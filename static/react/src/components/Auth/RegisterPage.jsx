import React, { useState } from 'react';
import { apiClient } from '../services/api';
import '../styles/auth.css';

/**
 * RegisterPage Component
 * Mobile-first responsive registration form
 * Creates new user account with Django backend
 */
export const RegisterPage = ({ onRegisterSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Basic validation
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirm_password) errors.confirm_password = 'Please confirm password';

    // Password matching
    if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    // Password strength
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Validate form
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        throw new Error('Please fix the errors above');
      }

      // Call API
      const response = await apiClient.register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
      });

      setSuccess('Account created! Redirecting to email verification...');

      // Call success callback
      if (onRegisterSuccess) {
        setTimeout(() => {
          onRegisterSuccess(response);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card auth-card-large">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the workshop platform</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="alert alert-error" role="alert">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="alert alert-success" role="alert">
              <span className="alert-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* Name Fields - Two Column on Desktop */}
          <div className="form-row">
            <div className="form-group form-group-half">
              <label htmlFor="first_name" className="form-label">
                First Name
                <span className="required">*</span>
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className={`form-input ${fieldErrors.first_name ? 'error' : ''}`}
                disabled={loading}
                required
              />
              {fieldErrors.first_name && (
                <span className="field-error">{fieldErrors.first_name}</span>
              )}
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="last_name" className="form-label">
                Last Name
                <span className="required">*</span>
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className={`form-input ${fieldErrors.last_name ? 'error' : ''}`}
                disabled={loading}
                required
              />
              {fieldErrors.last_name && (
                <span className="field-error">{fieldErrors.last_name}</span>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
              <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`form-input ${fieldErrors.email ? 'error' : ''}`}
              disabled={loading}
              required
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
              <span className="required">*</span>
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className={`form-input ${fieldErrors.username ? 'error' : ''}`}
              disabled={loading}
              required
            />
            {fieldErrors.username && (
              <span className="field-error">{fieldErrors.username}</span>
            )}
          </div>

          {/* Phone Field - Optional */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91-9876543210"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Password Fields */}
          <div className="form-row">
            <div className="form-group form-group-half">
              <label htmlFor="password" className="form-label">
                Password
                <span className="required">*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                disabled={loading}
                required
              />
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="confirm_password" className="form-label">
                Confirm Password
                <span className="required">*</span>
              </label>
              <input
                id="confirm_password"
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`form-input ${fieldErrors.confirm_password ? 'error' : ''}`}
                disabled={loading}
                required
              />
              {fieldErrors.confirm_password && (
                <span className="field-error">{fieldErrors.confirm_password}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="auth-footer">
          <p className="auth-text">Already have an account?</p>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => onNavigate && onNavigate('login')}
          >
            Sign in here
          </button>
        </div>
      </div>

      {/* Mobile Info */}
      <div className="auth-info-mobile">
        <p>Instructors and coordinators</p>
      </div>
    </div>
  );
};

export default RegisterPage;
