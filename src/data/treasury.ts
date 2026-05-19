export const TREASURY = {
  totalLiquidity: 250_000_000_000_000,
  reserved: 45_000_000_000_000,
  available: 185_000_000_000_000,
  alertThreshold: 20_000_000_000_000,
  riskCoverageRatio: 2.4,
  goldReserveGrams: 12_500,
  goldReserveValue: 406_250_000_000,
};

export type TreasuryTxType = 'deposit' | 'withdrawal' | 'reserve' | 'release';

export interface TreasuryTransaction {
  id: string;
  type: TreasuryTxType;
  description: string;
  amount: number;
  date: string;
  operator: string;
}

export const TREASURY_TRANSACTIONS: TreasuryTransaction[] = [
  { id: 'tx1', type: 'deposit', description: 'واریز وجه تسویه معاملات نقدی', amount: 2_500_000_000, date: '۱۴۰۳/۱۱/۲۸ - ۱۰:۰۰', operator: 'سیستم' },
  { id: 'tx2', type: 'withdrawal', description: 'پرداخت سود اجاره طلا', amount: 8_750_000, date: '۱۴۰۳/۱۱/۲۸ - ۰۹:۳۰', operator: 'امیر حیدری' },
  { id: 'tx3', type: 'reserve', description: 'رزرو برای تعهدات پسفردایی', amount: 16_500_000_000, date: '۱۴۰۳/۱۱/۲۸ - ۰۸:۰۰', operator: 'سیستم' },
  { id: 'tx4', type: 'deposit', description: 'واریز سپرده جدید - مجموعه طهران', amount: 5_000_000_000, date: '۱۴۰۳/۱۱/۲۷ - ۱۴:۲۰', operator: 'سیستم' },
  { id: 'tx5', type: 'release', description: 'آزادسازی وثیقه معامله منقضی', amount: 3_200_000_000, date: '۱۴۰۳/۱۱/۲۷ - ۱۱:۰۰', operator: 'سیستم' },
  { id: 'tx6', type: 'withdrawal', description: 'برداشت کارمزد مدیریت', amount: 120_000_000, date: '۱۴۰۳/۱۱/۲۶ - ۱۶:۰۰', operator: 'امیر حیدری' },
];

export type GoldAsset = 'طلا ۱۸ عیار' | 'طلا ۲۴ عیار' | 'سکه بهار آزادی' | 'نیم سکه' | 'ربع سکه';

export interface InventoryItem {
  id: string;
  asset: GoldAsset;
  unit: string;
  total: number;
  reserved: number;
  available: number;
  avgCostPerUnit: number;
  vault: string;
  coverageRatio: number;
  transactions: InventoryTx[];
}

export interface InventoryTx {
  id: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  label: string;
  qty: number;
  date: string;
}

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv1',
    asset: 'طلا ۱۸ عیار',
    unit: 'گرم',
    total: 12500,
    reserved: 3200,
    available: 9300,
    avgCostPerUnit: 4_850_000,
    vault: 'خزانه تهران',
    coverageRatio: 1.12,
    transactions: [
      { id: 't1', type: 'IN', label: 'خرید از بازار', qty: 500, date: '۱۴۰۳/۱۱/۲۸' },
      { id: 't2', type: 'OUT', label: 'تحویل به مشتری', qty: 120, date: '۱۴۰۳/۱۱/۲۷' },
      { id: 't3', type: 'ADJUST', label: 'اصلاح موجودی', qty: 10, date: '۱۴۰۳/۱۱/۲۶' },
      { id: 't4', type: 'IN', label: 'واریز از انبار', qty: 800, date: '۱۴۰۳/۱۱/۲۵' },
      { id: 't5', type: 'OUT', label: 'تحویل به مشتری', qty: 250, date: '۱۴۰۳/۱۱/۲۴' },
    ],
  },
  {
    id: 'inv2',
    asset: 'طلا ۲۴ عیار',
    unit: 'گرم',
    total: 4800,
    reserved: 900,
    available: 3900,
    avgCostPerUnit: 6_100_000,
    vault: 'خزانه اصفهان',
    coverageRatio: 1.38,
    transactions: [
      { id: 't6', type: 'IN', label: 'خرید از بازار', qty: 300, date: '۱۴۰۳/۱۱/۲۷' },
      { id: 't7', type: 'OUT', label: 'تحویل به مشتری', qty: 80, date: '۱۴۰۳/۱۱/۲۶' },
    ],
  },
  {
    id: 'inv3',
    asset: 'سکه بهار آزادی',
    unit: 'عدد',
    total: 3200,
    reserved: 850,
    available: 2350,
    avgCostPerUnit: 42_000_000,
    vault: 'خزانه تهران',
    coverageRatio: 1.27,
    transactions: [
      { id: 't8', type: 'IN', label: 'خرید از ضراب', qty: 200, date: '۱۴۰۳/۱۱/۲۸' },
      { id: 't9', type: 'OUT', label: 'تحویل به مشتری', qty: 60, date: '۱۴۰۳/۱۱/۲۷' },
      { id: 't10', type: 'ADJUST', label: 'اصلاح موجودی', qty: -5, date: '۱۴۰۳/۱۱/۲۵' },
    ],
  },
  {
    id: 'inv4',
    asset: 'نیم سکه',
    unit: 'عدد',
    total: 1800,
    reserved: 200,
    available: 1600,
    avgCostPerUnit: 22_000_000,
    vault: 'خزانه مشهد',
    coverageRatio: 1.55,
    transactions: [
      { id: 't11', type: 'IN', label: 'خرید از ضراب', qty: 100, date: '۱۴۰۳/۱۱/۲۶' },
    ],
  },
  {
    id: 'inv5',
    asset: 'ربع سکه',
    unit: 'عدد',
    total: 950,
    reserved: 480,
    available: 470,
    avgCostPerUnit: 11_500_000,
    vault: 'خزانه تهران',
    coverageRatio: 1.08,
    transactions: [
      { id: 't12', type: 'IN', label: 'خرید از ضراب', qty: 150, date: '۱۴۰۳/۱۱/۲۸' },
      { id: 't13', type: 'OUT', label: 'تحویل به مشتری', qty: 90, date: '۱۴۰۳/۱۱/۲۷' },
    ],
  },
];

export type DeliveryStatus = 'pending' | 'ready' | 'delivered' | 'cancelled';

export interface DeliveryItem {
  id: string;
  deliveryId: string;
  user: string;
  userId: string;
  asset: GoldAsset;
  qty: number;
  unit: string;
  status: DeliveryStatus;
  warehouse: string;
  address: string;
  requestDate: string;
  readyDate: string;
  paymentStatus: 'paid' | 'pending';
}

export const DELIVERIES: DeliveryItem[] = [
  { id: 'd1', deliveryId: 'DLV-۱۰۰۱', user: 'علی محمدی', userId: 'U-001', asset: 'طلا ۱۸ عیار', qty: 50, unit: 'گرم', status: 'pending', warehouse: 'انبار تهران', address: 'تهران، خیابان ولیعصر', requestDate: '۱۴۰۳/۱۱/۲۸', readyDate: '-', paymentStatus: 'paid' },
  { id: 'd2', deliveryId: 'DLV-۱۰۰۲', user: 'سارا رضایی', userId: 'U-002', asset: 'سکه بهار آزادی', qty: 5, unit: 'عدد', status: 'ready', warehouse: 'انبار اصفهان', address: 'اصفهان، خیابان چهارباغ', requestDate: '۱۴۰۳/۱۱/۲۷', readyDate: '۱۴۰۳/۱۱/۲۸', paymentStatus: 'paid' },
  { id: 'd3', deliveryId: 'DLV-۱۰۰۳', user: 'حسین کریمی', userId: 'U-003', asset: 'طلا ۲۴ عیار', qty: 30, unit: 'گرم', status: 'delivered', warehouse: 'انبار تهران', address: 'تهران، خیابان جردن', requestDate: '۱۴۰۳/۱۱/۲۶', readyDate: '۱۴۰۳/۱۱/۲۷', paymentStatus: 'paid' },
  { id: 'd4', deliveryId: 'DLV-۱۰۰۴', user: 'مریم احمدی', userId: 'U-004', asset: 'نیم سکه', qty: 10, unit: 'عدد', status: 'pending', warehouse: 'انبار مشهد', address: 'مشهد، بلوار وکیل‌آباد', requestDate: '۱۴۰۳/۱۱/۲۸', readyDate: '-', paymentStatus: 'pending' },
  { id: 'd5', deliveryId: 'DLV-۱۰۰۵', user: 'رضا نوری', userId: 'U-005', asset: 'ربع سکه', qty: 20, unit: 'عدد', status: 'cancelled', warehouse: 'انبار تهران', address: 'تهران، میرداماد', requestDate: '۱۴۰۳/۱۱/۲۵', readyDate: '-', paymentStatus: 'pending' },
  { id: 'd6', deliveryId: 'DLV-۱۰۰۶', user: 'نگار صادقی', userId: 'U-006', asset: 'طلا ۱۸ عیار', qty: 120, unit: 'گرم', status: 'ready', warehouse: 'انبار تهران', address: 'تهران، تجریش', requestDate: '۱۴۰۳/۱۱/۲۷', readyDate: '۱۴۰۳/۱۱/۲۸', paymentStatus: 'paid' },
  { id: 'd7', deliveryId: 'DLV-۱۰۰۷', user: 'فرید منصوری', userId: 'U-007', asset: 'سکه بهار آزادی', qty: 12, unit: 'عدد', status: 'pending', warehouse: 'انبار اصفهان', address: 'اصفهان، خیابان شریف', requestDate: '۱۴۰۳/۱۱/۲۸', readyDate: '-', paymentStatus: 'paid' },
];

export interface HedgeItem {
  id: string;
  asset: GoldAsset;
  unit: string;
  longPosition: number;
  shortPosition: number;
  netExposure: number;
  physical: number;
  coverageRatio: number;
  hedgeSuggestion: number;
  topUsers: { name: string; qty: number }[];
}

export const HEDGE_ITEMS: HedgeItem[] = [
  {
    id: 'h1',
    asset: 'طلا ۱۸ عیار',
    unit: 'گرم',
    longPosition: 28500,
    shortPosition: 16200,
    netExposure: 12300,
    physical: 9300,
    coverageRatio: 1.12,
    hedgeSuggestion: 3000,
    topUsers: [
      { name: 'علی محمدی', qty: 2500 },
      { name: 'سارا رضایی', qty: 1800 },
      { name: 'حسین کریمی', qty: 1200 },
    ],
  },
  {
    id: 'h2',
    asset: 'طلا ۲۴ عیار',
    unit: 'گرم',
    longPosition: 9200,
    shortPosition: 5100,
    netExposure: 4100,
    physical: 3900,
    coverageRatio: 1.38,
    hedgeSuggestion: 0,
    topUsers: [
      { name: 'مریم احمدی', qty: 900 },
      { name: 'رضا نوری', qty: 650 },
    ],
  },
  {
    id: 'h3',
    asset: 'سکه بهار آزادی',
    unit: 'عدد',
    longPosition: 5800,
    shortPosition: 3200,
    netExposure: 2600,
    physical: 2350,
    coverageRatio: 1.27,
    hedgeSuggestion: 250,
    topUsers: [
      { name: 'فرید منصوری', qty: 480 },
      { name: 'نگار صادقی', qty: 320 },
    ],
  },
  {
    id: 'h4',
    asset: 'ربع سکه',
    unit: 'عدد',
    longPosition: 1800,
    shortPosition: 700,
    netExposure: 1100,
    physical: 470,
    coverageRatio: 1.08,
    hedgeSuggestion: 630,
    topUsers: [
      { name: 'علی محمدی', qty: 220 },
      { name: 'حسین کریمی', qty: 180 },
    ],
  },
];

export const NET_EXPOSURE_CHART = [
  { label: '۱۱/۲۲', value: 8200 },
  { label: '۱۱/۲۳', value: 9100 },
  { label: '۱۱/۲۴', value: 8700 },
  { label: '۱۱/۲۵', value: 10500 },
  { label: '۱۱/۲۶', value: 11200 },
  { label: '۱۱/۲۷', value: 10800 },
  { label: '۱۱/۲۸', value: 12300 },
];
