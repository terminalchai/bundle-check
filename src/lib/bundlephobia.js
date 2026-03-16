/**
 * Bundlephobia API fetcher with concurrency queue (max 5 parallel)
 */

const API = 'https://bundlephobia.com/api/size'
const MAX_CONCURRENT = 5

export async function fetchPackageSizes(deps, onProgress) {
  const packages = Object.entries(deps).map(([name, range]) => ({
    name,
    version: normaliseRange(range),
  }))

  const results = []
  let completed = 0
  const total = packages.length

  // Process in chunks of MAX_CONCURRENT
  for (let i = 0; i < packages.length; i += MAX_CONCURRENT) {
    const chunk = packages.slice(i, i + MAX_CONCURRENT)
    const chunkResults = await Promise.all(
      chunk.map(pkg => fetchOne(pkg.name, pkg.version))
    )
    chunkResults.forEach(r => {
      results.push(r)
      completed++
      onProgress?.({ completed, total, latest: r })
    })
  }

  return results
}

async function fetchOne(name, version) {
  const pkg = version ? `${name}@${version}` : name
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(`${API}?package=${encodeURIComponent(pkg)}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      // Try without version if versioned request failed
      if (version) return fetchOne(name, '')
      return errorResult(name, version, `HTTP ${res.status}`)
    }

    const data = await res.json()
    return {
      name,
      version: data.version || version,
      size: data.size,
      gzip: data.gzip,
      hasSideEffects: data.hasSideEffects,
      dependencyCount: data.dependencyCount ?? 0,
      status: 'ok',
    }
  } catch (err) {
    if (err.name === 'AbortError') return errorResult(name, version, 'Timeout')
    return errorResult(name, version, 'Network error')
  }
}

function errorResult(name, version, reason) {
  return { name, version, size: 0, gzip: 0, hasSideEffects: null, dependencyCount: 0, status: 'error', error: reason }
}

function normaliseRange(range) {
  // Strip semver range chars to get plain version e.g. ^18.2.0 → 18.2.0
  if (!range || range === 'latest' || range === '*') return ''
  const match = range.match(/(\d+\.\d+\.\d+[\w.-]*)/)
  return match ? match[1] : ''
}
