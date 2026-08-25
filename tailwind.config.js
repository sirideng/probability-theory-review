/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'PingFang SC', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        ink: '#1d1d1f',
        canvas: '#f5f5f7',
        blue: '#0071e3',
      },
      boxShadow: {
        card: '0 20px 55px rgba(0, 0, 0, 0.075), 0 2px 8px rgba(0, 0, 0, 0.03)',
        soft: '0 8px 30px rgba(0, 0, 0, 0.055), 0 1px 3px rgba(0, 0, 0, 0.025)',
      },
    },
  },
  plugins: [],
}
