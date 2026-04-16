// translator-agent — instant language morphing with pretext overflow fade
// Text swaps instantly. Heights locked. Font-sizes fitted via DOM measurement.
// Overflow fades via CSS mask powered by pretext.
import { prepare, layout } from '@chenglou/pretext'

const RTL = new Set(['ar', 'he', 'fa', 'ur'])
const PREFIX = 't-'
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
  ja: 'Noto+Sans+JP:wght@400;700',
  ko: 'Noto+Sans+KR:wght@400;700',
  ar: 'Noto+Naskh+Arabic:wght@400;700',
  he: 'Noto+Sans+Hebrew:wght@400;700',
  'zh-CN': 'Noto+Sans+SC:wght@400;700',
  'zh-TW': 'Noto+Sans+TC:wght@400;700',
  hi: 'Noto+Sans+Devanagari:wght@400;700',
  bn: 'Noto+Sans+Bengali:wght@400;700',
  ta: 'Noto+Sans+Tamil:wght@400;700',
  th: 'Noto+Sans+Thai:wght@400;700',
  am: 'Noto+Sans+Ethiopic:wght@400;700',
  ka: 'Noto+Sans+Georgian:wght@400;700',
  km: 'Noto+Sans+Khmer:wght@400;700',
  my: 'Noto+Sans+Myanmar:wght@400;700',
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

// --- precompute: DOM binary search for font-size ---

const precompute = () => {
  const els = translatableEls()
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:0;'
  document.body.appendChild(probe)

  const info = els.map(el => {
    const cs = getComputedStyle(el)
    state.heights[el.id] = el.offsetHeight
    return {
      id: el.id,
      height: el.offsetHeight,
      fontSize: parseFloat(cs.fontSize),
      css: `width:${el.clientWidth}px;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};line-height:${cs.lineHeight};letter-spacing:${cs.letterSpacing};`,
    }
  })

  state.locales.map(locale => {
    const texts = state.texts[locale]
    if (!texts) return
    state.fits[locale] = {}

    info.map(({ id, height, fontSize, css }) => {
      if (!texts[id]) return
      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:0;${css}`
      probe.innerHTML = texts[id]

      // max 5% shrink — pretext mask handles overflow beyond that
      let lo = fontSize * 0.95, hi = fontSize
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2
        probe.style.fontSize = `${mid}px`
        if (probe.offsetHeight > height - 1) hi = mid
        else lo = mid
      }
      state.fits[locale][id] = Math.round(lo * 100) / 100
    })
  })

  document.body.removeChild(probe)
}

// --- pretext: overflow fade mask ---

const applyFadeMask = el => {
  const containerH = state.heights[el.id]
  if (!containerH) return

  const cs = getComputedStyle(el)
  const text = el.textContent || ''
  const font = cs.font
  const maxW = el.clientWidth
  const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.7

  try {
    const p = prepare(text, font)
    const { height: textH } = layout(p, maxW, lh)

    if (textH > containerH + 4) {
      const fadeStart = Math.max(40, ((containerH - lh * 2) / containerH) * 100)
      const mask = `linear-gradient(to bottom, black 0%, black ${fadeStart}%, transparent 100%)`
      el.style.maskImage = mask
      el.style.webkitMaskImage = mask
    } else {
      el.style.maskImage = 'none'
      el.style.webkitMaskImage = 'none'
    }
  } catch {
    el.style.maskImage = 'none'
    el.style.webkitMaskImage = 'none'
  }
}

// --- transition: instant swap + async pretext mask ---

const transitionTo = index => {
  const locale = state.locales[index]
  if (!locale || !state.texts[locale]) return

  state.index = index
  const texts = state.texts[locale]
  const fits = state.fits[locale] || {}
  const isRTL = RTL.has(locale)
  const els = translatableEls()

  document.documentElement.lang = locale

  // lock heights on first transition
  els.map(el => {
    if (!el.style.height) {
      el.style.height = `${state.heights[el.id]}px`
      el.style.overflow = 'hidden'
    }
  })

  // instant swap — one synchronous batch, one paint
  els.filter(el => texts[el.id] != null).map(el => {
    el.innerHTML = texts[el.id]
    el.style.fontSize = fits[el.id] ? `${fits[el.id]}px` : ''
    el.dir = isRTL ? 'rtl' : ''
    el.style.textAlign = isRTL ? 'right' : ''
  })

  updateBar()

  // async: pretext fade masks for overflow (next frame, non-blocking)
  requestAnimationFrame(() => {
    els.filter(el => texts[el.id] != null).map(applyFadeMask)
  })
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

  // load fonts for discovered locales
  await Promise.all(state.locales.map(loadFont))
  await document.fonts.ready

  precompute()
  buildBar()
  setupInput()
  document.getElementById('hint')?.classList.add('visible')
}

init()
