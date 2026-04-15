/**
 * Form Validation Utilities
 */

export const validators = {
  /**
   * Validate email format
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },

  /**
   * Validate password strength
   */
  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    // Add more strength checks if needed
    return null;
  },

  /**
   * Validate password confirmation
   */
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  },

  /**
   * Validate username
   */
  username: (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return null;
  },

  /**
   * Validate required field
   */
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  /**
   * Validate phone number
   */
  phone: (phone) => {
    if (!phone) return null; // Optional field
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  /**
   * Validate name field
   */
  name: (name, fieldName = 'Name') => {
    if (!name) return `${fieldName} is required`;
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    }
    return null;
  },
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return input.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Trim whitespace from form values
 */
export const trimFormValues = (formData) => {
  const trimmed = {};
  Object.keys(formData).forEach((key) => {
    const value = formData[key];
    trimmed[key] = typeof value === 'string' ? value.trim() : value;
  });
  return trimmed;
};

/**
 * Validate entire form
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const error = rule(formData[field], field);
    if (error) {
      errors[field] = error;
    }
  });
  return errors;
};
