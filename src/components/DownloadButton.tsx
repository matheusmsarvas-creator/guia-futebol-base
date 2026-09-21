import type { ReactNode } from "react";
import { EBOOK_FILENAME, EBOOK_URL } from "../lib/config";
import { events } from "../lib/analytics";

type Props = {
  /** Onde o botão está na página; vai como parâmetro no evento GA4 */
  location: string;
  variant?: "primary" | "ghost" | "onDark";
  className?: string;
  children?: ReactNode;
};

const styles = {
  primary: "bg-coral text-white hover:bg-coral-dark",
  ghost: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
  onDark: "bg-coral text-white hover:bg-white hover:text-navy",
};

const isExternal = /^https?:\/\//.test(EBOOK_URL);

/** Único ponto de disparo de `click_download_ebook` e do download do arquivo. */
export default function DownloadButton({ location, variant = "primary", className = "", children }: Props) {
  return (
    <a
      href={EBOOK_URL}
      // `download` só funciona para arquivos do mesmo domínio; links externos abrem em nova aba
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : { download: EBOOK_FILENAME })}
      onClick={() => events.downloadEbook(location)}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-[15px] font-extrabold transition-colors ${styles[variant]} ${className}`}
    >
      {children ?? "Baixar o e-book grátis"}
      <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13.5h11" />
      </svg>
    </a>
  );
}
