import { useEffect, useState } from "react";
import DownloadButton from "./DownloadButton";

/** Barra de CTA fixa no mobile: aparece após rolar o hero e some ao chegar na seção de download. */
export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const cta = document.getElementById("baixar");
    if (!hero || !cta) return;
    let heroGone = false;
    let ctaInView = false;
    const update = () => setVisible(heroGone && !ctaInView);
    const heroObs = new IntersectionObserver(([e]) => {
      heroGone = !e.isIntersecting;
      update();
    });
    const ctaObs = new IntersectionObserver(([e]) => {
      ctaInView = e.isIntersecting;
      update();
    });
    heroObs.observe(hero);
    ctaObs.observe(cta);
    return () => {
      heroObs.disconnect();
      ctaObs.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-cream/95 p-3 backdrop-blur transition-transform md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <DownloadButton location="sticky_mobile" className="w-full" />
    </div>
  );
}
