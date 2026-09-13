/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cas: {
          slate: '#0F172A',
          charcoal: '#1E293B',
          muted: '#475569',
          border: '#E2E8F0',
          canvas: '#F8FAFC',
          amber: '#D97706',
          amberDark: '#B45309',
          amberLight: '#FEF3C7',
          green: '#16A34A',
          greenLight: '#DCFCE7',
          blue: '#0369A1',
          blueLight: '#E0F2FE'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
