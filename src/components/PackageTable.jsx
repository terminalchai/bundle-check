import { ArrowDownUp } from 'lucide-react'
import PackageRow from './PackageRow'

const columns = [
  { key: 'name', label: 'Package', align: 'left' },
  { key: 'size', label: 'Raw size' },
  { key: 'gzip', label: 'Gzip' },
  { key: 'time', label: '3G time' },
  { key: 'sideEffects', label: 'Flags' },
  { key: 'alt', label: 'Alternative' },
]

export default function PackageTable({ packages, sortBy, sortDir, onSort, selected, onSelect }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '0.95rem 1rem', textAlign: col.align || 'right', fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)' }}>
                  <button onClick={() => onSort(col.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}>
                    {col.label}
                    {sortBy === col.key && <ArrowDownUp size={13} style={{ opacity: 0.85 }} />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <PackageRow key={pkg.name} pkg={pkg} selected={selected === pkg.name} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
