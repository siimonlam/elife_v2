/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFDFB',
          100: '#FAF8F4',
          200: '#F5F0E8',
          300: '#EDE5D6',
          400: '#E0D4BF',
        },
        forest: {
          50: '#EEF4F1',
          100: '#D5E6DF',
          200: '#A8CBBF',
          300: '#7AAF9F',
          400: '#4D937F',
          500: '#2C5F4A',
          600: '#234D3C',
          700: '#1B3B2D',
          800: '#12281F',
          900: '#091611',
        },
        terracotta: {
          50: '#FDF3EE',
          100: '#F9E2D4',
          200: '#F2C4A8',
          300: '#EAA57D',
          400: '#E38751',
          500: '#C17F5C',
          600: '#A56640',
          700: '#894E2E',
          800: '#6D371D',
          900: '#51210E',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E4EDE4',
          200: '#C6D9C6',
          300: '#A8C5A8',
          400: '#8AB18A',
          500: '#6C9D6C',
          600: '#578357',
          700: '#426942',
          800: '#2D4F2D',
          900: '#183518',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
