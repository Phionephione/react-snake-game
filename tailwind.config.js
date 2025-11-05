/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nokia-bg': '#c7f0d8',
        'nokia-fg': '#43523d',
      }
    },
  },
  plugins: [],
}
