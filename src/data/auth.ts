export type Role = 'super_admin' | 'risk_manager' | 'senior_trader' | 'accountant' | 'viewer' | 'user' | 'vip' | 'trader';

export interface AdminUser {
  id: string;
  name: string;
  title: string;
  initials: string;
  role: Role;
  permissions: string[];
}

export const ROLES: Record<Role, { label: string; permissions: string[] }> = {
  super_admin: {
    label: 'مدیر ارشد',
    permissions: ['dashboard', 'users', 'trades', 'risk', 'treasury', 'deposits', 'pricing', 'accounting', 'reports', 'settings'],
  },
  risk_manager: {
    label: 'مدیر ریسک',
    permissions: ['dashboard', 'users', 'trades', 'risk', 'treasury', 'reports'],
  },
  senior_trader: {
    label: 'معامله‌گر ارشد',
    permissions: ['dashboard', 'users', 'trades', 'risk', 'reports'],
  },
  accountant: {
    label: 'حسابدار',
    permissions: ['dashboard', 'accounting', 'deposits', 'treasury', 'reports'],
  },
  viewer: {
    label: 'ناظر',
    permissions: ['dashboard', 'reports'],
  },
  user: {
    label: 'کاربر عادی',
    permissions: ['dashboard'],
  },
  vip: {
    label: 'کاربر ویژه',
    permissions: ['dashboard', 'trades', 'reports'],
  },
  trader: {
    label: 'معامله‌گر',
    permissions: ['dashboard', 'trades', 'risk', 'reports'],
  },
};

export const MOCK_ADMIN: AdminUser = {
  id: 'admin1',
  name: 'امیر حیدری',
  title: 'معامله‌گر ارشد',
  initials: 'AH',
  role: 'super_admin',
  permissions: ROLES['super_admin'].permissions,
};