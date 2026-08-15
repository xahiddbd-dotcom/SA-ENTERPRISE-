import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { initialStaff } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | 'guest';
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  loginAdmin: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginStaff: (employeeIdOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginCustomer: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (name: string, phone: string, email?: string, address?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  hasPermission: (permissionName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('se_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
    // Default to guest
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('se_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('se_current_user');
    }
  }, [currentUser]);

  const currentRole: UserRole | 'guest' = currentUser ? currentUser.role : 'guest';
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
  const isStaff = ['super_admin', 'admin', 'manager', 'staff', 'accountant', 'service_operator'].includes(currentUser?.role || '');
  const isCustomer = currentUser?.role === 'customer';

  const loginAdmin = async (emailOrPhone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanId = emailOrPhone.trim().toLowerCase();
    
    // Super admin credentials
    if ((cleanId === 'admin@saifulenterprise.com' || cleanId === 'admin' || cleanId === '01540004966') && password === 'admin123') {
      const user: User = initialStaff[0]; // Saiful Islam
      setCurrentUser(user);
      return { success: true };
    }

    // Check other admin or staff
    const foundStaff = initialStaff.find(
      s => (s.email.toLowerCase() === cleanId || s.phone === cleanId || s.employeeId?.toLowerCase() === cleanId) &&
      (s.role === 'super_admin' || s.role === 'admin')
    );

    if (foundStaff && password === 'admin123') {
      setCurrentUser(foundStaff);
      return { success: true };
    }

    return { success: false, message: 'Invalid Admin Credentials. Default: admin / admin123' };
  };

  const loginStaff = async (employeeIdOrPhone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanId = employeeIdOrPhone.trim().toLowerCase();

    // Check staff accounts
    if ((cleanId === 'staff@saifulenterprise.com' || cleanId === 'se-emp-001' || cleanId === '01517992585' || cleanId === 'staff') && (password === 'staff123' || password === 'admin123')) {
      const staffUser: User = initialStaff[1]; // Md. Rafiqul Hassan
      setCurrentUser(staffUser);
      return { success: true };
    }

    const matched = initialStaff.find(
      s => s.employeeId?.toLowerCase() === cleanId || s.phone === cleanId || s.email.toLowerCase() === cleanId
    );

    if (matched && (password === 'staff123' || password === 'admin123')) {
      setCurrentUser(matched);
      return { success: true };
    }

    return { success: false, message: 'Invalid Employee ID or Password. Default: SE-EMP-001 / staff123' };
  };

  const loginCustomer = async (emailOrPhone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const clean = emailOrPhone.trim();
    if (!clean) return { success: false, message: 'Please enter mobile number or email' };

    const customerUser: User = {
      id: `usr_cust_${clean.replace(/[^a-zA-Z0-9]/g, '')}`,
      name: "Valued Customer",
      nameBn: "সম্মানিত গ্রাহক",
      email: clean.includes('@') ? clean : `${clean}@customer.com`,
      phone: clean.includes('@') ? "01711000000" : clean,
      role: 'customer',
      isActive: true,
      address: "Dhaka, Bangladesh"
    };

    setCurrentUser(customerUser);
    return { success: true };
  };

  const registerCustomer = async (name: string, phone: string, email?: string, address?: string): Promise<{ success: boolean; message?: string }> => {
    if (!name || !phone) {
      return { success: false, message: 'Name and Phone number are required' };
    }

    const customerUser: User = {
      id: `usr_cust_${Date.now()}`,
      name,
      phone,
      email: email || `${phone}@customer.com`,
      address: address || "Dhaka, Bangladesh",
      role: 'customer',
      isActive: true
    };

    setCurrentUser(customerUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.permissions && currentUser.permissions.includes(permissionName)) return true;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'manager' && !permissionName.includes('system_settings')) return true;
    if (currentUser.role === 'service_operator' && (permissionName.includes('application') || permissionName.includes('service') || permissionName.includes('pos'))) return true;
    if (currentUser.role === 'accountant' && (permissionName.includes('expense') || permissionName.includes('payment') || permissionName.includes('report') || permissionName.includes('pos'))) return true;
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        isAdmin,
        isStaff,
        isCustomer,
        loginAdmin,
        loginStaff,
        loginCustomer,
        registerCustomer,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
