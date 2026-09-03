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
  loginWithFacebook: (fbUser?: { name: string; email?: string; avatar?: string; facebookId?: string }) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (
    name: string,
    phone: string,
    email?: string,
    address?: string,
    password?: string,
    authProvider?: 'phone_otp' | 'google' | 'facebook' | 'email_password'
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
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
    // New browsers/visitors must ALWAYS be unauthenticated (null)
    // Only verified login through Admin Gateway can grant Admin access
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
          // Filter out any obsolete demo staff, keep real accounts
          return parsed.filter(u => u && u.id);
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

  // Security: Rate limiting & brute force check
  const checkBruteForceLockout = (key: string): { locked: boolean; remainingSec: number } => {
    try {
      const record = localStorage.getItem(`auth_attempts_${key}`);
      if (record) {
        const { count, lockUntil } = JSON.parse(record);
        const now = Date.now();
        if (lockUntil && now < lockUntil) {
          return { locked: true, remainingSec: Math.ceil((lockUntil - now) / 1000) };
        }
        if (lockUntil && now >= lockUntil) {
          localStorage.removeItem(`auth_attempts_${key}`);
        }
      }
    } catch (e) {
      // ignore
    }
    return { locked: false, remainingSec: 0 };
  };

  const recordFailedAttempt = (key: string) => {
    try {
      const record = localStorage.getItem(`auth_attempts_${key}`);
      const now = Date.now();
      let count = 1;
      if (record) {
        const parsed = JSON.parse(record);
        count = (parsed.count || 0) + 1;
      }
      if (count >= 5) {
        // Lock for 60 seconds
        localStorage.setItem(`auth_attempts_${key}`, JSON.stringify({ count, lockUntil: now + 60000 }));
      } else {
        localStorage.setItem(`auth_attempts_${key}`, JSON.stringify({ count, lastAttempt: now }));
      }
    } catch (e) {
      // ignore
    }
  };

  const resetFailedAttempts = (key: string) => {
    try {
      localStorage.removeItem(`auth_attempts_${key}`);
    } catch (e) {
      // ignore
    }
  };

  const loginAdmin = async (emailOrPhone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanId = emailOrPhone.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId) {
      return { success: false, message: 'অনুগ্রহ করে অ্যাডমিন ইউজারনেম বা ইমেইল লিখুন।' };
    }

    if (!cleanPass) {
      return { success: false, message: 'অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড লিখুন।' };
    }

    const lockout = checkBruteForceLockout('admin');
    if (lockout.locked) {
      return {
        success: false,
        message: `নিরাপত্তা সতর্কতা: অনেকবার ভুল চেষ্টা করা হয়েছে। অনুগ্রহ করে ${lockout.remainingSec} সেকেন্ড পর আবার চেষ্টা করুন।`
      };
    }
    
    // Master Admin credentials check (User ID: sent9696@gmail.com / 01540004966 / admin, Password: J@hid2045)
    const validMasterUsernames = ['admin', 'admin@saifulenterprise.com', 'sent9696@gmail.com', '01540004966', 'saiful', 'se-admin-01'];
    const isMasterUsername = validMasterUsernames.includes(cleanId);
    const isMasterPassword = cleanPass === 'J@hid2045';

    if (isMasterPassword && isMasterUsername) {
      resetFailedAttempts('admin');
      const user: User = {
        ...initialStaff[0],
        id: 'usr_admin_master',
        name: 'Saiful Islam (Master Admin)',
        nameBn: 'সাইফুল ইসলাম (প্রধান প্রশাসক)',
        email: 'sent9696@gmail.com',
        phone: '01540004966',
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
        return { success: false, message: `অ্যাকাউন্ট স্থগিত: ${foundStaff.blockReason || 'আপনার অ্যাডমিন অ্যাক্সেস স্থগিত করা হয়েছে। প্রধান প্রশাসকের সাথে যোগাযোগ করুন।'}` };
      }

      if (cleanPass === 'J@hid2045' || (foundStaff.password && cleanPass === foundStaff.password)) {
        resetFailedAttempts('admin');
        setCurrentUser({
          ...foundStaff,
          role: foundStaff.role === 'manager' ? 'admin' : foundStaff.role,
          permissions: ['all', 'manage_all', 'services', 'products', 'orders', 'applications', 'pos', 'staff', 'customers', 'settings', 'backup', 'finance', 'reports']
        });
        return { success: true };
      }
    }

    // Check if customer attempted to access admin
    const customersList = getCombinedCustomers();
    const isCustomerAccount = customersList.some(c => c.phone === cleanId || c.email?.toLowerCase() === cleanId);
    if (isCustomerAccount) {
      recordFailedAttempt('admin');
      return { 
        success: false, 
        message: 'অননুমোদিত প্রবেশ! এটি একটি সাধারণ গ্রাহক অ্যাকাউন্ট, যার অ্যাডমিন প্যানেলে প্রবেশের অনুমতি নেই।' 
      };
    }

    recordFailedAttempt('admin');
    return { success: false, message: 'ভুল অ্যাডমিন ক্রেডেনশিয়াল! সঠিক ইউজারনেম এবং পাসওয়ার্ড দিয়ে প্রবেশ করুন।' };
  };

  const loginStaff = async (employeeIdOrPhone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanId = employeeIdOrPhone.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'কর্মচারী আইডি/ফোন এবং পাসওয়ার্ড উভয়ই আবশ্যক।' };
    }

    const staffList = getCombinedStaff();
    const matched = staffList.find(
      s => s.employeeId?.toLowerCase() === cleanId || s.phone === cleanId || s.email?.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId
    );

    if (matched) {
      if (matched.isBlocked) {
        return { success: false, message: `অ্যাক্সেস স্থগিত: ${matched.blockReason || 'এই স্টাফ অ্যাকাউন্টটি প্রশাসক কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে।'}` };
      }

      if (cleanPass === 'J@hid2045' || (matched.password && cleanPass === matched.password)) {
        setCurrentUser(matched);
        return { success: true };
      }
    }

    return { success: false, message: 'ভুল স্টাফ তথ্য বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।' };
  };

  const loginCustomer = async (emailOrPhone: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const clean = emailOrPhone.trim();
    if (!clean) return { success: false, message: 'অনুগ্রহ করে মোবাইল নম্বর বা ইমেইল লিখুন।' };

    const customersList = getCombinedCustomers();
    const cleanLower = clean.toLowerCase();
    const matched = customersList.find(c => c.phone === clean || c.email?.toLowerCase() === cleanLower);

    if (matched) {
      if (matched.isBlocked) {
        return {
          success: false,
          message: `আপনার অ্যাকাউন্টটি স্থগিত (Blocked) করা হয়েছে। কারণ: ${matched.blockReason || 'অ্যাডমিনের সাথে যোগাযোগ করুন।'}`
        };
      }

      // If user has a password set and password is provided, verify it
      if (password && matched.password && matched.password !== password.trim()) {
        return { success: false, message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন অথবা ওটিপি ব্যবহার করুন।' };
      }

      setCurrentUser(matched);
      return { success: true };
    }

    // Account does not exist
    if (password) {
      return {
        success: false,
        message: 'এই তথ্য দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে প্রথমে সাইন-আপ (Sign Up) করুন।'
      };
    }

    // Phone OTP login auto-registration fallback
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

  const loginWithFacebook = async (fbUser?: { name: string; email?: string; avatar?: string; facebookId?: string }): Promise<{ success: boolean; message?: string }> => {
    const fName = fbUser?.name || "Saiful Facebook Client";
    const fEmail = fbUser?.email || "facebook.user@saifulenterprise.com";
    const fAvatar = fbUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

    const customersList = getCombinedCustomers();
    const matched = customersList.find(c => (fbUser?.email && c.email?.toLowerCase() === fbUser.email.toLowerCase()) || (c.authProvider === 'facebook' && c.name.toLowerCase() === fName.toLowerCase()));

    if (matched) {
      if (matched.isBlocked) {
        return {
          success: false,
          message: `Facebook Account Blocked: ${matched.blockReason || 'This account has been disabled by Administrator.'}`
        };
      }
      const updatedUser: User = {
        ...matched,
        avatar: matched.avatar || fAvatar
      };
      saveCustomerToStorage(updatedUser);
      setCurrentUser(updatedUser);
      return { success: true };
    }

    const newFbCustomer: User = {
      id: `usr_fb_${Date.now()}`,
      name: fName,
      email: fEmail,
      phone: "01712345678",
      role: 'customer',
      authProvider: 'facebook',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      isBlocked: false,
      registeredAt: new Date().toISOString(),
      address: "Dhaka, Bangladesh",
      avatar: fAvatar
    };

    saveCustomerToStorage(newFbCustomer);
    setCurrentUser(newFbCustomer);
    return { success: true };
  };

  const registerCustomer = async (
    name: string,
    phone: string,
    email?: string,
    address?: string,
    password?: string,
    authProvider: 'phone_otp' | 'google' | 'facebook' | 'email_password' = 'phone_otp'
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    if (!cleanName || !cleanPhone) {
      return { success: false, message: 'নাম এবং মোবাইল নম্বর উভয়ই আবশ্যক।' };
    }

    if (cleanPhone.length < 11) {
      return { success: false, message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' };
    }

    if (authProvider === 'email_password' && password && password.trim().length < 6) {
      return { success: false, message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
    }

    const customersList = getCombinedCustomers();
    const existing = customersList.find(c => c.phone === cleanPhone);
    if (existing) {
      if (existing.isBlocked) {
        return { success: false, message: 'এই ফোন নম্বরটির অ্যাকাউন্ট বর্তমানে ব্লক করা আছে।' };
      }
      return { 
        success: false, 
        message: 'এই ফোন নম্বরে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে। অনুগ্রহ করে লগইন করুন।' 
      };
    }

    const customerUser: User = {
      id: `usr_cust_${Date.now()}`,
      name: cleanName,
      phone: cleanPhone,
      email: email?.trim() || `${cleanPhone}@customer.bd`,
      address: address?.trim() || "Tejgaon, Dhaka",
      role: 'customer',
      authProvider,
      password: password ? password.trim() : undefined,
      isPhoneVerified: true,
      isEmailVerified: !!email,
      isActive: true,
      isBlocked: false,
      registeredAt: new Date().toISOString(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      socialLinks: {
        phone: cleanPhone,
        whatsapp: cleanPhone
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
        loginWithFacebook,
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
