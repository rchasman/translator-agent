// translator-agent — DOM-fitted instant language morphing
// Zero animation. Text morphs in place. Heights locked. Font-sizes adapt via DOM measurement.

const RTL = new Set(['ar', 'he', 'fa', 'ur'])
const PREFIX = 't-'
const CANDIDATES = [
  'ja', 'ar', 'de', 'fr', 'ko', 'pt-BR', 'zh-CN', 'es', 'hi', 'ru',
  'th', 'vi', 'it', 'nl', 'tr', 'pl', 'sv', 'uk', 'el', 'cs',
]

// Google Fonts for non-Latin scripts (loaded at init for correct measurement)
const GFONTS = {
  ja: 'Noto+Sans+JP:wght@400;700',
  ko: 'Noto+Sans+KR:wght@400;700',
  ar: 'Noto+Naskh+Arabic:wght@400;700',
  'zh-CN': 'Noto+Sans+SC:wght@400;700',
  hi: 'Noto+Sans+Devanagari:wght@400;700',
}

const state = { locales: [], index: 0, texts: {}, fits: {}, heights: {}, locked: false }

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

// --- DOM measurement: find font-size that fills target height ---
// Uses a hidden probe element — same rendering engine as the real page = zero divergence.

const precompute = () => {
  const els = translatableEls()

  // create offscreen probe
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:0;'
  document.body.appendChild(probe)

  // snapshot each element's geometry + styles
  const info = els.map(el => {
    const cs = getComputedStyle(el)
    state.heights[el.id] = el.offsetHeight
    return {
      id: el.id,
      height: el.offsetHeight,
      width: el.clientWidth,
      fontSize: parseFloat(cs.fontSize),
      // copy all typographic styles to probe
      css: `width:${el.clientWidth}px;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};line-height:${cs.lineHeight};letter-spacing:${cs.letterSpacing};`,
    }
  })

  // for every locale, binary search font-size via DOM measurement
  state.locales.map(locale => {
    const texts = state.texts[locale]
    if (!texts) return
    state.fits[locale] = {}

    info.map(({ id, height, width, fontSize, css }) => {
      if (!texts[id]) return

      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:0;${css}`
      probe.innerHTML = texts[id]

      // binary search: find largest font-size where text fits within target height
      let lo = fontSize * 0.5, hi = fontSize * 1.5
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2
        probe.style.fontSize = `${mid}px`
        // 1px safety margin to prevent sub-pixel overflow clipping
        if (probe.offsetHeight > height - 1) hi = mid
        else lo = mid
      }

      state.fits[locale][id] = Math.round(lo * 100) / 100
    })
  })

  document.body.removeChild(probe)
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
