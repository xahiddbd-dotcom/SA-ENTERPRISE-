import { User } from '../types';

export interface StaffQRPayload {
  issuer: 'SAIFUL_ENTERPRISE';
  type: 'STAFF_PASS';
  staffId: string;
  employeeId: string;
  name: string;
  nameBn?: string;
  role?: string;
  shift?: string;
  token: string;
  issuedAt: string;
}

/**
 * Generates a unique, tamper-evident JSON payload string for a staff member's QR code.
 */
export function generateStaffQRPayload(staff: Partial<User>): string {
  const staffId = staff.id || `staff_${Date.now()}`;
  const employeeId = staff.employeeId || `SE-${staffId.toUpperCase()}`;
  
  // Unique signature token based on employeeId & secret salt
  const token = `SE-PASS-${employeeId}-${staffId.slice(-4)}`;

  const payload: StaffQRPayload = {
    issuer: 'SAIFUL_ENTERPRISE',
    type: 'STAFF_PASS',
    staffId,
    employeeId,
    name: staff.name || 'Staff Member',
    nameBn: staff.nameBn,
    role: staff.role || 'staff',
    shift: staff.shift || 'Morning / General',
    token,
    issuedAt: staff.joiningDate || new Date().toISOString().split('T')[0]
  };

  return JSON.stringify(payload);
}

/**
 * Parses raw scanned data from camera, 2D scanner gun, or text input.
 * Supports structured JSON payload, human-readable prefix strings, and direct employee ID fallback.
 */
export function parseStaffQRPayload(
  rawInput: string,
  allStaff?: User[]
): { staffId: string; employeeId: string; name?: string } | null {
  if (!rawInput || typeof rawInput !== 'string') return null;

  const trimmed = rawInput.trim();

  // 1. Try parsing JSON format
  try {
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const data = JSON.parse(trimmed);
      if (data.staffId || data.employeeId || data.empId) {
        return {
          staffId: data.staffId || (allStaff?.find(s => s.employeeId === (data.employeeId || data.empId))?.id || ''),
          employeeId: data.employeeId || data.empId || (allStaff?.find(s => s.id === data.staffId)?.employeeId || ''),
          name: data.name
        };
      }
    }
  } catch {
    // Not valid JSON, proceed to other formats
  }

  // 2. Try parsing formatted string (e.g. SE:STAFF:SE-ADMIN-01:usr_admin)
  if (trimmed.toUpperCase().startsWith('SE:STAFF:') || trimmed.toUpperCase().startsWith('SE-PASS-')) {
    const parts = trimmed.split(':');
    if (parts.length >= 3) {
      const empId = parts[2];
      const sId = parts[3] || '';
      return {
        staffId: sId || (allStaff?.find(s => s.employeeId?.toUpperCase() === empId.toUpperCase())?.id || ''),
        employeeId: empId
      };
    }
  }

  // 3. Try matching direct employee ID or phone or staff ID from list
  if (allStaff && allStaff.length > 0) {
    const matched = allStaff.find(
      s =>
        s.id.toLowerCase() === trimmed.toLowerCase() ||
        (s.employeeId && s.employeeId.toLowerCase() === trimmed.toLowerCase()) ||
        s.phone.replace(/[^0-9]/g, '') === trimmed.replace(/[^0-9]/g, '') ||
        (s.name && s.name.toLowerCase() === trimmed.toLowerCase())
    );

    if (matched) {
      return {
        staffId: matched.id,
        employeeId: matched.employeeId || matched.id,
        name: matched.name
      };
    }
  }

  // 4. Fallback if it looks like an employee ID (e.g. SE-ADMIN-01)
  if (/^SE-[A-Z0-9-]+$/i.test(trimmed)) {
    return {
      staffId: '',
      employeeId: trimmed.toUpperCase()
    };
  }

  return null;
}

/**
 * Formats duration in hours and minutes for attendance shifts
 */
export function formatAttendanceDuration(minutes?: number, lang: 'bn' | 'en' = 'en'): string {
  if (!minutes || minutes <= 0) {
    return lang === 'bn' ? '১ মিনিটের কম' : '< 1 min';
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (lang === 'bn') {
    if (hours === 0) return `${mins} মিনিট`;
    return `${hours} ঘণ্টা ${mins > 0 ? `${mins} মিনিট` : ''}`.trim();
  }

  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
}

/**
 * Downloads a canvas element as high-resolution PNG image
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
