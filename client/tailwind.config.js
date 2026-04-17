/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rani: {
          DEFAULT: '#FF2E7E', // Rani pink
          dark: '#C30052',
          light: '#FF5CA7',
        },
        platform: {
          DEFAULT: '#0A0A0A', // Platform black
          dark: '#18181b',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#A78BFA',
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        pink: '0 4px 14px 0 rgba(255,46,126,0.25)',
      },
    },
  },
  plugins: [],
};
