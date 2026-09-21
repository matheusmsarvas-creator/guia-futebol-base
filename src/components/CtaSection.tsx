import { useState } from "react";
import DownloadButton from "./DownloadButton";
import SpotifyButton from "./SpotifyButton";
import { events } from "../lib/analytics";

const profiles = [
  { id: "familia", label: "Família" },
  { id: "atleta", label: "Atleta" },
  { id: "nutricionista", label: "Nutricionista / saúde" },
  { id: "comissao", label: "Comissão técnica" },
  { id: "outro", label: "Outro" },
];

export default function CtaSection() {
  const [profile, setProfile] = useState<string | null>(null);

  return (
    <section id="baixar" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
      <div className="grid gap-8 rounded-2xl bg-navy p-8 text-white sm:p-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#FF9A86]">Acesso gratuito</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Leve o guia com você</h2>
          <p className="mt-3 max-w-xl text-[#D9E8F2]">
            Baixe o e-book completo em PDF para ler no celular, imprimir ou compartilhar com quem cuida do atleta.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:min-w-64">
          <DownloadButton location="cta_section" variant="onDark" />
          <SpotifyButton location="cta_section" variant="onDark" />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-navy/10 bg-white p-6">
        <h3 className="font-bold text-navy">Quem está acessando este material?</h3>
        <p className="mt-1 text-sm text-muted">Resposta opcional e anônima. Nenhum nome, e-mail ou dado pessoal é solicitado.</p>
        <div role="group" aria-label="Perfil do visitante" className="mt-4 flex flex-wrap gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={profile === p.id}
              onClick={() => {
                setProfile(p.id);
                events.visitorProfile(p.id);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                profile === p.id ? "border-navy bg-navy text-white" : "border-line bg-sky-soft text-navy hover:border-navy"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p role="status" className="mt-3 min-h-5 text-sm font-semibold text-navy">
          {profile && "Obrigado! Isso nos ajuda a entender o alcance do projeto."}
        </p>
      </div>
    </section>
  );
}
