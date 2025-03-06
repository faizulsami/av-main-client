export interface MetaData {
  page: number;
  limit: number;
  total: number;
}

export interface StatTypes {
  icon: string;
  value: string;
  label: string;
}

export interface CategoryData {
  id?: string;
  interestedUsers: string;
  respondedUsers: string;
  serviceNeedsTo: string;
}

export interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: MetaData;
  data: CategoryData[];
}
