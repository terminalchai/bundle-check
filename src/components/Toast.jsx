import { motion } from 'framer-motion'

export default function Toast({ message }) {
  if (!message) return null
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        padding: '0.875rem 1rem',
        background: 'rgba(13,15,26,0.9)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        color: 'var(--text)',
        fontSize: '0.82rem',
        zIndex: 999,
        boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {message}
    </motion.div>
  )
}
