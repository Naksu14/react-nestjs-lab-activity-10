import React, { useEffect, useRef, useState } from 'react';

function EditProfileModal({
  isOpen,
  onClose,
  initialData = { firstname: '', lastname: '', email: '' },
  role = 'user',
  onSave = () => {}
}) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        firstname: initialData?.firstname || '',
        lastname: initialData?.lastname || '',
        email: initialData?.email || '',
        password: ''
      });
      setErrors({});
      setSuccess(false); // Only reset when opening
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
    // Removed initialData dependency to prevent resetting success state when parent data refreshes
  }, [isOpen]);

  // Support updating initialData while open (e.g. if a background fetch completes)
  // but DON'T do it if we're currently showing the success state to avoid jumpy UI
  useEffect(() => {
    if (isOpen && initialData && !success && !saving) {
      setForm(prev => ({
        ...prev,
        firstname: initialData.firstname || '',
        lastname: initialData.lastname || '',
        email: initialData.email || '',
      }));
    }
  }, [initialData, isOpen, success, saving]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.firstname.trim()) errs.firstname = 'First name is required';
    if (!form.lastname.trim()) errs.lastname = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (form.password && form.password.length < 8) errs.password = 'Min 8 characters';
    return errs;
  };

  const isDirty =
    form.firstname !== (initialData?.firstname || '') ||
    form.lastname !== (initialData?.lastname || '') ||
    form.email !== (initialData?.email || '') ||
    form.password !== '';

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'firstname' || e.target.name === 'lastname') {
      value = value.replace(/[0-9]/g, '');
    }
    setForm({ ...form, [e.target.name]: value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await onSave({ ...form, role });
      setSaving(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setSaving(false);
      setErrors({ submit: err?.response?.data?.message || 'Failed to update profile' });
      console.error('Profile update error:', err);
    }
  };

  const roleLabel =
    role === 'admin' ? 'Admin' : role === 'organizer' ? 'Organizer' : role === 'attendee' ? 'Attendee' : 'User';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-color)] w-full max-w-md p-8 relative my-auto">
        <button
          type="button"
          className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-6 text-[var(--text-primary)]">Edit {roleLabel} Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-left text-sm font-medium text-[var(--text-muted)] mb-1" htmlFor="firstname">
              First Name
            </label>
            <input
              ref={firstInputRef}
              type="text"
              name="firstname"
              id="firstname"
              value={form.firstname}
              onChange={handleChange}
              aria-invalid={!!errors.firstname}
              aria-describedby="firstname-error"
              className={`w-full px-4 py-2.5 border rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${errors.firstname ? 'border-red-400' : 'border-[var(--border-color)]'}`}
            />
            {errors.firstname && <span id="firstname-error" className="text-xs text-red-500">{errors.firstname}</span>}
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-[var(--text-muted)] mb-1" htmlFor="lastname">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={form.lastname}
              onChange={handleChange}
              aria-invalid={!!errors.lastname}
              aria-describedby="lastname-error"
              className={`w-full px-4 py-2.5 border rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${errors.lastname ? 'border-red-400' : 'border-[var(--border-color)]'}`}
            />
            {errors.lastname && <span id="lastname-error" className="text-xs text-red-500">{errors.lastname}</span>}
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-[var(--text-muted)] mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              className={`w-full px-4 py-2.5 border rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${errors.email ? 'border-red-400' : 'border-[var(--border-color)]'}`}
            />
            {errors.email && <span id="email-error" className="text-xs text-red-500">{errors.email}</span>}
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-[var(--text-muted)] mb-1" htmlFor="password">
              Password
            </label>
            <p className="text-xs text-left text-[var(--text-muted)] mb-2">Optional. Leave blank to keep current password.</p>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              className={`w-full px-4 py-2.5 border rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${errors.password ? 'border-red-400' : 'border-[var(--border-color)]'}`}
            />
            {errors.password && <span id="password-error" className="text-xs text-red-500">{errors.password}</span>}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || success || !isDirty || Object.keys(validate()).length > 0}
            className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${success ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-[var(--accent-color)] text-white shadow-[var(--accent-color)]/20'}`}
          >
            {saving ? (
              <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : success ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
            {saving ? 'Saving...' : success ? 'Profile Updated!' : 'Save Changes'}
          </button>

          {success && (
            <div className="text-green-600 text-center text-sm mt-2">Profile updated!</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
