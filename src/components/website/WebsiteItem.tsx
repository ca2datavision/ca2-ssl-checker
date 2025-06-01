import { WebsiteForm } from '../WebsiteForm';
import { Website, WebsiteFormData } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, RefreshCw, Share2, Copy, EyeOff, Eye, GripVertical } from 'lucide-react';
import { getStatusColor, getTimeRemaining, getHostname } from './utils';

interface WebsiteItemProps {
  website: Website;
  onRecheck: (id: string) => Promise<void>;
  onUpdate: (id: string, data: WebsiteFormData) => void;
  onDelete: (id: string) => void;
  onToggleIgnore: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  recheckingId: string | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function WebsiteItem({
  website,
  onRecheck,
  onUpdate,
  onDelete,
  onToggleIgnore,
  editingId,
  setEditingId,
  recheckingId,
  showToast
}: WebsiteItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: website.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'SSL Certificate Status',
        text: `SSL certificate for ${website.url} is ${website.status}. Expires: ${website.expiryDate ? new Date(website.expiryDate).toLocaleDateString() : 'N/A'}`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${text} to clipboard`);
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      {editingId === website.id ? (
        <WebsiteForm
          onSubmit={(data) => onUpdate(website.id, data)}
          initialData={{ url: website.url }}
          buttonText="Save"
        />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center flex-1 gap-2 min-w-0">
            <button
              className="p-2 text-gray-400 cursor-grab active:cursor-grabbing touch-none"
              {...attributes}
              {...listeners}>
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 group">
                <h3 className="font-medium text-gray-900 truncate">{website.url}</h3>
                <button
                  onClick={() => copyToClipboard(getHostname(website.url))}
                  className="hidden group-hover:inline-flex p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
                  title="Copy hostname">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {website.ip && (
                <div className="flex items-center gap-2 mt-1 group">
                  <p className="text-sm text-gray-500">IP: {website.ip}</p>
                  <button
                    onClick={() => copyToClipboard(website.ip!)}
                    className="hidden group-hover:inline-flex p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
                    title="Copy IP">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                <span className="whitespace-nowrap">Last checked: {new Date(website.lastChecked!).toLocaleString()}</span>
                <span className={`px-2 py-1 rounded-full ${getStatusColor(website.status)}`}>
                  {website.status}
                </span>
                {website.expiryDate && (
                  <span className="whitespace-nowrap">
                    Expires: {new Date(website.expiryDate).toLocaleDateString()} ({getTimeRemaining(website.expiryDate)})
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            {'share' in navigator && (
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onRecheck(website.id)}
              className={`p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 ${
                recheckingId === website.id ? 'animate-spin' : ''
              }`}
              disabled={recheckingId === website.id}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditingId(website.id)}
              className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleIgnore(website.id)}
              className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
              title={website.ignored ? "Unignore" : "Ignore"}>
              {website.ignored ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(website.id)}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}