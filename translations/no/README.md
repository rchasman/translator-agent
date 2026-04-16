# translator-agent

Lokaliseringsproblemet til 90 000 kroner, løst på 90 sekunder.

Bedrifter betaler byråer 1,00–2,30 kroner per ord for å lokalisere nettsidene sine. En 5000-ords side til 10 språk koster 50 000–120 000 kroner og tar 2–4 uker. Hver gang du endrer en overskrift, starter klokka på nytt.

Dette verktøyet gjør det med én kommando, til 71 språk, under byggeprosessen:

```bash
bunx translator-agent -s ./dist -l all
```

Ingen byrå. Ingen regneark. Ingen leverandørinnlåsing. Ingen påmelding. Dine nøkler, ditt bygg, dine språk.

> **Du leser beviset.** Denne README-filen ble oversatt ved å kjøre `bunx translator-agent -s README.md -l all`. Les den [japanske versjonen](./translations/ja/README.md) — den oversatte ikke bare "klokka starter på nytt", den erstattet det med et japansk forretningsidiom. Den [tyske versjonen](./translations/de/README.md) er 30% lengre fordi tysk alltid er det. Den [arabiske versjonen](./translations/ar/README.md) leses fra høyre til venstre. Den [brasiliansk-portugisiske versjonen](./translations/pt-BR/README.md) høres ut som en brasilianer skrev den, for det er jo poenget.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [alle 71...](./translations/)

---

## Hvorfor dette fungerer

Oversettelse er et løst problem. Lokalisering er det ikke.

Google Translate kan gjøre "Hamstrene våre jobber med det" om til japansk. Det den ikke kan gjøre er å gjenkjenne at vitsen ikke funker i Japan, og erstatte den med noe som gjør det — som å referere til utviklingsteamet som jobber hele natta, noe som både er kulturelt passende og morsomt i konteksten.

Dette verktøyet oversetter ikke. Det **transkaper** — samme prosess som reklamebyrå tar 450 000 kroner for når de tilpasser kampanjer på tvers av markeder. Bortsett fra at LLM-en allerede kjenner alle kulturer, alle idiomer, alle formateringskonvensjoner. Den vet at:

- `$49/month` blir `月額6,980円` i Japan — ikke "$49" med et yen-symbol kleint på
- Sarkasme dreper på engelsk og dør i formell japansk
- "Drowning in paperwork" blir "noyade administrative" på fransk — et ekte fransk uttrykk, ikke en ord-for-ord oversettelse
- Tyskere beholder hamstervitsen fordi Hamsterrad (hamsterhjul) er et ekte tysk idiom
- Brasilianere trenger uformell tone ellers høres det ut som en robot skrev det

Modellen klassifiserer hver streng. UI-etiketter får direkte oversettelse. Markedsføringstekst blir tilpasset. Humor blir fullstendig gjenskapt for målkulturen.

---

## Hva skjer når du kjører det

Pek det mot byggeutdataene dine. Det kloner hele filtreet per språkområde — oversetter tekstfiler, kopierer statiske ressurser, og genererer alt som trengs for deployment:

```
nettsiden-din/                      translations/
  index.html                          middleware.ts        ← språkområdedeteksjon
  about.html             →            _locales.css         ← typografi per skrift
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transkaper
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 linjeavstand
                                        css/style.css      ← kopiert
                                        js/app.js          ← kopiert
                                        images/logo.png    ← kopiert
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% skrift
                                        ...
                                      de/
                                        ...
```

Hver HTML-fil får `lang` og `dir="rtl"` injisert. Hvert språkområde får CSS med riktig fontstack, linjeavstand og tekstretning. En Vercel-middleware genereres som leser `Accept-Language` og omskriver til riktig språkområde.

Deploy til Vercel. En bruker i Tokyo ser japansk med Hiragino Sans på 1.8 linjeavstand. En bruker i Kairo ser RTL arabisk med Noto Naskh på 110% størrelse. En bruker i Bangkok ser thai med `word-break: keep-all` fordi thai ikke har mellomrom. Ingen konfig.

---

## 90 sekunder, ikke 4 uker

```bash
# Tre språk, én JSON-fil
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Ferdig. 3 filer skrevet på 9,5s

# Hele nettsiden din, alle språk på jorda
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Ferdig. 142 filer oversatt, 284 statiske filer kopiert på 94s
```

### I byggepipelinen din

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Hver deployment sendes ut på 71 språk. Oversettelser er byggartefakter — cacht, regenerert kun når kilden endres.

---

## Ta med egne nøkler eller ikke

```bash
# Du har nøkler — kjører lokalt, du betaler LLM-leverandøren direkte
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Du har ikke nøkler — bare funker
# Bruker automatisk den hostede tjenesten
# Betal per oversettelse med USDC via x402 — ingen påmelding, ingen konto
bunx translator-agent -s ./dist -l all
```

Same kommando. Hvis API-nøkler er til stede, kjører den lokalt med din leverandør. Hvis ikke, treffer den det hostede API-et og betaler per forespørsel via [x402](https://x402.org) — HTTP 402 betalingsprotokollen. Klienten din betaler USDC på Base, får oversettelser tilbake. Ingen auth, ingen leverandørforhold, ingen fakturaer.

Støtter Anthropic og OpenAI. Ta med hvilken modell du vil:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Alle skriftsystemer, håndtert

Verktøyet oversetter ikke bare tekst — det vet hvordan hvert skriftsystem rendres:

| Skrift | Hva som endres | Hvorfor |
|---|---|---|
| **Arabisk, hebraisk, farsi, urdu** | `dir="rtl"`, RTL-fonter, 110% størrelse | Arabisk trenger større type for å være lesbart; hele layouten speilvender |
| **Japansk, kinesisk, koreansk** | CJK-fontstacker, 1.8 linjeavstand | Tegn er kvadrater med fast bredde; trenger vertikal pusteplass |
| **Hindi, bengali, tamil, telugu** | Indiske fonter, 1.8 linjeavstand | Toppstreker (shirorekha) trenger ekstra vertikal plass |
| **Thai** | `word-break: keep-all` | Ingen mellomrom mellom ord — nettleseren trenger eksplisitte linjeskiftregler |
| **Burmesisk** | 2.2 linjeavstand | Høyeste glyfer av alle større skriftsystemer |
| **Khmer** | 2.0 linjeavstand | Underskrift-konsonantkluster stables vertikalt |

Generert CSS per språkområde:

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

Oversettelser er byggartefakter. Generer ved byggetid, cache outputtet, hopp over når kilden ikke har endret seg.

### Vercel

Vercel cacher byggeutdata automatisk. Legg til `postbuild` så er du i mål:

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

Kilde uendret = cache hit = null LLM-kall = null kostnad.

---

## Alternativer

```
Bruk: translator-agent [alternativer]

Alternativer:
  -s, --source <sti>       kildekatalog eller fil å skanne
  -l, --locales <locales>  målspråkområder, kommaseparert eller "all" for 71 språk
  -o, --output <sti>       utdatakatalog (standard: "./translations")
  -p, --provider <navn>    anthropic | openai (standard: "anthropic")
  -m, --model <id>         modelloverskriving
  -c, --concurrency <n>    maks parallelle LLM-kall (standard: 10)
  --api-url <url>          hostet tjeneste-URL (auto-brukt når ingen API-nøkler er satt)
```

| Utvidelse | Strategi |
|---|---|
| `.json` | Oversett verdier, bevar nøkler |
| `.md` / `.mdx` | Oversett tekst, bevar syntaks |
| `.html` / `.htm` | Oversett tekst, bevar tagger, injiser `lang`/`dir` |
| Alt annet | Kopier inn i hver språkområdekatalog |

### Alle 71 språkområder

`-l all` dekker ~95% av internettbrukere: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Lisens

MIT