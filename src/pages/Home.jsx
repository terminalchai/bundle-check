import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, RefreshCw, Sparkles, PackageOpen } from 'lucide-react'
import DropZone from '../components/DropZone'
import SummaryBar from '../components/SummaryBar'
import Treemap from '../components/Treemap'
import PackageTable from '../components/PackageTable'
import ProgressRing from '../components/ProgressRing'
import Toast from '../components/Toast'
import { fetchPackageSizes } from '../lib/bundlephobia'

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
    const nextDir = sortBy === col && sortDir === 'desc' ? 'asc' : 'desc'
    setSortBy(col)
    setSortDir(nextDir)
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
        case 'alt': av = Number(Boolean(a.name)); bv = Number(Boolean(b.name)); break
        default: av = a.gzip || 0; bv = b.gzip || 0
      }
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return arr
  }, [packages, sortBy, sortDir])

  const hasResults = packages.length > 0 && !loading

  return (
    <main style={{ minHeight: '100vh' }}>
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="grid-overlay" />

      <section className="shell hero-shell">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%' }}>
          <div className="hero-badge">
            <BarChart3 size={14} />
            Bundlephobia-powered package cost analyser
          </div>
          <h1 className="hero-title">Understand the real cost of every dependency.</h1>
          <p className="hero-copy">
            Drop a <span>package.json</span> and instantly see raw size, gzip size, estimated 3G download time, side-effect flags, and lighter alternatives — with a visual treemap that surfaces the worst offenders first.
          </p>

          <div className="toggle-row">
            <button className={`ghost-toggle ${includeDev ? 'active' : ''}`} onClick={handleToggleDev}>
              <Sparkles size={14} />
              {includeDev ? 'Including devDependencies' : 'Ignore devDependencies'}
            </button>
            {project && (
              <button className="ghost-toggle" onClick={() => startAnalysis(project, includeDev)}>
                <RefreshCw size={14} />
                Re-run analysis
              </button>
            )}
          </div>
        </motion.div>

        {!hasResults && !loading && <DropZone onParsed={handleParsed} />}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="panel center-panel">
              <ProgressRing completed={progress.completed} total={progress.total} />
            </motion.div>
          )}

          {hasResults && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="project-chip">
                <PackageOpen size={14} />
                {project?.name || 'Project'}
              </div>

              <SummaryBar packages={packages} />

              <div className="results-grid">
                <Treemap packages={packages} selected={selected} onSelect={setSelected} />
                <PackageTable
                  packages={sortedPackages}
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                  selected={selected}
                  onSelect={setSelected}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Toast message={toast} />
    </main>
  )
}
