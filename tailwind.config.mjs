import fluid, { extract, screens, fontSize } from "fluid-tailwind";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: [
      "./src/**/*.{js,jsx,ts,tsx}", // Add this to include all components in src
      "./app/**/*.{js,jsx,ts,tsx}", // Include app directory (used in Next.js)
      "./pages/**/*.{js,jsx,ts,tsx}",
    ],
    extract,
  },
  darkMode: "class",
  theme: {
    screens,
    fontSize,
    extend: {
      fontFamily: {
        dosis: ["var(--font-dosis)"],
        "geist-mono": ["var(--font-geist-mono)"],
      },
      colors: {
        white: {
          50: "#f9f8fc",
          100: "#e7e3f1",
          200: "#5c4d7c",
          300: "#302546",
        },
      },
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
    },
  },
  plugins: [
    fluid({
      checkSC144: false,
    }),
    addVariablesForColors,
    require("tailwind-scrollbar"),
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
