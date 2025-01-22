import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        app_blue: {
          DEFAULT: "#000066",
          50: "#1F1FFF",
          100: "#0A0AFF",
          200: "#0000E0",
          300: "#0000B8",
          400: "#00008F",
          500: "#000066",
          600: "#00002E",
          700: "#000000",
          800: "#000000",
          900: "#000000",
          950: "#000000",
        },
        app_yellow: {
          DEFAULT: "#CC9933",
          50: "#F1E2C6",
          100: "#EDDAB6",
          200: "#E4CA95",
          300: "#DCBA74",
          400: "#D4A954",
          500: "#CC9933",
          600: "#9F7728",
          700: "#72561D",
          800: "#453411",
          900: "#181206",
          950: "#020201",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
