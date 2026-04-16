# translator-agent

Die R70 000 lokaliseringsprobleem, opgelos in 90 sekondes.

Maatskappye betaal agentskappe R1.50–R3.75 per woord om hul webwerwe te lokaliseer. 'n 5 000-woord werf in 10 tale kos R75 000–R180 000 en vat 2–4 weke. Elke keer as jy 'n opskrif verander, begin die teller weer van voor af.

Hierdie hulpmiddel doen dit in een opdrag, in 71 tale, tydens jou bou-stap:

```bash
bunx translator-agent -s ./dist -l all
```

Geen agentskap nie. Geen sigblaaie nie. Geen verskaffer-slot nie. Geen aantekening nie. Jou sleutels, jou bou, jou tale.

> **Jy lees die bewys.** Hierdie README is vertaal deur `bunx translator-agent -s README.md -l all` uit te voer. Gaan lees die [Japannese weergawe](./translations/ja/README.md) — dit het nie net "die meter herbegin" vertaal nie, dit het dit vervang met 'n Japannese besigheidsuitdrukking. Die [Duitse weergawe](./translations/de/README.md) is 30% langer omdat Duits altyd is. Die [Arabiese weergawe](./translations/ar/README.md) lees van regs na links. Die [Brasiliaanse Portugese weergawe](./translations/pt-BR/README.md) klink of 'n Brasilianer dit geskryf het, want dis die punt.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [al 71...](./translations/)

---

## Hoekom dit werk

Vertaling is 'n opgelope probleem. Lokalisering nie.

Google Translate kan "Ons hamsters werk daaraan" in Japannees omskep. Wat dit nie kan doen nie, is om te besef dat die grap nie in Japan land nie, en dit vervang met iets wat wel werk — soos om na die ingenieurspan te verwys wat die hele nag deurtrek, wat beide kultureel gepas en snaaks in konteks is.

Hierdie hulpmiddel vertaal nie. Dit **transkripeer** — dieselfde proses waarvoor advertensieagentskappe R750 000 vra wanneer hulle 'n veldtog oor markte aanpas. Behalwe die LLM ken reeds elke kultuur, elke idioom, elke formatkonvensie. Dit weet dat:

- `R49/maand` word `月額6,980円` in Japan — nie "R49" met 'n yen-simbool daarop geplak nie
- Sarkasme gaan groot in Engels en sterf in formele Japannees
- "Verdrink in papierwerk" word "noyade administrative" in Frans — 'n werklike Franse uitdrukking, nie 'n woord-vir-woord vertaling nie
- Duitsers hou die hamster-grap omdat Hamsterrad (hamsterwiel) 'n werklike Duitse idioom is
- Brasilianers benodig die informele register of dit klink of 'n robot dit geskryf het

Die model klassifiseer elke string. UI-etikette kry direkte vertaling. Bemarkingsinhoud word aangepas. Humor word volledig herskep vir die teikenkultuur.

---

## Wat gebeur wanneer jy dit hardloop

Wys dit na jou bou-uitset. Dit kloon die hele lêerboom per plek — vertaal tekslêers, kopieer statiese bates, en genereer alles wat benodig word vir ontplooiing:

```
your-site/                          translations/
  index.html                          middleware.ts        ← plek-opsporing
  about.html             →            _locales.css         ← tipografie per skrif
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", getranskripeer
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 lynhoogte
                                        css/style.css      ← gekopieer
                                        js/app.js          ← gekopieer
                                        images/logo.png    ← gekopieer
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% lettergrootte
                                        ...
                                      de/
                                        ...
```

Elke HTML-lêer kry `lang` en `dir="rtl"` ingespuit. Elke plek kry CSS met die korrekte lettertipe-stapel, lynhoogte, en teksrigting. 'n Vercel middleware word gegenereer wat `Accept-Language` lees en herskryf na die regte plek.

Ontplooi na Vercel. 'n Gebruiker in Tokio sien Japannees met Hiragino Sans teen 1.8 lynhoogte. 'n Gebruiker in Kaïro sien RTL-Arabies met Noto Naskh teen 110% grootte. 'n Gebruiker in Bangkok sien Thai met `word-break: keep-all` omdat Thai geen spasies het nie. Geen konfigurasie nie.

---

## 90 sekondes, nie 4 weke nie

```bash
# Drie tale, een JSON-lêer
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Gedoen. 3 lêers geskryf in 9.5s

# Jou hele webwerf, elke taal op aarde
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Gedoen. 142 lêers vertaal, 284 statiese lêers gekopieer in 94s
```

### In jou bou-pyplyn

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Elke ontplooiing stuur in 71 tale. Vertalings is bou-artefakte — gekaseer, slegs hergenereer wanneer bron verander.

---

## Bring jou eie sleutels of moenie

```bash
# Jy het sleutels — loop plaaslik, jy betaal jou LLM-verskaffer direk
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Jy het nie sleutels nie — werk net
# Gebruik outomaties die gaste diens
# Betaal per vertaling met USDC via x402 — geen aantekening, geen rekening nie
bunx translator-agent -s ./dist -l all
```

Dieselfde opdrag. As API-sleutels teenwoordig is, loop dit plaaslik met jou verskaffer. As nie, raak dit die gaste API en betaal per versoek via [x402](https://x402.org) — die HTTP 402 betalingsprotokol. Jou kliënt betaal USDC op Base, kry vertalings terug. Geen outentifikasie nie, geen verskafferverhouding nie, geen fakture nie.

Ondersteun Anthropic en OpenAI. Bring watter model jy ook al wil:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Elke skrifskrifstelsel, hanteer

Die hulpmiddel vertaal nie net teks nie — dit weet hoe elke skrifskrifstelsel lewer:

| Skrif | Wat verander | Hoekom |
|---|---|---|
| **Arabies, Hebreeus, Persies, Oerdoe** | `dir="rtl"`, RTL-lettertipes, 110% grootte | Arabies benodig groter tipe om leesbaar te wees; hele uitleg spieël |
| **Japannees, Chinees, Koreaans** | CJK-lettertipe stapels, 1.8 lynhoogte | Karakters is vaste-wydte vierkante; benodig vertikale asemruimte |
| **Hindi, Bengali, Tamil, Telugu** | Indiese lettertipes, 1.8 lynhoogte | Kopstrepe (shirorekha) benodig ekstra vertikale ruimte |
| **Thai** | `word-break: keep-all` | Geen spasies tussen woorde nie — die blaaier benodig eksplisiete lynbreek reëls |
| **Birmaans** | 2.2 lynhoogte | Hoogste glywe van enige groot skrif |
| **Khmer** | 2.0 lynhoogte | Onderskrif-medeklinkerbondels stapel vertikaal |

Gegenereerde per-plek CSS:

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

## Kasering

Vertalings is bou-artefakte. Genereer by bou-tyd, kaseer die uitset, slaan oor wanneer bron nie verander het nie.

### Vercel

Vercel kaseer bou-uitset outomaties. Voeg `postbuild` by en jy is klaar:

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

Bron onveranderd = kasraak = nul LLM-oproepe = nul koste.

---

## Opsies

```
Gebruik: translator-agent [opsies]

Opsies:
  -s, --source <pad>       bron-lêergids of lêer om te skandeer
  -l, --locales <plekke>   teiken-plekke, komma-geskei of "all" vir 71 tale
  -o, --output <pad>       uitset-lêergids (verstek: "./translations")
  -p, --provider <naam>    anthropic | openai (verstek: "anthropic")
  -m, --model <id>         model oorheers
  -c, --concurrency <n>    maks parallelle LLM-oproepe (verstek: 10)
  --api-url <url>          gaste diens URL (outomaties gebruik wanneer geen API-sleutels gestel nie)
```

| Uitbreiding | Strategie |
|---|---|
| `.json` | Vertaal waardes, bewaar sleutels |
| `.md` / `.mdx` | Vertaal teks, bewaar sintaks |
| `.html` / `.htm` | Vertaal teks, bewaar merkers, spuit `lang`/`dir` in |
| Alles anders | Kopieer in elke plek-lêergids |

### Al 71 plekke

`-l all` dek ~95% van internetgebruikers: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Lisensie

MIT