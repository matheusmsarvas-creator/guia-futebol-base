const topics = [
  { title: "Alimentação", text: "Como organizar refeições e lanches, sem dietas rígidas nem alimentos “proibidos”." },
  { title: "Hidratação", text: "Água, suor, calor, isotônicos e sinais que merecem atenção." },
  { title: "Energia e carboidratos", text: "Combustível para treinar, jogar, recuperar e continuar crescendo." },
  { title: "Sono e recuperação", text: "O descanso como parte do treinamento e do desenvolvimento do jovem atleta." },
  { title: "Suplementos", text: "O que a ciência realmente mostra e quando um produto pode ou não fazer sentido." },
  { title: "Seletividade alimentar", text: "Estratégias realistas para ampliar o repertório sem transformar a refeição em conflito." },
];

export default function Features() {
  return (
    <section id="conteudos" className="bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-coral-dark">O que você encontra</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Nutrição esportiva explicada sem complicar
          </h2>
          <p className="mt-4 text-lg text-muted">
            Os temas que mais aparecem na rotina das famílias, em linguagem acessível e focados no que realmente faz diferença.
          </p>
        </div>

        <ol className="border-t border-navy/15">
          {topics.map((t, i) => (
            <li key={t.title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-navy/15 py-6 sm:grid-cols-[4rem_14rem_1fr]">
              <span className="font-display text-sm font-bold text-coral-dark">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-xl font-bold text-navy">{t.title}</h3>
              <p className="col-start-2 mt-1 text-[15px] text-muted sm:col-start-3 sm:mt-0">{t.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
