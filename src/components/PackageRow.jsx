import { format3GTime, formatBytes, sizeColor, sizeLabel } from '../lib/formatters'
import { getAlternative } from '../lib/alternatives'

export default function PackageRow({ pkg, selected, onSelect }) {
  const alt = getAlternative(pkg.name)
  const tag = sizeLabel(pkg.gzip)

  if (pkg.status !== 'ok') {
    return (
      <tr style={{ borderTop: '1px solid var(--border)', background: selected ? 'rgba(124,108,240,0.06)' : 'transparent' }} onClick={() => onSelect(pkg.name)}>
        <td style={cellLeft}>{pkg.name}</td>
        <td style={cell}>—</td>
        <td style={cell}>—</td>
        <td style={cell}>—</td>
        <td style={cell}><span style={{ color: 'var(--red)' }}>{pkg.error || 'Unavailable'}</span></td>
        <td style={cell}>—</td>
      </tr>
    )
  }

  return (
    <tr style={{ borderTop: '1px solid var(--border)', background: selected ? 'rgba(124,108,240,0.06)' : 'transparent', cursor: 'pointer' }} onClick={() => onSelect(pkg.name)}>
      <td style={cellLeft}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{pkg.name}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--dim)', fontFamily: 'JetBrains Mono, monospace' }}>{pkg.version || 'latest'}</span>
        </div>
      </td>
      <td style={cell}>{formatBytes(pkg.size)}</td>
      <td style={cell}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <span style={{ color: sizeColor(pkg.gzip), fontWeight: 600 }}>{formatBytes(pkg.gzip)}</span>
          <span style={{ fontSize: '0.66rem', color: tag.color, border: `1px solid ${tag.color}33`, background: `${tag.color}12`, padding: '0.14rem 0.4rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tag.label}</span>
        </div>
      </td>
      <td style={cell}>{format3GTime(pkg.gzip)}</td>
      <td style={cell}>
        {pkg.hasSideEffects === false ? (
          <span style={goodPill}>Side-effect free</span>
        ) : pkg.hasSideEffects === true ? (
          <span style={warnPill}>Has side effects</span>
        ) : (
          <span style={mutedPill}>Unknown</span>
        )}
      </td>
      <td style={cell}>
        {alt ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
            <span style={{ color: 'var(--amber)', fontSize: '0.76rem', fontWeight: 600 }}>{alt.alt}</span>
            <span style={{ color: 'var(--dim)', fontSize: '0.68rem' }}>{alt.saving}</span>
          </div>
        ) : '—'}
      </td>
    </tr>
  )
}

const cellLeft = {
  padding: '0.9rem 1rem',
  textAlign: 'left',
  verticalAlign: 'middle',
}

const cell = {
  padding: '0.9rem 1rem',
  textAlign: 'right',
  verticalAlign: 'middle',
  color: 'var(--muted)',
  fontSize: '0.82rem',
}

const goodPill = {
  display: 'inline-flex',
  padding: '0.2rem 0.45rem',
  borderRadius: '999px',
  background: 'rgba(52,211,153,0.12)',
  border: '1px solid rgba(52,211,153,0.24)',
  color: 'var(--green)',
  fontSize: '0.72rem',
}

const warnPill = {
  display: 'inline-flex',
  padding: '0.2rem 0.45rem',
  borderRadius: '999px',
  background: 'rgba(251,191,36,0.12)',
  border: '1px solid rgba(251,191,36,0.24)',
  color: 'var(--amber)',
  fontSize: '0.72rem',
}

const mutedPill = {
  display: 'inline-flex',
  padding: '0.2rem 0.45rem',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border)',
  color: 'var(--dim)',
  fontSize: '0.72rem',
}
