import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { format3GTime, formatBytes, sizeColor } from '../lib/formatters'
import { squarify } from '../lib/treemap'

const WIDTH = 720
const HEIGHT = 420

export default function Treemap({ packages, selected, onSelect }) {
  const nodes = useMemo(() => {
    const ok = packages.filter(p => p.status === 'ok' && p.gzip > 0)
    return squarify(
      ok.map(pkg => ({ ...pkg, value: pkg.gzip })),
      0,
      0,
      WIDTH,
      HEIGHT,
    )
  }, [packages])

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1rem' }}>
      <div style={{ fontSize: '0.74rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
        Treemap by gzip size
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
        Click a block to highlight the same package in the table, or use the package buttons below the chart for keyboard navigation.
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" style={{ display: 'block', borderRadius: '0.75rem', background: 'var(--surface2)' }} role="img" aria-label="Package treemap by gzip size">
        {nodes.map((node, i) => {
          const isActive = selected === node.name
          const showText = node.w > 110 && node.h > 48
          return (
            <motion.g
              key={node.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.015 }}
              onClick={() => onSelect(node.name)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(node.name)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Select ${node.name} in treemap`}
              aria-pressed={isActive}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={node.x + 2}
                y={node.y + 2}
                width={Math.max(node.w - 4, 0)}
                height={Math.max(node.h - 4, 0)}
                rx="12"
                fill={isActive ? 'rgba(124,108,240,0.28)' : `${sizeColor(node.gzip)}22`}
                stroke={isActive ? 'rgba(124,108,240,0.9)' : `${sizeColor(node.gzip)}66`}
                strokeWidth={isActive ? 2.5 : 1}
              />
              {showText && (
                <>
                  <text x={node.x + 12} y={node.y + 22} fill="rgba(255,255,255,0.95)" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">
                    {truncate(node.name, Math.max(10, Math.floor(node.w / 10)))}
                  </text>
                  <text x={node.x + 12} y={node.y + 40} fill="rgba(255,255,255,0.68)" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    {formatBytes(node.gzip)} gzip
                  </text>
                  {node.h > 68 && (
                    <text x={node.x + 12} y={node.y + 56} fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="Inter, sans-serif">
                      {format3GTime(node.gzip)} on 3G
                    </text>
                  )}
                </>
              )}
              <title>{`${node.name} — ${formatBytes(node.gzip)} gzip — ${format3GTime(node.gzip)} on 3G`}</title>
            </motion.g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.875rem' }}>
        {nodes.slice(0, 8).map(node => (
          <button
            key={node.name}
            type="button"
            onClick={() => onSelect(node.name)}
            className={`ghost-toggle ${selected === node.name ? 'active' : ''}`}
            aria-pressed={selected === node.name}
            style={{ textTransform: 'none', letterSpacing: 'normal' }}
          >
            {node.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function truncate(text, len) {
  return text.length > len ? `${text.slice(0, len - 1)}…` : text
}
