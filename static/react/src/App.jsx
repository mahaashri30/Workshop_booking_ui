import React, { useState, useEffect } from 'react';
import { LoginPage, RegisterPage, ActivationPage } from './components/Auth/index.js';
import './styles/auth.css';

/**
 * AuthApp Component
 * Main app for authentication flow
 * Routes between Login, Register, and Activation pages
 */
function AuthApp() {
  // Initialize page from window.INITIAL_PAGE (set by Django template) or URL
  const [currentPage, setCurrentPage] = useState(() => {
    if (window.INITIAL_PAGE) {
      return window.INITIAL_PAGE;
    }
    const url = new URL(window.location);
    return url.searchParams.get('page') || 'login';
  });

  const [activationKey, setActivationKey] = useState(window.ACTIVATION_KEY || null);
  const [userEmail, setUserEmail] = useState(window.USER_EMAIL || '');

  // Get activation key from URL if present
  useEffect(() => {
    const url = new URL(window.location);
    const key = url.searchParams.get('key');
    if (key) {
      setActivationKey(key);
      setCurrentPage('activation');
    }
  }, []);

  const handleLoginSuccess = (response) => {
    // Redirect to dashboard based on user role
    if (response.redirect_url) {
      window.location.href = response.redirect_url;
    } else {
      // Default redirects based on role
      const userRole = response.profile?.role || 'coordinator';
      const redirectUrl = userRole === 'instructor' ? '/dashboard' : '/status';
      window.location.href = redirectUrl;
    }
  };

  const handleRegisterSuccess = (response) => {
    // Save email for activation page
    setUserEmail(response.email || '');
    setCurrentPage('activation');
  };

  const handleActivationSuccess = (response) => {
    // Show success message and redirect to login
    setTimeout(() => {
      setCurrentPage('login');
    }, 2000);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  return (
    <div className="auth-app">
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'activation' && (
        <ActivationPage
          activationKey={activationKey}
          userEmail={userEmail}
          onActivationSuccess={handleActivationSuccess}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default AuthApp;
