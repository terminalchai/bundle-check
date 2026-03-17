import { formatBytes } from '../lib/formatters'

export default function SummaryBar({ packages }) {
  const ok = packages.filter(p => p.status === 'ok')
  const failed = packages.filter(p => p.status !== 'ok').length
  const totalGzip = ok.reduce((sum, p) => sum + (p.gzip || 0), 0)
  const totalRaw  = ok.reduce((sum, p) => sum + (p.size || 0), 0)
  const sideFree  = ok.filter(p => p.hasSideEffects === false).length
  const heavy     = ok.filter(p => (p.gzip || 0) > 50 * 1024).length

  const cards = [
    { label: 'Packages analysed', value: ok.length, note: 'Dependencies successfully priced', tone: 'var(--violet-hi)' },
    { label: 'Total raw size', value: formatBytes(totalRaw), note: 'Uncompressed install weight', tone: 'var(--teal)' },
    { label: 'Total gzip size', value: formatBytes(totalGzip), note: 'Closer to shipped network cost', tone: 'var(--amber)' },
    { label: 'Side-effect free', value: `${sideFree}/${ok.length || 0}`, note: 'Good sign for tree-shaking', tone: 'var(--green)' },
    { label: 'Heavy packages', value: heavy, note: 'Packages above 50 KB gzip', tone: 'var(--red)' },
    { label: 'Unavailable', value: failed, note: 'Missing or unsupported packages', tone: 'var(--dim)' },
  ]

  return (
    <section aria-label="Analysis summary" className="summary-grid">
      {cards.map(card => (
        <div key={card.label} className="summary-card" style={{ '--summary-accent': card.tone }}>
          <div className="summary-accent" />
          <div style={{ fontSize: '0.74rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{card.label}</div>
          <div style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 700, marginBottom: '0.35rem' }}>{card.value}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{card.note}</div>
        </div>
      ))}
    </section>
  )
}
