export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core ink scale — black-ish to muted gray
        ink: "#0A0A0B",
        charcoal: "#1F2933",
        slate: "#475569",
        muted: "#94A3B8",
        line: "#E5E7EB",
        soft: "#FAFAFA",
        paper: "#FFFFFF",
        // Single warm accent — used sparingly for prices + accent links
        accent: "#C77B45",
        accentDeep: "#8C5023",
        // Legacy aliases (admin pages still reference these names)
        onyx: "#0A0A0B",
        coal: "#1F2933",
        graphite: "#1F2933",
        gravel: "#94A3B8",
        ash: "#E5E7EB",
        linen: "#FAFAFA",
        porcelain: "#FAFAFA",
        mist: "#FFFFFF",
        champagne: "#C77B45",
        bronze: "#8C5023",
        forest: "#16A34A",
        sage: "#475569",
        sand: "#FAFAFA",
        shell: "#FFFFFF",
        ember: "#8C5023",
        pine: "#16A34A"
      },
      fontFamily: {
        display: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      },
      letterSpacing: {
        tightest: "-0.025em",
        editorial: "0.16em"
      },
      borderRadius: {
        sharp: "4px",
        edge: "8px",
        soft: "12px",
        card: "12px",
        well: "16px"
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(10, 10, 11, 0.05)",
        card: "0 4px 20px rgba(10, 10, 11, 0.04)",
        elev: "0 8px 30px rgba(10, 10, 11, 0.06)"
      }
    }
  },
  plugins: []
};
