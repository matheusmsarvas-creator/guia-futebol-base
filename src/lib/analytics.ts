declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(name: string, params: Record<string, string | number> = {}) {
  if (import.meta.env.DEV) console.info("[ga4]", name, params);
  // `gtag` é definido de forma síncrona no index.html (o shim empurra pra dataLayer
  // mesmo antes do script do Google carregar), então é seguro chamar direto.
  window.gtag?.("event", name, { ...params, transport_type: "beacon" });
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
