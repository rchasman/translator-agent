// translator-agent — pretext-fitted instant language morphing
// Zero animation. Text morphs in place. Heights locked. Font-sizes adapt.

const RTL = new Set(['ar', 'he', 'fa', 'ur'])
const PREFIX = 't-'
const CANDIDATES = [
  'ja', 'ar', 'de', 'fr', 'ko', 'pt-BR', 'zh-CN', 'es', 'hi', 'ru',
  'th', 'vi', 'it', 'nl', 'tr', 'pl', 'sv', 'uk', 'el', 'cs',
]

// Font family per locale (for pretext canvas measurement + rendering)
const LCFG = {
  en:      { family: 'Inter' },
  ja:      { family: 'Noto Sans JP' },
  ko:      { family: 'Noto Sans KR' },
  ar:      { family: 'Noto Naskh Arabic' },
  de:      { family: 'Inter' },
  fr:      { family: 'Inter' },
  'pt-BR': { family: 'Inter' },
  'zh-CN': { family: 'Noto Sans SC' },
  hi:      { family: 'Noto Sans Devanagari' },
}

const GFONTS = {
  ja: 'Noto+Sans+JP:wght@400;700',
  ko: 'Noto+Sans+KR:wght@400;700',
  ar: 'Noto+Naskh+Arabic:wght@400;700',
  'zh-CN': 'Noto+Sans+SC:wght@400;700',
  hi: 'Noto+Sans+Devanagari:wght@400;700',
}

const state = { locales: [], index: 0, texts: {}, fits: {}, heights: {}, locked: false, pretext: null }

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
  const name = spec.split(':')[0].replace(/\+/g, ' ')
  try { await document.fonts.load(`400 16px "${name}"`) } catch {}
  try { await document.fonts.load(`700 16px "${name}"`) } catch {}
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

// --- pretext: find font-size that fills target height ---

const fitToHeight = (text, locale, targetH, maxW, baseSize, weight, lhRatio) => {
  if (!state.pretext || !text.trim() || maxW <= 0 || targetH <= 0) return baseSize

  const family = (LCFG[locale] || LCFG.en).family

  const measure = size => {
    try {
      const font = `${weight} ${size}px "${family}", sans-serif`
      const p = state.pretext.prepare(text, font)
      return state.pretext.layout(p, maxW, size * lhRatio).height
    } catch { return targetH }
  }

  // measure at base size
  let fs = baseSize
  let h = measure(fs)
  if (Math.abs(h - targetH) < 3) return fs

  // proportional correction — two passes gets sub-pixel accuracy
  fs = fs * (targetH / h)
  h = measure(fs)
  if (Math.abs(h - targetH) > 3) fs = fs * (targetH / h)

  // clamp: ±35% of base — keeps text visually reasonable
  return Math.max(baseSize * 0.65, Math.min(fs, baseSize * 1.35))
}

// --- pre-computation (runs once at init, after fonts load) ---

const precompute = () => {
  const els = translatableEls()

  // snapshot each element's current geometry + typography
  const info = els.map(el => {
    const cs = getComputedStyle(el)
    const fontSize = parseFloat(cs.fontSize)
    const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.7
    state.heights[el.id] = el.offsetHeight
    return {
      id: el.id,
      height: el.offsetHeight,
      width: el.clientWidth,
      fontSize,
      lhRatio: lineHeight / fontSize,
      fontWeight: cs.fontWeight,
    }
  })

  // for every locale, find the font-size that fits each element's text into the locked height
  state.locales.map(locale => {
    const texts = state.texts[locale]
    if (!texts) return
    state.fits[locale] = {}

    info.map(({ id, height, width, fontSize, fontWeight, lhRatio }) => {
      if (!texts[id]) return
      state.fits[locale][id] = fitToHeight(toPlain(texts[id]), locale, height, width, fontSize, fontWeight, lhRatio)
    })
  })
}

// --- transition: instant, synchronous, one paint frame ---

const transitionTo = index => {
  const locale = state.locales[index]
  if (!locale || !state.texts[locale]) return

  state.index = index
  const texts = state.texts[locale]
  const fits = state.fits[locale] || {}
  const els = translatableEls()

  // lock heights on first transition
  if (!state.locked) {
    els.map(el => {
      el.style.height = `${state.heights[el.id]}px`
      el.style.overflow = 'hidden'
    })
    state.locked = true
  }

  // single synchronous batch — one browser paint, no font-family swap (avoids FOIT flash)
  document.documentElement.lang = locale
  document.documentElement.dir = RTL.has(locale) ? 'rtl' : 'ltr'

  els.filter(el => texts[el.id] != null).map(el => {
    el.innerHTML = texts[el.id]
    el.style.fontSize = fits[el.id] ? `${fits[el.id]}px` : ''
  })

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
  try { state.pretext = await import('@chenglou/pretext') } catch {}

  await discover()

  if (state.locales.length <= 1) return

  // load ALL locale fonts before pre-computing
  await Promise.all(state.locales.map(loadFont))
  await document.fonts.ready

  precompute()
  buildBar()
  setupInput()
  document.getElementById('hint')?.classList.add('visible')
}

init()
