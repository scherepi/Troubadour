/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'avara-black': ['Avara_Black', 'serif'],
        'avara-bold': ['Avara_Bold', 'serif'],
        'avara-bold-italic': ['Avara_Bold Italic', 'serif'],
        'manifont-book': ['ManifontGroteskBook', 'sans-serif'],
        'manifont-bold': ['ManifontGroteskBold', 'sans-serif'],
        'manifont-bold-italic': ['ManifontGroteskBoldItalic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
