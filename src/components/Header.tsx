import DownloadButton from "./DownloadButton";

const links = [
  { href: "#conteudos", label: "Conteúdo" },
  { href: "#publico", label: "Para quem" },
  { href: "#baixar", label: "Baixar" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-navy">
          <span aria-hidden className="size-2.5 rounded-full bg-coral" />
          Guia Alimentar <span className="hidden sm:inline">• Futebol de Base</span>
        </a>
        <nav aria-label="Principal" className="flex items-center gap-6">
          {links.slice(0, 2).map((l) => (
            <a key={l.href} href={l.href} className="hidden text-sm font-bold text-muted hover:text-navy md:block">
              {l.label}
            </a>
          ))}
          <DownloadButton location="header" className="!px-4 !py-2 !text-sm">
            Baixar grátis
          </DownloadButton>
        </nav>
      </div>
    </header>
  );
}
