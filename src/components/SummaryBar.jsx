import { formatBytes } from '../lib/formatters'

export default function SummaryBar({ packages }) {
  const ok = packages.filter(p => p.status === 'ok')
  const totalGzip = ok.reduce((sum, p) => sum + (p.gzip || 0), 0)
  const totalRaw  = ok.reduce((sum, p) => sum + (p.size || 0), 0)
  const sideFree  = ok.filter(p => p.hasSideEffects === false).length
  const heavy     = ok.filter(p => (p.gzip || 0) > 50 * 1024).length

  const cards = [
    { label: 'Packages analysed', value: ok.length },
    { label: 'Total raw size', value: formatBytes(totalRaw) },
    { label: 'Total gzip size', value: formatBytes(totalGzip) },
    { label: 'Side-effect free', value: `${sideFree}/${ok.length || 0}` },
    { label: 'Heavy packages', value: heavy },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
      {cards.map(card => (
        <div key={card.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{card.label}</div>
          <div style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 700 }}>{card.value}</div>
        </div>
      ))}
    </div>
  )
}
