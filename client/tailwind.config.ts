import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        onyx: "#0B0C0E",
        coal: "#16181C",
        graphite: "#2E3036",
        slate: "#5C5E66",
        gravel: "#8A8C93",
        ash: "#E5E0D2",
        line: "#E8E3D6",
        linen: "#F1ECE0",
        porcelain: "#FAFAF7",
        mist: "#FFFFFF",
        champagne: "#B5894A",
        bronze: "#8A6324",
        forest: "#143F33",
        sage: "#536D5F"
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      },
      letterSpacing: {
        editorial: "0.22em"
      },
      borderRadius: {
        sharp: "4px",
        edge: "8px",
        soft: "12px",
        card: "16px",
        well: "24px"
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(11, 12, 14, 0.06)",
        elev: "0 24px 60px rgba(11, 12, 14, 0.08)",
        deep: "0 32px 80px rgba(11, 12, 14, 0.18)"
      },
      backgroundImage: {
        "ink-gradient":
          "radial-gradient(circle at 80% 0%, rgba(181, 137, 74, 0.18), transparent 50%), radial-gradient(circle at 0% 100%, rgba(20, 63, 51, 0.22), transparent 50%), linear-gradient(135deg, #0B0C0E 0%, #16181C 100%)",
        "ivory-gradient":
          "radial-gradient(circle at 8% 5%, rgba(181, 137, 74, 0.10), transparent 40%), radial-gradient(circle at 95% 90%, rgba(20, 63, 51, 0.08), transparent 40%), linear-gradient(180deg, #FAFAF7 0%, #F1ECE0 100%)"
      }
    }
  },
  plugins: []
} satisfies Config;
