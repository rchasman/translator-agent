# translator-agent

Lokaliseringslösningen för 100 000 kr — fixad på 90 sekunder.

Företag betalar byråer 1:20–2:50 kr per ord för att lokalisera sina webbsajter. En 5 000-ordsajt till 10 språk kostar 50 000–125 000 kr och tar 2–4 veckor. Varje gång du ändrar en rubrik börjar mätaren om från noll.

Det här verktyget gör det med ett enda kommando, till 71 språk, under din build-process:

```bash
bunx translator-agent -s ./dist -l all
```

Ingen byrå. Inga kalkylark. Ingen leverantörsinlåsning. Ingen registrering. Dina nycklar, din build, dina språk.

> **Du läser beviset.** Denna README översattes genom att köra `bunx translator-agent -s README.md -l all`. Gå och läs [japanska versionen](./translations/ja/README.md) — den översatte inte bara "mätaren börjar om", den ersatte det med en japansk affärsidiom. [Tyska versionen](./translations/de/README.md) är 30% längre eftersom tyska alltid är det. [Arabiska versionen](./translations/ar/README.md) läses från höger till vänster. [Brasilianska portugisiska versionen](./translations/pt-BR/README.md) låter som om en brasilianare skrev den, för det är ju poängen.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [alla 71...](./translations/)

---

## Varför det här fungerar

Översättning är ett löst problem. Lokalisering är det inte.

Google Translate kan förvandla "Våra hamstrar jobbar på det" till japanska. Det den inte kan göra är att inse att skämtet inte fungerar i Japan och ersätta det med något som gör det — som att referera till utvecklingsteamet som jobbar hela natten, vilket både är kulturellt lämpligt och roligt i sammanhanget.

Det här verktyget översätter inte. Det **återskapar** — samma process som reklambyråer tar ut 500 000 kr för när de anpassar en kampanj över marknader. Förutom att LLM:en redan känner till alla kulturer, alla idiom, alla formateringskonventioner. Den vet att:

- `$49/month` blir `649 kr/månad` i Sverige — inte "$49" med en kronsymbol klistrad på
- Sarkasm slår i engelska och dör i formell japanska
- "Drowning in paperwork" blir "noyade administrative" på franska — ett riktigt franskt uttryck, inte en ord-för-ord-översättning
- Tyskarna behåller hamsterskämtet eftersom Hamsterrad (hamsterhjul) är ett riktigt tyskt idiom
- Brasilianare behöver det informella registret annars låter det som en robot skrev det

Modellen klassificerar varje sträng. UI-etiketter får direkt översättning. Marknadsföringstexter anpassas. Humor återskapas helt för målkulturen.

---

## Vad som händer när du kör det

Peka den på din build-output. Den klonar hela filträdet per locale — översätter textfiler, kopierar statiska tillgångar och genererar allt som behövs för deployment:

```
your-site/                          translations/
  index.html                          middleware.ts        ← locale-detektering
  about.html             →            _locales.css         ← typografi per skrift
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", återskapad
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 radavstånd
                                        css/style.css      ← kopierad
                                        js/app.js          ← kopierad
                                        images/logo.png    ← kopierad
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Varje HTML-fil får `lang` och `dir="rtl"` injicerat. Varje locale får CSS med rätt fontstack, radavstånd och textriktning. En Vercel-middleware genereras som läser `Accept-Language` och skriver om till rätt locale.

Deploya till Vercel. En användare i Tokyo ser japanska med Hiragino Sans på 1.8 radavstånd. En användare i Kairo ser RTL arabiska med Noto Naskh på 110% storlek. En användare i Bangkok ser thailändska med `word-break: keep-all` eftersom thailändska saknar mellanslag. Ingen konfiguration.

---

## 90 sekunder, inte 4 veckor

```bash
# Tre språk, en JSON-fil
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Klart. 3 filer skrivna på 9,5s

# Hela din sajt, alla språk på jorden
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Klart. 142 filer översatta, 284 statiska filer kopierade på 94s
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

Varje deploy skeppas på 71 språk. Översättningar är build-artefakter — cachade, regenereras bara när källkoden ändras.

---

## Ta med dina egna nycklar eller inte

```bash
# Du har nycklar — kör lokalt, betala din LLM-leverantör direkt
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Du har inga nycklar — fungerar bara
# Använder automatiskt den hostade tjänsten
# Betala per översättning med USDC via x402 — ingen registrering, inget konto
bunx translator-agent -s ./dist -l all
```

Samma kommando. Om API-nycklar finns kör det lokalt med din leverantör. Om inte träffar det det hostade API:et och betalar per begäran via [x402](https://x402.org) — HTTP 402-betalningsprotokollet. Din klient betalar USDC på Base, får översättningar tillbaka. Ingen auth, ingen leverantörsrelation, inga fakturor.

Stöder Anthropic och OpenAI. Ta med vilken modell du vill:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Alla skriftsystem, hanterade

Verktyget översätter inte bara text — det vet hur varje skriftsystem renderas:

| Skrift | Vad som ändras | Varför |
|---|---|---|
| **Arabiska, hebreiska, farsi, urdu** | `dir="rtl"`, RTL-fonter, 110% storlek | Arabiska behöver större typsnitt för att vara läsbart; hela layouten speglas |
| **Japanska, kinesiska, koreanska** | CJK-fontstackar, 1.8 radavstånd | Tecken är fyrkanter med fast bredd; behöver vertikalt andningsutrymme |
| **Hindi, bengali, tamil, telugu** | Indiska fonter, 1.8 radavstånd | Huvudstreck (shirorekha) behöver extra vertikalt utrymme |
| **Thailändska** | `word-break: keep-all` | Inga mellanslag mellan ord — webbläsaren behöver explicita radbrytningsregler |
| **Burmesiska** | 2.2 radavstånd | Högsta glyferna av alla större skriftsystem |
| **Khmer** | 2.0 radavstånd | Subscript-konsonantkluster staplas vertikalt |

Genererad per-locale CSS:

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

## Cachning

Översättningar är build-artefakter. Generera vid build-tid, cacha outputen, hoppa över när källkoden inte har ändrats.

### Vercel

Vercel cachar build-output automatiskt. Lägg till `postbuild` så är du klar:

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

Källkod oförändrad = cache hit = noll LLM-anrop = noll kostnad.

---

## Alternativ

```
Användning: translator-agent [alternativ]

Alternativ:
  -s, --source <sökväg>     källkatalog eller -fil att scanna
  -l, --locales <locales>   mållocales, kommaseparerade eller "all" för 71 språk
  -o, --output <sökväg>     outputkatalog (standard: "./translations")
  -p, --provider <namn>     anthropic | openai (standard: "anthropic")
  -m, --model <id>          modellöverskridning
  -c, --concurrency <n>     max parallella LLM-anrop (standard: 10)
  --api-url <url>           hostad tjänst-URL (används automatiskt när inga API-nycklar är satta)
```

| Filändelse | Strategi |
|---|---|
| `.json` | Översätt värden, bevara nycklar |
| `.md` / `.mdx` | Översätt text, bevara syntax |
| `.html` / `.htm` | Översätt text, bevara taggar, injicera `lang`/`dir` |
| Allt annat | Kopiera in i varje locale-katalog |

### Alla 71 locales

`-l all` täcker ~95% av internetanvändare: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licens

MIT