// Vercel serverless function: consulta o runRealtimeReport da GA4 Data API.
// Reflete eventos dos últimos ~30 minutos quase na hora (diferente do runReport,
// que demora horas para consolidar). Usa as mesmas env vars de api/analytics.js.

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
    res.status(501).json({ error: "GA4 não configurado no servidor." });
    return;
  }

  try {
    const accessToken = await getAccessToken(GA_CLIENT_EMAIL, GA_PRIVATE_KEY);

    const report = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runRealtimeReport`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", inListFilter: { values: TRACKED_EVENTS } },
        },
        minuteRanges: [{ startMinutesAgo: 29, endMinutesAgo: 0 }],
      }),
    });

    if (!report.ok) {
      res.status(502).json({ error: `GA4 respondeu ${report.status}`, detail: await report.text() });
      return;
    }

    const json = await report.json();
    const totals = TRACKED_EVENTS.reduce((acc, name) => {
      acc[name] = 0;
      return acc;
    }, {});
    for (const r of json.rows || []) {
      const name = r.dimensionValues[0].value;
      totals[name] = (totals[name] || 0) + Number(r.metricValues[0].value);
    }

    res.status(200).json({ totals, trackedEvents: TRACKED_EVENTS, windowMinutes: 30 });
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar o Realtime da GA4 Data API.", detail: String(err?.message || err) });
  }
}
