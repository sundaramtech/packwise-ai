/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#4CAF50',
        'leaf-green': '#7CB342',
        'dark-green': '#245B35',
        'accent-orange': '#FF9800',
        'mango-yellow': '#FFC107',
        'tomato-red': '#E53935',
        'fresh-blue': '#29B6F6',
        'warm-cream': '#FFF8E7',
        'slate-dark': '#263238',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'food-card': '0 4px 20px -2px rgba(36, 91, 53, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'food-lg': '0 10px 30px -5px rgba(36, 91, 53, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
