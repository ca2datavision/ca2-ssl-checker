export interface Website {
  id: string;
  url: string;
  lastChecked?: string;
  expiryDate?: string;
  status?: 'valid' | 'expired' | 'expires-soon' | 'expires-soon-warning' | 'error';
}

export interface WebsiteFormData {
  url: string;
}