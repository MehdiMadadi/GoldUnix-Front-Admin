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
  FiTrendingUp
} from 'react-icons/fi';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  permission: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: <FiPieChart size={20} />, label: 'داشبورد', permission: 'dashboard' },
  { to: '/financial-accounts', icon: <FiUsers size={20} />, label: 'خزانه', permission: 'users' },
  { to: '/users', icon: <FiUsers size={20} />, label: 'کاربران', permission: 'users' },
  { to: '/trades', icon: <FiRefreshCw size={20} />, label: 'معاملات', permission: 'trades' },
  // { to: '/risk', icon: <FiShield size={20} />, label: 'ریسک', permission: 'risk' },
  // { to: '/treasury', icon: <FiDatabase size={20} />, label: 'خزانه', permission: 'treasury' },
  // { to: '/deposits', icon: <FiDollarSign size={20} />, label: 'سپرده', permission: 'deposits' },
  // { to: '/pricing', icon: <FiTag size={20} />, label: 'قیمت‌گذاری', permission: 'pricing' },
  // { to: '/accounting', icon: <FiBook size={20} />, label: 'حسابداری', permission: 'accounting' },
  // { to: '/reports', icon: <FiBarChart2 size={20} />, label: 'گزارش‌ها', permission: 'reports' },
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
        <div className="h-full flex flex-col justify-between p-5">
          <div>
            <div className="flex items-center gap-3 px-2 mb-8">
              <div className="bg-gradient-to-br from-primary to-blue-400 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg shrink-0">
                <FiTrendingUp size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-slate-900 dark:text-white text-lg font-extrabold">سامانه متمرکز مالی</h1>
                {/* <p className="text-slate-500 dark:text-slate-400 text-xs">مدیریت ریسک پیشرفته</p> */}
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.filter(item => hasPermission(item.permission)).map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  onClick={close}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}

              <div className="pt-4 pb-2">
                <div className="h-px bg-slate-200 dark:bg-border-dark" />
              </div>

              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={close}
              >
                <FiSettings size={20} />
                <span className="text-sm">تنظیمات</span>
              </NavLink>

              <button 
                onClick={handleLogout}
                className="nav-item text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-400/10 dark:text-rose-400"
              >
                <FiLogOut size={20} />
                <span className="text-sm">خروج</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}