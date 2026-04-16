// translator-agent marketing site — pretext line-by-line language reveal

const RTL = new Set(['ar', 'he', 'fa', 'ur'])
const PREFIX = 't-'
const CANDIDATES = [
  'ja', 'ar', 'de', 'fr', 'ko', 'pt-BR', 'zh-CN', 'es', 'hi', 'ru',
  'th', 'vi', 'it', 'nl', 'tr', 'pl', 'sv', 'uk', 'el', 'cs',
]

// Google Fonts to load per locale (only non-Latin scripts)
const GFONTS = {
  ja: 'Noto+Sans+JP:wght@400;700',
  ko: 'Noto+Sans+KR:wght@400;700',
  ar: 'Noto+Naskh+Arabic:wght@400;700',
  'zh-CN': 'Noto+Sans+SC:wght@400;700',
  hi: 'Noto+Sans+Devanagari:wght@400;700',
}

const state = {
  locales: [],
  index: 0,
  texts: {},
  busy: false,
  pretext: null,
}

// --- helpers ---

const sleep = ms => new Promise(r => setTimeout(r, ms))

const translatableEls = (root = document) =>
  [...root.querySelectorAll('[id]')].filter(el => el.id.startsWith(PREFIX))

const extractTexts = doc =>
  translatableEls(doc).reduce((acc, el) => ({ ...acc, [el.id]: el.innerHTML }), {})

const basePath = () =>
  (document.documentElement.lang || 'en') === 'en' ? '.' : '..'

const localePath = locale =>
  locale === 'en' ? `${basePath()}/index.html` : `${basePath()}/${locale}/index.html`

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// --- font + css loading ---

const loaded = { fonts: new Set(), css: new Set() }

const loadLocaleFont = async locale => {
  const spec = GFONTS[locale]
  if (!spec || loaded.fonts.has(locale)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`
  document.head.appendChild(link)
  try { await document.fonts.load(`16px "${spec.split(':')[0].replace(/\+/g, ' ')}"`) } catch {}
  loaded.fonts.add(locale)
}

const loadLocaleCSS = locale => {
  if (locale === 'en' || loaded.css.has(locale)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `${basePath()}/${locale}/_locale.css`
  document.head.appendChild(link)
  loaded.css.add(locale)
}

// --- pretext ---

const computeLines = (text, font, maxWidth, lineHeight) => {
  if (!state.pretext || !text.trim() || maxWidth <= 0) return null
  try {
    const prepared = state.pretext.prepareWithSegments(text, font)
    const { lines } = state.pretext.layoutWithLines(prepared, maxWidth, lineHeight)
    return lines.map(l => l.text)
  } catch {
    return null
  }
}

// --- locale discovery ---

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

// --- transition ---

const transitionTo = async index => {
  if (state.busy) return
  const locale = state.locales[index]
  if (!locale || !state.texts[locale]) return

  state.busy = true
  state.index = index
  const texts = state.texts[locale]
  const els = translatableEls().filter(el => texts[el.id] != null)

  // phase 1 — fade out
  els.map(el => {
    el.style.transition = 'opacity 0.28s ease'
    el.style.opacity = '0'
  })
  await sleep(300)

  // phase 2 — apply locale styles and load fonts
  document.documentElement.lang = locale
  document.documentElement.dir = RTL.has(locale) ? 'rtl' : 'ltr'
  loadLocaleCSS(locale)
  await loadLocaleFont(locale)
  window.scrollTo({ top: 0, behavior: 'instant' })

  // phase 3 — swap content, compute pretext lines, render staggered
  let lineCount = 0

  els.map(el => {
    // set real content so computed styles resolve with locale CSS
    el.innerHTML = texts[el.id]
    el.style.transition = 'none'

    // read the resolved font after locale CSS is active
    const cs = getComputedStyle(el)
    const font = cs.font
    const maxW = el.clientWidth
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.7
    const plain = el.textContent || ''

    // pretext: compute exact line breaks
    const lines = computeLines(plain, font, maxW, lh)

    if (lines && lines.length > 0) {
      el.innerHTML = lines
        .map((line, i) =>
          `<span class="t-line" style="animation-delay:${(lineCount + i) * 40}ms">${esc(line)}</span>`)
        .join('')
      lineCount += lines.length
    }

    // reveal — line spans handle their own opacity animation
    el.style.opacity = '1'
  })

  updateBar()

  // phase 4 — after cascade completes, restore clean HTML
  await sleep(Math.max(lineCount * 40 + 500, 700))
  els.map(el => { el.innerHTML = texts[el.id] })

  state.busy = false
}

// --- ui ---

const buildBar = () => {
  const bar = document.getElementById('locale-bar')
  if (!bar) return

  bar.innerHTML = state.locales
    .map((l, i) =>
      `<button class="lp${i === state.index ? ' active' : ''}" data-i="${i}">${l}</button>`)
    .join('')

  bar.addEventListener('click', e => {
    const btn = e.target.closest('[data-i]')
    if (!btn) return
    e.stopPropagation()
    transitionTo(parseInt(btn.dataset.i, 10))
  })
}

const updateBar = () =>
  [...document.querySelectorAll('.lp')]
    .map((p, i) => p.classList.toggle('active', i === state.index))

// --- input ---

const setupInput = () => {
  const cycle = d => {
    const next = (state.index + d + state.locales.length) % state.locales.length
    transitionTo(next)
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowRight') {
      e.preventDefault()
      cycle(1)
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault()
      cycle(-1)
    }
  })

  document.querySelector('main')?.addEventListener('click', () => cycle(1))
}

// --- init ---

const init = async () => {
  try { state.pretext = await import('@chenglou/pretext') } catch {}

  await discover()

  if (state.locales.length > 1) {
    buildBar()
    setupInput()
    document.getElementById('hint')?.classList.add('visible')
  }
}

init()
