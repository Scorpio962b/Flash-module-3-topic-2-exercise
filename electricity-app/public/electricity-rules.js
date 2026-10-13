// Flash wallet demo — Buy electricity rules (Module 3 · Topic 2 activity).
// Money is handled in cents to avoid floating-point errors.
const MIN_RANDS = 20;
const MAX_RANDS = 2000;

function formatZar(cents) {
  return 'R' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function evaluatePurchase(balanceCents, meterNumber, amountText) {
  const fail = (message) => ({ result: 'error', message, balanceCents });
  if (!/^\d{11}$/.test(meterNumber)) return fail('Enter a valid 11-digit meter number');
  if (!/^\d+$/.test(amountText)) return fail('Enter a whole rand amount');
  const rands = Number(amountText);
  if (rands < MIN_RANDS || rands > MAX_RANDS) return fail(`Electricity amount must be between R${MIN_RANDS} and R${MAX_RANDS}`);
  const amountCents = rands * 100;
  if (amountCents > balanceCents) return fail('Not enough funds in your Flash wallet');
  return { result: 'success', message: 'Electricity purchased', balanceCents: balanceCents - amountCents, amountCents };
}

module.exports = { formatZar, evaluatePurchase };
