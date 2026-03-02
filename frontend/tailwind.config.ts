import type { Config } from "tailwindcss";

const config: Config = {
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0046ff",
          hover: "rgba(0, 70, 255, 0.2)",
        },
        gray: {
          100: "#e1e3ea",
          200: "#d3d6de",
          500: "#737684",
          600: "#454855",
          900: "#101116",
        },
      },
      fontFamily: {
        pretendard: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
      },
      borderRadius: {
        '24': '24px',
        '12': '12px',
        '100': '100px',
      },
    },
  },
  plugins: [],
};
export default config;
