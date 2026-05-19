import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../lib/client';
import { ROLES, type Role } from '../data/auth';

// ---------- Types ----------
export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
  role: Role;
  permissions: string[];
  userLevel?: string;
  isKycVerified?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  switchRole: (role: Role) => void;
  refreshUser: () => Promise<void>;
}

// ---------- Context ----------
const AuthContext = createContext<AuthContextValue | null>(null);

// ---------- Provider ----------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const client = new Api();

  // ---------- Map API userLevel to internal Role ----------
  const mapUserLevelToRole = (level?: string): Role => {
    if (!level) return 'viewer';
    
    const upperLevel = level.toUpperCase();
    if (upperLevel === 'ADMIN' || upperLevel === 'SUPER_ADMIN') return 'super_admin';
    if (upperLevel === 'VIP') return 'super_admin'; // یا یه نقش دیگه
    if (upperLevel === 'COLLEAGUE') return 'senior_trader';
    return 'viewer';
  };

  // ---------- Check Auth Status ----------
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await client.api.getMe();
      
      if (response.data) {
        const userData = response.data;
        const mappedRole = mapUserLevelToRole('ADMIN');
        
        setUser({
          id: userData.id || 0,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          mobile: userData.mobileNumber || userData.phoneNumber || '',
          email: userData.email,
          role: mappedRole,
          permissions: ROLES[mappedRole]?.permissions || [],
          userLevel: userData.userLevel,
          isKycVerified: userData.isKycVerified,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---------- Login ----------
  const login = async (username: string, password: string) => {
    try {
      await client.rest.authenticate({ username, password });
      
      const response = await client.api.getMe();
      
      if (!response.data) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = response.data;
      const mappedRole = mapUserLevelToRole('ADMIN');
      
      setUser({
        id: userData.id || 0,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        mobile: userData.mobileNumber || userData.phoneNumber || '',
        email: userData.email,
        role: mappedRole,
        permissions: ROLES[mappedRole]?.permissions || [],
        userLevel: userData.userLevel,
        isKycVerified: userData.isKycVerified,
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error?.response?.data?.message || 'Login failed');
    }
  };

  // ---------- Logout ----------
  const logout = async () => {
    try {
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  // ---------- Refresh User ----------
  const refreshUser = async () => {
    await checkAuth();
  };

  // ---------- Permission Check ----------
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  // ---------- Switch Role (Development Only) ----------
  const switchRole = (role: Role) => {
    if (!user) return;
    setUser({
      ...user,
      role,
      permissions: ROLES[role].permissions,
    });
  };

  // ---------- Initial Auth Check ----------
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ---------- Value ----------
  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    switchRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------- Hook ----------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}