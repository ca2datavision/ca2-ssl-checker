import { useState, useRef } from 'react';
import { RotateCw, Download, Upload, Trash2 } from 'lucide-react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Website } from '../types';
import { checkSSL } from '../hooks/useWebsites';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';
import { WebsiteStats } from './website/WebsiteStats';
import { WebsiteItem } from './website/WebsiteItem';
import { EmptyState } from './website/EmptyState';
import { DeleteConfirmation } from './website/DeleteConfirmation';

type StatusFilter = Website['status'] | null;

interface WebsiteListProps {
  websites: Website[];
  onUpdate: (id: string, url: string) => void;
  onDelete: (id: string) => void;
  onRecheck: (id: string) => void;
  onRecheckAll: () => Promise<void>;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onDeleteAll: () => void;
  setWebsites: (websites: Website[]) => void;
  onToggleIgnore: (id: string) => void;
}

export function WebsiteList({
  websites,
  onUpdate,
  onDelete,
  onRecheck,
  onRecheckAll,
  onExport,
  onImport,
  onDeleteAll,
  setWebsites,
  onToggleIgnore
}: WebsiteListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recheckingId, setRecheckingId] = useState<string | null>(null);
  const [isRecheckingAll, setIsRecheckingAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, showToast } = useToast();
  const [isRecheckingCurrent, setIsRecheckingCurrent] = useState(false);

  const filteredWebsites = websites
    .filter(w => {
      if (statusFilter === null) return true;
      if (statusFilter === 'ignored') return w.ignored;
      return !w.ignored && w.status === statusFilter;
    })
    .filter(w => !searchQuery || w.url.toLowerCase().includes(searchQuery.toLowerCase()));

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = websites.findIndex((item) => item.id === active.id);
      const newIndex = websites.findIndex((item) => item.id === over.id);
      const newWebsites = [...websites];
      const [movedItem] = newWebsites.splice(oldIndex, 1);
      newWebsites.splice(newIndex, 0, movedItem);
      setWebsites(newWebsites);
    }
  };

  const handleUpdate = (id: string, data: WebsiteFormData) => {
    onUpdate(id, data.url);
    setEditingId(null);
  };

  const handleRecheck = async (id: string) => {
    setRecheckingId(id);
    await onRecheck(id);
    setRecheckingId(null);
  };

  const handleRecheckAll = async () => {
    setIsRecheckingAll(true);
    // Only recheck non-ignored websites
    const activeWebsites = websites.filter(w => !w.ignored);
    const results = await Promise.all(
      activeWebsites.map(async (website) => ({
        id: website.id,
        ...(await checkSSL(website.url))
      }))
    );

    setWebsites(prev =>
      prev.map(website => {
        const result = results.find(r => r.id === website.id);
        return result && !website.ignored
          ? {
              ...website,
              lastChecked: new Date().toISOString(),
              status: result.status,
              expiryDate: result.expiryDate,
              ip: result.ip,
            }
          : website;
      })
    );
    setIsRecheckingAll(false);
  };

  const handleRecheckCurrent = async () => {
    setIsRecheckingCurrent(true);
    const results = await Promise.all(
      filteredWebsites
        .filter(w => !w.ignored)
        .map(async (website) => ({
          id: website.id,
          ...(await checkSSL(website.url))
        }))
    );

    setWebsites(prev =>
      prev.map(website => {
        const result = results.find(r => r.id === website.id);
        return result
          ? {
              ...website,
              lastChecked: new Date().toISOString(),
              status: result.status,
              expiryDate: result.expiryDate,
            }
          : website
      })
    );
    setIsRecheckingCurrent(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  const handleDeleteAll = () => {
    if (deleteConfirmText === 'delete all') {
      onDeleteAll();
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  if (websites.length === 0) {
    return (
      <EmptyState
        onImport={handleImport}
        onExport={onExport}
        fileInputRef={fileInputRef}
      />
    );
  }

  return (
    <div className="space-y-4">
      <WebsiteStats
        websites={websites}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
      
      <div className="relative">
        <div className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search websites..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Clear search</span>
              ×
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            accept=".txt"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
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
          {websites.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRecheckCurrent}
            disabled={isRecheckingCurrent || filteredWebsites.length === 0}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecheckingCurrent ? 'cursor-wait' : ''
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRecheckingCurrent ? 'animate-spin' : ''}`} />
            Recheck Current
          </button>
          <button
            onClick={handleRecheckAll}
            disabled={isRecheckingAll}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecheckingAll ? 'cursor-wait' : ''
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRecheckingAll ? 'animate-spin' : ''}`} />
            Recheck All
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <DeleteConfirmation
          deleteConfirmText={deleteConfirmText}
          setDeleteConfirmText={setDeleteConfirmText}
          onConfirm={handleDeleteAll}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteConfirmText('');
          }}
        />
      )}

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredWebsites.map(w => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {filteredWebsites.map(website => (
              <WebsiteItem
                key={website.id}
                website={website}
                onRecheck={handleRecheck}
                onUpdate={handleUpdate}
                onDelete={onDelete}
                editingId={editingId}
                setEditingId={setEditingId}
                recheckingId={recheckingId}
                showToast={showToast}
                onToggleIgnore={onToggleIgnore}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <ToastContainer toasts={toasts} />
    </div>
  );
}