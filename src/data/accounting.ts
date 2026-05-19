export type JournalEntryType =
  | 'trade'
  | 'deposit'
  | 'withdrawal'
  | 'margin_call'
  | 'margin_release'
  | 'fee'
  | 'credit_alloc'
  | 'credit_repay'
  | 'liquidation'
  | 'adjustment';

export type AccountCode =
  | 'wallet_spot'
  | 'wallet_tomorrow'
  | 'wallet_day_after'
  | 'margin_account'
  | 'credit_account'
  | 'platform_revenue'
  | 'treasury_gold'
  | 'bank_receivable'
  | 'suspense';

export const ACCOUNT_LABELS: Record<AccountCode, string> = {
  wallet_spot: 'کیف پول نقدی',
  wallet_tomorrow: 'کیف پول فردایی',
  wallet_day_after: 'کیف پول پسفردایی',
  margin_account: 'حساب مارجین',
  credit_account: 'حساب اعتبار',
  platform_revenue: 'درآمد پلتفرم',
  treasury_gold: 'خزانه طلا',
  bank_receivable: 'دریافتنی بانک',
  suspense: 'حساب انتظار',
};

export interface JournalEntry {
  id: string;
  date: string;
  type: JournalEntryType;
  debitAccount: AccountCode;
  creditAccount: AccountCode;
  asset: string;
  amount: number;
  referenceId: string;
  createdBy: string;
  lines: { account: AccountCode; type: 'debit' | 'credit'; amount: number; description: string }[];
}

export const JOURNAL_TYPE_LABELS: Record<JournalEntryType, string> = {
  trade: 'معامله',
  deposit: 'واریز',
  withdrawal: 'برداشت',
  margin_call: 'مارجین کال',
  margin_release: 'آزادسازی مارجین',
  fee: 'کارمزد',
  credit_alloc: 'تخصیص اعتبار',
  credit_repay: 'بازپرداخت اعتبار',
  liquidation: 'تسویه اجباری',
  adjustment: 'تعدیل',
};

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-2024-00001', date: '۱۴۰۳/۱۱/۲۸ - ۱۰:۳۲',
    type: 'trade', debitAccount: 'wallet_spot', creditAccount: 'treasury_gold',
    asset: 'طلای ۱۸ عیار', amount: 325_000_000, referenceId: '#TRX-t1', createdBy: 'سیستم',
    lines: [
      { account: 'wallet_spot', type: 'debit', amount: 325_000_000, description: 'بدهکار - کیف پول نقدی علی رضایی' },
      { account: 'treasury_gold', type: 'credit', amount: 323_375_000, description: 'بستانکار - خزانه طلا' },
      { account: 'platform_revenue', type: 'credit', amount: 1_625_000, description: 'بستانکار - درآمد پلتفرم (کارمزد)' },
    ],
  },
  {
    id: 'je-2024-00002', date: '۱۴۰۳/۱۱/۲۸ - ۰۹:۱۵',
    type: 'trade', debitAccount: 'treasury_gold', creditAccount: 'wallet_spot',
    asset: 'سکه تمام بهار', amount: 210_000_000, referenceId: '#TRX-t2', createdBy: 'سیستم',
    lines: [
      { account: 'treasury_gold', type: 'debit', amount: 210_000_000, description: 'بدهکار - خزانه طلا' },
      { account: 'wallet_spot', type: 'credit', amount: 208_950_000, description: 'بستانکار - کیف پول نقدی طلای امید' },
      { account: 'platform_revenue', type: 'credit', amount: 1_050_000, description: 'بستانکار - درآمد پلتفرم (کارمزد)' },
    ],
  },
  {
    id: 'je-2024-00003', date: '۱۴۰۳/۱۱/۲۸ - ۰۸:۰۰',
    type: 'deposit', debitAccount: 'bank_receivable', creditAccount: 'wallet_spot',
    asset: 'ریال', amount: 500_000_000, referenceId: '#DEP-001', createdBy: 'سیستم',
    lines: [
      { account: 'bank_receivable', type: 'debit', amount: 500_000_000, description: 'بدهکار - دریافتنی بانک' },
      { account: 'wallet_spot', type: 'credit', amount: 500_000_000, description: 'بستانکار - کیف پول نقدی مجموعه طهران' },
    ],
  },
  {
    id: 'je-2024-00004', date: '۱۴۰۳/۱۱/۲۸ - ۱۱:۱۰',
    type: 'margin_call', debitAccount: 'wallet_spot', creditAccount: 'margin_account',
    asset: 'ریال', amount: 700_000_000, referenceId: '#MRG-u4', createdBy: 'سیستم',
    lines: [
      { account: 'wallet_spot', type: 'debit', amount: 700_000_000, description: 'بدهکار - کیف پول پارس' },
      { account: 'margin_account', type: 'credit', amount: 700_000_000, description: 'بستانکار - حساب مارجین' },
    ],
  },
  {
    id: 'je-2024-00005', date: '۱۴۰۳/۱۱/۲۷ - ۱۱:۰۰',
    type: 'margin_release', debitAccount: 'margin_account', creditAccount: 'wallet_spot',
    asset: 'ریال', amount: 200_000_000, referenceId: '#MRG-u4-REL', createdBy: 'سیستم',
    lines: [
      { account: 'margin_account', type: 'debit', amount: 200_000_000, description: 'بدهکار - حساب مارجین' },
      { account: 'wallet_spot', type: 'credit', amount: 200_000_000, description: 'بستانکار - کیف پول پارس' },
    ],
  },
  {
    id: 'je-2024-00006', date: '۱۴۰۳/۱۱/۲۷ - ۱۴:۲۰',
    type: 'credit_alloc', debitAccount: 'credit_account', creditAccount: 'wallet_spot',
    asset: 'ریال', amount: 2_000_000_000, referenceId: '#CRD-u4', createdBy: 'امیر حیدری',
    lines: [
      { account: 'credit_account', type: 'debit', amount: 2_000_000_000, description: 'بدهکار - حساب اعتبار' },
      { account: 'wallet_spot', type: 'credit', amount: 2_000_000_000, description: 'بستانکار - کیف پول پارس' },
    ],
  },
  {
    id: 'je-2024-00007', date: '۱۴۰۳/۱۱/۲۶ - ۱۶:۰۰',
    type: 'fee', debitAccount: 'wallet_spot', creditAccount: 'platform_revenue',
    asset: 'ریال', amount: 120_000_000, referenceId: '#FEE-DAILY', createdBy: 'سیستم',
    lines: [
      { account: 'wallet_spot', type: 'debit', amount: 120_000_000, description: 'بدهکار - کیف‌های کاربران' },
      { account: 'platform_revenue', type: 'credit', amount: 120_000_000, description: 'بستانکار - درآمد پلتفرم' },
    ],
  },
  {
    id: 'je-2024-00008', date: '۱۴۰۳/۱۱/۲۶ - ۱۲:۰۰',
    type: 'withdrawal', debitAccount: 'wallet_spot', creditAccount: 'bank_receivable',
    asset: 'ریال', amount: 800_000_000, referenceId: '#WDR-u10', createdBy: 'سیستم',
    lines: [
      { account: 'wallet_spot', type: 'debit', amount: 800_000_000, description: 'بدهکار - کیف پول طهران' },
      { account: 'bank_receivable', type: 'credit', amount: 800_000_000, description: 'بستانکار - دریافتنی بانک' },
    ],
  },
  {
    id: 'je-2024-00009', date: '۱۴۰۳/۱۱/۲۸ - ۱۳:۰۰',
    type: 'trade', debitAccount: 'wallet_tomorrow', creditAccount: 'treasury_gold',
    asset: 'طلای ۱۸ عیار', amount: 3_280_000_000, referenceId: '#TRX-t4', createdBy: 'سیستم',
    lines: [
      { account: 'wallet_tomorrow', type: 'debit', amount: 3_280_000_000, description: 'بدهکار - کیف فردایی پارس' },
      { account: 'treasury_gold', type: 'credit', amount: 3_263_600_000, description: 'بستانکار - خزانه طلا' },
      { account: 'platform_revenue', type: 'credit', amount: 16_400_000, description: 'بستانکار - کارمزد' },
    ],
  },
  {
    id: 'je-2024-00010', date: '۱۴۰۳/۱۱/۲۸ - ۱۵:۳۰',
    type: 'adjustment', debitAccount: 'suspense', creditAccount: 'wallet_spot',
    asset: 'ریال', amount: 50_000_000, referenceId: '#ADJ-001', createdBy: 'امیر حیدری',
    lines: [
      { account: 'suspense', type: 'debit', amount: 50_000_000, description: 'بدهکار - حساب انتظار (مغایرت)' },
      { account: 'wallet_spot', type: 'credit', amount: 50_000_000, description: 'بستانکار - اصلاح موجودی' },
    ],
  },
];

export type CreditStatus = 'active' | 'overdue' | 'suspended' | 'cleared';

export interface CreditAccount {
  userId: string;
  userName: string;
  userType: 'normal' | 'trade';
  limit: number;
  used: number;
  available: number;
  overdueAmount: number;
  interestRate: number;
  dueDate: string;
  status: CreditStatus;
  history: { id: string; date: string; type: 'allocation' | 'repayment' | 'interest' | 'penalty'; amount: number; note: string }[];
}

export const CREDIT_ACCOUNTS: CreditAccount[] = [
  {
    userId: 'u2', userName: 'شرکت طلای امید', userType: 'trade',
    limit: 500_000_000, used: 280_000_000, available: 220_000_000,
    overdueAmount: 0, interestRate: 1.5, dueDate: '۱۴۰۳/۱۲/۲۰', status: 'active',
    history: [
      { id: 'ch1', date: '۱۴۰۳/۰۷/۰۱', type: 'allocation', amount: 500_000_000, note: 'تخصیص اولیه اعتبار' },
      { id: 'ch2', date: '۱۴۰۳/۱۰/۱۵', type: 'repayment', amount: 100_000_000, note: 'بازپرداخت اول' },
      { id: 'ch3', date: '۱۴۰۳/۱۱/۰۱', type: 'interest', amount: 4_200_000, note: 'سود ماهانه' },
    ],
  },
  {
    userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس', userType: 'trade',
    limit: 2_000_000_000, used: 1_800_000_000, available: 200_000_000,
    overdueAmount: 300_000_000, interestRate: 1.8, dueDate: '۱۴۰۳/۱۲/۰۵', status: 'overdue',
    history: [
      { id: 'ch4', date: '۱۴۰۳/۰۱/۱۰', type: 'allocation', amount: 2_000_000_000, note: 'تخصیص اعتبار سالانه' },
      { id: 'ch5', date: '۱۴۰۳/۱۰/۱۰', type: 'interest', amount: 36_000_000, note: 'سود ماهانه' },
      { id: 'ch6', date: '۱۴۰۳/۱۱/۰۵', type: 'penalty', amount: 15_000_000, note: 'جریمه تأخیر' },
    ],
  },
  {
    userId: 'u7', userName: 'شرکت کیمیا طلا', userType: 'trade',
    limit: 300_000_000, used: 120_000_000, available: 180_000_000,
    overdueAmount: 0, interestRate: 1.5, dueDate: '۱۴۰۳/۱۲/۲۸', status: 'active',
    history: [
      { id: 'ch7', date: '۱۴۰۳/۰۳/۱۵', type: 'allocation', amount: 300_000_000, note: 'تخصیص' },
      { id: 'ch8', date: '۱۴۰۳/۱۱/۱۵', type: 'repayment', amount: 50_000_000, note: 'بازپرداخت جزئی' },
    ],
  },
  {
    userId: 'u10', userName: 'مجموعه سرمایه طهران', userType: 'trade',
    limit: 5_000_000_000, used: 4_200_000_000, available: 800_000_000,
    overdueAmount: 800_000_000, interestRate: 2.0, dueDate: '۱۴۰۳/۱۱/۳۰', status: 'overdue',
    history: [
      { id: 'ch9', date: '۱۴۰۲/۰۶/۰۱', type: 'allocation', amount: 5_000_000_000, note: 'اعتبار اولیه' },
      { id: 'ch10', date: '۱۴۰۳/۱۱/۰۱', type: 'interest', amount: 84_000_000, note: 'سود ماهانه' },
      { id: 'ch11', date: '۱۴۰۳/۱۱/۱۰', type: 'penalty', amount: 40_000_000, note: 'جریمه تأخیر' },
    ],
  },
];

export type RevenueType = 'spread' | 'fee' | 'liquidation_fee' | 'credit_interest' | 'deposit_income';

export const REVENUE_TYPE_LABELS: Record<RevenueType, string> = {
  spread: 'اسپرد',
  fee: 'کارمزد',
  liquidation_fee: 'کارمزد تسویه اجباری',
  credit_interest: 'سود اعتبار',
  deposit_income: 'درآمد سپرده',
};

export interface RevenueEntry {
  id: string;
  date: string;
  type: RevenueType;
  asset: string;
  amount: number;
  referenceId: string;
}

export const REVENUE_ENTRIES: RevenueEntry[] = [
  { id: 'rev1', date: '۱۴۰۳/۱۱/۲۸ - ۱۰:۳۲', type: 'fee', asset: 'طلای ۱۸ عیار', amount: 1_625_000, referenceId: '#TRX-t1' },
  { id: 'rev2', date: '۱۴۰۳/۱۱/۲۸ - ۰۹:۱۵', type: 'fee', asset: 'سکه تمام بهار', amount: 1_050_000, referenceId: '#TRX-t2' },
  { id: 'rev3', date: '۱۴۰۳/۱۱/۲۸ - ۱۰:۳۲', type: 'spread', asset: 'طلای ۱۸ عیار', amount: 500_000, referenceId: '#TRX-t1' },
  { id: 'rev4', date: '۱۴۰۳/۱۱/۲۸ - ۰۹:۱۵', type: 'spread', asset: 'سکه تمام بهار', amount: 1_000_000, referenceId: '#TRX-t2' },
  { id: 'rev5', date: '۱۴۰۳/۱۱/۲۸ - ۱۳:۰۰', type: 'fee', asset: 'طلای ۱۸ عیار', amount: 16_400_000, referenceId: '#TRX-t4' },
  { id: 'rev6', date: '۱۴۰۳/۱۱/۲۸ - ۱۳:۰۰', type: 'spread', asset: 'طلای ۱۸ عیار', amount: 8_200_000, referenceId: '#TRX-t4' },
  { id: 'rev7', date: '۱۴۰۳/۱۱/۲۸ - ۱۵:۳۰', type: 'credit_interest', asset: 'ریال', amount: 4_200_000, referenceId: '#CRD-u2' },
  { id: 'rev8', date: '۱۴۰۳/۱۱/۲۸ - ۱۵:۴۵', type: 'credit_interest', asset: 'ریال', amount: 36_000_000, referenceId: '#CRD-u4' },
  { id: 'rev9', date: '۱۴۰۳/۱۱/۲۷ - ۱۰:۰۰', type: 'fee', asset: 'طلای ۱۸ عیار', amount: 815_000, referenceId: '#TRX-t3' },
  { id: 'rev10', date: '۱۴۰۳/۱۱/۲۷ - ۱۱:۳۰', type: 'liquidation_fee', asset: 'طلای ۱۸ عیار', amount: 5_500_000, referenceId: '#LIQ-p3' },
  { id: 'rev11', date: '۱۴۰۳/۱۱/۲۶ - ۱۶:۰۰', type: 'deposit_income', asset: 'شمش طلا', amount: 8_750_000, referenceId: '#DEP-GLD-001' },
  { id: 'rev12', date: '۱۴۰۳/۱۱/۲۵ - ۱۲:۰۰', type: 'fee', asset: 'سکه تمام بهار', amount: 4_220_000, referenceId: '#TRX-t5' },
];

export const REVENUE_STATS = {
  today: REVENUE_ENTRIES.filter(r => r.date.startsWith('۱۴۰۳/۱۱/۲۸')).reduce((s, r) => s + r.amount, 0),
  month: REVENUE_ENTRIES.reduce((s, r) => s + r.amount, 0),
  totalSpread: REVENUE_ENTRIES.filter(r => r.type === 'spread').reduce((s, r) => s + r.amount, 0),
  totalFee: REVENUE_ENTRIES.filter(r => r.type === 'fee').reduce((s, r) => s + r.amount, 0),
  liquidationFee: REVENUE_ENTRIES.filter(r => r.type === 'liquidation_fee').reduce((s, r) => s + r.amount, 0),
};

export type SettlementType = 'withdrawal' | 'delivery' | 'margin_return' | 'fee_payment';
export type SettlementStatus = 'pending' | 'completed' | 'failed';

export const SETTLEMENT_TYPE_LABELS: Record<SettlementType, string> = {
  withdrawal: 'برداشت',
  delivery: 'تحویل فیزیکی',
  margin_return: 'بازگشت مارجین',
  fee_payment: 'پرداخت کارمزد',
};

export interface Settlement {
  id: string;
  userId: string;
  userName: string;
  type: SettlementType;
  amount: number;
  bankRef: string;
  status: SettlementStatus;
  date: string;
  dueDate: string;
  note: string;
}

export const SETTLEMENTS: Settlement[] = [
  { id: 'stl1', userId: 'u1', userName: 'علی رضایی', type: 'withdrawal', amount: 30_000_000, bankRef: 'IR820120000000000000000001', status: 'completed', date: '۱۴۰۳/۱۱/۲۸ - ۱۰:۰۰', dueDate: '۱۴۰۳/۱۱/۲۸', note: 'برداشت عادی' },
  { id: 'stl2', userId: 'u2', userName: 'شرکت طلای امید', type: 'delivery', amount: 210_000_000, bankRef: 'IR820120000000000000000002', status: 'pending', date: '۱۴۰۳/۱۱/۲۸ - ۰۹:۱۵', dueDate: '۱۴۰۳/۱۱/۲۹', note: 'تحویل فیزیکی سکه' },
  { id: 'stl3', userId: 'u10', userName: 'مجموعه سرمایه طهران', type: 'withdrawal', amount: 800_000_000, bankRef: 'IR820120000000000000000003', status: 'failed', date: '۱۴۰۳/۱۱/۲۶ - ۱۲:۰۰', dueDate: '۱۴۰۳/۱۱/۲۶', note: 'عدم موجودی در بانک' },
  { id: 'stl4', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس', type: 'margin_return', amount: 200_000_000, bankRef: 'IR820120000000000000000004', status: 'completed', date: '۱۴۰۳/۱۱/۲۵ - ۱۱:۰۰', dueDate: '۱۴۰۳/۱۱/۲۵', note: 'آزادسازی مارجین تسویه‌شده' },
  { id: 'stl5', userId: 'u5', userName: 'رضا محمدی', type: 'withdrawal', amount: 50_000_000, bankRef: 'IR820120000000000000000005', status: 'pending', date: '۱۴۰۳/۱۱/۲۸ - ۱۴:۰۰', dueDate: '۱۴۰۳/۱۱/۲۹', note: '' },
  { id: 'stl6', userId: 'u7', userName: 'شرکت کیمیا طلا', type: 'fee_payment', amount: 16_400_000, bankRef: 'IR820120000000000000000006', status: 'completed', date: '۱۴۰۳/۱۱/۲۸ - ۱۳:۳۰', dueDate: '۱۴۰۳/۱۱/۲۸', note: 'کارمزد معاملات فردایی' },
  { id: 'stl7', userId: 'u3', userName: 'مریم صادقی', type: 'withdrawal', amount: 20_000_000, bankRef: '', status: 'pending', date: '۱۴۰۳/۱۱/۲۸ - ۱۶:۰۰', dueDate: '۱۴۰۳/۱۱/۲۹', note: 'در انتظار تأیید شعبه' },
  { id: 'stl8', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس', type: 'delivery', amount: 3_280_000_000, bankRef: 'IR820120000000000000000008', status: 'failed', date: '۱۴۰۳/۱۱/۲۸ - ۱۳:۰۰', dueDate: '۱۴۰۳/۱۱/۲۹', note: 'مشکل تأیید بانک' },
];

export const ACCOUNTING_KPI = {
  totalUserWalletBalance: 11_575_000_000,
  totalLockedMargin: 2_285_000_000,
  totalCreditUsed: 6_400_000_000,
  revenueToday: REVENUE_STATS.today,
  activeDiscrepancy: 120_000_000,
};
