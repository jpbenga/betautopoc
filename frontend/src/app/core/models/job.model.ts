export interface Job {
  id: string;
  type: 'pipeline' | 'analysis' | 'selection' | 'unknown';
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  createdAt: string;
  updatedAt?: string;
  message?: string;
}
