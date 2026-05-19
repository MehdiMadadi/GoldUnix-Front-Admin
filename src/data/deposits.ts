export type DepositType = 'lease' | 'growth';
export type DepositStatus = 'active' | 'expired' | 'pending' | 'terminated';

export interface Deposit {
  id: string;
  type: DepositType;
  userName: string;
  userId: string;
  assetType: string;
  quantity: number;
  unit: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  annualRate: number;
  accruedProfit: number;
  status: DepositStatus;
  contractNumber: string;
}

export const DEPOSITS: Deposit[] = [
  { id: 'd1', type: 'lease', userName: 'شرکت کیمیا طلا', userId: 'u7', assetType: 'شمش طلا', quantity: 500, unit: 'گرم', startDate: '۱۴۰۳/۰۱/۰۱', endDate: '۱۴۰۴/۰۱/۰۱', durationMonths: 12, annualRate: 3.5, accruedProfit: 8_750_000, status: 'active', contractNumber: 'GLD-1403-0001' },
  { id: 'd2', type: 'lease', userName: 'گروه سرمایه‌گذاری پارس', userId: 'u4', assetType: 'سکه تمام بهار', quantity: 50, unit: 'عدد', startDate: '۱۴۰۳/۰۳/۱۵', endDate: '۱۴۰۴/۰۳/۱۵', durationMonths: 12, annualRate: 4.0, accruedProfit: 7_000_000_000, status: 'active', contractNumber: 'GLD-1403-0002' },
  { id: 'd3', type: 'growth', userName: 'علی رضایی', userId: 'u1', assetType: 'طلای ۱۸ عیار', quantity: 100, unit: 'گرم', startDate: '۱۴۰۳/۰۶/۰۱', endDate: '۱۴۰۶/۰۶/۰۱', durationMonths: 36, annualRate: 5.0, accruedProfit: 1_625_000, status: 'active', contractNumber: 'GRW-1403-0001' },
  { id: 'd4', type: 'growth', userName: 'مریم صادقی', userId: 'u3', assetType: 'طلای ۱۸ عیار', quantity: 50, unit: 'گرم', startDate: '۱۴۰۳/۰۲/۱۰', endDate: '۱۴۰۵/۰۲/۱۰', durationMonths: 24, annualRate: 4.5, accruedProfit: 975_000, status: 'active', contractNumber: 'GRW-1403-0002' },
  { id: 'd5', type: 'lease', userName: 'مجموعه سرمایه طهران', userId: 'u10', assetType: 'شمش طلا', quantity: 2000, unit: 'گرم', startDate: '۱۴۰۲/۰۷/۰۱', endDate: '۱۴۰۳/۰۷/۰۱', durationMonths: 12, annualRate: 3.2, accruedProfit: 32_000_000, status: 'expired', contractNumber: 'GLD-1402-0005' },
  { id: 'd6', type: 'growth', userName: 'رضا محمدی', userId: 'u5', assetType: 'سکه تمام بهار', quantity: 10, unit: 'عدد', startDate: '۱۴۰۳/۰۸/۰۱', endDate: '۱۴۰۶/۰۸/۰۱', durationMonths: 36, annualRate: 5.2, accruedProfit: 520_000, status: 'active', contractNumber: 'GRW-1403-0003' },
  { id: 'd7', type: 'lease', userName: 'شرکت طلای امید', userId: 'u2', assetType: 'شمش طلا', quantity: 1000, unit: 'گرم', startDate: '۱۴۰۳/۰۹/۱۵', endDate: '۱۴۰۴/۰۹/۱۵', durationMonths: 12, annualRate: 3.8, accruedProfit: 2_375_000, status: 'active', contractNumber: 'GLD-1403-0007' },
  { id: 'd8', type: 'growth', userName: 'نسترن قاسمی', userId: 'u12', assetType: 'طلای ۱۸ عیار', quantity: 30, unit: 'گرم', startDate: '۱۴۰۳/۱۰/۰۵', endDate: '۱۴۰۵/۱۰/۰۵', durationMonths: 24, annualRate: 4.5, accruedProfit: 0, status: 'pending', contractNumber: 'GRW-1403-0004' },
];

export const DEPOSIT_STATS = {
  totalLeaseGrams: 3_500,
  totalGrowthGrams: 180,
  totalAnnualLease: 4_200,
  activeContracts: 7,
};
