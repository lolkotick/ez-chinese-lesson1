/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tone1: '#ef4444', // Red
        tone2: '#10b981', // Green
        tone3: '#3b82f6', // Blue
        tone4: '#8b5cf6', // Purple
        tone5: '#9ca3af', // Gray
      },
      fontFamily: {
        chinese: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
