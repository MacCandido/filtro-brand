import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        bone: "#f5f2ec",
        paper: "#faf8f4",
        ember: "#c8553d",
        moss: "#3a4a3f",
        ash: "#6b6b6b",
        line: "#e3dfd6",
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        display: ["'Bebas Neue'", "Impact", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        wider: "0.14em",
        wide: "0.05em",
      },
      boxShadow: {
        dock: "inset 0 1px 0 rgba(255,255,255,.55), 0 8px 24px rgba(10,10,10,.08), 0 18px 44px rgba(10,10,10,.05)",
        card: "inset 0 1px 0 rgba(255,255,255,.7), 0 4px 16px rgba(10,10,10,.06), 0 1px 3px rgba(10,10,10,.04)",
        cardHover:
          "inset 0 1px 0 rgba(255,255,255,.8), 0 12px 32px rgba(10,10,10,.12), 0 4px 8px rgba(10,10,10,.06)",
        pill: "inset 0 1px 0 rgba(255,255,255,.7), 0 2px 6px rgba(10,10,10,.05)",
        veredito:
          "inset 0 1.5px 0 rgba(255,255,255,.5), 0 20px 50px rgba(10,10,10,.25), 0 8px 20px rgba(10,10,10,.15)",
      },
      transitionTimingFunction: {
        glide: "cubic-bezier(.4,0,.2,1)",
        spring: "cubic-bezier(.34,1.4,.64,1)",
      },
    },
  },
  plugins: [],
};
export default config;
