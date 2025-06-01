import { Globe, Upload, Download } from 'lucide-react';

interface EmptyStateProps {
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function EmptyState({ onImport, onExport, fileInputRef }: EmptyStateProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-end">
        <input
          type="file"
          accept=".txt"
          className="hidden"
          ref={fileInputRef}
          onChange={onImport}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-gray-600">No websites added yet.</p>
        <p className="text-sm text-gray-500 mt-2">Add one above or import from a file to get started!</p>
      </div>
    </div>
  );
}