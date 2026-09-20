import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest() {
  return {
    name: `${SITE_NAME} — Philippine Government Social Benefits Navigator`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f8f9fa",
    theme_color: "#0066eb",
    lang: "en",
    categories: ["government", "education", "utilities"],
    icons: [
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logos/svg/BetterGov_Icon-Primary.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      { name: "Benefits Directory", url: "/" },
      { name: "Ayuda Finder", url: "/wizard" },
      { name: "Saved Benefits", url: "/shortlist" },
      { name: "Agency Hotlines", url: "/hotlines" },
    ],
  };
}
