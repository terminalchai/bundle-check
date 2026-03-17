import { format3GTime, formatBytes, sizeColor, sizeLabel } from '../lib/formatters'
import { getAlternative } from '../lib/alternatives'

export default function PackageRow({ pkg, selected, onSelect, maxGzip }) {
  const alt = getAlternative(pkg.name)
  const tag = sizeLabel(pkg.gzip)
  const gzipWidth = `${Math.max(((pkg.gzip || 0) / maxGzip) * 100, 8)}%`

  if (pkg.status !== 'ok') {
    return (
      <tr style={{ borderTop: '1px solid var(--border)', background: selected ? 'rgba(124,108,240,0.08)' : 'transparent' }}>
        <td style={cellLeft}>
          <button type="button" onClick={() => onSelect(pkg.name)} aria-pressed={selected} aria-label={`Select ${pkg.name}`} style={nameButton}>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '0.24rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{pkg.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--dim)', fontFamily: 'JetBrains Mono, monospace' }}>{pkg.version || 'latest'}</span>
            </span>
          </button>
        </td>
        <td style={cell}>—</td>
        <td style={cell}>—</td>
        <td style={cell}>—</td>
        <td style={cell}><span style={{ color: 'var(--red)' }}>{pkg.error || 'Unavailable'}</span></td>
        <td style={cell}>—</td>
      </tr>
    )
  }

  return (
    <tr style={{ borderTop: '1px solid var(--border)', background: selected ? 'rgba(124,108,240,0.08)' : 'transparent' }}>
      <td style={cellLeft}>
        <button type="button" onClick={() => onSelect(pkg.name)} aria-pressed={selected} aria-label={`Select ${pkg.name}`} style={nameButton}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>{pkg.name}</span>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--dim)', fontFamily: 'JetBrains Mono, monospace' }}>{pkg.version || 'latest'}</span>
              <span style={metaPill}>{pkg.dependencyCount || 0} deps</span>
            </span>
          </span>
        </button>
      </td>
      <td style={cellStrong}>{formatBytes(pkg.size)}</td>
      <td style={cell}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'stretch', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
            <span style={{ color: sizeColor(pkg.gzip), fontWeight: 700 }}>{formatBytes(pkg.gzip)}</span>
            <span style={{ fontSize: '0.66rem', color: tag.color, border: `1px solid ${tag.color}33`, background: `${tag.color}12`, padding: '0.14rem 0.4rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tag.label}</span>
          </div>
          <div style={barTrack}>
            <span style={{ ...barFill, width: gzipWidth, background: `linear-gradient(90deg, ${sizeColor(pkg.gzip)}, rgba(124,108,240,0.9))` }} />
          </div>
        </div>
      </td>
      <td style={cellStrong}>{format3GTime(pkg.gzip)}</td>
      <td style={cell}>
        {pkg.hasSideEffects === false ? (
          <span style={goodPill}>Side-effect free</span>
        ) : pkg.hasSideEffects === true ? (
          <span style={warnPill}>Has side effects</span>
        ) : (
          <span style={mutedPill}>Unknown</span>
        )}
      </td>
      <td style={cellAlt}>
        {alt ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.26rem' }}>
            <span style={{ color: 'var(--amber)', fontSize: '0.76rem', fontWeight: 600, lineHeight: 1.45 }}>{alt.alt}</span>
            <span style={{ color: 'var(--dim)', fontSize: '0.68rem' }}>{alt.saving}</span>
          </div>
        ) : <span style={{ color: 'var(--dim)' }}>—</span>}
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

const cellStrong = {
  ...cell,
  color: 'var(--text)',
  fontWeight: 600,
}

const cellAlt = {
  ...cell,
  textAlign: 'left',
}

const nameButton = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
}

const metaPill = {
  display: 'inline-flex',
  padding: '0.16rem 0.38rem',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  color: 'var(--dim)',
  fontSize: '0.65rem',
}

const barTrack = {
  width: '100%',
  height: '0.42rem',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.05)',
  overflow: 'hidden',
}

const barFill = {
  display: 'block',
  height: '100%',
  borderRadius: '999px',
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
