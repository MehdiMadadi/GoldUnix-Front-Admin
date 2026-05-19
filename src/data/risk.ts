export type AlertLevel = 'critical' | 'warning' | 'info';

export interface MarginAlert {
  id: string;
  userId: string;
  userName: string;
  userType: 'normal' | 'trade';
  currentMargin: number;
  requiredMargin: number;
  marginRatio: number;
  alertLevel: AlertLevel;
  obligation: number;
  createdAt: string;
}

export const MARGIN_ALERTS: MarginAlert[] = [
  { id: 'ma1', userId: 'u9', userName: 'زهرا نظری', userType: 'normal', currentMargin: 5_000_000, requiredMargin: 25_000_000, marginRatio: 20, alertLevel: 'critical', obligation: 25_000_000, createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۱:۳۰' },
  { id: 'ma2', userId: 'u10', userName: 'مجموعه سرمایه طهران', userType: 'trade', currentMargin: 1_200_000_000, requiredMargin: 2_800_000_000, marginRatio: 43, alertLevel: 'critical', obligation: 2_800_000_000, createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۹:۰۰' },
  { id: 'ma3', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس', userType: 'trade', currentMargin: 1_400_000_000, requiredMargin: 2_800_000_000, marginRatio: 50, alertLevel: 'warning', obligation: 1_200_000_000, createdAt: '۱۴۰۳/۱۱/۲۸ - ۱۰:۱۵' },
  { id: 'ma4', userId: 'u2', userName: 'شرکت طلای امید', userType: 'trade', currentMargin: 600_000_000, requiredMargin: 1_200_000_000, marginRatio: 50, alertLevel: 'warning', obligation: 600_000_000, createdAt: '۱۴۰۳/۱۱/۲۸ - ۰۸:۴۵' },
];

export const RISK_DISTRIBUTION = {
  low: 45,
  medium: 35,
  high: 20,
};

export const OBLIGATION_BREAKDOWN = {
  cash: 35,
  tomorrow: 30,
  overdue: 20,
  other: 15,
  coveragePercent: 85,
};
