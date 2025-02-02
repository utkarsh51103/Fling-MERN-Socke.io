/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {},
    screens: {
      sm: '360px',  
      md: '640px',  // Default for md
      lg: '768px',  // Adjust if needed
      xl: '1024px', // Adjust if needed
      '2xl': '1280px', // Adjust if needed
    },
  },
  plugins: [],
}

