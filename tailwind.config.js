// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./*.html",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],

  theme: {
    extend: {},
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],

  darkMode: "class",
  // ... other configurations
};
