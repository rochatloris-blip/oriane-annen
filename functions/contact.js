export async function onRequest(context) {
  const { request } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { prenom, nom, entreprise, email, demande } = await request.json();

    const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f4f4f4;padding:40px 20px"><div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="background:#7c3aed;padding:24px 32px"><h1 style="color:white;font-size:20px;margin:0">Nouveau contact</h1><p style="color:#c4b5fd;font-size:14px;margin:8px 0 0 0">relationspubliques.digital</p></div><table style="width:100%;border-collapse:collapse"><tr><td style="padding:16px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;width:110px;border-bottom:1px solid #eee">Prénom</td><td style="padding:16px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">${prenom || ''}</td></tr><tr><td style="padding:16px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;width:110px;border-bottom:1px solid #eee">Nom</td><td style="padding:16px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">${nom || ''}</td></tr><tr><td style="padding:16px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;width:110px;border-bottom:1px solid #eee">Entreprise</td><td style="padding:16px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">${entreprise || ''}</td></tr><tr><td style="padding:16px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;width:110px;border-bottom:1px solid #eee">Email</td><td style="padding:16px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">${email || ''}</td></tr><tr><td style="padding:16px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;width:110px;border-bottom:1px solid #eee">Message</td><td style="padding:16px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">${demande || ''}</td></tr></table></div></body></html>`;

    const mailResp = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'oriane.annen03@gmail.com' }] }],
        from: { email: 'contact@relationspubliques.digital', name: 'Formulaire relationspubliques.digital' },
        subject: `Nouveau contact — ${prenom || ''} ${nom || ''}`,
        content: [{ type: 'text/html', value: html }],
      }),
    });

    if (!mailResp.ok) {
      const errText = await mailResp.text();
      console.error('Mailchannels error:', mailResp.status, errText);
      return new Response(JSON.stringify({ success: false }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error('Contact function error:', e);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
