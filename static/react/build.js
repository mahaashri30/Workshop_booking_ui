/**
 * Build script for React Auth components
 * Creates a single bundled file suitable for Django templates
 */

import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.argv.includes('--prod');

const config = {
  entryPoints: [path.resolve(__dirname, 'src/bundle.jsx')],
  bundle: true,
  outfile: path.resolve(__dirname, isProduction ? 'dist/auth-bundle.min.js' : 'dist/auth-bundle.js'),
  external: [],  // No externals - rely on global React from CDN
  sourcemap: !isProduction,
  minify: isProduction,
  target: ['es2020'],
  platform: 'browser',
  format: 'iife',
  define: {
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
  },
};

// Build
try {
  await esbuild.build(config);
  console.log('✓ React auth bundle built successfully');
  console.log(`  Output: ${config.outfile}`);
  if (config.minify) console.log('  Mode: Production (minified)');
  else console.log('  Mode: Development');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
