import { Website } from '../../types';
import { getStatusColor } from './utils';

type StatusFilter = Website['status'] | null;

interface WebsiteStatsProps {
  websites: Website[];
  activeFilter: StatusFilter;
  onFilterChange: (status: StatusFilter) => void;
}

const statusLabels: Record<Website['status'] | 'ignored', string> = {
  'valid': 'valid',
  'expired': 'expired',
  'expires-soon': 'expiring soon',
  'expires-soon-warning': 'expiring this month',
  'error': 'with errors',
  'ignored': 'ignored'
};

export function WebsiteStats({ websites, activeFilter, onFilterChange }: WebsiteStatsProps) {
  const stats = websites.reduce((acc, website) => {
    if (website.ignored) {
      acc.ignored = (acc.ignored || 0) + 1;
    } else {
      acc[website.status || 'error'] = (acc[website.status || 'error'] || 0) + 1;
    }
    return acc;
  }, {} as Record<Website['status'] | 'ignored', number>);

  const handleFilterClick = (status: Website['status'] | 'ignored') => {
    onFilterChange(activeFilter === status ? null : status as Website['status']);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3 text-sm">
        {Object.entries(stats).map(([status, count]) => count > 0 && (
          <button
            key={status}
            onClick={() => handleFilterClick(status as Website['status'] | 'ignored')}
            className={`px-2 py-1 rounded-full transition-colors ${
              status === 'ignored' ? 'text-gray-600 bg-gray-100' : getStatusColor(status as Website['status'])
            } ${
              activeFilter === status ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            } hover:ring-2 hover:ring-blue-500 hover:ring-offset-2`}
          >
            {count} {status === 'ignored' ? 'ignored' : statusLabels[status as Website['status']]}
          </button>
        ))}
      </div>
      {activeFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Showing only {activeFilter === 'ignored' ? 'ignored' : statusLabels[activeFilter]} websites
          </span>
          <button
            onClick={() => onFilterChange(null)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}