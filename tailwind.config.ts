import type { Config } from "tailwindcss";
import { blackA } from "@radix-ui/colors";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "1000": "1000px",
        "1100": "1100px",
        "1200": "1200px",
      },
    },
    extend: {
      colors: {
        black: "#161313",
        black2: "#1c1c1b",
        red: "#FF3C47",
        red_mist: "rgba(248,56,68,0.2)",
        red_mist_strong: "rgba(248,56,68,0.3)",
        gray: "#AEAAAA",
        gray2: "#605E5E",
        gray3: "#313030",
        gray4: "#797676",
        ...blackA,
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--gradient-color-stops))",
        "radial-custom": "radial-gradient(circle, var(--tw-gradient-stops))",
        "radial-custom-multiple": `radial-gradient(50vw circle at 15% 50%, var(--tw-gradient-stops), transparent),
            radial-gradient(50vw circle at 97% 35%, var(--tw-gradient-stops), transparent)
        `,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
