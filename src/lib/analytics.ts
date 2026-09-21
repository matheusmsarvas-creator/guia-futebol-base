import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_ID;
let ready = false;

/** Chame uma vez na inicialização. Sem VITE_GA_ID, o tracking fica desligado (só console em dev). */
export function initAnalytics() {
  if (!GA_ID || ready) return;
  ReactGA.initialize(GA_ID);
  ready = true;
}

export function track(name: string, params: Record<string, string | number> = {}) {
  if (import.meta.env.DEV) console.info("[ga4]", name, params);
  if (!ready) return;
  // "beacon" garante o envio mesmo se o navegador iniciar o download/navegação em seguida
  ReactGA.event(name, { ...params, transport_type: "beacon" });
}

export const events = {
  downloadEbook: (location: string) =>
    track("click_download_ebook", {
      item_name: "Guia Alimentar Futebol de Base",
      cta_location: location,
    }),
  listenSpotify: (location: string) => track("click_listen_spotify", { cta_location: location }),
  visitorProfile: (profile: string) => track("select_visitor_profile", { profile }),
};
