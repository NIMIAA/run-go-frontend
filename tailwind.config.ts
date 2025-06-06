import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import daisyui from "daisyui";
import tailwindTypography from "@tailwindcss/typography";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [],
  },
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        ...colors,
        background: "#fff",
        foreground: "#006",
        "primary-text": "#000",
        "hover-blue": "#023e8a",
        "grey-bg": "#f8f9fa",
        "hover-gold": "#cc9933",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      
    },
  },
  plugins: [daisyui, tailwindTypography],
} satisfies Config;
