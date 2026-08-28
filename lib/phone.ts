export function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

// Drops a leading US country code so "+17133675363", "17133675363", and
// "7133675363" all normalize to the same thing.
function stripCountryCode(d: string) {
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}

// Caller ID and manually-typed numbers rarely match a stored lead's
// formatting exactly ("(713) 367-5363" vs "7133675363"), so compare on
// digits only and allow either side to be a substring of the other.
export function phoneMatches(leadPhone: string | undefined, query: string) {
  if (!leadPhone) return false;
  const q = stripCountryCode(digitsOnly(query));
  if (!q) return false;
  const p = stripCountryCode(digitsOnly(leadPhone));
  return p.includes(q) || q.includes(p);
}
