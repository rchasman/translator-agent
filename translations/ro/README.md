# translator-agent

Problema de localizare de 10.000 dolari, rezolvată în 90 de secunde.

Companiile plătesc agențiilor 0,10–0,25 dolari per cuvânt pentru a localiza site-urile. Un site cu 5.000 de cuvinte în 10 limbi costă 5.000–12.000 dolari și durează 2–4 săptămâni. De fiecare dată când schimbi un titlu, totul se reia de la capăt.

Acest instrument face totul într-o singură comandă, în 71 de limbi, în timpul procesului de build:

```bash
bunx translator-agent -s ./dist -l all
```

Fără agenție. Fără spreadsheet-uri. Fără vendor lock-in. Fără înregistrare. Cheile tale, build-ul tău, limbile tale.

> **Citești dovada.** Acest README a fost tradus prin executarea `bunx translator-agent -s README.md -l all`. Citește [versiunea japoneză](./translations/ja/README.md) — nu a tradus doar "the meter restarts", ci l-a înlocuit cu un idiom de business japonez. [Versiunea germană](./translations/de/README.md) este cu 30% mai lungă pentru că germana întotdeauna este. [Versiunea arabă](./translations/ar/README.md) se citește de la dreapta la stânga. [Versiunea braziliană](./translations/pt-BR/README.md) sună ca și cum ar fi scrisă de un brazilian, pentru că asta e ideea.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [toate cele 71...](./translations/)

---

## De ce funcționează

Traducerea este o problemă rezolvată. Localizarea nu.

Google Translate poate transforma "Our hamsters are working on it" în japoneză. Ce nu poate face este să recunoască că gluma nu funcționează în Japonia și să o înlocuiască cu ceva care funcționează — cum ar fi să facă referire la echipa de ingineri care lucrează toată noaptea, ceea ce e atât cultural adecvat, cât și amuzant în context.

Acest instrument nu traduce. **Transcreează** — același proces pentru care agențiile de publicitate iau 50.000 de dolari când adaptează o campanie pe piețe diferite. Doar că LLM-ul cunosce deja fiecare cultură, fiecare idiom, fiecare convenție de formatare. Știe că:

- `$49/month` devine `月額6,980円` în Japonia — nu "$49" cu un simbol yen lipit pe el
- Sarcasmul este perfect în engleză și moare în japoneza formală
- "Drowning in paperwork" devine "noyade administrative" în franceză — o expresie franceză reală, nu o traducere cuvânt cu cuvânt
- Germanii păstrează gluma cu hamsterul pentru că Hamsterrad (roata hamsterului) e un idiom german real
- Brazilienii au nevoie de registrul casual altfel sună ca și cum ar fi scris de un robot

Modelul clasifică fiecare string. Etichetele UI primesc traducere directă. Copy-ul de marketing se adaptează. Umorul se recreează complet pentru cultura țintă.

---

## Ce se întâmplă când îl rulezi

Îl îndreptezi către output-ul de build. Clonează întregul arbore de fișiere per locale — traducând fișierele text, copiind asset-urile statice și generând tot ce e necesar pentru deployment:

```
your-site/                          translations/
  index.html                          middleware.ts        ← detectarea locale-ului
  about.html             →            _locales.css         ← tipografie per script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreeat
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, înălțime linie 1.8
                                        css/style.css      ← copiat
                                        js/app.js          ← copiat
                                        images/logo.png    ← copiat
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, font 110%
                                        ...
                                      de/
                                        ...
```

Fiecare fișier HTML primește `lang` și `dir="rtl"` injectat. Fiecare locale primește CSS cu stack-ul de fonturi corect, înălțimea liniei și direcția textului. Se generează un middleware Vercel care citește `Accept-Language` și redirecționează către locale-ul potrivit.

Deploy pe Vercel. Un user din Tokyo vede japoneză cu Hiragino Sans la înălțime linie 1.8. Un user din Cairo vede arabă RTL cu Noto Naskh la 110% mărime. Un user din Bangkok vede thailandeză cu `word-break: keep-all` pentru că thailandeza nu are spații. Fără configurare.

---

## 90 de secunde, nu 4 săptămâni

```bash
# Trei limbi, un fișier JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Gata. 3 fișiere scrise în 9,5s

# Întregul tău site, fiecare limbă de pe pământ
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Gata. 142 de fișiere traduse, 284 de fișiere statice copiate în 94s
```

### În pipeline-ul tău de build

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Fiecare deploy livrează în 71 de limbi. Traducerile sunt artefacte de build — cached, regenerate doar când se schimbă sursa.

---

## Adu-ți propriile chei sau nu

```bash
# Ai chei — rulează local, plătești furnizorul de LLM direct
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# N-ai chei — funcționează oricum
# Folosește automat serviciul hosted
# Plătește per traducere cu USDC via x402 — fără înregistrare, fără cont
bunx translator-agent -s ./dist -l all
```

Aceeași comandă. Dacă există chei API, rulează local cu furnizorul tău. Dacă nu, accesează API-ul hosted și plătește per cerere prin [x402](https://x402.org) — protocolul de plată HTTP 402. Clientul tău plătește USDC pe Base, primește traduceri înapoi. Fără autentificare, fără relație cu vendor-ul, fără facturi.

Suportă Anthropic și OpenAI. Adu oricare model vrei:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Fiecare sistem de scriere, gestionat

Instrumentul nu doar traduce textul — știe cum se redă fiecare sistem de scriere:

| Script | Ce se schimbă | De ce |
|---|---|---|
| **Arabă, Ebraică, Persană, Urdu** | `dir="rtl"`, fonturi RTL, mărime 110% | Araba are nevoie de text mai mare să fie lizibil; întregul layout se oglindește |
| **Japoneză, Chineză, Coreeană** | stack-uri de fonturi CJK, înălțime linie 1.8 | Caracterele sunt pătrate de lățime fixă; au nevoie de spațiu vertical de respirat |
| **Hindi, Bengaleză, Tamil, Telugu** | fonturi indice, înălțime linie 1.8 | Liniuțele de sus (shirorekha) au nevoie de spațiu vertical extra |
| **Thailandeză** | `word-break: keep-all` | Fără spații între cuvinte — browser-ul are nevoie de reguli explicite de line-break |
| **Birman** | înălțime linie 2.2 | Cele mai înalte glife din orice script major |
| **Khmer** | înălțime linie 2.0 | Clusterele de consoane subscript se stivuiesc vertical |

CSS generat per locale:

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

Traducerile sunt artefacte de build. Generează la build time, cache-uiește output-ul, sare când sursa nu s-a schimbat.

### Vercel

Vercel cache-uiește output-ul de build automat. Adaugă `postbuild` și gata:

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

Sursa neschimbată = cache hit = zero apeluri LLM = cost zero.

---

## Opțiuni

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      directorul sau fișierul sursă de scanat
  -l, --locales <locales>  locale-uri țintă, separate prin virgulă sau "all" pentru 71 de limbi
  -o, --output <path>      directorul de output (implicit: "./translations")
  -p, --provider <name>    anthropic | openai (implicit: "anthropic")
  -m, --model <id>         suprascrierea modelului
  -c, --concurrency <n>    max apeluri LLM paralele (implicit: 10)
  --api-url <url>          URL serviciu hosted (folosit automat când nu sunt setate chei API)
```

| Extensie | Strategie |
|---|---|
| `.json` | Traduce valori, păstrează chei |
| `.md` / `.mdx` | Traduce text, păstrează sintaxa |
| `.html` / `.htm` | Traduce text, păstrează tag-uri, injectează `lang`/`dir` |
| Tot restul | Copiază în fiecare director locale |

### Toate cele 71 de locale

`-l all` acoperă ~95% din utilizatorii de internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licență

MIT