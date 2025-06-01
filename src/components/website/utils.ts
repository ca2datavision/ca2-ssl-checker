import { Website } from '../../types';

export const getStatusColor = (status: Website['status']) => {
  switch (status) {
    case 'valid':
      return 'text-green-600 bg-green-50';
    case 'expires-soon-warning':
      return 'text-yellow-600 bg-yellow-50';
    case 'expires-soon':
      return 'text-orange-600 bg-orange-50';
    case 'expired':
      return 'text-red-600 bg-red-50';
    case 'error':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getTimeRemaining = (expiryDate: string) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
  } else {
    return 'Expired';
  }
};

export const getHostname = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};