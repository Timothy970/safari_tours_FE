import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kibali Africa Official Logo Brand Palette
        "kibali-green": {
          DEFAULT: "#15803D", // Rich Forest / Safari Green from Logo ring & title
          dark: "#14532D",
          deep: "#0D3D1A",
          light: "#22C55E",
          subtle: "#DCFCE7",
          50: "#F0FDF4",
          100: "#DCFCE7",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        "kibali-navy": {
          DEFAULT: "#0F1D36", // Aviation Midnight Navy from Logo aircraft silhouette
          dark: "#0B1528",
          deep: "#070E1B",
          light: "#1E293B",
          subtle: "#F1F5F9",
          50: "#F8FAFC",
          100: "#F1F5F9",
          700: "#334155",
          800: "#1E293B",
          900: "#0F1D36",
        },
        "kibali-gold": {
          DEFAULT: "#D97706", // Safari Sunburst / Warm Amber Gold
          dark: "#B45309",
          light: "#F59E0B",
          accent: "#D4AF37",
          subtle: "#FEF3C7",
        },
        "kibali-cream": {
          DEFAULT: "#FCFBF9",
          dark: "#F5F2EB",
          dim: "#EBE6DC",
        },

        // Legacy compatibility aliases with enhanced contrast
        "bone-surface": "#F5F2EB",
        "bone": "#FCFBF9",
        "surface": "#FCFBF9",
        "surface-dim": "#E5E0D6",
        "surface-bright": "#FCFBF9",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F8F6F0",
        "surface-container": "#F4F0E8",
        "surface-container-high": "#EDE7DC",
        "surface-container-highest": "#E4DDD0",
        "surface-variant": "#E4DDD0",
        "surface-tint": "#15803D",

        "burnt-umber": "#0F1D36", // Migrated to Aviation Navy for premium aesthetic
        "deep-ochre": "#D97706",
        "deep-forest": "#14532D",
        "impact-gold": "#D97706",
        "sand": "#EBE6DC",
        "charcoal": "#0F172A",

        "primary": "#15803D",
        "primary-container": "#14532D",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#DCFCE7",
        "primary-fixed": "#DCFCE7",
        "primary-fixed-dim": "#BBF7D0",
        "on-primary-fixed": "#14532D",

        "secondary": "#0F1D36",
        "secondary-container": "#1E293B",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#E2E8F0",

        "tertiary": "#D97706",
        "tertiary-container": "#B45309",
        "on-tertiary": "#FFFFFF",
        "on-tertiary-container": "#FEF3C7",

        "on-surface": "#0F172A",
        "on-surface-variant": "#334155",
        "inverse-surface": "#0F1D36",
        "inverse-on-surface": "#FCFBF9",
        "outline": "#64748B",
        "outline-variant": "#CBD5E1",
      },
      fontFamily: {
        serif: ["var(--font-libre-caslon)", "Libre Caslon Text", "Georgia", "serif"],
        sans: ["var(--font-hanken-grotesk)", "Hanken Grotesk", "sans-serif"],
        display: ["var(--font-libre-caslon)", "Libre Caslon Text", "serif"],
        "body-md": ["var(--font-hanken-grotesk)", "Hanken Grotesk", "sans-serif"],
        "body-lg": ["var(--font-hanken-grotesk)", "Hanken Grotesk", "sans-serif"],
        "label-caps": ["var(--font-hanken-grotesk)", "Hanken Grotesk", "sans-serif"],
        "numeric-data": ["var(--font-hanken-grotesk)", "Hanken Grotesk", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-lg-mobile": ["40px", { lineHeight: "1.2", fontWeight: "400" }],
        "headline-xl": ["48px", { lineHeight: "1.2", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "1.3", fontWeight: "400" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.3", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "600" }],
        "numeric-data": ["24px", { lineHeight: "1.0", fontWeight: "300" }],
      },
      spacing: {
        "margin-lg": "5rem",
        "margin-md": "2.5rem",
        "margin-sm": "1rem",
        "bento-gap": "1rem",
        gutter: "1.5rem",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
