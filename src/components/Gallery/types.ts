export interface ProgressInfo {
  current: number;
  total: number;
  message: string;
  type: 'delete' | 'upload';
} 