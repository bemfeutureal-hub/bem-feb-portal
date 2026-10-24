/**
 * Utility to format and clean leader display names, roles, and NIMs.
 * Prevents redundant prefixes such as "Ketua BEM FEB UTU - Ketua BEM FEB UTU - NIM ...".
 */
export function formatLeaderDisplay(
  rawName: string | undefined,
  rawRole: string | undefined,
  rawNim: string | undefined,
  defaultRole: string
) {
  let name = (rawName || '').trim();
  let role = (rawRole || defaultRole).trim();
  let nim = (rawNim || '').trim();

  if (!role) role = defaultRole;

  // Check if nim actually contains the name (e.g. "AHMAD SAIFULLLAH" or "- NIM AHMAD SAIFULLLAH")
  const nimWithoutPrefix = nim.replace(/^(?:NIM|·|-|–|—|:|\s)+/i, '').trim();
  const hasLettersInNim = /[a-zA-Z]{3,}/.test(nimWithoutPrefix);

  const isGenericName =
    !name ||
    name.toLowerCase() === role.toLowerCase() ||
    name.toLowerCase().startsWith('ketua bem') ||
    name.toLowerCase().startsWith('wakil ketua bem');

  if (isGenericName && hasLettersInNim) {
    name = nimWithoutPrefix;
    nim = '';
  }

  // Remove duplicate role prefixes if present in name
  name = name
    .replace(/^(?:Ketua|Wakil Ketua)\s+BEM\s+FEB\s+UTU\s*[-–—:]\s*/i, '')
    .trim();

  // If name has embedded "NIM ...", extract it
  const nimMatch = name.match(/NIM\s*[:\s-]?\s*([0-9A-Za-z]+)/i);
  if (nimMatch) {
    if (!nim) nim = nimMatch[1];
    name = name.replace(/[-–—:]?\s*NIM.*$/i, '').trim();
  }

  // Strip duplicate "NIM" label from nim string
  nim = nim.replace(/^NIM\s*[:\s-]?\s*/i, '').trim();

  return {
    name: name || (defaultRole.includes('Wakil') ? 'Andreansyah Nuddin' : 'Ahmad Saifullah'),
    role,
    nim,
  };
}
