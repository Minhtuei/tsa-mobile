export type OrderQueryDto = {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isPaid?: boolean;
  startDate?: string;
  endDate?: string;
};
