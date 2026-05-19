export type GoldDepositPlan = '30d' | '90d' | '180d' | '365d';
export type GoldDepositStatus = 'active' | 'matured' | 'early_unlock' | 'used_as_collateral';

export const PLAN_LABELS: Record<GoldDepositPlan, string> = {
  '30d': '۳۰ روزه',
  '90d': '۹۰ روزه طلایی',
  '180d': '۱۸۰ روزه نقره‌ای',
  '365d': '۳۶۵ روزه الماس',
};

export const PLAN_RATES: Record<GoldDepositPlan, number> = {
  '30d': 2.5,
  '90d': 3.8,
  '180d': 4.5,
  '365d': 5.5,
};

export interface GoldDeposit {
  id: string;
  userId: string;
  userName: string;
  plan: GoldDepositPlan;
  assetType: string;
  quantityGrams: number;
  entryPricePerGram: number;
  currentPricePerGram: number;
  accruedProfitGrams: number;
  startDate: string;
  endDate: string;
  remainingDays: number;
  usableAsCollateral: boolean;
  collateralId?: string;
  status: GoldDepositStatus;
  contractNumber: string;
}

export const GOLD_DEPOSITS: GoldDeposit[] = [
  {
    id: 'gd1', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس',
    plan: '90d', assetType: 'شمش طلا', quantityGrams: 150,
    entryPricePerGram: 3_200_000, currentPricePerGram: 3_480_000,
    accruedProfitGrams: 4.2,
    startDate: '۱۴۰۳/۰۹/۰۱', endDate: '۱۴۰۳/۱۱/۳۰', remainingDays: 32,
    usableAsCollateral: true, status: 'active', contractNumber: 'GLD-DEP-0001',
  },
  {
    id: 'gd2', userId: 'u2', userName: 'شرکت طلای امید',
    plan: '365d', assetType: 'شمش طلا', quantityGrams: 500,
    entryPricePerGram: 3_100_000, currentPricePerGram: 3_480_000,
    accruedProfitGrams: 18.5,
    startDate: '۱۴۰۳/۰۱/۰۱', endDate: '۱۴۰۴/۰۱/۰۱', remainingDays: 95,
    usableAsCollateral: true, collateralId: 'ic2', status: 'used_as_collateral', contractNumber: 'GLD-DEP-0002',
  },
  {
    id: 'gd3', userId: 'u1', userName: 'علی رضایی',
    plan: '180d', assetType: 'طلای ۱۸ عیار', quantityGrams: 100,
    entryPricePerGram: 2_950_000, currentPricePerGram: 3_480_000,
    accruedProfitGrams: 3.0,
    startDate: '۱۴۰۳/۰۶/۰۱', endDate: '۱۴۰۳/۱۲/۰۱', remainingDays: 64,
    usableAsCollateral: true, status: 'active', contractNumber: 'GLD-DEP-0003',
  },
  {
    id: 'gd4', userId: 'u7', userName: 'شرکت کیمیا طلا',
    plan: '365d', assetType: 'سکه تمام بهار', quantityGrams: 750,
    entryPricePerGram: 3_050_000, currentPricePerGram: 3_480_000,
    accruedProfitGrams: 22.8,
    startDate: '۱۴۰۳/۰۲/۱۵', endDate: '۱۴۰۴/۰۲/۱۵', remainingDays: 127,
    usableAsCollateral: false, status: 'active', contractNumber: 'GLD-DEP-0004',
  },
  {
    id: 'gd5', userId: 'u10', userName: 'مجموعه سرمایه طهران',
    plan: '90d', assetType: 'شمش طلا', quantityGrams: 200,
    entryPricePerGram: 3_350_000, currentPricePerGram: 3_480_000,
    accruedProfitGrams: 2.8,
    startDate: '۱۴۰۳/۰۹/۱۵', endDate: '۱۴۰۳/۱۲/۱۵', remainingDays: 16,
    usableAsCollateral: true, status: 'active', contractNumber: 'GLD-DEP-0005',
  },
  {
    id: 'gd6', userId: 'u3', userName: 'مریم صادقی',
    plan: '30d', assetType: 'طلای ۱۸ عیار', quantityGrams: 50,
    entryPricePerGram: 3_420_000, currentPricePerGram: 3_480_000,
    accruedProfitGrams: 0.3,
    startDate: '۱۴۰۳/۱۱/۰۱', endDate: '۱۴۰۳/۱۲/۰۱', remainingDays: 4,
    usableAsCollateral: false, status: 'matured', contractNumber: 'GLD-DEP-0006',
  },
];

export const GOLD_DEPOSIT_STATS = {
  totalGrams: GOLD_DEPOSITS.reduce((s, d) => s + d.quantityGrams, 0),
  todayProfit: GOLD_DEPOSITS.reduce((s, d) => s + (d.accruedProfitGrams * d.currentPricePerGram) / 90, 0),
  activeCount: GOLD_DEPOSITS.filter(d => d.status === 'active').length,
  collateralUsable: GOLD_DEPOSITS.filter(d => d.usableAsCollateral && d.status !== 'used_as_collateral').reduce((s, d) => s + d.quantityGrams, 0),
};

export type InternalCollateralStatus = 'healthy' | 'margin_warning' | 'margin_call' | 'liquidated';

export interface InternalCollateral {
  id: string;
  userId: string;
  userName: string;
  assetType: string;
  quantityGrams: number;
  currentPricePerGram: number;
  currentValue: number;
  creditGranted: number;
  ltv: number;
  marginCallThreshold: number;
  liquidationThreshold: number;
  activationDate: string;
  status: InternalCollateralStatus;
  depositId?: string;
  ltvHistory: { date: string; ltv: number; note: string }[];
}

export const INTERNAL_COLLATERALS: InternalCollateral[] = [
  {
    id: 'ic1', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس',
    assetType: 'شمش طلا', quantityGrams: 120,
    currentPricePerGram: 3_480_000, currentValue: 417_600_000,
    creditGranted: 280_000_000, ltv: 67,
    marginCallThreshold: 75, liquidationThreshold: 85,
    activationDate: '۱۴۰۳/۰۸/۱۰', status: 'healthy',
    ltvHistory: [
      { date: '۱۴۰۳/۰۸/۱۰', ltv: 65, note: 'فعال‌سازی وثیقه' },
      { date: '۱۴۰۳/۱۰/۰۱', ltv: 67, note: 'کاهش ارزش طلا' },
      { date: '۱۴۰۳/۱۱/۱۵', ltv: 66, note: 'بازپرداخت جزئی اعتبار' },
    ],
  },
  {
    id: 'ic2', userId: 'u2', userName: 'شرکت طلای امید',
    assetType: 'شمش طلا', quantityGrams: 200,
    currentPricePerGram: 3_480_000, currentValue: 696_000_000,
    creditGranted: 500_000_000, ltv: 72,
    marginCallThreshold: 75, liquidationThreshold: 85,
    activationDate: '۱۴۰۳/۰۳/۰۱', status: 'margin_warning', depositId: 'gd2',
    ltvHistory: [
      { date: '۱۴۰۳/۰۳/۰۱', ltv: 60, note: 'فعال‌سازی وثیقه' },
      { date: '۱۴۰۳/۰۷/۱۵', ltv: 68, note: 'افزایش استفاده از اعتبار' },
      { date: '۱۴۰۳/۱۱/۰۱', ltv: 72, note: 'هشدار نزدیک شدن به حد' },
    ],
  },
  {
    id: 'ic3', userId: 'u10', userName: 'مجموعه سرمایه طهران',
    assetType: 'سکه تمام بهار', quantityGrams: 300,
    currentPricePerGram: 3_480_000, currentValue: 1_044_000_000,
    creditGranted: 880_000_000, ltv: 84,
    marginCallThreshold: 75, liquidationThreshold: 85,
    activationDate: '۱۴۰۳/۰۵/۱۰', status: 'margin_call',
    ltvHistory: [
      { date: '۱۴۰۳/۰۵/۱۰', ltv: 65, note: 'فعال‌سازی' },
      { date: '۱۴۰۳/۰۸/۲۰', ltv: 78, note: 'مارجین کال اول' },
      { date: '۱۴۰۳/۱۱/۲۵', ltv: 84, note: 'مارجین کال دوم' },
    ],
  },
  {
    id: 'ic4', userId: 'u7', userName: 'شرکت کیمیا طلا',
    assetType: 'طلای ۱۸ عیار', quantityGrams: 80,
    currentPricePerGram: 3_480_000, currentValue: 278_400_000,
    creditGranted: 150_000_000, ltv: 54,
    marginCallThreshold: 75, liquidationThreshold: 85,
    activationDate: '۱۴۰۳/۰۹/۰۱', status: 'healthy',
    ltvHistory: [
      { date: '۱۴۰۳/۰۹/۰۱', ltv: 55, note: 'فعال‌سازی' },
      { date: '۱۴۰۳/۱۰/۰۱', ltv: 54, note: 'افزایش ارزش طلا' },
    ],
  },
];

export const INTERNAL_COLLATERAL_STATS = {
  totalCollateralValue: INTERNAL_COLLATERALS.reduce((s, c) => s + c.currentValue, 0),
  totalCreditIssued: INTERNAL_COLLATERALS.reduce((s, c) => s + c.creditGranted, 0),
  avgLtv: Math.round(INTERNAL_COLLATERALS.reduce((s, c) => s + c.ltv, 0) / INTERNAL_COLLATERALS.length),
  atRiskCount: INTERNAL_COLLATERALS.filter(c => c.status === 'margin_call' || c.status === 'margin_warning').length,
};

export type LoanProvider = 'bank_mellat' | 'bank_pasargad' | 'bank_tejarat' | 'saderat_fund' | 'private_lender';
export type LoanStatus = 'active' | 'overdue' | 'margin_call' | 'closed' | 'default';

export const PROVIDER_LABELS: Record<LoanProvider, string> = {
  bank_mellat: 'بانک ملت',
  bank_pasargad: 'بانک پاسارگاد',
  bank_tejarat: 'بانک تجارت',
  saderat_fund: 'صندوق صادرات',
  private_lender: 'وام‌دهنده خصوصی',
};

export interface LoanInstallment {
  number: number;
  dueDate: string;
  amount: number;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface LoanCollateral {
  id: string;
  userId: string;
  userName: string;
  provider: LoanProvider;
  assetType: string;
  collateralGrams: number;
  currentPricePerGram: number;
  collateralValue: number;
  loanAmount: number;
  interestRate: number;
  durationMonths: number;
  monthlyInstallment: number;
  remainingInstallments: number;
  ltv: number;
  warningThreshold: number;
  startDate: string;
  endDate: string;
  status: LoanStatus;
  collateralHeldBy: string;
  installments: LoanInstallment[];
  collateralValueHistory: { date: string; value: number; ltv: number }[];
}

export const LOAN_COLLATERALS: LoanCollateral[] = [
  {
    id: 'lc1', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس',
    provider: 'bank_mellat', assetType: 'شمش طلا',
    collateralGrams: 200, currentPricePerGram: 3_480_000, collateralValue: 696_000_000,
    loanAmount: 450_000_000, interestRate: 24, durationMonths: 12,
    monthlyInstallment: 42_250_000, remainingInstallments: 8,
    ltv: 65, warningThreshold: 75,
    startDate: '۱۴۰۳/۰۳/۰۱', endDate: '۱۴۰۴/۰۳/۰۱',
    status: 'active', collateralHeldBy: 'بانک ملت - شعبه مرکزی',
    installments: [
      { number: 1, dueDate: '۱۴۰۳/۰۴/۰۱', amount: 42_250_000, paidDate: '۱۴۰۳/۰۴/۰۱', status: 'paid' },
      { number: 2, dueDate: '۱۴۰۳/۰۵/۰۱', amount: 42_250_000, paidDate: '۱۴۰۳/۰۵/۰۲', status: 'paid' },
      { number: 3, dueDate: '۱۴۰۳/۰۶/۰۱', amount: 42_250_000, paidDate: '۱۴۰۳/۰۶/۰۱', status: 'paid' },
      { number: 4, dueDate: '۱۴۰۳/۰۷/۰۱', amount: 42_250_000, paidDate: '۱۴۰۳/۰۷/۰۱', status: 'paid' },
      { number: 5, dueDate: '۱۴۰۳/۱۲/۰۱', amount: 42_250_000, status: 'pending' },
    ],
    collateralValueHistory: [
      { date: '۱۴۰۳/۰۳/۰۱', value: 620_000_000, ltv: 72 },
      { date: '۱۴۰۳/۰۷/۰۱', value: 660_000_000, ltv: 68 },
      { date: '۱۴۰۳/۱۱/۰۱', value: 696_000_000, ltv: 65 },
    ],
  },
  {
    id: 'lc2', userId: 'u10', userName: 'مجموعه سرمایه طهران',
    provider: 'bank_pasargad', assetType: 'سکه تمام بهار',
    collateralGrams: 400, currentPricePerGram: 3_480_000, collateralValue: 1_392_000_000,
    loanAmount: 1_000_000_000, interestRate: 22, durationMonths: 24,
    monthlyInstallment: 50_833_000, remainingInstallments: 16,
    ltv: 72, warningThreshold: 80,
    startDate: '۱۴۰۳/۰۱/۱۵', endDate: '۱۴۰۵/۰۱/۱۵',
    status: 'active', collateralHeldBy: 'بانک پاسارگاد - خزانه مرکزی',
    installments: [
      { number: 1, dueDate: '۱۴۰۳/۰۲/۱۵', amount: 50_833_000, paidDate: '۱۴۰۳/۰۲/۱۵', status: 'paid' },
      { number: 2, dueDate: '۱۴۰۳/۰۳/۱۵', amount: 50_833_000, paidDate: '۱۴۰۳/۰۳/۱۶', status: 'paid' },
      { number: 9, dueDate: '۱۴۰۳/۱۰/۱۵', amount: 50_833_000, paidDate: '۱۴۰۳/۱۰/۱۸', status: 'paid' },
      { number: 10, dueDate: '۱۴۰۳/۱۱/۱۵', amount: 50_833_000, status: 'overdue' },
    ],
    collateralValueHistory: [
      { date: '۱۴۰۳/۰۱/۱۵', value: 1_200_000_000, ltv: 83 },
      { date: '۱۴۰۳/۰۶/۰۱', value: 1_320_000_000, ltv: 76 },
      { date: '۱۴۰۳/۱۱/۰۱', value: 1_392_000_000, ltv: 72 },
    ],
  },
  {
    id: 'lc3', userId: 'u7', userName: 'شرکت کیمیا طلا',
    provider: 'bank_tejarat', assetType: 'شمش طلا',
    collateralGrams: 120, currentPricePerGram: 3_480_000, collateralValue: 417_600_000,
    loanAmount: 350_000_000, interestRate: 20, durationMonths: 6,
    monthlyInstallment: 63_166_000, remainingInstallments: 2,
    ltv: 84, warningThreshold: 80,
    startDate: '۱۴۰۳/۰۶/۰۱', endDate: '۱۴۰۳/۱۲/۰۱',
    status: 'margin_call', collateralHeldBy: 'بانک تجارت - امانات',
    installments: [
      { number: 1, dueDate: '۱۴۰۳/۰۷/۰۱', amount: 63_166_000, paidDate: '۱۴۰۳/۰۷/۰۱', status: 'paid' },
      { number: 2, dueDate: '۱۴۰۳/۰۸/۰۱', amount: 63_166_000, paidDate: '۱۴۰۳/۰۸/۰۲', status: 'paid' },
      { number: 3, dueDate: '۱۴۰۳/۰۹/۰۱', amount: 63_166_000, paidDate: '۱۴۰۳/۰۹/۰۳', status: 'paid' },
      { number: 4, dueDate: '۱۴۰۳/۱۰/۰۱', amount: 63_166_000, paidDate: '۱۴۰۳/۱۰/۰۱', status: 'paid' },
      { number: 5, dueDate: '۱۴۰۳/۱۱/۰۱', amount: 63_166_000, status: 'overdue' },
      { number: 6, dueDate: '۱۴۰۳/۱۲/۰۱', amount: 63_166_000, status: 'pending' },
    ],
    collateralValueHistory: [
      { date: '۱۴۰۳/۰۶/۰۱', value: 366_000_000, ltv: 96 },
      { date: '۱۴۰۳/۰۹/۰۱', value: 400_000_000, ltv: 87 },
      { date: '۱۴۰۳/۱۱/۰۱', value: 417_600_000, ltv: 84 },
    ],
  },
  {
    id: 'lc4', userId: 'u2', userName: 'شرکت طلای امید',
    provider: 'saderat_fund', assetType: 'طلای ۱۸ عیار',
    collateralGrams: 250, currentPricePerGram: 3_480_000, collateralValue: 870_000_000,
    loanAmount: 500_000_000, interestRate: 18, durationMonths: 18,
    monthlyInstallment: 32_777_000, remainingInstallments: 12,
    ltv: 57, warningThreshold: 75,
    startDate: '۱۴۰۳/۰۵/۰۱', endDate: '۱۴۰۴/۱۱/۰۱',
    status: 'active', collateralHeldBy: 'صندوق صادرات - خزانه',
    installments: [
      { number: 1, dueDate: '۱۴۰۳/۰۶/۰۱', amount: 32_777_000, paidDate: '۱۴۰۳/۰۶/۰۱', status: 'paid' },
      { number: 7, dueDate: '۱۴۰۳/۱۲/۰۱', amount: 32_777_000, status: 'pending' },
    ],
    collateralValueHistory: [
      { date: '۱۴۰۳/۰۵/۰۱', value: 775_000_000, ltv: 64 },
      { date: '۱۴۰۳/۱۱/۰۱', value: 870_000_000, ltv: 57 },
    ],
  },
];

export const LOAN_COLLATERAL_STATS = {
  totalCollateralValue: LOAN_COLLATERALS.reduce((s, l) => s + l.collateralValue, 0),
  totalActiveLoan: LOAN_COLLATERALS.reduce((s, l) => s + l.loanAmount, 0),
  avgLtv: Math.round(LOAN_COLLATERALS.reduce((s, l) => s + l.ltv, 0) / LOAN_COLLATERALS.length),
  atRiskCount: LOAN_COLLATERALS.filter(l => l.status === 'margin_call' || l.status === 'overdue').length,
};
