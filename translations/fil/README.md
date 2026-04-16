# translator-agent

Ang ₱500,000 na problema sa lokalisasyon, nalutas sa loob ng 90 segundo.

Ang mga kumpanya ay nagbabayad ng ₱5–12 bawat salita sa mga agency para sa lokalisasyon ng kanilang mga site. Isang 5,000-salitang site na isalin sa 10 wika ay nagkakahalaga ng ₱25,000–60,000 at tumatagal ng 2–4 linggo. Tuwing magbabago ka ng headline, magsisimula ulit ang bayaran.

Ang tool na ito ay gumagawa niyon sa isang command lang, sa 71 wika, habang nag-build ka:

```bash
bunx translator-agent -s ./dist -l all
```

Walang agency. Walang spreadsheets. Walang vendor lock-in. Walang signup. Ang inyong keys, ang inyong build, ang inyong mga wika.

> **Ikaw ay bumabasa ng patunay.** Ang README na ito ay naisalin gamit ang `bunx translator-agent -s README.md -l all`. Basahin mo ang [Japanese version](./translations/ja/README.md) — hindi lang nito sinaling ang "the meter restarts," pinalit nito sa Japanese business idiom. Ang [German version](./translations/de/README.md) ay 30% mahaba dahil ganyan talaga ang German. Ang [Arabic version](./translations/ar/README.md) ay nabasa mula kanan paliwa. Ang [Brazilian Portuguese version](./translations/pt-BR/README.md) ay tumutunog na Brazilian ang nagsulat, kasi yun nga ang point.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [lahat ng 71...](./translations/)

---

## Bakit gumana ito

Ang translation ay solved problem na. Ang localization ay hindi pa.

Kayang gawin ng Google Translate na maging Japanese ang "Our hamsters are working on it." Pero hindi niya makikilala na hindi bagay ang biro sa Japan, at papalitan ito ng bagay na tugma — tulad ng pag-refer sa engineering team na nagpupuyat, na appropriate sa kultura at nakakatawa sa context.

Hindi lang nagtratranslate ang tool na ito. Nag-**transcreate** ito — same process na sinisinkil ng ad agencies ng ₱2.5 milyon kapag nag-adapt ng campaign sa ibang markets. Kaso alam na ng LLM ang lahat ng kultura, lahat ng idiom, lahat ng formatting convention. Alam niya na:

- Ang `₱2,450/month` ay nagiging `月額6,980円` sa Japan — hindi "₱2,450" na may yen symbol lang na dikit
- Ang sarcasm ay hit sa English pero dead sa formal Japanese
- Ang "Drowning in paperwork" ay nagiging "noyade administrative" sa French — tunay na French expression, hindi word-for-word translation
- Ang Germans ay pinapanatili ang hamster joke kasi Hamsterrad (hamster wheel) ay tunay na German idiom
- Ang Brazilians ay kailangan ng casual register o tumutunog na robot ang nagsulat

Ginagamit ng model ang bawat string. Ang UI labels ay direct translation. Ang marketing copy ay inadapt. Ang humor ay ginagawang bago para sa target culture.

---

## Ang nangyayari kapag pinatakbo mo

I-point mo sa build output mo. Kina-clone niya ang buong file tree bawat locale — sinasaling ang text files, kinokopya ang static assets, at gineggenerate ang lahat na kailangan para sa deployment:

```
your-site/                          translations/
  index.html                          middleware.ts        ← locale detection
  about.html             →            _locales.css         ← typography kada script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreated
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← kinopya
                                        js/app.js          ← kinopya
                                        images/logo.png    ← kinopya
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Lahat ng HTML file ay nakakuha ng `lang` at `dir="rtl"` na injected. Lahat ng locale ay nakakuha ng CSS na may tamang font stack, line-height, at text direction. Isang Vercel middleware ay ginagawa na bumabasa ng `Accept-Language` at nirewrite sa tamang locale.

I-deploy sa Vercel. Ang user sa Tokyo ay makakita ng Japanese na may Hiragino Sans sa 1.8 line-height. Ang user sa Cairo ay makakita ng RTL Arabic na may Noto Naskh sa 110% size. Ang user sa Bangkok ay makakita ng Thai na may `word-break: keep-all` kasi walang spaces ang Thai. Walang config.

---

## 90 segundo, hindi 4 linggo

```bash
# Tatlong wika, isang JSON file
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Tapos na. 3 files nasulat sa 9.5s

# Buong site mo, lahat ng wika sa mundo
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Tapos na. 142 files na-translate, 284 static files na-copy sa 94s
```

### Sa build pipeline mo

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Bawat deploy ay naka-ship sa 71 wika. Ang mga translation ay build artifacts — naka-cache, ginagawa lang ulit kapag nagbago ang source.

---

## Dalhin mo ang sariling keys o wag na

```bash
# May keys ka — tumatakbo local, ikaw magbabayad sa LLM provider mo
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Walang keys — gumagana lang
# Automatic na gumagamit ng hosted service
# Bayad per translation gamit USDC via x402 — walang signup, walang account
bunx translator-agent -s ./dist -l all
```

Same command. Kapag may API keys, tumatakbo locally sa provider mo. Kapag wala, tumatama sa hosted API at magbabayad per request via [x402](https://x402.org) — ang HTTP 402 payment protocol. Ang client mo ay magbabayad ng USDC sa Base, makakakuha ng translations. Walang auth, walang vendor relationship, walang invoices.

Sumusuporta sa Anthropic at OpenAI. Dalhin mo kung anong model mo:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Lahat ng script system, nahawakan

Hindi lang text ang sinasaling ng tool — alam niya kung paano nagre-render ang bawat writing system:

| Script | Anong nagbabago | Bakit |
|---|---|---|
| **Arabic, Hebrew, Farsi, Urdu** | `dir="rtl"`, RTL fonts, 110% size | Kailangan ng Arabic ng mas malaking type para mabasa; buong layout ay salungat |
| **Japanese, Chinese, Korean** | CJK font stacks, 1.8 line-height | Fixed-width squares ang characters; kailangan ng vertical breathing room |
| **Hindi, Bengali, Tamil, Telugu** | Indic fonts, 1.8 line-height | Ang headstrokes (shirorekha) ay kailangan ng extra vertical space |
| **Thai** | `word-break: keep-all` | Walang spaces sa mga salita — kailangan ng explicit line-break rules ng browser |
| **Burmese** | 2.2 line-height | Pinakamatataas na glyphs sa lahat ng major script |
| **Khmer** | 2.0 line-height | Ang subscript consonant clusters ay naka-stack vertically |

Ginagawang per-locale CSS:

```css
/* ar/_locale.css */
body {
  font-family: "Noto Naskh Arabic", "Geeza Pro", Tahoma, sans-serif;
  line-height: 1.9;
  font-size: 110%;
}
[dir="rtl"] { text-align: right; }
```

---

## Caching

Ang mga translation ay build artifacts. Gumawa habang build time, i-cache ang output, skip kapag hindi nagbago ang source.

### Vercel

Automatic na nag-cache ng build output ang Vercel. Dagdag lang ng `postbuild` tapos na:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

### CI

```yaml
- uses: actions/cache@v4
  id: translations
  with:
    path: translations/
    key: translations-${{ hashFiles('src/messages/**', 'public/**/*.html') }}

- if: steps.translations.outputs.cache-hit != 'true'
  run: bunx translator-agent -s ./src/messages -l all
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Walang pagbabago sa source = cache hit = zero LLM calls = zero cost.

---

## Options

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      source directory o file na iske-scan
  -l, --locales <locales>  target locales, comma-separated o "all" para sa 71 wika
  -o, --output <path>      output directory (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         model override
  -c, --concurrency <n>    max parallel LLM calls (default: 10)
  --api-url <url>          hosted service URL (auto-used kapag walang API keys)
```

| Extension | Strategy |
|---|---|
| `.json` | I-translate ang values, i-preserve ang keys |
| `.md` / `.mdx` | I-translate ang text, i-preserve ang syntax |
| `.html` / `.htm` | I-translate ang text, i-preserve ang tags, i-inject ang `lang`/`dir` |
| Lahat ng iba | I-copy sa bawat locale directory |

### Lahat ng 71 locales

Ang `-l all` ay sumasaklaw sa ~95% ng internet users: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## License

MIT