/**
 * Squarified treemap layout algorithm.
 * Input:  array of { name, value, ...rest }   (value = gzip bytes)
 * Output: array of { name, x, y, w, h, ...rest }
 */

export function squarify(items, x, y, w, h) {
  if (!items.length) return []

  // Filter out zero-value items and sort descending
  const sorted = [...items]
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)

  if (!sorted.length) return []

  const total = sorted.reduce((s, d) => s + d.value, 0)
  const rects = []
  layout(sorted, x, y, w, h, total, rects)
  return rects
}

function layout(items, x, y, w, h, total, rects) {
  if (!items.length) return
  if (items.length === 1) {
    rects.push({ ...items[0], x, y, w, h })
    return
  }

  const horizontal = w >= h
  const lineSize = horizontal ? w : h
  const crossSize = horizontal ? h : w

  // Find best split point using squarify heuristic
  let row = [items[0]]
  let rowTotal = items[0].value
  let bestRatio = worstRatio(row, rowTotal, lineSize, crossSize, total)

  for (let i = 1; i < items.length; i++) {
    const candidate = items.slice(0, i + 1)
    const candidateTotal = candidate.reduce((s, d) => s + d.value, 0)
    const ratio = worstRatio(candidate, candidateTotal, lineSize, crossSize, total)
    if (ratio <= bestRatio) {
      row = candidate
      rowTotal = candidateTotal
      bestRatio = ratio
    } else {
      break
    }
  }

  // Place row
  const rowFraction = rowTotal / total
  const rowCross = crossSize * rowFraction

  let cursor = horizontal ? y : x
  for (const item of row) {
    const frac = item.value / rowTotal
    const itemLine = lineSize * frac
    if (horizontal) {
      rects.push({ ...item, x: cursor, y, w: itemLine, h: rowCross })
      cursor += itemLine
    } else {
      rects.push({ ...item, x, y: cursor, w: rowCross, h: itemLine })
      cursor += itemLine
    }
  }

  // Recurse on remaining items
  const remaining = items.slice(row.length)
  if (remaining.length) {
    const remainTotal = remaining.reduce((s, d) => s + d.value, 0)
    if (horizontal) {
      layout(remaining, x, y + rowCross, w, h - rowCross, remainTotal, rects)
    } else {
      layout(remaining, x + rowCross, y, w - rowCross, h, remainTotal, rects)
    }
  }
}

function worstRatio(row, rowTotal, lineSize, crossSize, total) {
  const rowCross = crossSize * (rowTotal / total)
  let worst = 0
  for (const item of row) {
    const frac = item.value / rowTotal
    const itemLine = lineSize * frac
    if (itemLine === 0 || rowCross === 0) continue
    const ratio = Math.max(rowCross / itemLine, itemLine / rowCross)
    if (ratio > worst) worst = ratio
  }
  return worst
}
