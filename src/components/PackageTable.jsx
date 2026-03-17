import { ArrowDownUp } from 'lucide-react'
import PackageRow from './PackageRow'
import { formatBytes, format3GTime } from '../lib/formatters'

const columns = [
  { key: 'name', label: 'Package', align: 'left' },
  { key: 'size', label: 'Raw size' },
  { key: 'gzip', label: 'Gzip' },
  { key: 'time', label: '3G time' },
  { key: 'sideEffects', label: 'Flags' },
  { key: 'alt', label: 'Alternative' },
]

export default function PackageTable({ packages, sortBy, sortDir, onSort, selected, onSelect, selectedPackage, heaviestPackage }) {
  const maxGzip = Math.max(...packages.map(pkg => pkg.gzip || 0), 1)

  return (
    <div className="table-shell" role="region" aria-label="Package analysis table">
      <div className="table-head">
        <div>
          <div className="panel-label" style={{ marginBottom: '0.3rem' }}>Package breakdown</div>
          <div className="table-copy">Compare exact sizes, flags, gzip weight, and lighter-path suggestions package by package.</div>
        </div>
        <div className="table-head-meta">
          <div className="table-pill">{packages.length} rows</div>
          <div className="table-pill">Sorted by {labelForSort(sortBy)}</div>
        </div>
      </div>

      <div className="table-insights" aria-label="Package table highlights">
        <div className="table-insight-card table-insight-card-heavy">
          <div className="table-insight-label">Heaviest gzip package</div>
          <div className="table-insight-title">{heaviestPackage?.name || '—'}</div>
          <div className="table-insight-copy">
            {heaviestPackage ? `${formatBytes(heaviestPackage.gzip)} gzip • ${format3GTime(heaviestPackage.gzip)} on 3G` : 'No package data yet'}
          </div>
        </div>

        <div className="table-insight-card table-insight-card-selected">
          <div className="table-insight-label">Current selection</div>
          <div className="table-insight-title">{selectedPackage?.name || 'Nothing selected'}</div>
          <div className="table-insight-copy">
            {selectedPackage
              ? `${formatBytes(selectedPackage.gzip || 0)} gzip • ${selectedPackage.hasSideEffects ? 'Has side effects' : 'Side-effect free'}`
              : 'Select a treemap block or package row to compare details faster.'}
          </div>
        </div>
      </div>

      <div className="table-scroll">
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 960 }}>
          <caption className="sr-only">Package analysis results sorted by size, gzip weight, flags, and alternative suggestions.</caption>
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {columns.map(col => (
                <th key={col.key} scope="col" aria-sort={sortBy === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} style={{ padding: '0.95rem 1rem', textAlign: col.align || 'right', fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'rgba(13,15,26,0.96)', backdropFilter: 'blur(12px)', zIndex: 1 }}>
                  <button type="button" onClick={() => onSort(col.key)} aria-label={`Sort by ${col.label}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}>
                    {col.label}
                    {sortBy === col.key && <ArrowDownUp size={13} style={{ opacity: 0.85 }} />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <PackageRow key={pkg.name} pkg={pkg} selected={selected === pkg.name} onSelect={onSelect} maxGzip={maxGzip} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function labelForSort(sortBy) {
  return columns.find(col => col.key === sortBy)?.label ?? 'Gzip'
}
