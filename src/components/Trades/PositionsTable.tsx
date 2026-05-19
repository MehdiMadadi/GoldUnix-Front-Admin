import { FiEye, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { PositionDetailsResponse } from '../../lib/client';
import Badge from '../UI/Badge';

interface PositionsTableProps {
  positions: PositionDetailsResponse[];
  onRowClick?: (position: PositionDetailsResponse) => void;
  onMarginIncrease?: (position: PositionDetailsResponse) => void;
  onMarginDecrease?: (position: PositionDetailsResponse) => void;
}

function SideBadge({ side }: { side?: PositionDetailsResponse['side'] }) {
  return side === 'BUY' || side === 'LONG'
    ? <Badge variant="success">خرید</Badge>
    : <Badge variant="danger">فروش</Badge>;
}

function RiskBadge({ level }: { level?: PositionDetailsResponse['riskLevel'] }) {
  if (level === 'SAFE') return <Badge variant="success">ایمن</Badge>;
  if (level === 'WARNING') return <Badge variant="warning">هشدار</Badge>;
  return <Badge variant="danger">بحرانی</Badge>;
}

function fmt(n?: number) {
  if (!n) return '0';
  // if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  // if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n.toLocaleString('fa-IR');
}

export default function PositionsTable({ 
  positions, 
  onRowClick, 
  onMarginIncrease, 
  onMarginDecrease 
}: PositionsTableProps) {
  return (
    <div className="table-container">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
          <tr>
            <th className="px-4 py-3 text-right font-medium">شناسه</th>
            <th className="px-4 py-3 text-right font-medium">دارایی</th>
            <th className="px-4 py-3 text-right font-medium">جهت</th>
            <th className="px-4 py-3 text-right font-medium">مقدار</th>
            <th className="px-4 py-3 text-right font-medium">قیمت ورود</th>
            <th className="px-4 py-3 text-right font-medium">قیمت بازار</th>
            <th className="px-4 py-3 text-right font-medium">سود/زیان</th>
            <th className="px-4 py-3 text-right font-medium">اهرم</th>
            <th className="px-4 py-3 text-right font-medium">مارجین</th>
            <th className="px-4 py-3 text-right font-medium">نسبت مارجین</th>
            <th className="px-4 py-3 text-right font-medium">قیمت لیکویید</th>
            <th className="px-4 py-3 text-right font-medium">ریسک</th>
            <th className="px-4 py-3 text-center font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light dark:divide-border-dark">
          {positions?.map(pos => {
            const isProfit = (pos.unrealizedPnl || 0) >= 0;
            const marginLevel = pos.marginLevel || 0;
            
            return (
              <tr
                key={pos.positionId}
                className={`hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer ${
                  pos.riskLevel === 'CRITICAL' || pos.riskLevel === 'LIQUIDATION' 
                    ? 'bg-rose-50/40 dark:bg-rose-950/10' 
                    : pos.riskLevel === 'WARNING' 
                      ? 'bg-amber-50/40 dark:bg-amber-950/10' 
                      : ''
                }`}
                onClick={() => onRowClick?.(pos)}
              >
                <td className="px-4 py-3.5  text-xs text-slate-500 whitespace-nowrap">
                  #{pos.positionId}
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium">
                  {pos.asset}
                </td>
                <td className="px-4 py-3.5">
                  <SideBadge side={pos.side} />
                </td>
                <td className="px-4 py-3.5  font-bold">
                  {fmt(pos.quantity)}
                </td>
                <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">
                  {fmt(pos.entryPrice)}
                </td>
                <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">
                  {fmt(pos.markPrice || pos.currentPrice)}
                </td>
                <td className={`px-4 py-3.5  font-bold ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isProfit ? '+' : ''}{fmt(pos.unrealizedPnl)}
                  {pos.profitLossPercent && (
                    <span className="text-xs mr-1">
                      ({pos.profitLossPercent > 0 ? '+' : ''}{pos.profitLossPercent.toFixed(2)}٪)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5  text-slate-600 dark:text-slate-400">
                  {pos.leverage}x
                </td>
                <td className="px-4 py-3.5  text-slate-600 dark:text-slate-400">
                  {fmt(pos.maintenanceMargin || pos.initialMargin)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-border-dark rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          marginLevel >= 130 ? 'bg-emerald-500' :
                          marginLevel >= 110 ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(marginLevel, 200) / 2}%` }}
                      />
                    </div>
                    <span className={`font-bold text-xs ${
                      marginLevel >= 130 ? 'text-emerald-600 dark:text-emerald-400' :
                      marginLevel >= 110 ? 'text-amber-600 dark:text-amber-400' :
                      'text-rose-600 dark:text-rose-400'
                    }`}>
                      {marginLevel.toLocaleString('fa-IR')}٪
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5  text-rose-500">
                  {fmt(pos.liquidationPrice)}
                </td>
                <td className="px-4 py-3.5">
                  <RiskBadge level={pos.riskLevel} />
                </td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => onRowClick?.(pos)} 
                      title="جزئیات" 
                      className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 flex items-center justify-center transition-colors"
                    >
                      <FiEye size={14} />
                    </button>
                    <button 
                      onClick={() => onMarginIncrease?.(pos)} 
                      title="افزایش مارجین" 
                      className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                    >
                      <FiPlusCircle size={14} />
                    </button>
                    <button 
                      onClick={() => onMarginDecrease?.(pos)} 
                      title="کاهش مارجین" 
                      className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 flex items-center justify-center transition-colors"
                    >
                      <FiMinusCircle size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}