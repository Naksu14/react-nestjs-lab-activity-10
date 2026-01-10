import React from 'react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Yes', cancelText = 'No' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-color)] w-full max-w-md p-6 relative">
        <h2 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">{title}</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)] transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
