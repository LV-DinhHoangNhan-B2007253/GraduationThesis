import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // dark: màu dùng cho dark mode
  theme: {
    extend: {
      backgroundImage: {
        "SignUp-light-bg": "url('/RegisterBgImage.jpg')",
        "SignUp-dark-bg": "url('/RegisDarkBg.jpg')",
        "Loading-img": "url('/pageLoading.jpg')",
        "PageNotFound-img": "url('/pageNotFound.jpg')",
        'Hero1': "url('/Hero1.webp')",
        'Hero2': "url('/Hero2.webp')",
        'CreateShopBg': "url('/shop_signup_bg.jpg')",

      },
      colors: {

        // light
        "light-primary-text": "#333333",

        "light-bg": "#FAFAFA",

        'light-modal-popup': '#ffffff',
        'light-sidetab': '#ECECEC',
        'light-element-border': '#DDDDDD',
        'light-text-link-color': '#3A6EA5 ',

        'light-btn-bg': '#007BFF ',
        'light-btn-bg-second': '#F0F0F0 ',
        'light-btn-hover': '#0069D9 ',
        'light-btn-text': '#FFFFFF',

        'light-input-field': '#FFFFFF ',
        'light-input-border': '#D1D8E0',
        'light-input-placeholder': '#A9A9A9',
        'light-input-text': '#333333',

        'light-modal-border': '#DDDDDD',

        'light-navbar-bg': '#ffffff ',
        'light-navbar-text': '#333333',
        'light-navbar-hover': '#007BFF',

        'light-card-bg': '#FFFFFF',
        'light-card-shadow': 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
        'light-card-border': '#E0E0E0',

        'light-footer-bg': '#ffffff ',
        'light-footer-text': '#666666',
        'light-footer-link': '#007BFF',
        'light-active': '#3d405b',


        // dark text  
        "dark-primary-text": "#e0e0e0",
        'dark-heading': '#f5f5f5',
        "dark-bg": "#1a1a2e",
        "dark-border": "#4a4a6a",
        "dark-modal-popup": "#33334D",
        'dark-sidetab': '#2F2F45',
        'dark-bg-btn': '#4B4B6A',
        'dark-bg-btn-hover': '#06B6D4',
        'dark-btn-text': '#dddddd',
        // dark input
        'dark-input-field': '#2e2e3a',
        'dark-input-border': '#3B82F6',
        'dark-input-placeholder': '#9CA3AF',
        'dark-input-text': '#e0e0e0',

        // dark accent color
        'dark-hover': '#2563eb',
        // dark hover active
        'dark-link': '#f97316',
        'dark-active': '#7bf1a8',
        // dark navbar
        'dark-navbar-bg': '#1A1A2E',
        'dark-navbar-text': '#ffffff',
        'dark-navbar-hover': '#3B82F6',

        // dark card
        'dark-card-bg': '#2B2B3F',
        'dark-card-shadow': 'rgba(0, 0, 0, 0.25) 0px 4px 12px',
        'dark-card-border': '#444466',

        // dark footer
        'dark-footer-bg': '#1A1A40',
        'dark-footer-text': '#A1A1AA',
        'dark-footer-link': '#22D3EE'


      },
      fontSize: {
        base: "16px",
        small: "14px",
      },
    },
  },
  plugins: [nextui()],
  darkMode: "selector",
};
export default config;
