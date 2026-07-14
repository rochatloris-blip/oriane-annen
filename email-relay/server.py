#!/usr/bin/env python3
import json, smtplib, ssl
from http.server import HTTPServer, BaseHTTPRequestHandler

SMTP_HOST = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USER = 'oriane.annen03@gmail.com'
SMTP_PASS = 'buaq tnsp vprk dvvg'
TO_EMAIL = 'oriane.annen03@gmail.com'
FROM_EMAIL = 'oriane.annen03@gmail.com'

class Handler(BaseHTTPRequestHandler):
  def do_OPTIONS(self):
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    self.end_headers()

  def do_POST(self):
    length = int(self.headers.get('Content-Length', 0))
    raw = self.rfile.read(length)
    try:
      data = json.loads(raw)
    except Exception:
      self._respond(400, {'error': 'invalid json'})
      return

    prenom = data.get('prenom', '')
    nom = data.get('nom', '')
    entreprise = data.get('entreprise', '')
    email = data.get('email', '')
    demande = data.get('demande', '')

    subject = f'Nouveau contact — {prenom} {nom}'
    body = f'''<!DOCTYPE html>
<html><body style="font-family:sans-serif;background:#f4f4f4;padding:40px 20px">
<div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
<div style="background:#7c3aed;padding:24px 32px">
<h1 style="color:white;font-size:20px;margin:0">Nouveau contact</h1>
<p style="color:#c4b5fd;font-size:14px;margin:8px 0 0 0">relationspubliques.digital</p>
</div>
<table style="width:100%;border-collapse:collapse">
<tr><td style="padding:12px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;border-bottom:1px solid #eee">Prenom</td><td style="padding:12px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">{prenom}</td></tr>
<tr><td style="padding:12px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;border-bottom:1px solid #eee">Nom</td><td style="padding:12px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">{nom}</td></tr>
<tr><td style="padding:12px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;border-bottom:1px solid #eee">Entreprise</td><td style="padding:12px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">{entreprise}</td></tr>
<tr><td style="padding:12px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;border-bottom:1px solid #eee">Email</td><td style="padding:12px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">{email}</td></tr>
<tr><td style="padding:12px 32px;background:#fafafa;font-weight:600;color:#666;font-size:13px;border-bottom:1px solid #eee">Message</td><td style="padding:12px 32px;border-bottom:1px solid #eee;color:#333;font-size:14px">{demande}</td></tr>
</table>
</div></body></html>'''

    message = f'''From: {FROM_EMAIL}
To: {TO_EMAIL}
Subject: {subject}
MIME-Version: 1.0
Content-Type: text/html; charset="utf-8"

{body}'''

    try:
      ctx = ssl.create_default_context()
      s = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15)
      s.starttls(context=ctx)
      s.login(SMTP_USER, SMTP_PASS)
      s.sendmail(FROM_EMAIL, [TO_EMAIL], message.encode('utf-8'))
      s.quit()
      print(f'Email sent: {prenom} {nom}')
      self._respond(200, {'success': True})
    except Exception as e:
      print(f'SMTP error: {e}')
      self._respond(500, {'success': False, 'error': str(e)})

  def _respond(self, status, data):
    self.send_response(status)
    self.send_header('Content-Type', 'application/json')
    self.send_header('Access-Control-Allow-Origin', '*')
    self.end_headers()
    self.wfile.write(json.dumps(data).encode('utf-8'))

  def log_message(self, format, *args):
    print(f'[relay] {args[0]} {args[1]} {args[2]}')

if __name__ == '__main__':
  port = 8825
  server = HTTPServer(('0.0.0.0', port), Handler)
  print(f'SMTP relay listening on http://0.0.0.0:{port}')
  server.serve_forever()
