// vite.config.js

export default {
  // other configurations...
  server: {
    hmr: {
      overlay: false,
    },
  },

  resolve: {
    alias: {
      "@views": "./src/views", // Example alias for views/components folder
    },
  },
};
