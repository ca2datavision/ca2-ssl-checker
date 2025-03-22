import React, { useState } from 'react';
import { Pencil, Trash2, RefreshCw, Globe, RotateCw, Download, Upload, GripVertical, Share2 } from 'lucide-react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Website, WebsiteFormData } from '../types';
import { WebsiteForm } from './WebsiteForm';

interface SortableWebsiteItemProps {
  website: Website;
  onRecheck: (id: string) => Promise<void>;
  onUpdate: (id: string, data: WebsiteFormData) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  recheckingId: string | null;
  getStatusColor: (status: Website['status']) => string;
}

function SortableWebsiteItem({
  website,
  onRecheck,
  onUpdate,
  onDelete,
  editingId,
  setEditingId,
  recheckingId,
  getStatusColor
}: SortableWebsiteItemProps) {
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
              {...listeners}
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 truncate">{website.url}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                <span className="whitespace-nowrap">Last checked: {new Date(website.lastChecked!).toLocaleString()}</span>
                <span className={`px-2 py-1 rounded-full ${getStatusColor(website.status)}`}>
                  {website.status}
                </span>
                {website.expiryDate && (
                  <span className="whitespace-nowrap">Expires: {new Date(website.expiryDate).toLocaleDateString()}</span>
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
  setWebsites
}: WebsiteListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recheckingId, setRecheckingId] = useState<string | null>(null);
  const [isRecheckingAll, setIsRecheckingAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    await onRecheckAll();
    setIsRecheckingAll(false);
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

  const getStatusColor = (status: Website['status']) => {
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

  if (websites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 justify-end">
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
        </div>
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-gray-600">No websites added yet.</p>
          <p className="text-sm text-gray-500 mt-2">Add one above or import from a file to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
      
      {showDeleteConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-medium mb-2">Confirm Deletion</h3>
          <p className="text-red-600 text-sm mb-3">
            Type 'delete all' to confirm deletion of all websites. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type 'delete all'"
              className="flex-1 px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={handleDeleteAll}
              disabled={deleteConfirmText !== 'delete all'}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={websites.map(w => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {websites.map(website => (
              <SortableWebsiteItem
                key={website.id}
                website={website}
                onRecheck={handleRecheck}
                onUpdate={handleUpdate}
                onDelete={onDelete}
                editingId={editingId}
                setEditingId={setEditingId}
                recheckingId={recheckingId}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}