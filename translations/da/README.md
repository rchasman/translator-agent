# translator-agent

10.000 kr.'s lokaliserings-problemet, løst på 90 sekunder.

Virksomheder betaler bureauer 0,75–1,85 kr. per ord for at lokalisere deres hjemmesider. En hjemmeside på 5.000 ord til 10 sprog koster 37.500–90.000 kr. og tager 2-4 uger. Hver gang du ændrer en overskrift, starter uret forfra.

Dette værktøj gør det med én kommando, til 71 sprog, under dit build-trin:

```bash
bunx translator-agent -s ./dist -l all
```

Intet bureau. Ingen regneark. Ingen vendor lock-in. Ingen tilmelding. Dine nøgler, dit build, dine sprog.

> **Du læser beviset.** Denne README blev oversat ved at køre `bunx translator-agent -s README.md -l all`. Gå og læs den [japanske version](./translations/ja/README.md) — den oversatte ikke bare "uret starter forfra", den erstattede det med et japansk forretningsidiom. Den [tyske version](./translations/de/README.md) er 30% længere, fordi tysk altid er det. Den [arabiske version](./translations/ar/README.md) læses fra højre til venstre. Den [brasiliansk portugisiske version](./translations/pt-BR/README.md) lyder som om en brasilianer skrev den, fordi det er pointen.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [alle 71...](./translations/)

---

## Hvorfor dette virker

Oversættelse er et løst problem. Lokalisering er ikke.

Google Translate kan gøre "Vores hamstre arbejder på det" til japansk. Det den ikke kan, er at genkende at joken ikke lander i Japan og erstatte det med noget der gør — som at referere til ingeniør-teamet der trækker en natte-vagt, hvilket både er kulturelt passende og sjovt i sammenhængen.

Dette værktøj oversætter ikke. Det **transcreater** — samme proces som reklame-bureauer tager 375.000 kr. for, når de tilpasser en kampagne på tværs af markeder. Bare at LLM'en allerede kender alle kulturer, alle idiomer, alle formaterings-konventioner. Den ved at:

- `49 kr./månedligt` bliver `月額6,980円` i Japan — ikke "49 kr." med et yen-symbol smækket på
- Sarkasme dræber på engelsk og dør i formel japansk
- "Drowning in paperwork" bliver "noyade administrative" på fransk — et ægte fransk udtryk, ikke en ord-for-ord oversættelse
- Tyskere beholder hamster-joken, fordi Hamsterrad (hamster-hjul) er et ægte tysk idiom
- Brasilianere har brug for den afslappede stil, ellers lyder det som om en robot skrev det

Modellen klassificerer hver streng. UI-labels får direkte oversættelse. Marketing-tekst bliver tilpasset. Humor bliver fuldstændig genopfundet for målkulturen.

---

## Hvad der sker når du kører det

Peg det mod dit build-output. Det kloner hele fil-træet per locale — oversætter tekstfiler, kopierer statiske assets og genererer alt der skal til for deployment:

```
din-hjemmeside/                     translations/
  index.html                          middleware.ts        ← locale-detection
  about.html             →            _locales.css         ← typografi per script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreated
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← kopieret
                                        js/app.js          ← kopieret
                                        images/logo.png    ← kopieret
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Hver HTML-fil får `lang` og `dir="rtl"` injiceret. Hver locale får CSS med den korrekte font-stack, line-height og tekstretning. En Vercel middleware bliver genereret, der læser `Accept-Language` og omskriver til den rigtige locale.

Deploy til Vercel. En bruger i Tokyo ser japansk med Hiragino Sans på 1.8 line-height. En bruger i Cairo ser RTL arabisk med Noto Naskh på 110% størrelse. En bruger i Bangkok ser thai med `word-break: keep-all`, fordi thai ikke har mellemrum. Ingen konfiguration.

---

## 90 sekunder, ikke 4 uger

```bash
# Tre sprog, én JSON-fil
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Færdig. 3 filer skrevet på 9,5s

# Hele din hjemmeside, alle sprog på jorden
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Færdig. 142 filer oversat, 284 statiske filer kopieret på 94s
```

### I din build-pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Hver deploy bliver sendt afsted på 71 sprog. Oversættelser er build-artifacts — cached, regenereret kun når source ændrer sig.

---

## Tag dine egne nøgler med eller lad være

```bash
# Du har nøgler — kører lokalt, du betaler din LLM-udbyder direkte
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Du har ikke nøgler — virker bare
# Bruger automatisk den hostede service
# Betal per oversættelse med USDC via x402 — ingen tilmelding, ingen konto
bunx translator-agent -s ./dist -l all
```

Samme kommando. Hvis API-nøgler er til stede, kører det lokalt med din udbyder. Hvis ikke, rammer det den hostede API og betaler per request via [x402](https://x402.org) — HTTP 402 betalings-protokollen. Din klient betaler USDC på Base, får oversættelser tilbage. Ingen auth, ingen leverandør-forhold, ingen fakturaer.

Understøtter Anthropic og OpenAI. Tag hvilken model du vil:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Alle skriftsystemer, håndteret

Værktøjet oversætter ikke bare tekst — det ved hvordan hver skrifttype renderes:

| Script | Hvad der ændres | Hvorfor |
|---|---|---|
| **Arabisk, hebraisk, farsi, urdu** | `dir="rtl"`, RTL fonts, 110% størrelse | Arabisk behøver større type for at være læselig; hele layoutet spejles |
| **Japansk, kinesisk, koreansk** | CJK font-stacks, 1.8 line-height | Tegn er fixed-width firkanter; behøver vertikal luft |
| **Hindi, bengali, tamil, telugu** | Indiske fonts, 1.8 line-height | Headstrokes (shirorekha) behøver ekstra vertikal plads |
| **Thai** | `word-break: keep-all` | Ingen mellemrum mellem ord — browseren behøver eksplicitte linje-break regler |
| **Burmesisk** | 2.2 line-height | Højeste glyffer af alle større scripts |
| **Khmer** | 2.0 line-height | Subscript konsonant-klynger stabler sig vertikalt |

Genereret per-locale CSS:

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

Oversættelser er build-artifacts. Generer ved build-tid, cache outputtet, spring over når source ikke er ændret.

### Vercel

Vercel cacher build-output automatisk. Tilføj `postbuild` og du er færdig:

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

Source uændret = cache hit = nul LLM-kald = nul omkostninger.

---

## Muligheder

```
Brug: translator-agent [muligheder]

Muligheder:
  -s, --source <sti>       source-mappe eller -fil at scanne
  -l, --locales <locales>  mål-locales, komma-separeret eller "all" for 71 sprog
  -o, --output <sti>       output-mappe (standard: "./translations")
  -p, --provider <navn>    anthropic | openai (standard: "anthropic")
  -m, --model <id>         model-override
  -c, --concurrency <n>    max parallelle LLM-kald (standard: 10)
  --api-url <url>          hosted service URL (auto-brugt når ingen API-nøgler sat)
```

| Filendelse | Strategi |
|---|---|
| `.json` | Oversæt værdier, bevar nøgler |
| `.md` / `.mdx` | Oversæt tekst, bevar syntaks |
| `.html` / `.htm` | Oversæt tekst, bevar tags, injicer `lang`/`dir` |
| Alt andet | Kopier ind i hver locale-mappe |

### Alle 71 locales

`-l all` dækker ~95% af internetbrugere: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licens

MIT