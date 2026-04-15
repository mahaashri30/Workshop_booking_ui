/**
 * Consolidated React Auth Components Bundle
 * All components, services, and styles in one file for easy bundling
 * Uses global React/ReactDOM from CDN
 */

// Use global React and ReactDOM from CDN
const React = window.React;
const { useState, useEffect } = React;

// ============================================
// STYLES - Embedded CSS
// ============================================
const STYLES = `
/* Auth Container */
.auth-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.auth-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 32px 24px;
}

/* Forms */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Buttons */
button {
  background-color: #2563eb;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  min-width: 100%;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #1d4ed8;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Messages */
.error-message {
  color: #ef4444;
  background-color: #fee2e2;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.success-message {
  color: #10b981;
  background-color: #d1fae5;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

/* Links */
a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .auth-container {
    padding: 0;
  }
  
  .auth-box {
    box-shadow: none;
    border-radius: 0;
  }
}
`;

// ============================================
// API SERVICE
// ============================================

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8000';

export const apiClient = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ username: email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  },

  activateUser: async (key) => {
    const response = await fetch(`${API_BASE_URL}/activate/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ key }),
    });
    if (!response.ok) throw new Error('Activation failed');
    return await response.json();
  },
};

// ============================================
// VALIDATION UTILS
// ============================================

const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? '' : 'Invalid email address';
  },

  password: (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain number';
    return '';
  },

  confirmPassword: (password, confirmPassword) => {
    return password === confirmPassword ? '' : 'Passwords do not match';
  },

  username: (username) => {
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Username can only contain letters, numbers, hyphens, and underscores';
    return '';
  },

  required: (value) => {
    return value && value.trim() ? '' : 'This field is required';
  },

  name: (name) => {
    return name && name.trim().length >= 2 ? '' : 'Name must be at least 2 characters';
  },
};

// ============================================
// COMPONENTS
// ============================================

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validators.email(email)) setErrors(newErrors);
    if (!validators.password(password)) setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.login(email, password);
      window.location.href = '/profile/';
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          {errors.form && <div className="error-message">{errors.form}</div>}
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Don't have an account? <a href="/register/">Register</a>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (validators.username(formData.username)) newErrors.username = validators.username(formData.username);
    if (validators.email(formData.email)) newErrors.email = validators.email(formData.email);
    if (validators.name(formData.firstName)) newErrors.firstName = validators.name(formData.firstName);
    if (validators.name(formData.lastName)) newErrors.lastName = validators.name(formData.lastName);
    if (validators.password(formData.password)) newErrors.password = validators.password(formData.password);
    if (validators.confirmPassword(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = validators.confirmPassword(formData.password, formData.confirmPassword);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.register(formData);
      window.location.href = '/activate/';
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          {errors.form && <div className="error-message">{errors.form}</div>}
          
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={formData.username} onChange={handleChange} required />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} required />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} required />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Already have an account? <a href="/login/">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export function ActivationPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    if (key) {
      activateUser(key);
    }
  }, []);

  const activateUser = async (key) => {
    setIsLoading(true);
    try {
      await apiClient.activateUser(key);
      setMessage('✓ Your account has been activated! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login/';
      }, 2000);
    } catch (error) {
      setMessage('✗ Activation failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await apiClient.register({ email });
      setMessage('✓ Activation email sent!');
    } catch (error) {
      setMessage('✗ Failed to resend: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Verify Your Email</h1>
        {message && (
          <div className={message.startsWith('✓') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleResend}>
          <p>Enter your email to resend the activation link:</p>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Resend Activation Email'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Export styles for injection
export { STYLES };

// Make components available globally for use in HTML templates
if (typeof window !== 'undefined') {
  window.LoginPage = LoginPage;
  window.RegisterPage = RegisterPage;
  window.ActivationPage = ActivationPage;
  window.apiClient = apiClient;
  window.validators = validators;
}
