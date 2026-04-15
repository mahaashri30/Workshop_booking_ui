/**
 * Simple React component bundler - converts JSX to stand-alone HTML with embedded CSS
 * This generates HTML templates that can be included in Django templates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read CSS file
const cssContent = fs.readFileSync(path.join(__dirname, 'src/styles/auth.css'), 'utf8');

// Create Docker-like setup - write HTML templates with inline CSS and CDN React
const templates = {
  'login': `
<div id="react-root"></div>
<style>
${cssContent}
</style>

<script>
// Auth API Service
const AUTH_API = {
  login: async (email, password) => {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || 
                      Array.from(document.cookies).find(c => c.includes('csrftoken'));
    const response = await fetch('/login/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ username: email, password }),
    });
    return response.json();
  }
};

// Login Component
const LoginComponent = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await AUTH_API.login(email, password);
      if (result.success) {
        window.location.href = '/profile/';
      } else {
        setErrors({ form: result.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement('div', { className: 'auth-container' },
    React.createElement('div', { className: 'auth-box' },
      React.createElement('h1', {}, 'Sign In'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', {}, 'Email'),
          React.createElement('input', {
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', {}, 'Password'),
          React.createElement('input', {
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true
          })
        ),
        errors.form && React.createElement('div', { className: 'error-message' }, errors.form),
        React.createElement('button', { type: 'submit', disabled: isLoading },
          isLoading ? 'Signing in...' : 'Sign In'
        )
      )
    )
  );
};

ReactDOM.render(React.createElement(LoginComponent), document.getElementById('react-root'));
</script>
  `.trim()
};

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
}

// Write template files
Object.entries(templates).forEach(([name, content]) => {
  const filepath = path.join(__dirname, `dist/${name}-bundle.html`);
  fs.writeFileSync(filepath, content);
  console.log(`✓ Generated: dist/${name}-bundle.html`);
});

// Create a standalone CSS bundle
fs.writeFileSync(path.join(__dirname, 'dist/auth-styles.css'), cssContent);
console.log('✓ Generated: dist/auth-styles.css');

console.log('\nTo use these bundles:');
console.log('1. Include React CDN in Django templates');
console.log('2. Include dist/auth-styles.css for styling');
console.log('3. Add <div id="react-root"></div> where you want to mount components');
