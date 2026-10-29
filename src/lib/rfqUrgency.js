// How long an RFQ has left, and how loudly to flag it.
export function closesIn(expiresAt, now = Date.now()) {
  const ms = new Date(expiresAt).getTime() - now;
  if (!Number.isFinite(ms) || ms <= 0) return { label: 'Closed', tone: 'closed' };
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(mins / 60);
  if (hours < 1) return { label: `Closes in ${Math.max(mins, 1)}m`, tone: 'urgent' };
  if (hours < 6) return { label: `Closes in ${hours}h`, tone: 'urgent' };
  if (hours < 24) return { label: `Closes in ${hours}h`, tone: 'soon' };
  return { label: `Closes in ${Math.floor(hours / 24)}d ${hours % 24}h`, tone: 'ok' };
}

export const URGENCY_STYLE = {
  urgent: 'bg-rose-50 text-rose-800 border-rose-200',
  soon: 'bg-cas-amberLight text-cas-amberDark border-amber-200',
  ok: 'bg-slate-50 text-cas-muted border-slate-200',
  closed: 'bg-slate-100 text-cas-muted border-slate-200',
};
