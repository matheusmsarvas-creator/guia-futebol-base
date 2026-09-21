const people = ["Pais e responsáveis", "Jovens atletas", "Nutricionistas e profissionais de saúde", "Treinadores e comissões técnicas"];

export default function Audience() {
  return (
    <section id="publico" className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[.9fr_1.1fr]">
      <figure className="flex min-h-72 flex-col justify-between rounded-2xl bg-navy p-8 text-white sm:p-10">
        <blockquote className="font-display text-2xl font-bold leading-snug sm:text-3xl">
          “Pequenas escolhas hoje constroem saúde, autonomia e desempenho para toda a vida.”
        </blockquote>
        <figcaption className="mt-8 text-xs font-bold uppercase tracking-[0.1em] text-sky">
          O jovem atleta cresce dentro e fora do campo
        </figcaption>
      </figure>

      <div className="rounded-2xl border border-line bg-sky-soft p-8 sm:p-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-coral-dark">Para quem é este guia</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-navy">
          Feito para quem acompanha o atleta todos os dias
        </h2>
        <p className="mt-4 text-muted">
          Não é preciso saber calcular nutrientes. O objetivo é ajudar famílias e pessoas próximas ao jovem atleta a fazer escolhas mais seguras e possíveis.
        </p>
        <ul className="mt-6 divide-y divide-navy/10 border-y border-navy/10">
          {people.map((p) => (
            <li key={p} className="flex items-center gap-3 py-3 font-bold text-navy">
              <span aria-hidden className="size-1.5 rounded-full bg-coral" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
