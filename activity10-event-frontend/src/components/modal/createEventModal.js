import React, { useState, useRef } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  FileText,
  Clock,
  Upload,
  Image,
} from "lucide-react";
import { createEvent } from "../../services/organizerService";
import { getCurrentUser } from "../../services/authService";
import { usersService } from "../../services/adminSideService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CreateEventModal = ({ isOpen, onClose, onSubmit, organizerId, isAdminCreating = false }) => {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title_event: "",
    description: "",
    location: "",
    start_datetime: "",
    end_datetime: "",
    capacity: "",
    status: "draft",
    organizer_id: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });

  const { data: organizers = [] } = useQuery({
    queryKey: ["allOrganizers"],
    queryFn: () => usersService.getAllOrganizers(),
    enabled: isAdminCreating,
  });

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image must be less than 5MB",
        }));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title_event.trim())
      newErrors.title_event = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.start_datetime)
      newErrors.start_datetime = "Start date is required";
    if (!formData.end_datetime) newErrors.end_datetime = "End date is required";
    if (!formData.capacity || formData.capacity < 1)
      newErrors.capacity = "Capacity must be at least 1";
    if (isAdminCreating && !formData.organizer_id)
      newErrors.organizer_id = "Organizer is required";
    if (
      formData.start_datetime &&
      formData.end_datetime &&
      formData.start_datetime >= formData.end_datetime
    ) {
      newErrors.end_datetime = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity),
      organizer_id: isAdminCreating ? parseInt(formData.organizer_id) : currentUser?.id,
      created_by_admin: isAdminCreating ? true : false,
      image: imageFile,
    };
    try {
      await createEvent(payload);
      queryClient.invalidateQueries(["organizerEvents"]);
      queryClient.invalidateQueries(["adminEvents"]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title_event: "",
      description: "",
      location: "",
      start_datetime: "",
      end_datetime: "",
      capacity: "",
      status: "draft",
      organizer_id: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="w-full max-w-5xl rounded-lg overflow-hidden text-left"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-2 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Create New Event
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Fill in the details to create your event
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-1">
              <label
                className="flex items-center gap-2 text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                <Image size={16} /> Event Image
              </label>
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "2px dashed var(--border-color)",
                  minHeight: 280,
                }}
              >
                {imagePreview ? (
                  <div className="relative h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      style={{ minHeight: 280 }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="event-image"
                    className="flex flex-col items-center justify-center h-full cursor-pointer p-6"
                    style={{ minHeight: 280 }}
                  >
                    <Upload size={40} style={{ color: "var(--text-muted)" }} />
                    <p
                      className="mt-3 text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Click to upload
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      PNG, JPG up to 5MB
                    </p>
                  </label>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="event-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div>
                <label
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <FileText size={16} /> Event Title
                </label>
                <input
                  type="text"
                  name="title_event"
                  value={formData.title_event}
                  onChange={handleChange}
                  placeholder="e.g., Tech Conference 2026"
                  className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  style={inputStyle}
                />
                {errors.title_event && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title_event}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <FileText size={16} /> Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none focus:ring-2 focus:ring-indigo-500"
                  style={inputStyle}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <MapPin size={16} /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Convention Center, New York"
                  className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  style={inputStyle}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>

              {/* Date/Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="flex items-center gap-2 text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Calendar size={16} /> Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start_datetime"
                    value={formData.start_datetime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    style={inputStyle}
                  />
                  {errors.start_datetime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.start_datetime}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="flex items-center gap-2 text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Clock size={16} /> End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end_datetime"
                    value={formData.end_datetime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    style={inputStyle}
                  />
                  {errors.end_datetime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.end_datetime}
                    </p>
                  )}
                </div>
              </div>

              {/* Capacity & Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="flex items-center gap-2 text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Users size={16} /> Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    style={inputStyle}
                  />
                  {errors.capacity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.capacity}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="flex items-center gap-2 text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    style={inputStyle}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Admin: Assign Organizer */}
              {isAdminCreating && (
                <div>
                  <label
                    className="flex items-center gap-2 text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Users size={16} /> Assign Organizer
                  </label>
                  <select
                    name="organizer_id"
                    value={formData.organizer_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    style={inputStyle}
                  >
                    <option value="">Select an organizer...</option>
                    {organizers.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.firstname} {org.lastname} ({org.email})
                      </option>
                    ))}
                  </select>
                  {errors.organizer_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.organizer_id}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div
          className="px-6 py-4 flex gap-3 justify-end"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-80"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
