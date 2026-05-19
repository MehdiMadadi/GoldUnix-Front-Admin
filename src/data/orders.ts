export type OrderType = 'market' | 'limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'partially_filled' | 'cancelled';
export type UserType = 'normal' | 'trade';
export type AssetType = 'طلای ۱۸ عیار' | 'سکه تمام بهار' | 'طلای ۲۴ عیار' | 'مس';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userType: UserType;
  side: OrderSide;
  asset: AssetType;
  orderType: OrderType;
  quantity: number;
  unit: string;
  price: number;
  filledQty: number;
  remaining: number;
  status: OrderStatus;
  createdAt: string;
}

export const ORDERS: Order[] = [
  { id: 'o1', userId: 'u1', userName: 'علی رضایی', userType: 'normal', side: 'buy', asset: 'طلای ۱۸ عیار', orderType: 'limit', quantity: 10, unit: 'گرم', price: 32_500_000, filledQty: 0, remaining: 10, status: 'open', createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۰:۳۲' },
  { id: 'o2', userId: 'u2', userName: 'شرکت طلای امید', userType: 'trade', side: 'sell', asset: 'سکه تمام بهار', orderType: 'market', quantity: 5, unit: 'عدد', price: 42_000_000, filledQty: 3, remaining: 2, status: 'partially_filled', createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۹:۱۵' },
  { id: 'o3', userId: 'u3', userName: 'مریم صادقی', userType: 'normal', side: 'buy', asset: 'طلای ۱۸ عیار', orderType: 'limit', quantity: 2, unit: 'گرم', price: 33_100_000, filledQty: 0, remaining: 2, status: 'open', createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۳:۲۰' },
  { id: 'o4', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس', userType: 'trade', side: 'buy', asset: 'طلای ۱۸ عیار', orderType: 'limit', quantity: 100, unit: 'گرم', price: 32_800_000, filledQty: 60, remaining: 40, status: 'partially_filled', createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۸:۰۰' },
  { id: 'o5', userId: 'u5', userName: 'رضا محمدی', userType: 'normal', side: 'sell', asset: 'طلای ۲۴ عیار', orderType: 'market', quantity: 3, unit: 'گرم', price: 38_500_000, filledQty: 0, remaining: 3, status: 'open', createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۱:۴۵' },
  { id: 'o6', userId: 'u6', userName: 'سعید نوروزی', userType: 'normal', side: 'buy', asset: 'سکه تمام بهار', orderType: 'limit', quantity: 2, unit: 'عدد', price: 41_800_000, filledQty: 0, remaining: 2, status: 'cancelled', createdAt: '۱۴۰۳/۱۱/۲۷ - ۱۶:۱۰' },
  { id: 'o7', userId: 'u7', userName: 'شرکت کیمیا طلا', userType: 'trade', side: 'sell', asset: 'سکه تمام بهار', orderType: 'limit', quantity: 20, unit: 'عدد', price: 42_200_000, filledQty: 12, remaining: 8, status: 'partially_filled', createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۹:۳۰' },
  { id: 'o8', userId: 'u8', userName: 'حسین کریمی', userType: 'normal', side: 'buy', asset: 'مس', orderType: 'market', quantity: 50, unit: 'کیلوگرم', price: 8_200_000, filledQty: 0, remaining: 50, status: 'open', createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۲:۰۰' },
  { id: 'o9', userId: 'u9', userName: 'نرگس حسینی', userType: 'normal', side: 'sell', asset: 'طلای ۱۸ عیار', orderType: 'limit', quantity: 1, unit: 'گرم', price: 32_700_000, filledQty: 0, remaining: 1, status: 'open', createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۴:۰۵' },
  { id: 'o10', userId: 'u10', userName: 'مجموعه سرمایه طهران', userType: 'trade', side: 'buy', asset: 'طلای ۱۸ عیار', orderType: 'limit', quantity: 500, unit: 'گرم', price: 33_000_000, filledQty: 0, remaining: 500, status: 'open', createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۷:۴۵' },
  { id: 'o11', userId: 'u11', userName: 'فریده موسوی', userType: 'normal', side: 'buy', asset: 'سکه تمام بهار', orderType: 'market', quantity: 1, unit: 'عدد', price: 42_000_000, filledQty: 0, remaining: 1, status: 'cancelled', createdAt: '۱۴۰۳/۱۱/۲۷ - ۱۸:۳۰' },
  { id: 'o12', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس', userType: 'trade', side: 'sell', asset: 'سکه تمام بهار', orderType: 'limit', quantity: 50, unit: 'عدد', price: 42_500_000, filledQty: 20, remaining: 30, status: 'partially_filled', createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۰:۰۰' },
];

export const ORDER_STATS = {
  totalOpen: ORDERS.filter(o => o.status === 'open').length,
  totalOrderValue: ORDERS.reduce((s, o) => s + o.price * o.quantity, 0),
  avgOrderSize: Math.round(ORDERS.reduce((s, o) => s + o.quantity, 0) / ORDERS.length),
  cancelRate: Math.round((ORDERS.filter(o => o.status === 'cancelled').length / ORDERS.length) * 100),
};
