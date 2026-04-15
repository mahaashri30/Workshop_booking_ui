import React, { useState } from 'react';
import { apiClient } from '../services/api';
import '../styles/auth.css';

/**
 * LoginPage Component
 * Mobile-first responsive login form
 * Handles user authentication with Django backend
 */
export const LoginPage = ({ onLoginSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Call API
      const response = await apiClient.login(formData.email, formData.password);
      setSuccess('Login successful! Redirecting...');

      // Call success callback
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(response);
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Workshop Booking</h1>
          <p className="auth-subtitle">Sign in to your account</p>
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
              className="form-input"
              disabled={loading}
              required
              aria-label="Email address"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
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
              className="form-input"
              disabled={loading}
              required
              aria-label="Password"
            />
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="auth-footer">
          <p className="auth-text">Don't have an account?</p>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => onNavigate && onNavigate('register')}
          >
            Register here
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="auth-forgot">
          <button
            type="button"
            className="btn btn-text-link"
            onClick={() => onNavigate && onNavigate('forgot-password')}
          >
            Forgot your password?
          </button>
        </div>
      </div>

      {/* Mobile Info */}
      <div className="auth-info-mobile">
        <p>For instructors and coordinators</p>
      </div>
    </div>
  );
};

export default LoginPage;
