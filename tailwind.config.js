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
          graphite: '#18181B',
          bg: '#FAFAFA',
          teal: '#14B8A6',
          tealLight: '#F0FDFA',
        }
      }
    },
  },
  plugins: [],
};
