/**
 * Known lighter alternatives for heavy/common packages
 */
export const ALTERNATIVES = {
  'moment':            { alt: 'date-fns or dayjs', saving: '~65KB gzip' },
  'lodash':            { alt: 'lodash-es (cherry-pick) or native JS', saving: '~24KB gzip' },
  'axios':             { alt: 'ky or native fetch', saving: '~5KB gzip' },
  'jquery':            { alt: 'vanilla JS', saving: '~30KB gzip' },
  'underscore':        { alt: 'native JS', saving: '~6KB gzip' },
  'styled-components': { alt: 'CSS Modules or vanilla-extract', saving: '~12KB gzip' },
  'classnames':        { alt: 'clsx', saving: '~0.5KB gzip' },
  'uuid':              { alt: 'crypto.randomUUID()', saving: '~2KB gzip' },
  'request':           { alt: 'node-fetch or got', saving: '~30KB gzip' },
  'bluebird':          { alt: 'native Promises', saving: '~16KB gzip' },
  'immutable':         { alt: 'immer', saving: '~40KB gzip' },
  'ramda':             { alt: 'native JS / partial lodash-es', saving: '~20KB gzip' },
  'rxjs':              { alt: 'zustand or native EventEmitter', saving: '~30KB gzip' },
  'redux':             { alt: 'zustand or jotai', saving: '~8KB gzip' },
  'react-redux':       { alt: 'zustand or jotai', saving: '~4KB gzip' },
  'antd':              { alt: 'shadcn/ui or radix-ui', saving: '~200KB gzip' },
  'material-ui':       { alt: 'shadcn/ui or radix-ui', saving: '~100KB gzip' },
  '@mui/material':     { alt: 'shadcn/ui or radix-ui', saving: '~100KB gzip' },
  'bootstrap':         { alt: 'Tailwind CSS', saving: '~22KB gzip' },
  'chart.js':          { alt: 'recharts or lightweight-charts', saving: '~30KB gzip' },
  'moment-timezone':   { alt: 'date-fns-tz', saving: '~70KB gzip' },
  'highlight.js':      { alt: 'shiki or prism (lighter import)', saving: '~100KB gzip' },
  'three':             { alt: 'Use only needed modules via import', saving: 'varies' },
}

export function getAlternative(name) {
  return ALTERNATIVES[name.toLowerCase()] ?? null
}
