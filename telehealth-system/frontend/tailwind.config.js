/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#e0edff',
          200: '#c5dfff',
          300: '#9dcbff',
          400: '#72aeff',
          500: '#4e8bff',
          600: '#0057FF', // Main Primary
          700: '#0047e0',
          800: '#003eb8',
          900: '#003692'
        },
        healthcare: {
          light: '#e0f2fe',
          DEFAULT: '#0ea5e9',
          dark: '#0369a1'
        },
        brand: {
          background: '#F7FAFC',
          success: '#00A86B',
          emergency: '#FF3B30',
          text: '#0B1F33'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -10px rgba(0, 87, 255, 0.08)',
      }
    }
  },
  plugins: []
}
