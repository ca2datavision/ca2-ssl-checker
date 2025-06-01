interface DeleteConfirmationProps {
  deleteConfirmText: string;
  setDeleteConfirmText: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({
  deleteConfirmText,
  setDeleteConfirmText,
  onConfirm,
  onCancel
}: DeleteConfirmationProps) {
  return (
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
          onClick={onConfirm}
          disabled={deleteConfirmText !== 'delete all'}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}