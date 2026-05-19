import { useState } from 'react';
import { POSITIONS } from '../../data/positions';

interface Alert {
  id: string;
  level: 'critical' | 'warning';
  message: string;
}

function buildAlerts(): Alert[] {
  const alerts: Alert[] = [];
  const criticalPositions = POSITIONS.filter(p => p.riskLevel === 'red');
  const warningPositions = POSITIONS.filter(p => p.riskLevel === 'yellow');

  // if (criticalPositions.length > 0) {
  //   alerts.push({
  //     id: 'critical-margin',
  //     level: 'critical',
  //     message: `${criticalPositions.length} پوزیشن با مارجین بحرانی (زیر ۱۱۰٪) — اقدام فوری نیاز است`,
  //   });
  // }
  // if (warningPositions.length > 0) {
  //   alerts.push({
  //     id: 'warning-margin',
  //     level: 'warning',
  //     message: `${warningPositions.length} پوزیشن در وضعیت هشدار مارجین`,
  //   });
  // }
  return alerts;
}

export default function RiskAlertBar() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const alerts = buildAlerts().filter(a => !dismissed.includes(a.id));

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-1 mb-4">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
            alert.level === 'critical'
              ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
              : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              {alert.level === 'critical' ? 'emergency' : 'warning'}
            </span>
            <span>{alert.message}</span>
          </div>
          <button
            onClick={() => setDismissed(d => [...d, alert.id])}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
