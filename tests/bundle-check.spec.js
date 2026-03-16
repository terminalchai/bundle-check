import { test, expect } from '@playwright/test'

const fixtures = {
  react: {
    name: 'react',
    version: '19.0.0',
    size: 128700,
    gzip: 42100,
    hasSideEffects: false,
    dependencyCount: 0,
  },
  axios: {
    name: 'axios',
    version: '1.8.0',
    size: 44200,
    gzip: 16200,
    hasSideEffects: true,
    dependencyCount: 1,
  },
  lodash: {
    name: 'lodash',
    version: '4.17.21',
    size: 286000,
    gzip: 71900,
    hasSideEffects: true,
    dependencyCount: 0,
  },
  moment: {
    name: 'moment',
    version: '2.30.1',
    size: 287300,
    gzip: 72000,
    hasSideEffects: true,
    dependencyCount: 0,
  },
  vite: {
    name: 'vite',
    version: '8.0.0',
    size: 96500,
    gzip: 33600,
    hasSideEffects: false,
    dependencyCount: 8,
  },
}

async function mockBundlephobia(page) {
  await page.route('https://bundlephobia.com/api/size?package=*', async route => {
    const url = new URL(route.request().url())
    const pkg = url.searchParams.get('package') || ''
    const normalised = pkg.startsWith('@') ? pkg.slice(1) : pkg
    const name = normalised.split('@')[0]
    const data = fixtures[name]

    if (!data) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Package not found' }),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data),
    })
  })
}

async function openPastePanel(page) {
  await page.goto('/')
  await page.getByRole('button', { name: /paste json directly/i }).click()
}

test('renders the landing experience with accessible primary actions', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: /skip to main content/i })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: /understand the real cost of every dependency/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /include devdependencies/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /browse file/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /use sample package.json/i })).toBeVisible()
})

test('shows an inline error for invalid json', async ({ page }) => {
  await openPastePanel(page)
  await page.getByLabel(/paste package.json content/i).fill('{ invalid json }')
  await page.getByRole('button', { name: /analyse bundle/i }).click()

  await expect(page.getByRole('alert')).toContainText(/invalid json/i)
})

test('analyses sample dependencies and renders treemap + table results', async ({ page }) => {
  await mockBundlephobia(page)
  await page.goto('/')
  await page.getByRole('button', { name: /use sample package.json/i }).click()
  await page.getByRole('button', { name: /analyse bundle/i }).click()

  const table = page.getByRole('region', { name: /package analysis table/i })

  await expect(page.getByLabel(/analysis summary/i)).toBeVisible()
  await expect(page.getByText('demo-app')).toBeVisible()
  await expect(page.getByText('Packages analysed')).toBeVisible()
  await expect(page.getByRole('img', { name: /package treemap by gzip size/i })).toBeVisible()
  await expect(table.locator('tbody')).toContainText('moment')
  await expect(page.getByText(/date-fns or dayjs/i)).toBeVisible()
})

test('includes devDependencies when the toggle is enabled before analysis', async ({ page }) => {
  await mockBundlephobia(page)
  await page.goto('/')
  await page.getByRole('button', { name: /include devdependencies/i }).click()
  await page.getByRole('button', { name: /use sample package.json/i }).click()
  await page.getByRole('button', { name: /analyse bundle/i }).click()

  await expect(page.getByRole('region', { name: /package analysis table/i }).locator('tbody')).toContainText('vite')
})

test('supports sorting and resetting the analysis flow', async ({ page }) => {
  await mockBundlephobia(page)
  await page.goto('/')
  await page.getByRole('button', { name: /use sample package.json/i }).click()
  await page.getByRole('button', { name: /analyse bundle/i }).click()

  const table = page.getByRole('region', { name: /package analysis table/i })
  await page.getByRole('button', { name: 'Sort by Package' }).click()
  await expect(table.locator('tbody tr').first()).toContainText('axios')

  await page.getByRole('button', { name: /analyse another package/i }).click()
  await expect(page.getByRole('button', { name: /browse file/i })).toBeVisible()
  await expect(page.getByText('Packages analysed')).not.toBeVisible()
})
