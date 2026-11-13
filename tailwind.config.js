/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5A1F',
          orangeHover: '#E04810',
          orangeLight: '#FFF7ED',
          orangeBorder: '#FED7AA',
          graphite: '#18181B',
          dark: '#09090B',
          bg: '#FAFAFA',
          subtle: '#F4F4F5',
        }
      },
      borderRadius: {
        'button': '8px',
        'input': '8px',
        'card': '12px',
        'panel': '16px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
