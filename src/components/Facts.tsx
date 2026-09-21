const facts = [
  { title: "7–17 anos", text: "Da iniciação esportiva à adolescência" },
  { title: "Família primeiro", text: "Orientações para decisões reais do dia a dia" },
  { title: "Base científica", text: "Construído a partir de diretrizes e consensos" },
];

export default function Facts() {
  return (
    <div className="border-y border-navy/10">
      <dl className="mx-auto grid max-w-6xl divide-y divide-navy/10 px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
        {facts.map((f) => (
          <div key={f.title} className="py-6 md:px-8 md:first:pl-0 md:last:pr-0">
            <dt className="font-display text-2xl font-extrabold text-navy">{f.title}</dt>
            <dd className="mt-1 text-sm text-muted">{f.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
