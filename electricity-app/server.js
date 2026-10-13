// Flash wallet demo — Buy electricity page + JSON API: node electricity-app/server.js
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { formatZar, evaluatePurchase } = require('./public/electricity-rules');

const PORT = 3002;
const accounts = new Map(); // accountId -> { balanceCents, purchases: [] }
let nextAccount = 1;
let nextToken = 1;

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { resolve({}); } });
  });
}

function makeToken() {
  const digits = String(nextToken++).padStart(20, '0');
  return digits.match(/.{4}/g).join('-');
}

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && pathname === '/electricity') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(__dirname, 'public', 'electricity.html')).pipe(res);
  }

  if (req.method === 'POST' && pathname === '/api/accounts') {
    const body = await readJson(req);
    const balanceCents = Math.round(Number.parseFloat(body.startingBalance ?? '500.00') * 100);
    const accountId = `A-${String(nextAccount++).padStart(4, '0')}`;
    accounts.set(accountId, { balanceCents, purchases: [] });
    return send(res, 201, { accountId, balance: formatZar(balanceCents) });
  }

  const match = pathname.match(/^\/api\/accounts\/([^/]+)(\/electricity|\/purchases)?$/);
  const account = match && accounts.get(match[1]);
  if (match && !account) return send(res, 404, { message: 'Account not found' });

  if (match && !match[2] && req.method === 'GET') {
    return send(res, 200, { accountId: match[1], balance: formatZar(account.balanceCents) });
  }

  if (match && match[2] === '/purchases' && req.method === 'GET') return send(res, 200, account.purchases);

  if (match && match[2] === '/electricity' && req.method === 'POST') {
    const body = await readJson(req);
    const outcome = evaluatePurchase(account.balanceCents, String(body.meterNumber ?? ''), String(body.amount ?? ''));
    if (outcome.result === 'error') {
      return send(res, 422, { result: 'error', message: outcome.message, balance: formatZar(account.balanceCents) });
    }
    account.balanceCents = outcome.balanceCents;
    const token = makeToken();
    account.purchases.push({ token, meterNumber: body.meterNumber, amount: formatZar(outcome.amountCents) });
    return send(res, 201, { result: 'success', message: outcome.message, token, balance: formatZar(account.balanceCents) });
  }

  send(res, 404, { message: 'Not found' });
}).listen(PORT, () => console.log(`Flash electricity demo on http://localhost:${PORT}/electricity?account=<id>`));
