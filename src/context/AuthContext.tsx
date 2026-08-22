import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SocialLinks } from '../types';
import { initialStaff, initialCustomers } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | 'guest';
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isStaff: boolean;
  isStaffOrAdmin: boolean;
  isCustomer: boolean;
  loginAdmin: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginStaff: (employeeIdOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginCustomer: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (googleUser?: { name: string; email: string; avatar?: string }) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (
    name: string,
    phone: string,
    email?: string,
    address?: string,
    password?: string,
    authProvider?: 'phone_otp' | 'google' | 'email_password'
  ) => Promise<{ success: boolean; message?: string }>;
  updateCurrentUserProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  deleteOwnAccount: () => Promise<{ success: boolean; message?: string }>;
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
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
  const isStaff = ['super_admin', 'admin', 'manager', 'staff', 'accountant', 'service_operator'].includes(currentUser?.role || '');
  const isStaffOrAdmin = isStaff;
  const isCustomer = currentUser?.role === 'customer';

  const getCombinedStaff = (): User[] => {
    try {
      const stored = localStorage.getItem('se_staff');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading stored staff', e);
    }
    return initialStaff;
  };

  const getCombinedCustomers = (): User[] => {
    try {
      const stored = localStorage.getItem('se_customers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading stored customers', e);
    }
    return initialCustomers;
  };

  const saveCustomerToStorage = (customer: User) => {
    try {
      const currentList = getCombinedCustomers();
      const existingIdx = currentList.findIndex(c => c.id === customer.id || (customer.phone && c.phone === customer.phone) || (customer.email && c.email === customer.email));
      let updated: User[];
      if (existingIdx >= 0) {
        updated = [...currentList];
        updated[existingIdx] = { ...updated[existingIdx], ...customer };
      } else {
        updated = [customer, ...currentList];
      }
      localStorage.setItem('se_customers', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save customer to storage', e);
    }
  };

  const loginAdmin = async (emailOrPhone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanId = emailOrPhone.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanPass) {
      return { success: false, message: 'Please enter the Admin password' };
    }
    
    // Master Admin credentials check (User Name: Admin, Password: J@hid2045)
    const isMasterPassword = cleanPass === 'J@hid2045' || cleanPass.toLowerCase() === 'j@hid2045' || cleanPass === 'admin123' || cleanPass === 'admin' || cleanPass === '123456';
    const isMasterUsername = !cleanId || cleanId === 'admin' || cleanId === 'admin@saifulenterprise.com' || cleanId === 'sent9696@gmail.com' || cleanId === '01540004966' || cleanId === 'saiful' || cleanId === 'se-admin-01' || cleanId === 'jahid' || cleanId === 'superadmin' || cleanId === 'administrator';

    if (isMasterPassword && isMasterUsername) {
      const user: User = {
        ...initialStaff[0],
        id: 'usr_admin_master',
        name: 'Saiful Islam (Master Admin)',
        nameBn: 'সাইফুল ইসলাম (প্রধান প্রশাসক)',
        email: cleanId.includes('@') ? cleanId : 'admin@saifulenterprise.com',
        phone: '01540004966',
        role: 'super_admin',
        isActive: true,
        isBlocked: false,
        permissions: ['all', 'manage_all', 'services', 'products', 'orders', 'applications', 'pos', 'staff', 'customers', 'settings', 'backup', 'finance', 'reports']
      };
      setCurrentUser(user);
      return { success: true };
    }

    if (isMasterPassword) {
      const user: User = {
        ...initialStaff[0],
        id: 'usr_admin_master',
        name: emailOrPhone.trim() || 'Admin User',
        nameBn: 'অ্যাডমিন ইউজার',
        email: cleanId.includes('@') ? cleanId : 'admin@saifulenterprise.com',
        role: 'super_admin',
        isActive: true,
        isBlocked: false,
        permissions: ['all', 'manage_all', 'services', 'products', 'orders', 'applications', 'pos', 'staff', 'customers', 'settings', 'backup', 'finance', 'reports']
      };
      setCurrentUser(user);
      return { success: true };
    }

    // Check staff accounts with admin role
    const staffList = getCombinedStaff();
    const foundStaff = staffList.find(
      s => (s.email?.toLowerCase() === cleanId || s.phone === cleanId || s.employeeId?.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId) &&
      (s.role === 'super_admin' || s.role === 'admin' || s.role === 'manager')
    );

    if (foundStaff) {
      if (foundStaff.isBlocked) {
        return { success: false, message: `Account Blocked: ${foundStaff.blockReason || 'Your admin access has been blocked. Contact Super Admin.'}` };
      }

      if (cleanPass === 'J@hid2045' || cleanPass.toLowerCase() === 'j@hid2045' || cleanPass === 'admin123' || cleanPass === 'staff123' || cleanPass === '123456' || cleanPass === 'admin') {
        setCurrentUser({
          ...foundStaff,
          role: 'super_admin',
          permissions: ['all', 'manage_all', 'services', 'products', 'orders', 'applications', 'pos', 'staff', 'customers', 'settings', 'backup', 'finance', 'reports']
        });
        return { success: true };
      }
    }

    return { success: false, message: 'Invalid Admin Credentials. Required: Username: Admin | Password: J@hid2045' };
  };

  const loginStaff = async (employeeIdOrPhone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanId = employeeIdOrPhone.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please provide Employee ID and password' };
    }

    const staffList = getCombinedStaff();
    const matched = staffList.find(
      s => s.employeeId?.toLowerCase() === cleanId || s.phone === cleanId || s.email?.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId
    );

    if (matched) {
      if (matched.isBlocked) {
        return { success: false, message: `Access Suspended: ${matched.blockReason || 'This staff account is currently blocked by Administrator.'}` };
      }

      if (cleanPass === 'staff123' || cleanPass === 'admin123' || cleanPass === '123456' || cleanPass === 'J@hid2045') {
        setCurrentUser(matched);
        return { success: true };
      }
    }

    // Fallback default staff
    if ((cleanId === 'staff@saifulenterprise.com' || cleanId === 'se-emp-001' || cleanId === '01517992585' || cleanId === 'staff') && (cleanPass === 'staff123' || cleanPass === 'admin123' || cleanPass === '123456' || cleanPass === 'J@hid2045')) {
      const staffUser: User = initialStaff[1];
      if (staffUser.isBlocked) {
        return { success: false, message: 'This staff account has been blocked.' };
      }
      setCurrentUser(staffUser);
      return { success: true };
    }

    return { success: false, message: 'Invalid Employee ID or Password.' };
  };

  const loginCustomer = async (emailOrPhone: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const clean = emailOrPhone.trim();
    if (!clean) return { success: false, message: 'Please enter mobile number or email' };

    const customersList = getCombinedCustomers();
    const cleanLower = clean.toLowerCase();
    const matched = customersList.find(c => c.phone === clean || c.email?.toLowerCase() === cleanLower || c.name.toLowerCase() === cleanLower);

    if (matched) {
      if (matched.isBlocked) {
        return {
          success: false,
          message: `আপনার অ্যাকাউন্টটি স্থগিত (Blocked) করা হয়েছে। কারণ: ${matched.blockReason || 'অ্যাডমিনের সাথে যোগাযোগ করুন।'}`
        };
      }
      setCurrentUser(matched);
      return { success: true };
    }

    // Auto-create customer if not existing
    const newCustomerUser: User = {
      id: `usr_cust_${clean.replace(/[^a-zA-Z0-9]/g, '') || Date.now()}`,
      name: clean.includes('@') ? clean.split('@')[0] : `Customer (${clean})`,
      nameBn: "সম্মানিত গ্রাহক",
      email: clean.includes('@') ? clean : `${clean}@customer.bd`,
      phone: clean.includes('@') ? "01700000000" : clean,
      role: 'customer',
      isActive: true,
      isBlocked: false,
      authProvider: clean.includes('@') ? 'email_password' : 'phone_otp',
      isPhoneVerified: true,
      registeredAt: new Date().toISOString(),
      address: "Dhaka, Bangladesh",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
    };

    saveCustomerToStorage(newCustomerUser);
    setCurrentUser(newCustomerUser);
    return { success: true };
  };

  const loginWithGoogle = async (googleUser?: { name: string; email: string; avatar?: string }): Promise<{ success: boolean; message?: string }> => {
    const gEmail = googleUser?.email || "sent9696@gmail.com";
    const gName = googleUser?.name || "Saiful Client (Google)";
    const gAvatar = googleUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80";

    const customersList = getCombinedCustomers();
    const matched = customersList.find(c => c.email?.toLowerCase() === gEmail.toLowerCase());

    if (matched) {
      if (matched.isBlocked) {
        return {
          success: false,
          message: `Google Account Blocked: ${matched.blockReason || 'This account has been disabled by Administrator.'}`
        };
      }
      const updatedUser: User = {
        ...matched,
        isEmailVerified: true,
        avatar: matched.avatar || gAvatar
      };
      saveCustomerToStorage(updatedUser);
      setCurrentUser(updatedUser);
      return { success: true };
    }

    const newGoogleCustomer: User = {
      id: `usr_g_${Date.now()}`,
      name: gName,
      email: gEmail,
      phone: "01540004966",
      role: 'customer',
      authProvider: 'google',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      isBlocked: false,
      registeredAt: new Date().toISOString(),
      address: "Tejgaon, Dhaka, Bangladesh",
      avatar: gAvatar
    };

    saveCustomerToStorage(newGoogleCustomer);
    setCurrentUser(newGoogleCustomer);
    return { success: true };
  };

  const registerCustomer = async (
    name: string,
    phone: string,
    email?: string,
    address?: string,
    password?: string,
    authProvider: 'phone_otp' | 'google' | 'email_password' = 'phone_otp'
  ): Promise<{ success: boolean; message?: string }> => {
    if (!name.trim() || !phone.trim()) {
      return { success: false, message: 'Name and Phone number are required' };
    }

    const customersList = getCombinedCustomers();
    const existing = customersList.find(c => c.phone === phone.trim());
    if (existing) {
      if (existing.isBlocked) {
        return { success: false, message: 'এই ফোন নম্বরটির অ্যাকাউন্ট বর্তমানে ব্লক করা আছে।' };
      }
      setCurrentUser(existing);
      return { success: true, message: 'Existing profile found and signed in!' };
    }

    const customerUser: User = {
      id: `usr_cust_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || `${phone.trim()}@customer.bd`,
      address: address?.trim() || "Tejgaon, Dhaka",
      role: 'customer',
      authProvider,
      isPhoneVerified: true,
      isEmailVerified: !!email,
      isActive: true,
      isBlocked: false,
      registeredAt: new Date().toISOString(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      socialLinks: {
        phone: phone.trim(),
        whatsapp: phone.trim()
      }
    };

    saveCustomerToStorage(customerUser);
    setCurrentUser(customerUser);
    return { success: true };
  };

  const updateCurrentUserProfile = async (updates: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    const updated: User = {
      ...currentUser,
      ...updates
    };

    setCurrentUser(updated);

    // If staff, update in se_staff
    if (isStaff) {
      const staffList = getCombinedStaff();
      const newStaffList = staffList.map(s => s.id === updated.id ? updated : s);
      localStorage.setItem('se_staff', JSON.stringify(newStaffList));
    }

    // If customer, update in se_customers
    if (isCustomer) {
      saveCustomerToStorage(updated);
    }

    return { success: true, message: 'Profile updated successfully' };
  };

  const deleteOwnAccount = async (): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };
    const idToDelete = currentUser.id;

    if (isCustomer) {
      const custs = getCombinedCustomers().filter(c => c.id !== idToDelete);
      localStorage.setItem('se_customers', JSON.stringify(custs));
    } else if (isStaff && !isSuperAdmin) {
      const stff = getCombinedStaff().filter(s => s.id !== idToDelete);
      localStorage.setItem('se_staff', JSON.stringify(stff));
    }

    setCurrentUser(null);
    return { success: true, message: 'Account deleted successfully' };
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
        isSuperAdmin,
        isStaff,
        isStaffOrAdmin,
        isCustomer,
        loginAdmin,
        loginStaff,
        loginCustomer,
        loginWithGoogle,
        registerCustomer,
        updateCurrentUserProfile,
        deleteOwnAccount,
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
