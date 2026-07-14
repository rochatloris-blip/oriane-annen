const N8N_WEBHOOK = 'https://automate.hemonia.uk/webhook/oriane-contact';

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await request.json();

    const emailBody = `
Nouveau message depuis le site relationspubliques.digital

Nom: ${body.name || 'Non renseigne'}
Email: ${body.email || 'Non renseigne'}
Telephone: ${body.phone || 'Non renseigne'}
Societe: ${body.company || 'Non renseigne'}

Message:
${body.message || 'Non renseigne'}
    `.trim();

    const [resendResp] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'contact@relationspubliques.digital',
          to: ['oriane.annen03@gmail.com'],
          subject: `Nouveau contact depuis relationspubliques.digital - ${body.name || 'Anonyme'}`,
          text: emailBody,
        }),
      }),
      fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(() => {}),
    ]);

    if (!resendResp.ok) {
      const err = await resendResp.text();
      return new Response(JSON.stringify({ success: false, error: err.substring(0, 500) }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
  }
}
