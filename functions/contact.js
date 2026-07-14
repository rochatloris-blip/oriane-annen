const RELAY_URL = 'https://politics-perform-incidence-boating.trycloudflare.com';
const N8N_WEBHOOK = 'https://automate.hemonia.uk/webhook/oriane-contact';

export async function onRequest(context) {
  const { request } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await request.json();

    const [relayResp] = await Promise.all([
      fetch(RELAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
      fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(() => {}),
    ]);

    if (!relayResp.ok) {
      const err = await relayResp.text();
      return new Response(JSON.stringify({ success: false, error: err.substring(0, 500) }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
  }
}
