import React, { useState, useRef, useEffect } from 'react';

function CreateOrganizerModal({ isOpen, onClose, onCreate, organizer = null }) {
  const isEditMode = !!organizer && !organizer.isArchived;
  const isViewMode = !!organizer && organizer.isArchived;
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [originalForm, setOriginalForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if ((isEditMode || isViewMode) && organizer) {
        const orgData = {
          firstname: organizer.firstname || '',
          lastname: organizer.lastname || '',
          email: organizer.email || '',
          password: '',
        };
        setForm(orgData);
        setOriginalForm(orgData);
      } else {
        setForm({ firstname: '', lastname: '', email: '', password: '' });
        setOriginalForm({ firstname: '', lastname: '', email: '', password: '' });
      }
      setErrors({});
      setSuccess(false);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, organizer, isEditMode, isViewMode]);

  const hasChanges = () => {
    return (
      form.firstname !== originalForm.firstname ||
      form.lastname !== originalForm.lastname ||
      form.email !== originalForm.email ||
      form.password !== ''
    );
  };

  const validate = () => {
    const errs = {};
    if (!form.firstname.trim()) errs.firstname = 'First name is required';
    if (!form.lastname.trim()) errs.lastname = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    
    // Password validation
    if (!isEditMode) {
      // Create mode - password required
      if (!form.password) {
        errs.password = 'Password is required';
      } else {
        const passwordError = validatePassword(form.password);
        if (passwordError) {
          errs.password = passwordError;
        }
      }
    } else if (form.password) {
      // Edit mode - password optional but if provided must be strong
      const passwordError = validatePassword(form.password);
      if (passwordError) {
        errs.password = passwordError;
      }
    }
    return errs;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return '';
  };

  const getPasswordRequirements = () => {
    return {
      minLength: form.password.length >= 8,
      hasUppercase: /[A-Z]/.test(form.password),
      hasLowercase: /[a-z]/.test(form.password),
      hasNumber: /[0-9]/.test(form.password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password),
    };
  };

  const handleChange = (e) => {
    let value = e.target.value;
    // Block numbers in firstname and lastname
    if (e.target.name === 'firstname' || e.target.name === 'lastname') {
      value = value.replace(/[0-9]/g, '');
    }
    setForm({ ...form, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await onCreate(form);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1200);
    } catch (error) {
      setLoading(false);
      console.error('Error creating organizer:', error.response?.data || error.message);
      setErrors({ submit: error.response?.data?.message || 'Failed to create organizer' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-color)] w-full max-w-md p-8 relative">
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
        <h2 className="text-xl font-semibold mb-6 text-[var(--text-primary)] text-left">
          {isViewMode ? 'View Organizer' : isEditMode ? 'Edit Organizer' : 'Add Organizer'}
        </h2>
        {isViewMode && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg text-sm">
            📋 This organizer is archived. Details are view-only.
          </div>
        )}
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
              required
              disabled={isViewMode}
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
              required
              disabled={isViewMode}
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
            <p className="text-xs text-left text-[var(--text-muted)] mb-2">Please enter a valid email address (e.g., organizer@example.com)</p>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isViewMode}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              className={`w-full px-4 py-2.5 border rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${errors.email ? 'border-red-400' : 'border-[var(--border-color)]'}`}
            />
            {errors.email && <span id="email-error" className="text-xs text-red-500">{errors.email}</span>}
          </div>
          {!isViewMode && (
            <div>
              <label className="block text-left text-sm font-medium text-[var(--text-muted)] mb-1" htmlFor="password">
                Password
              </label>
              {isEditMode && (
                <p className="text-xs bg-blue-100 border border-blue-300 text-blue-800 p-2 rounded mb-2 font-medium">
                  💡 Leave blank to keep current password
                </p>
              )}
              <p className="text-xs text-left text-[var(--text-muted)] mb-2">Strong password required:</p>
              <div className="space-y-1 mb-2 text-xs text-left">
                <div style={{ color: getPasswordRequirements().minLength ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                  {getPasswordRequirements().minLength ? '✓' : '○'} Minimum 8 characters
                </div>
                <div style={{ color: getPasswordRequirements().hasUppercase ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                  {getPasswordRequirements().hasUppercase ? '✓' : '○'} At least one uppercase letter (A-Z)
                </div>
                <div style={{ color: getPasswordRequirements().hasLowercase ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                  {getPasswordRequirements().hasLowercase ? '✓' : '○'} At least one lowercase letter (a-z)
                </div>
                <div style={{ color: getPasswordRequirements().hasNumber ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                  {getPasswordRequirements().hasNumber ? '✓' : '○'} At least one number (0-9)
                </div>
                <div style={{ color: getPasswordRequirements().hasSpecial ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                  {getPasswordRequirements().hasSpecial ? '✓' : '○'} At least one special character (!@#$%^&*)
                </div>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required={!isEditMode}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              className={`w-full px-4 py-2.5 border rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${errors.password ? 'border-red-400' : 'border-[var(--border-color)]'}`}
            />
            {errors.password && <span id="password-error" className="text-xs text-red-500">{errors.password}</span>}
            </div>
          )}
          {errors.submit && (
            <div className="p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}
          {!isViewMode && (
            <button
              type="submit"
              disabled={loading || Object.keys(validate()).length > 0 || (isEditMode && !hasChanges())}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:shadow-lg shadow-[var(--accent-color)]/20 disabled:opacity-60"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Organizer' : 'Create Organizer')}
            </button>
          )}
          {success && (
            <div className="text-green-600 text-center text-sm mt-2">
              Organizer {isEditMode ? 'updated' : 'created'} successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateOrganizerModal;