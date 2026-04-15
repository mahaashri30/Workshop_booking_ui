/**
 * esbuild configuration for React Auth components
 * 
 * Usage:
 * npm run build        # Development build (watched)
 * npm run build:prod   # Production build (minified)
 */

const esbuild = require('esbuild');
const path = require('path');

const config = {
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outfile: 'dist/auth-bundle.js',
  external: ['react', 'react-dom'],
  sourcemap: process.env.NODE_ENV !== 'production',
  minify: process.env.NODE_ENV === 'production',
  target: ['es2020'],
  platform: 'browser',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
  },
};

// Build
esbuild
  .build(config)
  .then(() => {
    console.log('✓ React auth bundle built successfully');
    console.log(`  Output: ${config.outfile}`);
    if (config.minify) {
      console.log('  Mode: Production (minified)');
    } else {
      console.log('  Mode: Development (with sourcemap)');
    }
  })
  .catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
  });
