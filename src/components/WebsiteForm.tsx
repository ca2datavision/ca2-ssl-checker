import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { WebsiteFormData } from '../types';
import { normalizeUrl } from '../hooks/useWebsites';

interface WebsiteFormProps {
  onSubmit: (data: WebsiteFormData) => void;
  initialData?: WebsiteFormData;
  buttonText?: string;
}

export function WebsiteForm({ onSubmit, initialData, buttonText = 'Add Website' }: WebsiteFormProps) {
  const [url, setUrl] = useState(initialData?.url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    onSubmit({ url: normalizeUrl(trimmedUrl) });
    if (!initialData) setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="example.com or https://example.com"
        required
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {buttonText}
      </button>
    </form>
  );
}