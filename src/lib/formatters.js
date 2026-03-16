/**
 * Formatting helpers
 */

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// 3G speed ≈ 1.5 Mbps = 187.5 KB/s = 187500 B/s (conservative: 50KB/s)
const SPEED_3G = 50 * 1024 // 50 KB/s

export function format3GTime(gzipBytes) {
  if (!gzipBytes) return '—'
  const seconds = gzipBytes / SPEED_3G
  if (seconds < 0.1) return '<0.1s'
  if (seconds < 60) return `${seconds.toFixed(1)}s`
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
}

export function sizeColor(gzip) {
  if (!gzip || gzip === 0) return 'var(--dim)'
  if (gzip < 5 * 1024)   return 'var(--green)'   // <5KB  — great
  if (gzip < 20 * 1024)  return 'var(--teal)'    // <20KB — ok
  if (gzip < 50 * 1024)  return 'var(--amber)'   // <50KB — caution
  return 'var(--red)'                              // >50KB — heavy
}

export function sizeLabel(gzip) {
  if (!gzip || gzip === 0) return { label: 'N/A',    color: 'var(--dim)' }
  if (gzip < 5 * 1024)    return { label: 'Tiny',   color: 'var(--green)' }
  if (gzip < 20 * 1024)   return { label: 'Small',  color: 'var(--teal)' }
  if (gzip < 50 * 1024)   return { label: 'Medium', color: 'var(--amber)' }
  return                          { label: 'Heavy',  color: 'var(--red)' }
}

export function totalSize(packages) {
  return packages.filter(p => p.status === 'ok').reduce((acc, p) => ({
    size: acc.size + (p.size || 0),
    gzip: acc.gzip + (p.gzip || 0),
  }), { size: 0, gzip: 0 })
}
