export type MainTab = 'orders' | 'trades' | 'positions';
export type TradeTypeFilter = 'all' | 'cash' | 'tomorrow' | 'day_after' | 'commitment';

export type OrderSubTab = 'PENDING' | 'ACCEPTED' | 'EXECUTED' | 'PARTIALLY_EXECUTED' | 'CANCELLED' | 'REJECTED' | 'EXPIRED' | 'OPEN';
export type TradeSubTab = 'cash' | 'tomorrow' | 'day_after' | 'commitment';
export type PositionSubTab = 'all' | 'green' | 'yellow' | 'red';

export interface TradeFiltersState {
  search: string;
  tradeType: TradeTypeFilter;
  asset: string;
  userType: string;
  status: string;
  minAmount: string;
  physicalOnly: boolean;
  commitmentOnly: boolean;
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_TRADE_FILTERS: TradeFiltersState = {
  search: '',
  tradeType: 'all',
  asset: 'all',
  userType: 'all',
  status: 'all',
  minAmount: '',
  physicalOnly: false,
  commitmentOnly: false,
  dateFrom: '',
  dateTo: '',
};

export const ORDER_SUB_TABS: { key: OrderSubTab; label: string; icon: string }[] = [
  { key: 'PENDING', label: 'در انتظار', icon: 'radio_button_checked' },
  { key: 'ACCEPTED', label: 'قبول شده', icon: 'pie_chart' },
  { key: 'EXECUTED', label: 'انجام شده', icon: 'cancel' },
  { key: 'PARTIALLY_EXECUTED', label: 'PARTIALLY_EXECUTED', icon: 'cancel' },
  { key: 'CANCELLED', label: 'لغو', icon: 'cancel' },
  { key: 'REJECTED', label: 'باطل', icon: 'cancel' },
  { key: 'EXPIRED', label: 'سررسید شده', icon: 'cancel' },
];

export const TRADE_SUB_TABS: { key: TradeSubTab; label: string; icon: string }[] = [
  { key: 'cash', label: 'نقدی', icon: 'bolt' },
  { key: 'tomorrow', label: 'فردایی', icon: 'schedule' },
  { key: 'day_after', label: 'پسفردایی', icon: 'event' },
  { key: 'commitment', label: 'تعهدی', icon: 'handshake' },
];

export const POSITION_SUB_TABS: { key: PositionSubTab; label: string; icon: string; color: string }[] = [
  { key: 'all', label: 'همه', icon: 'list', color: '' },
  { key: 'green', label: 'ایمن', icon: 'check_circle', color: 'text-emerald-600' },
  { key: 'yellow', label: 'هشدار', icon: 'warning', color: 'text-amber-600' },
  { key: 'red', label: 'بحرانی', icon: 'emergency', color: 'text-rose-600' },
];
