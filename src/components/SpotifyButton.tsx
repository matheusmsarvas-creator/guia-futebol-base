import { useState, type ReactNode } from "react";
import { SPOTIFY_URL } from "../lib/config";
import { events } from "../lib/analytics";

type Props = {
  location: string;
  variant?: "ghost" | "onDark";
  className?: string;
  children?: ReactNode;
};

const styles = {
  ghost: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
  onDark: "border-2 border-white/70 text-white hover:bg-white hover:text-navy",
};

/** Botão secundário "Ouvir no Spotify". Sem VITE_SPOTIFY_URL, avisa que o link ainda não está disponível. */
export default function SpotifyButton({ location, variant = "ghost", className = "", children }: Props) {
  const [pending, setPending] = useState(false);

  return (
    <span className={`flex flex-col ${className}`}>
      <a
        href={SPOTIFY_URL || "#baixar"}
        {...(SPOTIFY_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={(e) => {
          events.listenSpotify(location);
          if (!SPOTIFY_URL) {
            e.preventDefault();
            setPending(true);
          }
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-[15px] font-extrabold transition-colors ${styles[variant]}`}
      >
        {children ?? "Ouvir no Spotify"}
      </a>
      <span role="status" className={`mt-1 text-xs ${variant === "onDark" ? "text-sky" : "text-muted"}`}>
        {pending && "Link do Spotify ainda não configurado."}
      </span>
    </span>
  );
}
