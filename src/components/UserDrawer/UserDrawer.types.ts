export type DrawerTab = 'info' | 'wallet' | 'gold' | 'orders' | 'staking';

export interface TabDef {
  id: DrawerTab;
  label: string;
  icon: string;
}

export const DRAWER_TABS: TabDef[] = [
  { id: 'info', label: 'اطلاعات', icon: 'person' },
  { id: 'wallet', label: 'کیف پول', icon: 'account_balance_wallet' },
  { id: 'orders', label: 'سفارشات', icon: 'receipt_long' },
  { id: 'staking', label: 'رشد ثروت', icon: 'trending_up' },
];
