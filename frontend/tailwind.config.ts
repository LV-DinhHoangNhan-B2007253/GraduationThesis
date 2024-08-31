import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      backgroundImage: {
        'SignUp-light-bg': "url('/RegisterBgImage.jpg')",
        'SignUp-dark-bg': "url('/RegisDarkBg.jpg')",
      }
      ,
      colors: {
        'light-primary-text': '#000000',
        'dark-primary-text': '#ffffff',
        'label-text': '#6c757d',
        'input-focus': '#4cc9f0',
        'bg-dark': '#000814',
        'bg-light': '#ffffff',
        'border-light': '#343a40',
        'border-dark': '#f8f9fa'
      },
      fontSize: {
        base: '16px',
        'small': '14px',

      }
    },
  },
  plugins: [nextui()],
  darkMode: 'selector',
};
export default config;
