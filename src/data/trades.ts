export type TradeType = 'cash' | 'tomorrow' | 'day_after' | 'commitment';
export type TradeSide = 'buy' | 'sell';
export type TradeStatus = 'settled' | 'pending' | 'cancelled' | 'open';
export type DeliveryStatus = 'pending' | 'delivered' | 'cancelled';
export type UserType = 'normal' | 'trade';

export interface Trade {
  id: string;
  orderId: string;
  type: TradeType;
  side: TradeSide;
  userName: string;
  userId: string;
  userType: UserType;
  asset: string;
  quantity: number;
  unit: string;
  entryPrice: number;
  marketPriceAtExecution: number;
  spread: number;
  fee: number;
  commission: number;
  netRevenue: number;
  totalValue: number;
  status: TradeStatus;
  createdAt: string;
  settlementDate: string;
  deliveryType: 'physical' | 'cash';
  deliveryStatus: DeliveryStatus;
  physicalDelivery: boolean;
}

export const TRADES: Trade[] = [
  {
    id: 't1', orderId: 'o1', type: 'cash', side: 'buy',
    userName: 'علی رضایی', userId: 'u1', userType: 'normal',
    asset: 'طلای ۱۸ عیار', quantity: 10, unit: 'گرم',
    entryPrice: 32_500_000, marketPriceAtExecution: 32_450_000,
    spread: 500_000, fee: 1_625_000, commission: 812_500, netRevenue: 2_437_500,
    totalValue: 325_000_000, status: 'settled',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۰:۳۲', settlementDate: '۱۴۰۳/۱۱/۲۸',
    deliveryType: 'cash', deliveryStatus: 'delivered', physicalDelivery: false,
  },
  {
    id: 't2', orderId: 'o2', type: 'cash', side: 'sell',
    userName: 'شرکت طلای امید', userId: 'u2', userType: 'trade',
    asset: 'سکه تمام بهار', quantity: 5, unit: 'عدد',
    entryPrice: 42_000_000, marketPriceAtExecution: 41_800_000,
    spread: 1_000_000, fee: 1_050_000, commission: 525_000, netRevenue: 1_575_000,
    totalValue: 210_000_000, status: 'settled',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۹:۱۵', settlementDate: '۱۴۰۳/۱۱/۲۸',
    deliveryType: 'physical', deliveryStatus: 'pending', physicalDelivery: true,
  },
  {
    id: 't3', orderId: 'o3', type: 'cash', side: 'buy',
    userName: 'رضا محمدی', userId: 'u5', userType: 'normal',
    asset: 'طلای ۱۸ عیار', quantity: 5, unit: 'گرم',
    entryPrice: 32_600_000, marketPriceAtExecution: 32_550_000,
    spread: 250_000, fee: 815_000, commission: 407_500, netRevenue: 1_222_500,
    totalValue: 163_000_000, status: 'pending',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۱:۴۵', settlementDate: '۱۴۰۳/۱۱/۲۸',
    deliveryType: 'cash', deliveryStatus: 'pending', physicalDelivery: false,
  },
  {
    id: 't4', orderId: 'o4', type: 'tomorrow', side: 'buy',
    userName: 'گروه سرمایه‌گذاری پارس', userId: 'u4', userType: 'trade',
    asset: 'طلای ۱۸ عیار', quantity: 100, unit: 'گرم',
    entryPrice: 32_800_000, marketPriceAtExecution: 32_700_000,
    spread: 10_000_000, fee: 16_400_000, commission: 8_200_000, netRevenue: 24_600_000,
    totalValue: 3_280_000_000, status: 'open',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۸:۰۰', settlementDate: '۱۴۰۳/۱۱/۲۹',
    deliveryType: 'cash', deliveryStatus: 'pending', physicalDelivery: false,
  },
  {
    id: 't5', orderId: 'o7', type: 'tomorrow', side: 'sell',
    userName: 'شرکت کیمیا طلا', userId: 'u7', userType: 'trade',
    asset: 'سکه تمام بهار', quantity: 20, unit: 'عدد',
    entryPrice: 42_200_000, marketPriceAtExecution: 42_000_000,
    spread: 4_000_000, fee: 4_220_000, commission: 2_110_000, netRevenue: 6_330_000,
    totalValue: 844_000_000, status: 'open',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۹:۳۰', settlementDate: '۱۴۰۳/۱۱/۲۹',
    deliveryType: 'cash', deliveryStatus: 'pending', physicalDelivery: false,
  },
  {
    id: 't6', orderId: 'o8', type: 'tomorrow', side: 'buy',
    userName: 'حسین کریمی', userId: 'u8', userType: 'normal',
    asset: 'طلای ۲۴ عیار', quantity: 3, unit: 'گرم',
    entryPrice: 38_500_000, marketPriceAtExecution: 38_400_000,
    spread: 300_000, fee: 577_500, commission: 288_750, netRevenue: 866_250,
    totalValue: 115_500_000, status: 'pending',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۲:۰۰', settlementDate: '۱۴۰۳/۱۱/۲۹',
    deliveryType: 'physical', deliveryStatus: 'pending', physicalDelivery: true,
  },
  {
    id: 't7', orderId: 'o10', type: 'day_after', side: 'buy',
    userName: 'مجموعه سرمایه طهران', userId: 'u10', userType: 'trade',
    asset: 'طلای ۱۸ عیار', quantity: 500, unit: 'گرم',
    entryPrice: 33_000_000, marketPriceAtExecution: 32_900_000,
    spread: 50_000_000, fee: 82_500_000, commission: 41_250_000, netRevenue: 123_750_000,
    totalValue: 16_500_000_000, status: 'open',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۷:۴۵', settlementDate: '۱۴۰۳/۱۱/۳۰',
    deliveryType: 'cash', deliveryStatus: 'pending', physicalDelivery: false,
  },
  {
    id: 't8', orderId: 'o12', type: 'day_after', side: 'sell',
    userName: 'گروه سرمایه‌گذاری پارس', userId: 'u4', userType: 'trade',
    asset: 'سکه تمام بهار', quantity: 50, unit: 'عدد',
    entryPrice: 42_500_000, marketPriceAtExecution: 42_200_000,
    spread: 15_000_000, fee: 10_625_000, commission: 5_312_500, netRevenue: 15_937_500,
    totalValue: 2_125_000_000, status: 'open',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۰:۰۰', settlementDate: '۱۴۰۳/۱۱/۳۰',
    deliveryType: 'cash', deliveryStatus: 'pending', physicalDelivery: false,
  },
  {
    id: 't9', orderId: 'o3', type: 'day_after', side: 'buy',
    userName: 'مریم صادقی', userId: 'u3', userType: 'normal',
    asset: 'طلای ۱۸ عیار', quantity: 2, unit: 'گرم',
    entryPrice: 33_100_000, marketPriceAtExecution: 33_050_000,
    spread: 100_000, fee: 331_000, commission: 165_500, netRevenue: 496_500,
    totalValue: 66_200_000, status: 'pending',
    createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۳:۲۰', settlementDate: '۱۴۰۳/۱۱/۳۰',
    deliveryType: 'physical', deliveryStatus: 'pending', physicalDelivery: true,
  },
  {
    id: 't10', orderId: 'o10', type: 'commitment', side: 'buy',
    userName: 'مجموعه سرمایه طهران', userId: 'u10', userType: 'trade',
    asset: 'طلای ۱۸ عیار', quantity: 1000, unit: 'گرم',
    entryPrice: 33_500_000, marketPriceAtExecution: 33_300_000,
    spread: 200_000_000, fee: 167_500_000, commission: 83_750_000, netRevenue: 251_250_000,
    totalValue: 33_500_000_000, status: 'open',
    createdAt: '۱۴۰۳/۱۱/۰۱ - ۰۸:۰۰', settlementDate: '۱۴۰۳/۱۲/۲۸',
    deliveryType: 'cash', deliveryStatus: 'pending', physicalDelivery: false,
  },
  {
    id: 't11', orderId: 'o2', type: 'commitment', side: 'sell',
    userName: 'شرکت طلای امید', userId: 'u2', userType: 'trade',
    asset: 'طلای ۱۸ عیار', quantity: 300, unit: 'گرم',
    entryPrice: 33_200_000, marketPriceAtExecution: 33_000_000,
    spread: 60_000_000, fee: 49_800_000, commission: 24_900_000, netRevenue: 74_700_000,
    totalValue: 9_960_000_000, status: 'open',
    createdAt: '۱۴۰۳/۱۰/۱۵ - ۱۰:۰۰', settlementDate: '۱۴۰۴/۰۱/۱۵',
    deliveryType: 'cash', deliveryStatus: 'pending', physicalDelivery: false,
  },
  {
    id: 't12', orderId: 'o4', type: 'commitment', side: 'buy',
    userName: 'گروه سرمایه‌گذاری پارس', userId: 'u4', userType: 'trade',
    asset: 'سکه تمام بهار', quantity: 100, unit: 'عدد',
    entryPrice: 43_000_000, marketPriceAtExecution: 42_800_000,
    spread: 20_000_000, fee: 21_500_000, commission: 10_750_000, netRevenue: 32_250_000,
    totalValue: 4_300_000_000, status: 'open',
    createdAt: '۱۴۰۳/۱۰/۲۰ - ۰۹:۳۰', settlementDate: '۱۴۰۴/۰۲/۲۰',
    deliveryType: 'physical', deliveryStatus: 'pending', physicalDelivery: true,
  },
];

export const TRADE_STATS = {
  totalVolumeTodayCoin: 12_540,
  spreadProfit: 850_000_000,
  activeTraders: 1_245,
  openObligations: 5_400,
  avgSpread: Math.round(TRADES.reduce((s, t) => s + t.spread, 0) / TRADES.length),
};

export const TRADE_TYPE_LABELS: Record<TradeType, string> = {
  cash: 'نقدی',
  tomorrow: 'فردایی',
  day_after: 'پسفردایی',
  commitment: 'تعهدی',
};
