import DownloadButton from "./DownloadButton";
import SpotifyButton from "./SpotifyButton";

export default function Hero() {
  return (
    <section id="hero" className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-14 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
      <div>
        <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.14em] text-navy">
          <span aria-hidden className="h-[3px] w-8 rounded bg-coral" />
          Ciência aplicada à rotina
        </p>
        <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1] tracking-tight text-navy sm:text-6xl lg:text-7xl">
          Guia alimentar para famílias de{" "}
          <span className="text-coral-dark">atletas de futebol de base</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          Informação prática e baseada em ciência para apoiar jovens de 7 a 17 anos a crescer, treinar,
          recuperar e criar uma relação saudável com a comida.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <DownloadButton location="hero" className="w-full sm:w-auto" />
          <SpotifyButton location="hero" className="w-full sm:w-auto">
            Ouvir o guia
          </SpotifyButton>
        </div>
        <p className="mt-4 text-sm text-muted">PDF · gratuito · sem cadastro</p>
      </div>

      <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
        <div aria-hidden className="absolute inset-y-6 -right-4 left-8 rounded-[2rem] bg-sky" />
        <img
          src="/capa-guia.jpg"
          alt="Capa do Guia Alimentar para Famílias de Atletas de Futebol de Base"
          width={1092}
          height={1440}
          className="relative w-full rounded-xl border border-navy/10"
        />
      </div>
    </section>
  );
}
