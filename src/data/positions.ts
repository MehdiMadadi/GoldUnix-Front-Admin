export type PositionSide = 'buy' | 'sell';
export type RiskLevel = 'green' | 'yellow' | 'red';
export type UserType = 'normal' | 'trade';

export interface Position {
  id: string;
  userId: string;
  userName: string;
  userType: UserType;
  asset: string;
  side: PositionSide;
  quantityOpen: number;
  unit: string;
  avgEntryPrice: number;
  currentMarketPrice: number;
  unrealizedPnl: number;
  marginPosted: number;
  marginRatio: number;
  liquidationPrice: number;
  riskLevel: RiskLevel;
  expiryDate: string;
}

export const POSITIONS: Position[] = [
  {
    id: 'p1', userId: 'u10', userName: 'مجموعه سرمایه طهران', userType: 'trade',
    asset: 'طلای ۱۸ عیار', side: 'buy', quantityOpen: 1000, unit: 'گرم',
    avgEntryPrice: 33_500_000, currentMarketPrice: 34_200_000,
    unrealizedPnl: 700_000_000, marginPosted: 5_000_000_000, marginRatio: 149,
    liquidationPrice: 30_200_000, riskLevel: 'green', expiryDate: '۱۴۰۳/۱۲/۲۸',
  },
  {
    id: 'p2', userId: 'u2', userName: 'شرکت طلای امید', userType: 'trade',
    asset: 'طلای ۱۸ عیار', side: 'sell', quantityOpen: 300, unit: 'گرم',
    avgEntryPrice: 33_200_000, currentMarketPrice: 34_200_000,
    unrealizedPnl: -300_000_000, marginPosted: 1_200_000_000, marginRatio: 112,
    liquidationPrice: 36_500_000, riskLevel: 'yellow', expiryDate: '۱۴۰۴/۰۱/۱۵',
  },
  {
    id: 'p3', userId: 'u4', userName: 'گروه سرمایه‌گذاری پارس', userType: 'trade',
    asset: 'سکه تمام بهار', side: 'buy', quantityOpen: 100, unit: 'عدد',
    avgEntryPrice: 43_000_000, currentMarketPrice: 42_100_000,
    unrealizedPnl: -90_000_000, marginPosted: 600_000_000, marginRatio: 142,
    liquidationPrice: 38_700_000, riskLevel: 'green', expiryDate: '۱۴۰۴/۰۲/۲۰',
  },
  {
    id: 'p4', userId: 'u7', userName: 'شرکت کیمیا طلا', userType: 'trade',
    asset: 'طلای ۱۸ عیار', side: 'buy', quantityOpen: 200, unit: 'گرم',
    avgEntryPrice: 32_900_000, currentMarketPrice: 34_200_000,
    unrealizedPnl: 260_000_000, marginPosted: 800_000_000, marginRatio: 121,
    liquidationPrice: 29_400_000, riskLevel: 'green', expiryDate: '۱۴۰۴/۰۱/۳۰',
  },
  {
    id: 'p5', userId: 'u8', userName: 'حسین کریمی', userType: 'normal',
    asset: 'طلای ۲۴ عیار', side: 'sell', quantityOpen: 15, unit: 'گرم',
    avgEntryPrice: 39_000_000, currentMarketPrice: 40_500_000,
    unrealizedPnl: -22_500_000, marginPosted: 70_000_000, marginRatio: 105,
    liquidationPrice: 44_100_000, riskLevel: 'red', expiryDate: '۱۴۰۳/۱۲/۱۰',
  },
  {
    id: 'p6', userId: 'u6', userName: 'سعید نوروزی', userType: 'normal',
    asset: 'سکه تمام بهار', side: 'buy', quantityOpen: 10, unit: 'عدد',
    avgEntryPrice: 41_500_000, currentMarketPrice: 42_100_000,
    unrealizedPnl: 6_000_000, marginPosted: 50_000_000, marginRatio: 108,
    liquidationPrice: 37_200_000, riskLevel: 'red', expiryDate: '۱۴۰۳/۱۲/۰۵',
  },
  {
    id: 'p7', userId: 'u3', userName: 'مریم صادقی', userType: 'normal',
    asset: 'طلای ۱۸ عیار', side: 'buy', quantityOpen: 5, unit: 'گرم',
    avgEntryPrice: 33_100_000, currentMarketPrice: 34_200_000,
    unrealizedPnl: 5_500_000, marginPosted: 20_000_000, marginRatio: 118,
    liquidationPrice: 28_900_000, riskLevel: 'yellow', expiryDate: '۱۴۰۴/۰۱/۰۱',
  },
];

export const POSITION_STATS = {
  totalOpenCommitment: POSITIONS.reduce((s, p) => s + p.quantityOpen * p.avgEntryPrice, 0),
  totalUnrealizedPnl: POSITIONS.reduce((s, p) => s + p.unrealizedPnl, 0),
  marginCoveragePct: Math.round(
    (POSITIONS.reduce((s, p) => s + p.marginPosted, 0) /
      POSITIONS.reduce((s, p) => s + p.quantityOpen * p.currentMarketPrice, 0)) * 100
  ),
  positionsAtRisk: POSITIONS.filter(p => p.riskLevel === 'red' || p.riskLevel === 'yellow').length,
  largestExposureUser: POSITIONS.reduce((max, p) =>
    p.quantityOpen * p.currentMarketPrice > max.value
      ? { name: p.userName, value: p.quantityOpen * p.currentMarketPrice }
      : max,
    { name: '', value: 0 }
  ).name,
};
