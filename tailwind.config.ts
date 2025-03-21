import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': "#fff",
        'foreground': "#006",
        'primary-text': "#000",
        'hover-blue': "#023e8a",
        'grey-bg': "#f8f9fa",
        'hover-gold': "#cc9933",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        'backgroundImg': "url('/images/background-image.jpg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
