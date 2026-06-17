import { useTheme } from '../../contexts/ThemeContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiMoon, FiSun, FiBell, FiChevronDown } from 'react-icons/fi';

interface HeaderProps {
  title: string;
  showMarketStatus?: boolean;
}

export default function Header({ title, showMarketStatus }: HeaderProps) {
  const { toggleTheme, theme } = useTheme();
  const { toggle } = useSidebar();
  const { user } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 md:px-6 shrink-0 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <FiMenu size={20} />
        </button>
        <h2 className="text-slate-900 dark:text-white text-base font-bold">{title}</h2>
        {showMarketStatus && (
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              باز
            </span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          <FiBell size={18} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
        </button>

        <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user?.firstName || 'کاربر'}
            </p>
            <p className="text-xs text-slate-400">{user?.title || 'مدیر'}</p>
          </div>
          <div className="size-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">
            {user?.firstName?.charAt(0) || 'ک'}
          </div>
        </div>
      </div>
    </header>
  );
}