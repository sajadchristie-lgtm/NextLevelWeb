import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1720",
        sand: "#f7f3ec",
        shell: "#fffdf9",
        line: "#e6dece",
        bronze: "#ba7d4a",
        ember: "#7a3e1c",
        pine: "#30443a"
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 45px rgba(17, 24, 39, 0.08)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(186, 125, 74, 0.2), transparent 45%), radial-gradient(circle at bottom right, rgba(48, 68, 58, 0.18), transparent 42%)"
      }
    }
  },
  plugins: []
} satisfies Config;

