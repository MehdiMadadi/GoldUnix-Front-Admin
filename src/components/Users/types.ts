export interface UserFilters {
  search: string;
  userType: string;
  status: string;
  riskLevel: string;
  obligation: string;
}

export const DEFAULT_FILTERS: UserFilters = {
  search: '',
  userType: 'all',
  status: 'all',
  riskLevel: 'all',
  obligation: 'all',
};
