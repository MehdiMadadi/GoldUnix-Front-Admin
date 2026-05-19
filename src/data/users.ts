export type UserType = 'normal' | 'trade';
export type RiskLevel = 'low' | 'medium' | 'high';
export type UserStatus = 'active' | 'blocked' | 'pending';
export type WalletTxType = 'deposit' | 'withdraw' | 'block' | 'release';

export interface WalletTransaction {
  id: string;
  type: WalletTxType;
  amount: number;
  balanceAfter: number;
  date: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  type: UserType;
  balance: number;
  blockedBalance: number;
  creditLimit: number;
  openObligation: number;
  riskLevel: RiskLevel;
  status: UserStatus;
  nationalId: string;
  email: string;
  joinDate: string;
  lastActivity: string;
  marginRatio: number;
  goldCash: number;
  goldTomorrowDayAfter: number;
  goldCommitment: number;
  walletTransactions: WalletTransaction[];
}

export const USERS: User[] = [
  {
    id: 'u1', name: 'علی رضایی', mobile: '09121234567', type: 'normal',
    balance: 250_000_000, blockedBalance: 18_000_000, creditLimit: 0,
    openObligation: 80_000_000, riskLevel: 'medium', status: 'active',
    nationalId: '0012345678', email: 'ali@example.com',
    joinDate: '۱۴۰۲/۰۳/۱۵', lastActivity: '۱۴۰۳/۱۱/۲۸', marginRatio: 68,
    goldCash: 10, goldTomorrowDayAfter: 0, goldCommitment: 100,
    walletTransactions: [
      { id: 'wt1', type: 'deposit', amount: 100_000_000, balanceAfter: 250_000_000, date: '۱۴۰۳/۱۱/۲۵', description: 'واریز از درگاه بانکی' },
      { id: 'wt2', type: 'block', amount: 18_000_000, balanceAfter: 232_000_000, date: '۱۴۰۳/۱۱/۲۸', description: 'بلوک بابت سفارش باز' },
      { id: 'wt3', type: 'deposit', amount: 50_000_000, balanceAfter: 150_000_000, date: '۱۴۰۳/۱۱/۱۰', description: 'واریز از درگاه بانکی' },
      { id: 'wt4', type: 'withdraw', amount: 30_000_000, balanceAfter: 100_000_000, date: '۱۴۰۳/۱۱/۰۵', description: 'برداشت به حساب بانکی' },
    ],
  },
  {
    id: 'u2', name: 'شرکت طلای امید', mobile: '02188888888', type: 'trade',
    balance: 1_200_000_000, blockedBalance: 240_000_000, creditLimit: 500_000_000,
    openObligation: 600_000_000, riskLevel: 'high', status: 'active',
    nationalId: '10102345678', email: 'info@omidgold.com',
    joinDate: '۱۴۰۱/۰۷/۰۱', lastActivity: '۱۴۰۳/۱۱/۲۸', marginRatio: 50,
    goldCash: 0, goldTomorrowDayAfter: 0, goldCommitment: 300,
    walletTransactions: [
      { id: 'wt5', type: 'deposit', amount: 500_000_000, balanceAfter: 1_200_000_000, date: '۱۴۰۳/۱۱/۲۰', description: 'واریز اعتباری صنفی' },
      { id: 'wt6', type: 'block', amount: 240_000_000, balanceAfter: 960_000_000, date: '۱۴۰۳/۱۱/۲۸', description: 'بلوک بابت تعهدات باز' },
      { id: 'wt7', type: 'withdraw', amount: 100_000_000, balanceAfter: 700_000_000, date: '۱۴۰۳/۱۱/۱۵', description: 'برداشت' },
    ],
  },
  {
    id: 'u3', name: 'مریم صادقی', mobile: '09351112233', type: 'normal',
    balance: 85_000_000, blockedBalance: 0, creditLimit: 0,
    openObligation: 0, riskLevel: 'low', status: 'active',
    nationalId: '0087654321', email: 'maryam@example.com',
    joinDate: '۱۴۰۲/۰۸/۲۰', lastActivity: '۱۴۰۳/۱۱/۲۵', marginRatio: 100,
    goldCash: 0, goldTomorrowDayAfter: 2, goldCommitment: 50,
    walletTransactions: [
      { id: 'wt8', type: 'deposit', amount: 85_000_000, balanceAfter: 85_000_000, date: '۱۴۰۳/۱۱/۲۰', description: 'واریز اولیه' },
    ],
  },
  {
    id: 'u4', name: 'گروه سرمایه‌گذاری پارس', mobile: '02177777777', type: 'trade',
    balance: 3_500_000_000, blockedBalance: 700_000_000, creditLimit: 2_000_000_000,
    openObligation: 1_200_000_000, riskLevel: 'high', status: 'active',
    nationalId: '10103456789', email: 'info@pars.com',
    joinDate: '۱۴۰۰/۱۱/۰۵', lastActivity: '۱۴۰۳/۱۱/۲۸', marginRatio: 34,
    goldCash: 0, goldTomorrowDayAfter: 100, goldCommitment: 100,
    walletTransactions: [
      { id: 'wt9', type: 'deposit', amount: 2_000_000_000, balanceAfter: 3_500_000_000, date: '۱۴۰۳/۱۱/۱۵', description: 'واریز صنفی' },
      { id: 'wt10', type: 'block', amount: 700_000_000, balanceAfter: 2_800_000_000, date: '۱۴۰۳/۱۱/۲۸', description: 'بلوک بابت مارجین' },
      { id: 'wt11', type: 'release', amount: 200_000_000, balanceAfter: 3_500_000_000, date: '۱۴۰۳/۱۱/۲۵', description: 'آزادسازی مارجین تسویه‌شده' },
    ],
  },
  {
    id: 'u5', name: 'رضا محمدی', mobile: '09209876543', type: 'normal',
    balance: 420_000_000, blockedBalance: 50_000_000, creditLimit: 0,
    openObligation: 120_000_000, riskLevel: 'medium', status: 'active',
    nationalId: '0023456789', email: 'reza@example.com',
    joinDate: '۱۴۰۲/۰۱/۱۰', lastActivity: '۱۴۰۳/۱۱/۲۷', marginRatio: 71,
    goldCash: 5, goldTomorrowDayAfter: 0, goldCommitment: 0,
    walletTransactions: [
      { id: 'wt12', type: 'deposit', amount: 200_000_000, balanceAfter: 420_000_000, date: '۱۴۰۳/۱۱/۲۲', description: 'واریز بانکی' },
      { id: 'wt13', type: 'block', amount: 50_000_000, balanceAfter: 370_000_000, date: '۱۴۰۳/۱۱/۲۸', description: 'بلوک سفارش جاری' },
    ],
  },
  {
    id: 'u6', name: 'فرناز احمدی', mobile: '09151234567', type: 'normal',
    balance: 60_000_000, blockedBalance: 0, creditLimit: 0,
    openObligation: 0, riskLevel: 'low', status: 'blocked',
    nationalId: '0034567890', email: 'farnaz@example.com',
    joinDate: '۱۴۰۲/۰۶/۰۸', lastActivity: '۱۴۰۳/۱۰/۱۵', marginRatio: 100,
    goldCash: 0, goldTomorrowDayAfter: 0, goldCommitment: 0,
    walletTransactions: [
      { id: 'wt14', type: 'deposit', amount: 60_000_000, balanceAfter: 60_000_000, date: '۱۴۰۳/۱۰/۱۰', description: 'واریز بانکی' },
    ],
  },
  {
    id: 'u7', name: 'شرکت کیمیا طلا', mobile: '02166666666', type: 'trade',
    balance: 800_000_000, blockedBalance: 120_000_000, creditLimit: 300_000_000,
    openObligation: 350_000_000, riskLevel: 'medium', status: 'active',
    nationalId: '10104567890', email: 'info@kimia.com',
    joinDate: '۱۴۰۱/۰۳/۱۸', lastActivity: '۱۴۰۳/۱۱/۲۸', marginRatio: 56,
    goldCash: 0, goldTomorrowDayAfter: 20, goldCommitment: 500,
    walletTransactions: [
      { id: 'wt15', type: 'deposit', amount: 400_000_000, balanceAfter: 800_000_000, date: '۱۴۰۳/۱۱/۱۸', description: 'واریز صنفی' },
      { id: 'wt16', type: 'block', amount: 120_000_000, balanceAfter: 680_000_000, date: '۱۴۰۳/۱۱/۲۸', description: 'بلوک مارجین' },
    ],
  },
  {
    id: 'u8', name: 'حسین کریمی', mobile: '09303334444', type: 'normal',
    balance: 155_000_000, blockedBalance: 15_000_000, creditLimit: 0,
    openObligation: 45_000_000, riskLevel: 'low', status: 'active',
    nationalId: '0045678901', email: 'hossein@example.com',
    joinDate: '۱۴۰۲/۰۹/۱۲', lastActivity: '۱۴۰۳/۱۱/۲۶', marginRatio: 71,
    goldCash: 0, goldTomorrowDayAfter: 3, goldCommitment: 0,
    walletTransactions: [
      { id: 'wt17', type: 'deposit', amount: 100_000_000, balanceAfter: 155_000_000, date: '۱۴۰۳/۱۱/۲۰', description: 'واریز' },
      { id: 'wt18', type: 'block', amount: 15_000_000, balanceAfter: 140_000_000, date: '۱۴۰۳/۱۱/۲۸', description: 'بلوک سفارش' },
    ],
  },
  {
    id: 'u9', name: 'زهرا نظری', mobile: '09121111111', type: 'normal',
    balance: 30_000_000, blockedBalance: 25_000_000, creditLimit: 0,
    openObligation: 25_000_000, riskLevel: 'high', status: 'active',
    nationalId: '0056789012', email: 'zahra@example.com',
    joinDate: '۱۴۰۳/۰۱/۰۲', lastActivity: '۱۴۰۳/۱۱/۲۸', marginRatio: 17,
    goldCash: 0, goldTomorrowDayAfter: 0, goldCommitment: 0,
    walletTransactions: [
      { id: 'wt19', type: 'deposit', amount: 30_000_000, balanceAfter: 30_000_000, date: '۱۴۰۳/۱۱/۰۱', description: 'واریز اولیه' },
      { id: 'wt20', type: 'block', amount: 25_000_000, balanceAfter: 5_000_000, date: '۱۴۰۳/۱۱/۲۸', description: 'بلوک تعهد' },
    ],
  },
  {
    id: 'u10', name: 'مجموعه سرمایه طهران', mobile: '02155555555', type: 'trade',
    balance: 5_200_000_000, blockedBalance: 1_200_000_000, creditLimit: 5_000_000_000,
    openObligation: 2_800_000_000, riskLevel: 'high', status: 'active',
    nationalId: '10105678901', email: 'info@tehran-cap.com',
    joinDate: '۱۴۰۰/۰۵/۲۰', lastActivity: '۱۴۰۳/۱۱/۲۸', marginRatio: 46,
    goldCash: 0, goldTomorrowDayAfter: 500, goldCommitment: 1000,
    walletTransactions: [
      { id: 'wt21', type: 'deposit', amount: 3_000_000_000, balanceAfter: 5_200_000_000, date: '۱۴۰۳/۱۱/۱۰', description: 'واریز صنفی بزرگ' },
      { id: 'wt22', type: 'block', amount: 1_200_000_000, balanceAfter: 4_000_000_000, date: '۱۴۰۳/۱۱/۲۸', description: 'بلوک تعهدات' },
      { id: 'wt23', type: 'release', amount: 500_000_000, balanceAfter: 5_200_000_000, date: '۱۴۰۳/۱۱/۲۶', description: 'آزادسازی پس از تسویه' },
      { id: 'wt24', type: 'withdraw', amount: 800_000_000, balanceAfter: 4_700_000_000, date: '۱۴۰۳/۱۱/۰۵', description: 'برداشت' },
    ],
  },
  {
    id: 'u11', name: 'امیر اکبری', mobile: '09361234567', type: 'normal',
    balance: 310_000_000, blockedBalance: 0, creditLimit: 0,
    openObligation: 0, riskLevel: 'low', status: 'active',
    nationalId: '0067890123', email: 'amir@example.com',
    joinDate: '۱۴۰۲/۰۴/۲۵', lastActivity: '۱۴۰۳/۱۱/۲۴', marginRatio: 100,
    goldCash: 0, goldTomorrowDayAfter: 0, goldCommitment: 0,
    walletTransactions: [
      { id: 'wt25', type: 'deposit', amount: 310_000_000, balanceAfter: 310_000_000, date: '۱۴۰۳/۱۱/۲۲', description: 'واریز بانکی' },
    ],
  },
  {
    id: 'u12', name: 'نسترن قاسمی', mobile: '09189876543', type: 'normal',
    balance: 120_000_000, blockedBalance: 10_000_000, creditLimit: 0,
    openObligation: 40_000_000, riskLevel: 'medium', status: 'pending',
    nationalId: '0078901234', email: 'nastaran@example.com',
    joinDate: '۱۴۰۳/۱۰/۰۵', lastActivity: '۱۴۰۳/۱۱/۲۰', marginRatio: 67,
    goldCash: 0, goldTomorrowDayAfter: 0, goldCommitment: 30,
    walletTransactions: [
      { id: 'wt26', type: 'deposit', amount: 120_000_000, balanceAfter: 120_000_000, date: '۱۴۰۳/۱۰/۰۵', description: 'واریز ثبت‌نام' },
      { id: 'wt27', type: 'block', amount: 10_000_000, balanceAfter: 110_000_000, date: '۱۴۰۳/۱۱/۲۰', description: 'بلوک رزرو قرارداد' },
    ],
  },
];

export const USER_STATS = {
  total: 12_450,
  activeToday: 1_245,
  tradeType: 320,
  openObligation: 180,
  marginAlert: 15,
};
