// translator-agent — instant language morphing
// Pretext measures ALL locales without DOM reflow. Pure canvas + arithmetic. Fast.
import { prepare, layout } from '@chenglou/pretext'

const RTL = new Set(['ar', 'he', 'fa', 'ur'])
const PREFIX = 't-'
const MAX_GROWTH = 1.6
const CANDIDATES = [
  'ja', 'ar', 'de', 'fr', 'ko', 'pt-BR', 'zh-CN', 'es', 'hi', 'ru',
  'th', 'vi', 'it', 'nl', 'tr', 'pl', 'sv', 'uk', 'el', 'cs',
  'id', 'ms', 'fil', 'my', 'bn', 'ta', 'te', 'mr', 'gu', 'kn',
  'ml', 'pa', 'ur', 'fa', 'he', 'kk', 'uz', 'pt', 'ca', 'gl',
  'da', 'no', 'fi', 'is', 'sk', 'hu', 'ro', 'bg', 'hr', 'sr',
  'sl', 'lt', 'lv', 'et', 'ga', 'sw', 'am', 'ha', 'yo', 'zu',
  'af', 'km', 'lo', 'ne', 'si', 'ka', 'az', 'mn',
]

const GFONTS = {
  ja: 'Noto+Sans+JP:wght@400;700', ko: 'Noto+Sans+KR:wght@400;700',
  ar: 'Noto+Naskh+Arabic:wght@400;700', he: 'Noto+Sans+Hebrew:wght@400;700',
  'zh-CN': 'Noto+Sans+SC:wght@400;700', 'zh-TW': 'Noto+Sans+TC:wght@400;700',
  hi: 'Noto+Sans+Devanagari:wght@400;700', bn: 'Noto+Sans+Bengali:wght@400;700',
  ta: 'Noto+Sans+Tamil:wght@400;700', th: 'Noto+Sans+Thai:wght@400;700',
  am: 'Noto+Sans+Ethiopic:wght@400;700', ka: 'Noto+Sans+Georgian:wght@400;700',
  km: 'Noto+Sans+Khmer:wght@400;700', my: 'Noto+Sans+Myanmar:wght@400;700',
  si: 'Noto+Sans+Sinhala:wght@400;700',
}

const state = { locales: [], index: 0, texts: {}, fits: {}, heights: {} }

// --- helpers ---

const translatableEls = (root = document) =>
  [...root.querySelectorAll('[id]')].filter(el => el.id.startsWith(PREFIX))

const extractTexts = doc =>
  translatableEls(doc).reduce((acc, el) => ({ ...acc, [el.id]: el.innerHTML }), {})

const toPlain = html => {
  const d = document.createElement('div')
  d.innerHTML = html
  return d.textContent || ''
}

const basePath = () =>
  (document.documentElement.lang || 'en') === 'en' ? '.' : '..'

const localePath = locale =>
  locale === 'en' ? `${basePath()}/index.html` : `${basePath()}/${locale}/index.html`

// --- font loading ---

const loadFont = async locale => {
  const spec = GFONTS[locale]
  if (!spec) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`
  document.head.appendChild(link)
}

// --- discovery ---

const fetchLocale = async locale => {
  try {
    const res = await fetch(localePath(locale))
    if (!res.ok) return null
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html')
    state.texts[locale] = extractTexts(doc)
    return locale
  } catch { return null }
}

const discover = async () => {
  const lang = document.documentElement.lang || 'en'
  state.texts[lang] = extractTexts(document)
  const found = (await Promise.all(CANDIDATES.map(fetchLocale))).filter(Boolean)
  state.locales = [lang, ...found.filter(l => l !== lang)]
  state.index = 0
}

// --- pretext measurement: no DOM reflows, pure canvas + arithmetic ---

const pretextMeasure = (text, fontWeight, fontFamily, size, width, lhRatio) => {
  const font = `${fontWeight} ${size}px ${fontFamily}`
  const p = prepare(text, font)
  return layout(p, width, size * lhRatio).height
}

const precompute = () => {
  const els = translatableEls()
  const t0 = performance.now()

  // one DOM read per element to snapshot geometry + typography
  const info = els.map(el => {
    const cs = getComputedStyle(el)
    const fontSize = parseFloat(cs.fontSize)
    return {
      id: el.id,
      enHeight: el.offsetHeight,
      fontSize,
      lhRatio: parseFloat(cs.lineHeight) / fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      width: el.clientWidth,
    }
  })

  // all measurement from here is pretext — zero DOM reflows
  info.map(({ id, enHeight, fontSize, lhRatio, fontWeight, fontFamily, width }) => {
    // measure every locale at natural font-size
    const localeHeights = {}
    state.locales.map(locale => {
      const texts = state.texts[locale]
      if (!texts?.[id]) return
      try {
        localeHeights[locale] = pretextMeasure(toPlain(texts[id]), fontWeight, fontFamily, fontSize, width, lhRatio)
      } catch {}
    })

    // container = capped max
    const cap = Math.ceil(enHeight * MAX_GROWTH)
    const maxNatural = Math.max(...Object.values(localeHeights), enHeight)
    const containerH = Math.min(maxNatural, cap)
    state.heights[id] = containerH

    // fit each locale: proportional correction (2-3 prepare() calls, not 20)
    state.locales.map(locale => {
      const texts = state.texts[locale]
      if (!texts?.[id]) return
      const naturalH = localeHeights[locale]
      if (!naturalH || Math.abs(naturalH - containerH) < 4) return

      if (!state.fits[locale]) state.fits[locale] = {}
      const plain = toPlain(texts[id])

      // proportional guess + correction — much faster than binary search
      let fs = fontSize * (containerH / naturalH)

      // clamp: don't let typography get absurd — max 1.3x grow, min 0.65x shrink
      fs = Math.max(fontSize * 0.65, Math.min(fs, fontSize * 1.3))

      let h = pretextMeasure(plain, fontWeight, fontFamily, fs, width, lhRatio)
      if (Math.abs(h - containerH) > 4) {
        fs = Math.max(fontSize * 0.65, Math.min(fs * (containerH / h), fontSize * 1.3))
        h = pretextMeasure(plain, fontWeight, fontFamily, fs, width, lhRatio)
      }
      if (Math.abs(h - containerH) > 4) {
        fs = Math.max(fontSize * 0.65, Math.min(fs * (containerH / h), fontSize * 1.3))
      }

      // 8% safety margin for canvas→CSS rendering divergence
      state.fits[locale][id] = Math.floor(fs * 0.92 * 10) / 10
    })
  })

  // lock heights
  els.map(el => {
    el.style.height = `${state.heights[el.id]}px`
    el.style.overflow = 'hidden'
  })

  const pretextMs = performance.now() - t0

  // DOM verification pass — catch any pretext mismatches, shrink until they fit
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;top:-9999px;left:0;'
  document.body.appendChild(probe)

  info.map(({ id, fontSize, lhRatio, fontWeight, fontFamily, width }) => {
    const containerH = state.heights[id]
    const baseCss = `width:${width}px;font-family:${fontFamily};font-weight:${fontWeight};line-height:${lhRatio};letter-spacing:0;`

    state.locales.map(locale => {
      const texts = state.texts[locale]
      if (!texts?.[id]) return
      const fs = state.fits[locale]?.[id] || fontSize

      probe.style.cssText = `position:absolute;visibility:hidden;top:-9999px;left:0;${baseCss}font-size:${fs}px;`
      probe.innerHTML = texts[id]

      let size = fs
      while (probe.offsetHeight > containerH && size > 6) {
        size *= 0.93
        probe.style.fontSize = `${size}px`
      }

      if (size !== fs) {
        if (!state.fits[locale]) state.fits[locale] = {}
        state.fits[locale][id] = Math.floor(size * 10) / 10
      }
    })
  })

  document.body.removeChild(probe)
  console.log(`precompute: ${state.locales.length} locales × ${els.length} elements — pretext ${pretextMs.toFixed(0)}ms, total ${(performance.now() - t0).toFixed(0)}ms`)
}

// --- transition: instant swap ---

const transitionTo = index => {
  const locale = state.locales[index]
  if (!locale || !state.texts[locale]) return

  state.index = index
  const texts = state.texts[locale]
  const fits = state.fits[locale] || {}
  const isRTL = RTL.has(locale)

  document.documentElement.lang = locale

  translatableEls()
    .filter(el => texts[el.id] != null)
    .map(el => {
      el.innerHTML = texts[el.id]
      el.style.fontSize = fits[el.id] ? `${fits[el.id]}px` : ''
      el.dir = isRTL ? 'rtl' : ''
      el.style.textAlign = isRTL ? 'right' : ''
    })

  const url = new URL(location.href)
  if (locale === 'en') url.searchParams.delete('locale')
  else url.searchParams.set('locale', locale)
  history.replaceState(null, '', url)

  updateBar()
}

// --- ui ---

const buildBar = () => {
  const bar = document.getElementById('locale-bar')
  if (!bar) return
  bar.innerHTML = state.locales
    .map((l, i) => `<button class="lp${i === state.index ? ' active' : ''}" data-i="${i}">${l}</button>`)
    .join('')
  bar.addEventListener('click', e => {
    const btn = e.target.closest('[data-i]')
    if (!btn) return
    e.stopPropagation()
    transitionTo(parseInt(btn.dataset.i, 10))
  })
}

const updateBar = () =>
  [...document.querySelectorAll('.lp')].map((p, i) => p.classList.toggle('active', i === state.index))

// --- input ---

const setupInput = () => {
  const cycle = d => transitionTo((state.index + d + state.locales.length) % state.locales.length)
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowRight') { e.preventDefault(); cycle(1) }
    else if (e.code === 'ArrowLeft') { e.preventDefault(); cycle(-1) }
  })
  document.querySelector('main')?.addEventListener('click', () => cycle(1))
}

// --- init ---

const init = async () => {
  await discover()
  if (state.locales.length <= 1) return

  await Promise.all(state.locales.map(loadFont))
  await document.fonts.ready

  precompute()
  buildBar()
  setupInput()
  document.getElementById('hint')?.classList.add('visible')

  const urlLocale = new URL(location.href).searchParams.get('locale')
  if (urlLocale) {
    const idx = state.locales.indexOf(urlLocale)
    if (idx >= 0) transitionTo(idx)
  }

  document.body.classList.add('ready')
}

init()
