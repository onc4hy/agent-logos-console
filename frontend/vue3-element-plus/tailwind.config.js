/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D47A1',
          container: '#1565C0',
          light: {
            3: '#1976D2',
          }
        },
        secondary: {
          DEFAULT: '#00B0FF',
          container: '#26C6DA',
        },
        accent: '#64DD17',
        surface: {
          DEFAULT: '#F5F5F7',
          dark: '#121212', // 更深的背景色
          high: {
            light: '#E0E0E6',
            dark: '#2C2C3A',
          }
        },
        on: {
          primary: '#FFFFFF',
          secondary: '#000000',
          surface: {
            light: '#1A1A1A',
            dark: '#E5E5E5',
          }
        },
        error: '#CF6679',
        success: '#4CAF50',
      }
    },
  },
  plugins: [],
}