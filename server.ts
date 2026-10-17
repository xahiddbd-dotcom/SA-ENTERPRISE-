import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Body parsing with generous payload limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Allow CORS for preview iframes and proxy headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "database.json");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create data directory:", err);
  }
}

// Safely read database from disk
function readDatabase(): Record<string, any> | null {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading database file from disk:", err);
  }
  return null;
}

// Safely write database to disk
function writeDatabase(data: Record<string, any>): boolean {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error("Error writing database file to disk:", err);
    return false;
  }
}

// REST API Endpoints

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Full database retrieval
app.get("/api/database", (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(200).json({ success: true, initialized: false, data: null });
  }
  return res.json({ success: true, initialized: true, data: db });
});

// 3. Save full database
app.post("/api/database", (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ success: false, error: "Invalid payload" });
  }

  const ok = writeDatabase(payload);
  if (ok) {
    // Trigger real-time GitHub cloud sync if enabled
    triggerAutoSyncToGitHub("Full database updated");
    res.json({ success: true, message: "Database saved successfully" });
  } else {
    res.status(500).json({ success: false, error: "Failed to persist database to disk" });
  }
});

// 4. Patch/Update specific keys in database
app.post("/api/database/patch", (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== "object") {
    return res.status(400).json({ success: false, error: "Invalid updates object" });
  }

  const currentDb = readDatabase() || {};
  const merged = { ...currentDb, ...updates };
  merged.lastUpdatedAt = new Date().toISOString();

  const ok = writeDatabase(merged);
  if (ok) {
    // Trigger real-time GitHub cloud sync if enabled
    const updatedKeysList = Object.keys(updates).slice(0, 5).join(", ");
    triggerAutoSyncToGitHub(`Updated keys: ${updatedKeysList}`);
    res.json({
      success: true,
      updatedKeys: Object.keys(updates),
      timestamp: merged.lastUpdatedAt
    });
  } else {
    res.status(500).json({ success: false, error: "Failed to persist database update to disk" });
  }
});

// 5. Reset database endpoint
app.post("/api/database/reset", (req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
    res.json({ success: true, message: "Server database reset to factory state" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. GitHub Auto-Sync & Cloud Storage Integration

const GITHUB_CONFIG_FILE = path.join(DB_DIR, "github-sync.json");

interface GitHubSyncConfig {
  enabled: boolean;
  token: string;
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  commitAuthorName: string;
  commitAuthorEmail: string;
  lastSyncStatus: "idle" | "success" | "error" | "syncing";
  lastSyncTime?: string;
  lastCommitSha?: string;
  lastCommitUrl?: string;
  lastErrorMessage?: string | null;
}

function readGitHubConfig(): GitHubSyncConfig {
  try {
    if (fs.existsSync(GITHUB_CONFIG_FILE)) {
      const content = fs.readFileSync(GITHUB_CONFIG_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading GitHub config from disk:", err);
  }
  return {
    enabled: false,
    token: process.env.GITHUB_TOKEN || "",
    owner: "sent9696",
    repo: "saiful-enterprise",
    branch: "main",
    filePath: "data/database.json",
    commitAuthorName: "Saiful Enterprise CMS",
    commitAuthorEmail: "sent9696@gmail.com",
    lastSyncStatus: "idle"
  };
}

function writeGitHubConfig(updates: Partial<GitHubSyncConfig>): GitHubSyncConfig {
  const current = readGitHubConfig();
  const merged: GitHubSyncConfig = { ...current, ...updates };
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(GITHUB_CONFIG_FILE, JSON.stringify(merged, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing GitHub config:", err);
  }
  return merged;
}

async function executeGitHubPush(commitReason = "Update website database"): Promise<{
  success: boolean;
  commitSha?: string;
  commitUrl?: string;
  error?: string;
}> {
  const config = readGitHubConfig();
  if (!config.token || !config.owner || !config.repo) {
    return { success: false, error: "GitHub token, owner, and repository name are required." };
  }

  const db = readDatabase();
  if (!db) {
    return { success: false, error: "Database file is empty or not initialized." };
  }

  writeGitHubConfig({ lastSyncStatus: "syncing" });

  const cleanOwner = config.owner.trim();
  const cleanRepo = config.repo.trim().replace(/^https:\/\/github\.com\//, "").replace(/^\//, "");
  const cleanBranch = (config.branch || "main").trim();
  const cleanPath = (config.filePath || "data/database.json").trim().replace(/^\//, "");
  const token = config.token.trim();

  const apiFileUrl = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}`;

  try {
    // 1. Get existing file SHA if file already exists in repo
    let currentSha: string | undefined;
    const getRes = await fetch(`${apiFileUrl}?ref=${encodeURIComponent(cleanBranch)}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "SaifulEnterprise-Applet"
      }
    });

    if (getRes.ok) {
      const existingData: any = await getRes.json();
      currentSha = existingData.sha;
    } else if (getRes.status !== 404) {
      const errJson: any = await getRes.json().catch(() => ({}));
      const errMsg = errJson.message || `GitHub API error: HTTP ${getRes.status}`;
      writeGitHubConfig({
        lastSyncStatus: "error",
        lastErrorMessage: errMsg
      });
      return { success: false, error: errMsg };
    }

    // 2. Prepare payload
    const jsonContent = JSON.stringify(db, null, 2);
    const contentBase64 = Buffer.from(jsonContent, "utf-8").toString("base64");

    const nowStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    const payload: any = {
      message: `${commitReason} [${nowStr}]`,
      content: contentBase64,
      branch: cleanBranch,
      committer: {
        name: config.commitAuthorName || "Saiful Enterprise CMS",
        email: config.commitAuthorEmail || "sent9696@gmail.com"
      }
    };

    if (currentSha) {
      payload.sha = currentSha;
    }

    // 3. Put contents to GitHub
    const putRes = await fetch(apiFileUrl, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "SaifulEnterprise-Applet"
      },
      body: JSON.stringify(payload)
    });

    if (!putRes.ok) {
      const errJson: any = await putRes.json().catch(() => ({}));
      const errMsg = errJson.message || `Failed to commit to GitHub: HTTP ${putRes.status}`;
      writeGitHubConfig({
        lastSyncStatus: "error",
        lastErrorMessage: errMsg
      });
      return { success: false, error: errMsg };
    }

    const putData: any = await putRes.json();
    const commitSha = putData.commit?.sha || "committed";
    const commitUrl = putData.commit?.html_url || `https://github.com/${cleanOwner}/${cleanRepo}/commit/${commitSha}`;

    writeGitHubConfig({
      lastSyncStatus: "success",
      lastSyncTime: new Date().toISOString(),
      lastCommitSha: commitSha,
      lastCommitUrl: commitUrl,
      lastErrorMessage: null
    });

    console.log(`[GitHub Auto-Sync] Successfully pushed to GitHub: ${cleanOwner}/${cleanRepo}@${cleanBranch} (${commitSha})`);
    return { success: true, commitSha, commitUrl };
  } catch (err: any) {
    const errMsg = err?.message || "Unknown error connecting to GitHub API";
    writeGitHubConfig({
      lastSyncStatus: "error",
      lastErrorMessage: errMsg
    });
    return { success: false, error: errMsg };
  }
}

// Debounced auto-sync trigger so frequent updates bundle into 1 commit
let autoSyncTimer: NodeJS.Timeout | null = null;
function triggerAutoSyncToGitHub(reason = "Website data change") {
  const config = readGitHubConfig();
  if (!config.enabled || !config.token || !config.owner || !config.repo) {
    return;
  }
  if (autoSyncTimer) {
    clearTimeout(autoSyncTimer);
  }
  autoSyncTimer = setTimeout(() => {
    executeGitHubPush(`Auto-sync (${reason})`).catch(err => {
      console.warn("[GitHub Auto-Sync error]:", err);
    });
  }, 4000);
}

// GitHub API Endpoints

// GET /api/github/config: Retrieve current config (token masked for security)
app.get("/api/github/config", (req, res) => {
  const config = readGitHubConfig();
  const token = config.token || "";
  const maskedToken = token
    ? token.length > 8
      ? `${token.slice(0, 4)}••••••••${token.slice(-4)}`
      : "••••••••"
    : "";

  res.json({
    success: true,
    config: {
      ...config,
      token: maskedToken,
      hasToken: Boolean(token)
    }
  });
});

// POST /api/github/config: Save updated configuration
app.post("/api/github/config", (req, res) => {
  const body = req.body || {};
  const current = readGitHubConfig();

  // If user left token blank, keep existing token
  const token = body.token && body.token.trim() !== "" ? body.token.trim() : current.token;

  const updated = writeGitHubConfig({
    enabled: Boolean(body.enabled),
    token,
    owner: (body.owner || current.owner || "").trim(),
    repo: (body.repo || current.repo || "").trim(),
    branch: (body.branch || current.branch || "main").trim(),
    filePath: (body.filePath || current.filePath || "data/database.json").trim(),
    commitAuthorName: (body.commitAuthorName || current.commitAuthorName || "Saiful Enterprise CMS").trim(),
    commitAuthorEmail: (body.commitAuthorEmail || current.commitAuthorEmail || "sent9696@gmail.com").trim()
  });

  res.json({
    success: true,
    message: "GitHub configuration updated successfully",
    config: {
      ...updated,
      token: updated.token ? "••••••••" : "",
      hasToken: Boolean(updated.token)
    }
  });
});

// POST /api/github/test: Verify connection to GitHub repository
app.post("/api/github/test", async (req, res) => {
  const config = readGitHubConfig();
  const token = (req.body?.token && req.body.token.trim() !== "" ? req.body.token.trim() : config.token) || "";
  const owner = (req.body?.owner || config.owner || "").trim();
  const repo = (req.body?.repo || config.repo || "").trim().replace(/^https:\/\/github\.com\//, "").replace(/^\//, "");

  if (!token) {
    return res.status(400).json({ success: false, error: "GitHub Personal Access Token is required." });
  }
  if (!owner || !repo) {
    return res.status(400).json({ success: false, error: "Repository owner and repository name are required." });
  }

  try {
    const testUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const testRes = await fetch(testUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "SaifulEnterprise-Applet"
      }
    });

    if (!testRes.ok) {
      const errJson: any = await testRes.json().catch(() => ({}));
      return res.status(testRes.status).json({
        success: false,
        error: errJson.message || `GitHub repository connection failed with status HTTP ${testRes.status}`
      });
    }

    const repoInfo: any = await testRes.json();
    return res.json({
      success: true,
      message: `Connected successfully to GitHub repository: ${repoInfo.full_name}`,
      repo: {
        fullName: repoInfo.full_name,
        private: repoInfo.private,
        defaultBranch: repoInfo.default_branch,
        permissions: repoInfo.permissions
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Failed to connect to GitHub API" });
  }
});

// POST /api/github/sync: Force an immediate push to GitHub
app.post("/api/github/sync", async (req, res) => {
  const result = await executeGitHubPush("Manual sync from Saiful Enterprise Admin Panel");
  if (result.success) {
    res.json({
      success: true,
      message: "Database committed and pushed to GitHub successfully!",
      commitSha: result.commitSha,
      commitUrl: result.commitUrl
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || "Failed to push to GitHub"
    });
  }
});

// POST /api/github/pull: Fetch and hydrate database from GitHub
app.post("/api/github/pull", async (req, res) => {
  const config = readGitHubConfig();
  if (!config.token || !config.owner || !config.repo) {
    return res.status(400).json({ success: false, error: "GitHub token, owner, and repository name are required." });
  }

  const cleanOwner = config.owner.trim();
  const cleanRepo = config.repo.trim().replace(/^https:\/\/github\.com\//, "").replace(/^\//, "");
  const cleanBranch = (config.branch || "main").trim();
  const cleanPath = (config.filePath || "data/database.json").trim().replace(/^\//, "");
  const token = config.token.trim();

  try {
    const apiFileUrl = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}?ref=${encodeURIComponent(cleanBranch)}`;
    const getRes = await fetch(apiFileUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "SaifulEnterprise-Applet"
      }
    });

    if (!getRes.ok) {
      const errJson: any = await getRes.json().catch(() => ({}));
      return res.status(getRes.status).json({
        success: false,
        error: errJson.message || `File ${cleanPath} not found on branch ${cleanBranch}`
      });
    }

    const fileData: any = await getRes.json();
    const rawBase64 = fileData.content || "";
    const cleanBase64 = rawBase64.replace(/\n/g, "");
    const decodedString = Buffer.from(cleanBase64, "base64").toString("utf-8");
    const parsedData = JSON.parse(decodedString);

    parsedData.lastSyncedAt = new Date().toISOString();
    writeDatabase(parsedData);

    res.json({
      success: true,
      message: `Database successfully restored from GitHub (${cleanOwner}/${cleanRepo}@${cleanBranch}:${cleanPath})`,
      data: parsedData
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to pull from GitHub" });
  }
});

async function start() {
  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Saiful Enterprise Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
