/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        light_blue: "#0099ff",
        dark_blue: "#0000ff",
      },
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
      },
    },
    screens: {
      sm: "576px",
      tab: "767px",
      md: "991px",
      lg: "1024px",
      xl: "1220px",
      xxl: "1440px",
      xll: "1550px",
      xlll: "1746px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};


