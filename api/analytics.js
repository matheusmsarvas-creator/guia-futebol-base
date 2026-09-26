// Vercel serverless function: consulta a GA4 Data API (Google Analytics) usando
// uma service account e devolve contagens dos eventos personalizados do site.
//
// Variáveis de ambiente necessárias (configurar no projeto Vercel):
//   GA_PROPERTY_ID        -> ID numérico da propriedade GA4 (Admin > Detalhes da propriedade)
//   GA_CLIENT_EMAIL       -> e-mail da service account (Google Cloud, com acesso "Leitor" na propriedade GA4)
//   GA_PRIVATE_KEY        -> chave privada da service account (com \n literais ou já com quebras de linha)
//   DASHBOARD_TOKEN       -> senha simples para proteger o /dashboard (opcional, mas recomendado)
//
// Sem essas variáveis configuradas, o endpoint responde 501 explicando o que falta,
// para o /dashboard mostrar uma mensagem clara em vez de dar erro genérico.

const TRACKED_EVENTS = ["click_download_ebook", "click_listen_spotify", "select_visitor_profile"];

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(clientEmail, privateKey) {
  const crypto = await import("node:crypto");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey.replace(/\\n/g, "\n"));
  const jwt = `${unsigned}.${base64url(signature).replace(/\+/g, "-").replace(/\//g, "_")}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Falha ao autenticar com o Google (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  const { GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY, DASHBOARD_TOKEN } = process.env;

  if (DASHBOARD_TOKEN && req.headers["x-dashboard-token"] !== DASHBOARD_TOKEN) {
    res.status(401).json({ error: "Não autorizado. Informe o token do dashboard." });
    return;
  }

  if (!GA_PROPERTY_ID || !GA_CLIENT_EMAIL || !GA_PRIVATE_KEY) {
    res.status(501).json({
      error: "GA4 não configurado no servidor.",
      missing: ["GA_PROPERTY_ID", "GA_CLIENT_EMAIL", "GA_PRIVATE_KEY"].filter((k) => !process.env[k]),
      hint: "Crie uma service account no Google Cloud com acesso de leitor na propriedade GA4 e configure as variáveis de ambiente no Vercel.",
    });
    return;
  }

  try {
    const accessToken = await getAccessToken(GA_CLIENT_EMAIL, GA_PRIVATE_KEY);
    const days = Math.min(Math.max(Number(req.query?.days) || 30, 1), 90);

    const report = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "date" }, { name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: { values: TRACKED_EVENTS },
          },
        },
        orderBys: [{ dimension: { dimensionName: "date" } }],
        limit: 10000,
      }),
    });

    if (!report.ok) {
      res.status(502).json({ error: `GA4 respondeu ${report.status}`, detail: await report.text() });
      return;
    }

    const json = await report.json();
    const rows = (json.rows || []).map((r) => ({
      date: r.dimensionValues[0].value,
      eventName: r.dimensionValues[1].value,
      count: Number(r.metricValues[0].value),
    }));

    const totals = TRACKED_EVENTS.reduce((acc, name) => {
      acc[name] = rows.filter((r) => r.eventName === name).reduce((s, r) => s + r.count, 0);
      return acc;
    }, {});

    res.status(200).json({ days, rows, totals, trackedEvents: TRACKED_EVENTS });
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar a GA4 Data API.", detail: String(err?.message || err) });
  }
}
