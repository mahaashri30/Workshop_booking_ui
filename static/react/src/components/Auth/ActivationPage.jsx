import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import '../styles/auth.css';

/**
 * ActivationPage Component
 * Mobile-first responsive email verification page
 * Handles user email verification and resend activation
 */
export const ActivationPage = ({ activationKey = null, userEmail = '', onActivationSuccess, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resendSent, setResendSent] = useState(false);
  const [activationAttempted, setActivationAttempted] = useState(false);
  const [email, setEmail] = useState(userEmail);
  const [resendLoading, setResendLoading] = useState(false);

  // Auto-activate if key is provided
  useEffect(() => {
    if (activationKey && !activationAttempted) {
      handleActivate(activationKey);
      setActivationAttempted(true);
    }
  }, [activationKey, activationAttempted]);

  const handleActivate = async (key = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.activateUser(key);
      setSuccess('Your email has been verified successfully! Redirecting to login...');

      if (onActivationSuccess) {
        setTimeout(() => {
          onActivationSuccess(response);
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Activation failed. Please check your activation link or resend the email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendActivation = async (e) => {
    e.preventDefault();
    setResendLoading(true);
    setError(null);

    try {
      if (!email) {
        throw new Error('Please enter your email address');
      }

      const response = await apiClient.resendActivation(email);
      setResendSent(true);
      setSuccess('Activation email sent! Check your inbox for the verification link.');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to resend activation email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Verify Your Email</h1>
          <p className="auth-subtitle">Complete your registration</p>
        </div>

        {/* Content */}
        <div className="activation-content">
          {/* Success State */}
          {success && (
            <div className="alert alert-success" role="alert">
              <span className="alert-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-error" role="alert">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="activation-loading">
              <div className="spinner-large"></div>
              <p>Verifying your email...</p>
            </div>
          )}

          {/* Main Message */}
          {!success && !loading && (
            <>
              <div className="activation-message">
                <p className="activation-text">
                  We've sent a verification link to your email address. Check your inbox and click the link to complete your registration.
                </p>
                <p className="activation-subtext">
                  If you didn't receive the email, you can request a new verification link below.
                </p>
              </div>

              {/* Resend Form */}
              <form className="activation-form" onSubmit={handleResendActivation}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                    <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input"
                    disabled={resendLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary btn-block"
                  disabled={resendLoading}
                  aria-busy={resendLoading}
                >
                  {resendLoading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              </form>

              {/* Info Box */}
              <div className="info-box">
                <h3 className="info-title">💡 Didn't get the email?</h3>
                <ul className="info-list">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you entered the correct email</li>
                  <li>Wait a few moments and refresh</li>
                  <li>Request a new verification link above</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer Links */}
        {!loading && success && (
          <div className="auth-footer">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => onNavigate && onNavigate('login')}
            >
              ← Back to Login
            </button>
          </div>
        )}

        {/* Alternative Actions */}
        {!success && !loading && (
          <div className="auth-footer">
            <p className="auth-text">Already verified?</p>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => onNavigate && onNavigate('login')}
            >
              Sign in to your account
            </button>
          </div>
        )}
      </div>

      {/* Mobile Info */}
      <div className="auth-info-mobile">
        <p>Email verification required</p>
      </div>
    </div>
  );
};

export default ActivationPage;
