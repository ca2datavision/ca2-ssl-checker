export interface Website {
  id: string;
  url: string;
  lastChecked?: string;
  expiryDate?: string;
  status?: 'valid' | 'expired' | 'expiration-warning' | 'expiration-hint' | 'error';
}

export interface WebsiteFormData {
  url: string;
}