export default function Footer() {
  return (
    <footer className="border-t border-navy/10 pb-24 pt-10 md:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="font-extrabold text-navy">Guia Alimentar para Famílias de Atletas de Futebol de Base</p>
          <p className="mt-2 text-sm text-muted">
            Material educativo que aproxima ciência, alimentação e rotina familiar no futebol de base. Não substitui a avaliação individual de profissionais de saúde.
          </p>
        </div>
        <p className="font-display text-sm font-bold text-navy md:text-right">
          Nutrir o presente.
          <br />
          Construir o futuro.
        </p>
      </div>
    </footer>
  );
}
