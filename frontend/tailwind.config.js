/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Replaced yellow gold with sleek minimalist black, charcoal & warm stone
        gold: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#9CA3AF',
          400: '#4B5563',
          500: '#18181B', // Sleek primary black
          600: '#09090B',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          DEFAULT: '#18181B',
          light: '#4B5563',
          dark: '#000000',
        },
        obsidian: {
          950: '#FFFFFF', // Pure clean white canvas
          900: '#FFFFFF', // White cards
          850: '#F9FAFB', // Subtle off-white
          800: '#E5E7EB', // Neutral light border
          700: '#D1D5DB',
          600: '#6B7280',
        },
        minimal: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          500: '#737373',
          700: '#404040',
          900: '#171717',
          950: '#0A0A0A',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 4px 14px 0 rgba(0, 0, 0, 0.08)',
        'gold-glow-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
        'glass-edge': 'none',
        'luxury-card': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #27272A 0%, #09090B 100%)',
        'gold-metallic': 'linear-gradient(90deg, #FFFFFF 0%, #27272A 100%)',
      },
    },
  },
  plugins: [],
};
