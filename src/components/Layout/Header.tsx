import { useTheme } from '../../contexts/ThemeContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiMoon, FiSun, FiBell } from 'react-icons/fi';

interface HeaderProps {
  title: string;
  showMarketStatus?: boolean;
}

export default function Header({ title, showMarketStatus }: HeaderProps) {
  const { toggleTheme, theme } = useTheme();
  const { toggle } = useSidebar();
  const { user } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-white/60 dark:bg-surface-dark/60 backdrop-blur-xl px-4 md:px-7 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggle}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-border-dark lg:hidden"
        >
          <FiMenu size={24} />
        </button>
        <h2 className="text-slate-900 dark:text-white text-base md:text-xl font-bold">{title}</h2>
        {showMarketStatus && (
          <>
            <div className="h-6 w-px bg-slate-300 dark:bg-border-dark hidden sm:block" />
            <div className="hidden sm:flex gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="size-2 rounded-full bg-emerald-600" />
                بازار: باز
              </div>
              <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="size-2 rounded-full bg-blue-600" />
                ریسک: نرمال
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        <button
          onClick={toggleTheme}
          className="icon-btn bg-slate-200 dark:bg-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <button className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-border-dark">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-red-600 border-2 border-white dark:border-surface-dark" />
        </button>

        <div className="h-8 w-px bg-border-light dark:bg-border-dark mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.firstName + ' ' + user?.lastName || 'کاربر'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.title || 'مدیر'}</p>
          </div>
          <div className="size-9 md:size-10 rounded-2xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center text-white font-bold shadow-md text-sm">
            {user?.firstName.charAt(0) || 'ک'}
          </div>
        </div>
      </div>
    </header>
  );
}