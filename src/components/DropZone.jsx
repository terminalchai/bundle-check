import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileJson, AlertCircle, X } from 'lucide-react'

const SAMPLE_PACKAGE_JSON = JSON.stringify({
  name: 'demo-app',
  dependencies: {
    react: '^19.0.0',
    axios: '^1.8.0',
    lodash: '^4.17.21',
    moment: '^2.30.1',
  },
  devDependencies: {
    vite: '^8.0.0',
  },
}, null, 2)

export default function DropZone({ onParsed }) {
  const [dragging, setDragging]   = useState(false)
  const [error, setError]         = useState(null)
  const [pasting, setPasting]     = useState(false)
  const [pasteVal, setPasteVal]   = useState('')
  const fileRef                   = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) readFile(file)
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (file) readFile(file)
  }

  function readFile(file) {
    setError(null)
    const reader = new FileReader()
    reader.onload = ev => parse(ev.target.result)
    reader.readAsText(file)
  }

  function parse(text) {
    try {
      const json = JSON.parse(text)
      const deps    = json.dependencies    || {}
      const devDeps = json.devDependencies || {}
      if (!Object.keys(deps).length && !Object.keys(devDeps).length) {
        setError('No dependencies found in this package.json')
        return
      }
      setError(null)
      onParsed({ deps, devDeps, name: json.name || 'project' })
    } catch {
      setError('Invalid JSON — please drop a valid package.json file')
    }
  }

  function handlePasteSubmit() {
    setError(null)
    parse(pasteVal)
  }

  function useSampleJson() {
    setPasting(true)
    setError(null)
    setPasteVal(SAMPLE_PACKAGE_JSON)
  }

  return (
    <div style={{ width: '100%', maxWidth: '640px' }}>
      <AnimatePresence mode="wait">
        {!pasting ? (
          <motion.div
            key="drop"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {/* Drop area */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragEnter={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              role="group"
              aria-labelledby="dropzone-title"
              aria-describedby="dropzone-help"
              style={{
                border: `2px dashed ${dragging ? 'var(--violet)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '1.25rem',
                padding: '3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                background: dragging ? 'rgba(124,108,240,0.06)' : 'var(--surface)',
                transition: 'all 0.2s',
                userSelect: 'none',
              }}
            >
              <motion.div
                animate={{ scale: dragging ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ width: 64, height: 64, borderRadius: '1rem', background: 'rgba(124,108,240,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {dragging
                  ? <FileJson size={28} style={{ color: 'var(--violet)' }} />
                  : <Upload size={28} style={{ color: 'var(--violet)' }} />
                }
              </motion.div>
              <div style={{ textAlign: 'center' }}>
                <div id="dropzone-title" style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                  {dragging ? 'Drop it!' : 'Drop your package.json here'}
                </div>
                <div id="dropzone-help" style={{ fontSize: '0.82rem', color: 'var(--dim)' }}>
                  Works with dependencies and optional devDependencies. Upload a file, or paste raw JSON below.
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{ padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(124,108,240,0.35)', background: 'rgba(124,108,240,0.1)', color: 'var(--text)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Browse file
                </button>
                <button
                  type="button"
                  onClick={useSampleJson}
                  style={{ padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Use sample package.json
                </button>
              </div>
              <input ref={fileRef} type="file" accept=".json" onChange={handleFile} aria-label="Upload a package.json file" style={{ display: 'none' }} />
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <button
              type="button"
              onClick={() => { setPasting(true); setError(null) }}
              style={{ width: '100%', padding: '0.875rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--muted)', fontSize: '0.875rem', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,108,240,0.4)'; e.currentTarget.style.background = 'rgba(124,108,240,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}
            >
              Paste JSON directly
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Paste package.json</span>
              <button type="button" onClick={() => { setPasting(false); setError(null) }} aria-label="Close paste panel" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dim)', display: 'flex', padding: '0.25rem' }}>
                <X size={15} />
              </button>
            </div>
            <label htmlFor="package-json-input" className="sr-only">Paste package.json content</label>
            <textarea
              id="package-json-input"
              autoFocus
              value={pasteVal}
              onChange={e => setPasteVal(e.target.value)}
              onKeyDown={e => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handlePasteSubmit()
              }}
              placeholder={'{\n  "dependencies": {\n    "react": "^19.0.0"\n  }\n}'}
              rows={12}
              aria-describedby="paste-help dropzone-error"
              aria-invalid={Boolean(error)}
              style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1rem', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8125rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,108,240,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
            <div id="paste-help" style={{ fontSize: '0.78rem', color: 'var(--dim)', marginTop: '-0.15rem' }}>
              Tip: press Ctrl + Enter to analyse instantly.
            </div>
            <button
              type="button"
              onClick={handlePasteSubmit}
              disabled={!pasteVal.trim()}
              style={{ padding: '0.875rem', background: pasteVal.trim() ? 'var(--violet)' : 'rgba(124,108,240,0.2)', border: 'none', borderRadius: '0.75rem', color: pasteVal.trim() ? 'white' : 'var(--dim)', fontSize: '0.875rem', fontWeight: 600, cursor: pasteVal.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
            >
              Analyse Bundle
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            id="dropzone-error"
            role="alert"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.875rem', padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '0.75rem', color: 'var(--red)', fontSize: '0.82rem' }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
