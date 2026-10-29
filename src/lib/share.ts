export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}
export function listUrl() { return `${window.location.origin}${window.location.pathname}` }
