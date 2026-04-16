// translator-agent — instant language morphing with pretext overflow fade
// Text morphs in place. Heights locked. Font-sizes adapt via DOM measurement.
// Overflow text fades via CSS mask, powered by pretext height analysis.
import { prepare, layout } from '@chenglou/pretext'

const RTL = new Set(['ar', 'he', 'fa', 'ur'])
const PREFIX = 't-'
const CANDIDATES = [
  'ja', 'ar', 'de', 'fr', 'ko', 'pt-BR', 'zh-CN', 'es', 'hi', 'ru',
  'th', 'vi', 'it', 'nl', 'tr', 'pl', 'sv', 'uk', 'el', 'cs',
]

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

// --- precompute: DOM measurement for font-size fitting ---

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
      width: el.clientWidth,
      fontSize: parseFloat(cs.fontSize),
      css: `width:${el.clientWidth}px;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};line-height:${cs.lineHeight};letter-spacing:${cs.letterSpacing};`,
    }
  })

  state.locales.map(locale => {
    const texts = state.texts[locale]
    if (!texts) return
    state.fits[locale] = {}

    info.map(({ id, height, width, fontSize, css }) => {
      if (!texts[id]) return

      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:0;${css}`
      probe.innerHTML = texts[id]

      // barely shrink — max 5%. Let pretext fade mask handle overflow gracefully
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

// --- pretext: detect overflow and apply fade mask ---

const applyFadeMask = (el) => {
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
      // overflow — apply gradient mask: fully visible up to fadeStart, then fade out
      const fadeStart = Math.max(50, ((containerH - lh * 1.5) / containerH) * 100)
      const mask = `linear-gradient(to bottom, black 0%, black ${fadeStart}%, transparent 100%)`
      el.style.maskImage = mask
      el.style.webkitMaskImage = mask
    } else {
      // fits — no mask needed
      el.style.maskImage = 'none'
      el.style.webkitMaskImage = 'none'
    }
  } catch {
    // pretext failed — no mask
    el.style.maskImage = 'none'
    el.style.webkitMaskImage = 'none'
  }
}

// --- transition: instant swap + async fade mask ---

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
    })
    state.locked = true
  }

  // instant swap — single synchronous batch
  // set lang but keep page layout LTR always — RTL only on text elements (no layout jitter)
  document.documentElement.lang = locale
  const isRTL = RTL.has(locale)

  els.filter(el => texts[el.id] != null).map(el => {
    el.innerHTML = texts[el.id]
    el.style.fontSize = fits[el.id] ? `${fits[el.id]}px` : ''
    el.dir = isRTL ? 'rtl' : ''
    el.style.textAlign = isRTL ? 'right' : ''
  })

  updateBar()

  // async: apply pretext fade masks (non-blocking, next frame)
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

  await Promise.all(state.locales.map(loadFont))
  await document.fonts.ready

  precompute()
  buildBar()
  setupInput()
  document.getElementById('hint')?.classList.add('visible')
}

init()
