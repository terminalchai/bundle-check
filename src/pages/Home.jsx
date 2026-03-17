import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, RefreshCw, Sparkles, PackageOpen, Gauge, ShieldCheck, ScanSearch, TrendingUp } from 'lucide-react'
import DropZone from '../components/DropZone'
import SummaryBar from '../components/SummaryBar'
import Treemap from '../components/Treemap'
import PackageTable from '../components/PackageTable'
import ProgressRing from '../components/ProgressRing'
import Toast from '../components/Toast'
import { fetchPackageSizes } from '../lib/bundlephobia'
import { getAlternative } from '../lib/alternatives'

const heroFeatures = [
  {
    icon: Gauge,
    title: 'See the real production weight',
    description: 'Compare raw size, gzip size, and the packages that actually matter once shipped.',
  },
  {
    icon: ScanSearch,
    title: 'Spot the heaviest offenders fast',
    description: 'The treemap turns bulky dependencies into obvious visual hotspots in seconds.',
  },
  {
    icon: ShieldCheck,
    title: 'Catch packaging red flags',
    description: 'Surface side-effect metadata and unavailable packages before they surprise you later.',
  },
  {
    icon: TrendingUp,
    title: 'Get lighter alternatives',
    description: 'Common heavy libraries are annotated with faster, leaner replacement suggestions.',
  },
]

const insightCards = [
  {
    title: 'Treemap first',
    copy: 'Instantly see which dependency dominates the compressed bundle weight.',
  },
  {
    title: '3G reality check',
    copy: 'Translate gzip size into rough mobile download time instead of abstract KB alone.',
  },
  {
    title: 'Side-effect flags',
    copy: 'Identify packages that are harder for bundlers to tree-shake cleanly.',
  },
  {
    title: 'Swap suggestions',
    copy: 'Heavy libraries like `moment` and `lodash` get lighter-path nudges automatically.',
  },
]

export default function Home() {
  const [project, setProject]       = useState(null)
  const [includeDev, setIncludeDev] = useState(false)
  const [packages, setPackages]     = useState([])
  const [loading, setLoading]       = useState(false)
  const [progress, setProgress]     = useState({ completed: 0, total: 0 })
  const [sortBy, setSortBy]         = useState('gzip')
  const [sortDir, setSortDir]       = useState('desc')
  const [selected, setSelected]     = useState(null)
  const [toast, setToast]           = useState('')

  function resetAnalysis() {
    setProject(null)
    setPackages([])
    setLoading(false)
    setProgress({ completed: 0, total: 0 })
    setSelected(null)
  }

  async function startAnalysis(parsed, nextIncludeDev = includeDev) {
    setProject(parsed)
    setLoading(true)
    setPackages([])
    setSelected(null)
    setProgress({ completed: 0, total: 0 })

    const deps = {
      ...(parsed.deps || {}),
      ...(nextIncludeDev ? parsed.devDeps || {} : {}),
    }

    const total = Object.keys(deps).length
    setProgress({ completed: 0, total })

    const results = await fetchPackageSizes(deps, ({ completed, total: totalNow }) => {
      setProgress({ completed, total: totalNow })
    })

    setPackages(results)
    setLoading(false)
    setToast(`Analysed ${results.length} packages`)
    setTimeout(() => setToast(''), 2500)
  }

  function handleParsed(parsed) {
    startAnalysis(parsed, includeDev)
  }

  function handleToggleDev() {
    if (!project) {
      setIncludeDev(v => !v)
      return
    }
    const next = !includeDev
    setIncludeDev(next)
    startAnalysis(project, next)
  }

  function handleSort(col) {
    if (sortBy !== col) {
      setSortBy(col)
      setSortDir(col === 'name' ? 'asc' : 'desc')
      return
    }

    setSortDir(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  const sortedPackages = useMemo(() => {
    const arr = [...packages]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      let av, bv
      switch (sortBy) {
        case 'name': av = a.name.toLowerCase(); bv = b.name.toLowerCase(); break
        case 'size': av = a.size || 0; bv = b.size || 0; break
        case 'gzip': av = a.gzip || 0; bv = b.gzip || 0; break
        case 'time': av = a.gzip || 0; bv = b.gzip || 0; break
        case 'sideEffects': av = Number(a.hasSideEffects); bv = Number(b.hasSideEffects); break
        case 'alt': av = Number(Boolean(getAlternative(a.name))); bv = Number(Boolean(getAlternative(b.name))); break
        default: av = a.gzip || 0; bv = b.gzip || 0
      }
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return arr
  }, [packages, sortBy, sortDir])

  const hasResults = packages.length > 0 && !loading
  const selectedPackage = packages.find(pkg => pkg.name === selected) ?? null
  const heaviestPackage = packages
    .filter(pkg => pkg.status === 'ok')
    .sort((a, b) => (b.gzip || 0) - (a.gzip || 0))[0] ?? null

  return (
    <main id="app-content" style={{ minHeight: '100vh' }} aria-busy={loading}>
      <a href="#main-panel" className="skip-link">Skip to main content</a>
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="grid-overlay" />

      <section id="main-panel" className="shell hero-shell" aria-labelledby="hero-title">
        <motion.header initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="hero-grid">
          <div>
            <div className="hero-badge">
              <BarChart3 size={14} />
              Bundlephobia-powered package cost analyser
            </div>
            <h1 id="hero-title" className="hero-title">Understand the real cost of every dependency.</h1>
            <p className="hero-copy">
              Drop a <span>package.json</span> and instantly see raw size, gzip size, estimated 3G download time, side-effect flags, and lighter alternatives — with a visual treemap that surfaces the worst offenders first.
            </p>

            <div className="signal-row" aria-label="Core product signals">
              <span className="signal-pill">Treemap-first analysis</span>
              <span className="signal-pill">3G-aware estimates</span>
              <span className="signal-pill">Alt suggestions built in</span>
            </div>

            <div className="toggle-row">
              <button type="button" className={`ghost-toggle ${includeDev ? 'active' : ''}`} onClick={handleToggleDev} aria-pressed={includeDev} aria-describedby="dev-toggle-help">
                <Sparkles size={14} />
                {includeDev ? 'Including devDependencies' : 'Include devDependencies'}
              </button>
            </div>
            <p id="dev-toggle-help" className="subtle-copy">
              Toggle this on if you also want to count build tools, linters, test packages, and other development-only dependencies.
            </p>
          </div>

          <aside className="panel hero-panel" aria-label="Feature highlights">
            <div className="panel-label">What you get instantly</div>
            <div className="hero-feature-list">
              {heroFeatures.map(feature => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="hero-feature-item">
                    <div className="hero-feature-icon">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="hero-feature-title">{feature.title}</div>
                      <div className="hero-feature-copy">{feature.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>
        </motion.header>

        {!hasResults && !loading && (
          <div className="entry-grid">
            <DropZone onParsed={handleParsed} />

            <aside className="panel entry-panel" aria-label="Analysis insights preview">
              <div className="panel-label">What gets surfaced</div>
              <div className="insight-grid">
                {insightCards.map(card => (
                  <div key={card.title} className="insight-card">
                    <div className="insight-title">{card.title}</div>
                    <div className="insight-copy">{card.copy}</div>
                  </div>
                ))}
              </div>
              <div className="entry-note">
                Built for quick dependency triage: paste once, identify risk fast, then decide what deserves a swap.
              </div>
            </aside>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="panel center-panel" role="status" aria-live="polite">
              <ProgressRing completed={progress.completed} total={progress.total} />
            </motion.div>
          )}

          {hasResults && (
            <motion.section key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-labelledby="results-heading">
              <h2 id="results-heading" className="sr-only">Package analysis results</h2>
              <div className="results-head">
                <div className="project-chip">
                  <PackageOpen size={14} />
                  {project?.name || 'Project'}
                </div>
                <div className="project-actions">
                  <button type="button" className="ghost-toggle" onClick={() => startAnalysis(project, includeDev)}>
                    <RefreshCw size={14} />
                    Re-run analysis
                  </button>
                  <button type="button" className="ghost-toggle" onClick={resetAnalysis}>
                    <RefreshCw size={14} />
                    Analyse another package
                  </button>
                </div>
              </div>

              <SummaryBar packages={packages} />

              <div className="results-stack">
                <Treemap packages={packages} selected={selected} onSelect={setSelected} />
                <PackageTable
                  packages={sortedPackages}
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                  selected={selected}
                  onSelect={setSelected}
                  selectedPackage={selectedPackage}
                  heaviestPackage={heaviestPackage}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </section>

      <Toast message={toast} />
    </main>
  )
}
