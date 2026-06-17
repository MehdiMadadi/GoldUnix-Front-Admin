import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiPieChart, 
  FiUsers, 
  FiRefreshCw, 
  FiShield, 
  FiDatabase, 
  FiDollarSign, 
  FiTag, 
  FiBook, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut,
  FiTrendingUp,
  FiGrid,
  FiHelpCircle,
  FiFileText
} from 'react-icons/fi';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  permission: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: <FiPieChart size={18} />, label: 'داشبورد', permission: 'dashboard' },
  { to: '/users', icon: <FiUsers size={18} />, label: 'کاربران', permission: 'users' },
  { to: '/financial-accounts', icon: <FiUsers size={20} />, label: 'خزانه', permission: 'users' },
  { to: '/trades', icon: <FiRefreshCw size={18} />, label: 'معاملات', permission: 'trades' },
  { to: '/cashouts', icon: <FiDollarSign size={18} />, label: 'برداشت‌ها', permission: 'dashboard' },
  { to: '/products', icon: <FiGrid size={18} />, label: 'محصولات', permission: 'dashboard' },
  { to: '/system/config', icon: <FiSettings size={18} />, label: 'تنظیمات سیستم', permission: 'dashboard' },
  { to: '/faq', icon: <FiHelpCircle size={18} />, label: 'سوالات متداول', permission: 'dashboard' },
];

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const { hasPermission, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      close();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    close();
  };

  return (
    <>
      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={close} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="h-full flex flex-col p-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 mb-6">
            <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
              <FiTrendingUp size={18} className="text-white" />
            </div>
            <h1 className="text-slate-900 dark:text-white text-sm font-bold">
              پنل مدیریت
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-0.5">
            {NAV_ITEMS.filter(item => hasPermission(item.permission)).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => 
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
                onClick={close}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border-light dark:border-border-dark pt-3 mt-2">
            <NavLink
              to="/settings"
              className={({ isActive }) => 
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
              onClick={close}
            >
              <FiSettings size={18} />
              <span>تنظیمات</span>
            </NavLink>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-400/10 w-full transition-all mt-0.5"
            >
              <FiLogOut size={18} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}