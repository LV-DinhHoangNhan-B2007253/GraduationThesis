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


        'text': 'var(--text)',
        'background': 'var(--background)',
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'accent': 'var(--accent)',
        'navbar': 'var(--navbar)',
        'borderb': 'var(--border-bottom-color)',
        'heading': 'var(--heading)',
        'input': 'var(--input)',
        'input-text': 'var(--input-text)',
        'label': 'var(--label)',
        'button-primary': 'var(--button-primary)',
        'button-warning': 'var(--button-warning)',
        'button-danger': 'var(--button-danger)',
        'button-success': 'var(--button-success)',
        'primary-border': 'var(--primary-border)',
        'card-bg': 'var(--card-bg)',
        'product-card': 'var(--product-card)'

      },
      fontSize: {
        sm: '0.750rem',
        base: '1rem',
        xl: '1.333rem',
        '2xl': '1.777rem',
        '3xl': '2.369rem',
        '4xl': '3.158rem',
        '5xl': '4.210rem',
      },
      fontFamily: {
        heading: 'Inter',
        body: 'Inter',
      },
      fontWeight: {
        normal: '400',
        bold: '700',
      },
    },
  },
  variants: {
    extend: {
      animation: ['group-hover'],
    },
  },
  plugins: [nextui()],
  darkMode: "selector",
};
export default config;
