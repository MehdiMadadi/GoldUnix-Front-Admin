interface Tab<T extends string> {
  key: T;
  label: string;
  icon?: string;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (key: T) => void;
}

export default function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className="flex gap-1 bg-slate-100 dark:bg-background-dark p-1 rounded-xl border border-border-light dark:border-border-dark overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
            active === tab.key
              ? 'bg-primary text-white shadow'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-border-dark'
          }`}
        >
          {tab.icon && <span className="material-symbols-outlined text-base">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
