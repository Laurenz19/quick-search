/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/utils/*.{vue,js,ts,jsx,tsx}",
    "./src/components/*.{vue,js,ts,jsx,tsx}",
    "./src/views/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

