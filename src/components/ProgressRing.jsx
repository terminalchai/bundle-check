import { motion } from 'framer-motion'

export default function ProgressRing({ completed, total }) {
  const radius = 42
  const stroke = 7
  const normalized = radius - stroke * 0.5
  const circumference = normalized * 2 * Math.PI
  const progress = total ? completed / total : 0
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} aria-live="polite" aria-atomic="true">
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="48" cy="48" r={normalized} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
          <motion.circle
            cx="48"
            cy="48"
            r={normalized}
            fill="none"
            stroke="url(#grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.35 }}
            style={{ strokeDashoffset }}
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="96" y2="96">
              <stop stopColor="#7c6cf0" />
              <stop offset="1" stopColor="#9d91ff" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>{completed}/{total}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>done</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem' }}>
          Analysing dependencies...
        </div>
        <div style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>
          Fetching live package size data from Bundlephobia. {completed} of {total} completed.
        </div>
      </div>
    </div>
  )
}
