import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette principale
        grenat: "#800000",      // Couleur du club
        blanc: "#FFFFFF",       // Texte / cartes
        argent: "#C0C0C0",     // Accent dynamique
        grisclair: "#F5F5F5",  // Hover / fond léger
        roseclair: "#F8E4E4",  // Accent secondaire subtil

        // Garder tes couleurs dynamiques existantes si nécessaire
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "Montserrat", "sans-serif"],
      },
      borderRadius: {
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        card: "0 4px 10px rgba(0,0,0,0.08)",
        cardHover: "0 8px 20px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
