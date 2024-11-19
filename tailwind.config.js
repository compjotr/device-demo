/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#004E82",
        accent: "#89CFF0",
        complement: "#4E8200",
        neutral: "#A3A3A3",
      },
    },
  },
  plugins: [],
};
