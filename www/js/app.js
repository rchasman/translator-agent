// translator-agent — instant language morphing
// Heights normalized across locales. Outliers get font-size shrunk to fit.
// No masks, no fades, no animations. Pure instant swap.

const RTL = new Set(['ar', 'he', 'fa', 'ur'])
const PREFIX = 't-'
const MAX_GROWTH = 1.6 // container can grow up to 60% beyond English — outliers shrink to fit
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

// --- precompute ---

const precompute = () => {
  const els = translatableEls()
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:0;'
  document.body.appendChild(probe)

  const info = els.map(el => {
    const cs = getComputedStyle(el)
    return {
      id: el.id,
      enHeight: el.offsetHeight,
      fontSize: parseFloat(cs.fontSize),
      css: `width:${el.clientWidth}px;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};font-size:${cs.fontSize};line-height:${cs.lineHeight};letter-spacing:${cs.letterSpacing};`,
    }
  })

  info.map(({ id, enHeight, fontSize, css }) => {
    // measure every locale at natural font-size
    const localeHeights = {}
    state.locales.map(locale => {
      const texts = state.texts[locale]
      if (!texts?.[id]) return
      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:0;${css}`
      probe.innerHTML = texts[id]
      localeHeights[locale] = probe.offsetHeight
    })

    // container height: capped at MAX_GROWTH × English height
    const cap = Math.ceil(enHeight * MAX_GROWTH)
    const maxNatural = Math.max(...Object.values(localeHeights), enHeight)
    const containerH = Math.min(maxNatural, cap)
    state.heights[id] = containerH

    // for locales that overflow the cap: shrink font-size to fit
    state.locales.map(locale => {
      const h = localeHeights[locale]
      if (!h || h <= containerH) return // fits naturally

      // binary search: largest font-size where text fits
      if (!state.fits[locale]) state.fits[locale] = {}
      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:0;${css}`
      probe.innerHTML = state.texts[locale][id]

      let lo = fontSize * 0.4, hi = fontSize
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2
        probe.style.fontSize = `${mid}px`
        if (probe.offsetHeight > containerH - 1) hi = mid
        else lo = mid
      }
      state.fits[locale][id] = Math.round(lo * 100) / 100
    })
  })

  document.body.removeChild(probe)

  // lock heights
  els.map(el => {
    el.style.height = `${state.heights[el.id]}px`
    el.style.overflow = 'hidden'
  })
}

// --- transition: instant swap + update URL ---

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

  // sync URL
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

  // restore locale from URL
  const urlLocale = new URL(location.href).searchParams.get('locale')
  if (urlLocale) {
    const idx = state.locales.indexOf(urlLocale)
    if (idx >= 0) transitionTo(idx)
  }
}

init()
