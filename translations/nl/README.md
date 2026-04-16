# translator-agent

Het €10.000 lokalisatieprobleem, opgelost in 90 seconden.

Bedrijven betalen bureaus €0,10–0,25 per woord om hun sites te lokaliseren. Een site van 5.000 woorden naar 10 talen kost €5.000–12.000 en duurt 2–4 weken. Elke keer dat je een koptekst wijzigt, begint de teller opnieuw.

Deze tool doet het in één commando, naar 71 talen, tijdens je build:

```bash
bunx translator-agent -s ./dist -l all
```

Geen bureau. Geen spreadsheets. Geen vendor lock-in. Geen aanmelding. Jouw sleutels, jouw build, jouw talen.

> **Je leest het bewijs.** Deze README werd vertaald door `bunx translator-agent -s README.md -l all` te draaien. Ga de [Japanse versie](./translations/ja/README.md) lezen — het vertaalde niet alleen "de teller begint opnieuw," maar verving het met een Japans zakenjargon. De [Duitse versie](./translations/de/README.md) is 30% langer omdat Duits dat altijd is. De [Arabische versie](./translations/ar/README.md) leest van rechts naar links. De [Braziliaans-Portugese versie](./translations/pt-BR/README.md) klinkt alsof een Braziliaan het schreef, want dat is precies het punt.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [alle 71...](./translations/)

---

## Waarom dit werkt

Vertaling is een opgelost probleem. Lokalisatie niet.

Google Translate kan "Onze hamsters zijn ermee bezig" naar het Japans vertalen. Wat het niet kan, is herkennen dat de grap niet aanslaat in Japan, en het vervangen met iets dat wel werkt — zoals verwijzen naar het engineeringteam dat de hele nacht doorwerkt, wat zowel cultureel gepast als grappig is in die context.

Deze tool vertaalt niet. Het **transcreëert** — hetzelfde proces waar reclamebureaus €50.000 voor rekenen bij het aanpassen van campagnes voor verschillende markten. Behalve dat het LLM elke cultuur, elk idioom, elke opmaakconventie al kent. Het weet dat:

- `€49/maand` wordt `月額6.980円` in Japan — niet "€49" met een yen-symbool erop geplakt
- Sarcasme het goed doet in het Engels maar sterft in formeel Japans
- "Verdrinken in de administratie" wordt "noyade administrative" in het Frans — een echte Franse uitdrukking, geen woord-voor-woord vertaling
- Duitsers de hamstergrap behouden omdat Hamsterrad een echt Duits idioom is
- Brazilianen het informele register nodig hebben anders klinkt het alsof een robot het schreef

Het model classificeert elke string. UI-labels krijgen directe vertaling. Marketingtekst wordt aangepast. Humor wordt volledig geherstructureerd voor de doelcultuur.

---

## Wat er gebeurt als je het draait

Richt het op je build output. Het kloont de hele bestandsstructuur per locale — vertaalt tekstbestanden, kopieert statische assets, en genereert alles wat nodig is voor deployment:

```
your-site/                          translations/
  index.html                          middleware.ts        ← locale detectie
  about.html             →            _locales.css         ← typografie per script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", getranscreëerd
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← gekopieerd
                                        js/app.js          ← gekopieerd
                                        images/logo.png    ← gekopieerd
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% lettertype
                                        ...
                                      de/
                                        ...
```

Elk HTML-bestand krijgt `lang` en `dir="rtl"` geïnjecteerd. Elke locale krijgt CSS met de juiste lettertype-stack, line-height en tekstrichting. Een Vercel middleware wordt gegenereerd die `Accept-Language` leest en herschrijft naar de juiste locale.

Deploy naar Vercel. Een gebruiker in Tokyo ziet Japans met Hiragino Sans op 1.8 line-height. Een gebruiker in Caïro ziet RTL Arabisch met Noto Naskh op 110% grootte. Een gebruiker in Bangkok ziet Thai met `word-break: keep-all` omdat Thai geen spaties heeft. Geen configuratie.

---

## 90 seconden, geen 4 weken

```bash
# Drie talen, één JSON bestand
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Klaar. 3 bestanden geschreven in 9,5s

# Je hele site, elke taal op aarde
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Klaar. 142 bestanden vertaald, 284 statische bestanden gekopieerd in 94s
```

### In je build pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Elke deploy gaat live in 71 talen. Vertalingen zijn build artifacts — gecacht, alleen opnieuw gegenereerd als de bron verandert.

---

## Bring your own keys of niet

```bash
# Je hebt sleutels — draait lokaal, je betaalt je LLM provider direct
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Je hebt geen sleutels — werkt gewoon
# Gebruikt automatisch de hosted service
# Betaal per vertaling met USDC via x402 — geen aanmelding, geen account
bunx translator-agent -s ./dist -l all
```

Hetzelfde commando. Als API-sleutels aanwezig zijn, draait het lokaal met je provider. Zo niet, dan raakt het de hosted API en betaalt per request via [x402](https://x402.org) — het HTTP 402 betalingsprotocol. Je client betaalt USDC op Base, krijgt vertalingen terug. Geen auth, geen vendor-relatie, geen facturen.

Ondersteunt Anthropic en OpenAI. Breng welk model je maar wilt mee:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Elk schriftsysteem, afgehandeld

De tool vertaalt niet alleen tekst — het weet hoe elk schrijfsysteem wordt weergegeven:

| Script | Wat verandert | Waarom |
|---|---|---|
| **Arabisch, Hebreeuws, Farsi, Urdu** | `dir="rtl"`, RTL lettertypen, 110% grootte | Arabisch heeft groter lettertype nodig om leesbaar te zijn; hele layout spiegelt |
| **Japans, Chinees, Koreaans** | CJK lettertype-stacks, 1.8 line-height | Karakters zijn blokken met vaste breedte; hebben verticale ruimte nodig |
| **Hindi, Bengaals, Tamil, Telugu** | Indische lettertypen, 1.8 line-height | Hoofdstrepen (shirorekha) hebben extra verticale ruimte nodig |
| **Thai** | `word-break: keep-all` | Geen spaties tussen woorden — browser heeft expliciete regelafbreek-regels nodig |
| **Burmees** | 2.2 line-height | Hoogste glyphs van elk groot script |
| **Khmer** | 2.0 line-height | Subscript medeklinker-clusters stapelen verticaal |

Gegenereerde per-locale CSS:

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

Vertalingen zijn build artifacts. Genereer bij build time, cache de output, sla over als bron niet is veranderd.

### Vercel

Vercel cachet build output automatisch. Voeg `postbuild` toe en je bent klaar:

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

Bron onveranderd = cache hit = nul LLM-aanroepen = nul kosten.

---

## Opties

```
Gebruik: translator-agent [opties]

Opties:
  -s, --source <pad>       bronmap of bestand om te scannen
  -l, --locales <locales>  doellocales, kommagescheiden of "all" voor 71 talen
  -o, --output <pad>       outputmap (standaard: "./translations")
  -p, --provider <naam>    anthropic | openai (standaard: "anthropic")
  -m, --model <id>         model override
  -c, --concurrency <n>    max parallelle LLM-aanroepen (standaard: 10)
  --api-url <url>          hosted service URL (auto-gebruikt als geen API-sleutels zijn ingesteld)
```

| Extensie | Strategie |
|---|---|
| `.json` | Vertaal waardes, behoud sleutels |
| `.md` / `.mdx` | Vertaal tekst, behoud syntax |
| `.html` / `.htm` | Vertaal tekst, behoud tags, injecteer `lang`/`dir` |
| Al het andere | Kopieer naar elke locale map |

### Alle 71 locales

`-l all` dekt ~95% van internetgebruikers: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licentie

MIT