import React, { useEffect } from "react";
import { Trash2 } from "lucide-react";

const DeleteEventModal = ({ isOpen, onClose, onConfirm, eventTitle }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
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
              backgroundColor: "var(--bg-secondary)",
              color: "var(--accent-color)",
            }}
          >
            <Trash2 size={24} style={{ color: "#ef4444" }}/>
          </div>

          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Delete Event
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
              "{eventTitle}"
            </span>
            ? This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 px-8 pb-8">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95"
            style={{ backgroundColor: "#ef4444", color: "#fff" }}
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
