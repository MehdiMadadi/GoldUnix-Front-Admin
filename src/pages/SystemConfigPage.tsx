// pages/admin/SystemConfigPage.tsx
import { useEffect, useState } from 'react';
import { Api, SystemConfigDto, SystemStatusDto, TradingLimitsDto, MarginLimitsDto, UpdateSystemConfigRequest } from '../lib/client';
import Badge from '../components/UI/Badge';
import { 
  Settings, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  History,
  RotateCcw,
  Edit,
  TrendingUp,
  DollarSign,
  Percent,
  Play,
  Pause,
  Loader2,
  Activity,
  Server,
  Eye
} from 'lucide-react';

// Status Badge
function StatusBadge({ enabled, labelTrue, labelFalse }: { enabled: boolean; labelTrue: string; labelFalse: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      enabled 
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }`}>
      {enabled ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {enabled ? labelTrue : labelFalse}
    </span>
  );
}

// ===== Export to CSV =====
function exportToCSV(config: SystemConfigDto | null) {
  if (!config) return;

  const headers = ['تنظیمات سیستم'];
  const rows = [
    ['وضعیت معاملات', config.tradingEnabled ? 'فعال' : 'غیرفعال'],
    ['معاملات نقدی', config.cashTradeEnabled ? 'فعال' : 'غیرفعال'],
    ['معاملات مارجین', config.marginTradeEnabled ? 'فعال' : 'غیرفعال'],
    ['حداقل معامله', config.minTradeQuantity || '---'],
    ['حداکثر معامله', config.maxTradeQuantity || '---'],
    ['حداکثر ارزش هر سفارش', config.maxSingleOrderValue || '---'],
    ['حداکثر حجم روزانه', config.maxDailyVolumePerUser || '---'],
    ['حداکثر سفارش روزانه', config.maxDailyOrdersPerUser || '---'],
    ['حداکثر اهرم', config.maxLeverage || '---'],
    ['مارجین اولیه', config.initialMarginRate ? `${(config.initialMarginRate * 100).toFixed(0)}%` : '---'],
    ['مارجین نگهداری', config.maintenanceMarginRate ? `${(config.maintenanceMarginRate * 100).toFixed(0)}%` : '---'],
    ['آستانه لیکوئیدیشن', config.liquidationThreshold ? `${(config.liquidationThreshold * 100).toFixed(0)}%` : '---'],
    ['ساعت شروع', config.tradingHoursStart ? `${config.tradingHoursStart.hour}:${config.tradingHoursStart.minute}` : '---'],
    ['ساعت پایان', config.tradingHoursEnd ? `${config.tradingHoursEnd.hour}:${config.tradingHoursEnd.minute}` : '---'],
    ['زمان تسویه', config.settlementTime || '---'],
    ['نسخه', config.versionNumber || '---'],
  ];

  const BOM = '\uFEFF';
  const csvContent = BOM + rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `system_config_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// Config Edit Modal
function ConfigEditModal({
  config,
  onClose,
  onSave,
  isSaving
}: {
  config: SystemConfigDto | null;
  onClose: () => void;
  onSave: (data: UpdateSystemConfigRequest) => Promise<void>;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<UpdateSystemConfigRequest>({
    tradingEnabled: true,
    cashTradeEnabled: true,
    marginTradeEnabled: true,
    minTradeQuantity: 0,
    maxTradeQuantity: 0,
    maxSingleOrderValue: 0,
    maxDailyVolumePerUser: 0,
    maxDailyOrdersPerUser: 0,
    maxLeverage: 10,
    initialMarginRate: null,
    maintenanceMarginRate: 0.05,
    marginWarningThreshold: 0.3,
    marginCriticalThreshold: 0.15,
    liquidationThreshold: 0.05,
    maxExposurePerUser: 0,
    positionConcentrationLimit: 0,
    liquidationSpread: 0.05,
    settlementTime: '14:30',
    settlementMode: 'T_PLUS_0',
    priceTtlSeconds: 30,
    walletReserveTimeoutSeconds: 60,
    chargeFundingOnWeekends: false,
    killSwitchGlobal: false,
    killSwitchMargin: false,
    killSwitchCash: false,
    changeReason: '',
    tradingHoursStart: { hour: 9, minute: 0, second: 0, nano: 0 },
    tradingHoursEnd: { hour: 17, minute: 0, second: 0, nano: 0 },
    ...config
  });

  const [changeReason, setChangeReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeReason) {
      alert('لطفا دلیل تغییر را وارد کنید');
      return;
    }
    await onSave({ ...formData, changeReason });
  };

  const Input = ({ label, name, type = 'text', placeholder, unit }: any) => (
    <div>
      <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={formData[name] ?? ''}
          onChange={e => setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100"
        />
        {unit && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{unit}</span>}
      </div>
    </div>
  );

  const Toggle = ({ label, name }: { label: string; name: string }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={!!formData[name]}
          onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.checked }))}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface-dark rounded-xl shadow-2xl border border-border-light">
        <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border-light px-5 py-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">ویرایش تنظیمات سیستم</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200">
            <span className="text-lg">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Trading Status */}
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">وضعیت معاملات</h4>
            <div className="space-y-2">
              <Toggle label="فعال بودن کل معاملات" name="tradingEnabled" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Toggle label="معاملات نقدی" name="cashTradeEnabled" />
                <Toggle label="معاملات مارجین" name="marginTradeEnabled" />
              </div>
            </div>
          </div>

          {/* Trading Hours */}
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">ساعات معاملاتی</h4>
            <div className="grid grid-cols-3 gap-3">
              <Input label="ساعت شروع" name="tradingHoursStart" placeholder="ساعت" />
              <Input label="ساعت پایان" name="tradingHoursEnd" placeholder="ساعت" />
              <Input label="زمان تسویه" name="settlementTime" placeholder="14:30" />
            </div>
          </div>

          {/* Trading Limits */}
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">محدودیت‌های معاملاتی</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="حداقل معامله" name="minTradeQuantity" type="number" unit="گرم" />
              <Input label="حداکثر معامله" name="maxTradeQuantity" type="number" unit="گرم" />
              <Input label="حداکثر ارزش سفارش" name="maxSingleOrderValue" type="number" unit="تومان" />
              <Input label="حداکثر حجم روزانه" name="maxDailyVolumePerUser" type="number" unit="تومان" />
              <Input label="حداکثر سفارش روزانه" name="maxDailyOrdersPerUser" type="number" unit="عدد" />
            </div>
          </div>

          {/* Margin */}
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">تنظیمات مارجین</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="حداکثر اهرم" name="maxLeverage" type="number" unit="x" />
              <Input label="مارجین اولیه" name="initialMarginRate" type="number" unit="%" />
              <Input label="مارجین نگهداری" name="maintenanceMarginRate" type="number" unit="%" />
              <Input label="آستانه لیکوئیدیشن" name="liquidationThreshold" type="number" unit="%" />
            </div>
          </div>

          {/* Kill Switch */}
          <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800/30">
            <h4 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-3">قطع اضطراری</h4>
            <div className="space-y-2">
              <Toggle label="قطع کل معاملات" name="killSwitchGlobal" />
              <Toggle label="قطع معاملات مارجین" name="killSwitchMargin" />
              <Toggle label="قطع معاملات نقدی" name="killSwitchCash" />
            </div>
          </div>

          {/* Reason */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800/30">
            <label className="block text-xs text-amber-700 dark:text-amber-400 mb-1">دلیل تغییر *</label>
            <textarea
              value={changeReason}
              onChange={e => setChangeReason(e.target.value)}
              rows={2}
              placeholder="دلیل تغییرات را وارد کنید..."
              className="w-full rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-background-dark px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ذخیره'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// History Modal
function ConfigHistoryModal({
  history,
  onClose,
  onRollback,
  isRollingBack
}: {
  history: SystemConfigDto[];
  onClose: () => void;
  onRollback: (version: number) => Promise<void>;
  isRollingBack: boolean;
}) {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-surface-dark rounded-xl shadow-2xl border border-border-light">
        <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border-light px-5 py-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            تاریخچه تغییرات
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200">
            <span className="text-lg">×</span>
          </button>
        </div>

        <div className="p-4 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">تاریخچه‌ای وجود ندارد</div>
          ) : (
            history.map((config, index) => (
              <div
                key={config.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedVersion === config.versionNumber
                    ? 'border-primary bg-primary/5'
                    : 'border-border-light dark:border-border-dark hover:bg-slate-50'
                }`}
                onClick={() => setSelectedVersion(config.versionNumber || null)}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={index === 0 ? 'success' : 'neutral'} size="sm">
                      نسخه {config.versionNumber}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {config.createdAt ? new Date(config.createdAt).toLocaleString('fa-IR') : '---'}
                    </span>
                  </div>
                  {index === 0 && (
                    <span className="text-xs text-green-600 dark:text-green-400">● فعلی</span>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-xs mt-2">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded px-2 py-1">
                    <span className="text-slate-400">معاملات:</span>
                    <span className="mr-1 font-medium">{config.tradingEnabled ? 'فعال' : 'غیرفعال'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded px-2 py-1">
                    <span className="text-slate-400">اهرم:</span>
                    <span className="mr-1 font-medium">{config.maxLeverage || '0'}x</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded px-2 py-1">
                    <span className="text-slate-400">لیکوئیدیشن:</span>
                    <span className="mr-1 font-medium">{config.liquidationThreshold ? (config.liquidationThreshold * 100) : 0}%</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded px-2 py-1">
                    <span className="text-slate-400">ساعت:</span>
                    <span className="mr-1 font-medium">
                      {config.tradingHoursStart?.hour}:{config.tradingHoursStart?.minute}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {history.length > 0 && (
            <div className="flex gap-3 pt-3 border-t border-border-light">
              <button
                onClick={() => selectedVersion && onRollback(selectedVersion)}
                disabled={!selectedVersion || isRollingBack || selectedVersion === history[0]?.versionNumber}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRollingBack ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                بازگشت به نسخه {selectedVersion}
              </button>
              <button onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm font-semibold">
                بستن
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function SystemConfigPage() {
  const [activeConfig, setActiveConfig] = useState<SystemConfigDto | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatusDto | null>(null);
  const [tradingLimits, setTradingLimits] = useState<TradingLimitsDto | null>(null);
  const [marginLimits, setMarginLimits] = useState<MarginLimitsDto | null>(null);
  const [configHistory, setConfigHistory] = useState<SystemConfigDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const client = new Api();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [active, status, limits, margin, history] = await Promise.all([
        client.api.getActiveConfig(),
        client.api.getSystemStatus(),
        client.api.getTradingLimits(),
        client.api.getMarginLimits(),
        client.api.getConfigHistory()
      ]);
      setActiveConfig(active.data || null);
      setSystemStatus(status.data || null);
      setTradingLimits(limits.data || null);
      setMarginLimits(margin.data || null);
      setConfigHistory(history.data || []);
    } catch (error) {
      console.error('Failed to fetch config data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveConfig = async (data: UpdateSystemConfigRequest) => {
    setIsSaving(true);
    try {
      await client.api.updateConfig(data);
      await fetchAllData();
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollback = async (version: number) => {
    setIsRollingBack(true);
    try {
      await client.api.rollbackToVersion(version);
      await fetchAllData();
      setShowHistoryModal(false);
    } catch (error) {
      console.error('Failed to rollback:', error);
    } finally {
      setIsRollingBack(false);
    }
  };

  const handleExport = () => {
    exportToCSV(activeConfig);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-background-dark rounded-xl border border-border-light overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const isTradingActive = systemStatus?.tradingEnabled && systemStatus?.withinTradingHours;

  return (
    <div className="bg-white dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
      {/* Tab Header - بدون تایتل */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-slate-50/30 dark:bg-slate-800/10">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-slate-900 dark:text-white border-b-2 border-primary pb-2">
            تنظیمات سیستم
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge 
            enabled={isTradingActive} 
            labelTrue="بازار باز" 
            labelFalse="بازار بسته" 
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">نسخه {activeConfig?.versionNumber || '---'}</span>
          <span className="w-px h-4 bg-border-light dark:bg-border-dark" />
          <span className="text-xs text-slate-400">
            آخرین بروزرسانی: {activeConfig?.updatedAt ? new Date(activeConfig.updatedAt).toLocaleString('fa-IR') : '---'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
          >
            <History className="w-4 h-4" />
            تاریخچه
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
            title="خروجی اکسل"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            خروجی
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-all"
          >
            <Edit className="w-4 h-4" />
            ویرایش
          </button>
          <button
            onClick={fetchAllData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kill Switch Alert */}
      {systemStatus?.killSwitchActive && (
        <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/30 flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">قطع اضطراری فعال است</span>
            <div className="flex gap-2 mt-1">
              {activeConfig?.killSwitchGlobal && <Badge variant="danger" size="sm">کل معاملات</Badge>}
              {activeConfig?.killSwitchMargin && <Badge variant="danger" size="sm">مارجین</Badge>}
              {activeConfig?.killSwitchCash && <Badge variant="danger" size="sm">نقدی</Badge>}
            </div>
          </div>
        </div>
      )}

      {/* Config Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {/* وضعیت معاملات */}
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500 w-1/3">وضعیت کل معاملات</td>
              <td className="px-4 py-3">
                <StatusBadge enabled={systemStatus?.tradingEnabled ?? false} labelTrue="فعال" labelFalse="غیرفعال" />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">معاملات نقدی</td>
              <td className="px-4 py-3">
                <StatusBadge enabled={systemStatus?.cashTradeEnabled ?? false} labelTrue="فعال" labelFalse="غیرفعال" />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">معاملات مارجین</td>
              <td className="px-4 py-3">
                <StatusBadge enabled={systemStatus?.marginTradeEnabled ?? false} labelTrue="فعال" labelFalse="غیرفعال" />
              </td>
            </tr>

            {/* ساعات معاملاتی */}
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">ساعات معاملاتی</td>
              <td className="px-4 py-3">
                <span className="text-sm">
                  {systemStatus?.tradingHoursStart?.hour}:{systemStatus?.tradingHoursStart?.minute} - 
                  {systemStatus?.tradingHoursEnd?.hour}:{systemStatus?.tradingHoursEnd?.minute}
                </span>
                <span className="text-xs text-slate-400 mr-2">| تسویه: {activeConfig?.settlementTime || '---'}</span>
              </td>
            </tr>

            {/* محدودیت‌های معاملاتی */}
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">حداقل/حداکثر معامله</td>
              <td className="px-4 py-3">
                <span className="text-sm">{tradingLimits?.minTradeQuantity || '---'}</span>
                <span className="text-xs text-slate-400 mx-1">تا</span>
                <span className="text-sm">{tradingLimits?.maxTradeQuantity || '---'}</span>
                <span className="text-xs text-slate-400 mr-1">گرم</span>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">حداکثر ارزش هر سفارش</td>
              <td className="px-4 py-3">
                <span className="text-sm">{tradingLimits?.maxSingleOrderValue?.toLocaleString() || '---'}</span>
                <span className="text-xs text-slate-400 mr-1">تومان</span>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">حداکثر حجم روزانه هر کاربر</td>
              <td className="px-4 py-3">
                <span className="text-sm">{tradingLimits?.maxDailyVolumePerUser?.toLocaleString() || '---'}</span>
                <span className="text-xs text-slate-400 mr-1">تومان</span>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">حداکثر سفارش روزانه هر کاربر</td>
              <td className="px-4 py-3">
                <span className="text-sm">{tradingLimits?.maxDailyOrdersPerUser || '---'}</span>
                <span className="text-xs text-slate-400 mr-1">عدد</span>
              </td>
            </tr>

            {/* تنظیمات مارجین */}
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">حداکثر اهرم</td>
              <td className="px-4 py-3">
                <span className="text-sm font-bold">{marginLimits?.maxLeverage || '---'}x</span>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">مارجین اولیه / نگهداری</td>
              <td className="px-4 py-3">
                <span className="text-sm">
                  {marginLimits?.initialMarginRate ? (marginLimits.initialMarginRate * 100).toFixed(0) : '---'}%
                </span>
                <span className="text-xs text-slate-400 mx-1">/</span>
                <span className="text-sm">
                  {marginLimits?.maintenanceMarginRate ? (marginLimits.maintenanceMarginRate * 100).toFixed(0) : '---'}%
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500 text-red-500">آستانه لیکوئیدیشن</td>
              <td className="px-4 py-3">
                <span className="text-sm font-bold text-red-600">
                  {marginLimits?.liquidationThreshold ? (marginLimits.liquidationThreshold * 100).toFixed(0) : '---'}%
                </span>
                <span className="text-xs text-red-400 mr-1">(زیر این حد پوزیشن بسته می‌شود)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showEditModal && (
        <ConfigEditModal
          config={activeConfig}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveConfig}
          isSaving={isSaving}
        />
      )}

      {showHistoryModal && (
        <ConfigHistoryModal
          history={configHistory}
          onClose={() => setShowHistoryModal(false)}
          onRollback={handleRollback}
          isRollingBack={isRollingBack}
        />
      )}
    </div>
  );
}