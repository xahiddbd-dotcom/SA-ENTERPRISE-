import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Body parsing with generous payload limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
