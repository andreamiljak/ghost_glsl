import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    root: './src',
    server: {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open unless on CodeSandbox
    },
    plugins: [glsl()]
});
