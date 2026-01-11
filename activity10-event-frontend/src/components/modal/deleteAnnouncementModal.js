import React, { useEffect, useState } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

const DeleteAnnouncementModal = ({ isOpen, onClose, onConfirm, announcementTitle }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setError(null);
      setIsDeleting(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Failed to delete announcement. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md transform overflow-hidden rounded-2xl shadow-2xl transition-all animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Content Section */}
        <div className="p-8 text-center">
          {/* Warning Icon */}
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
            }}
          >
            <Trash2 size={24} style={{ color: "#ef4444" }} />
          </div>

          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Delete Announcement
          </h2>

          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Are you sure you want to delete{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              "{announcementTitle}"
            </span>
            ? This action cannot be undone.
          </p>

          {/* Error Message */}
          {error && (
            <div
              className="mt-4 p-3 rounded-lg flex items-center gap-2 text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 px-8 pb-8">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            style={{
              backgroundColor: "#ef4444",
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAnnouncementModal;
