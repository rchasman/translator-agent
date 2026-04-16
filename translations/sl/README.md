# translator-agent

10.000 $ problem lokalizacije, rešen v 90 sekundah.

Podjetja plačajo agencijam 0,10–0,25 $ na besedo za lokalizacijo svojih strani. Stran s 5.000 besedami v 10 jezikov stane 5.000–12.000 $ in traja 2–4 tedne. Vsakič, ko spremenite naslov, se števec ponovno zažene.

To orodje to naredi z enim ukazom, v 71 jezikov, med vašim procesom gradnje:

```bash
bunx translator-agent -s ./dist -l all
```

Brez agencije. Brez preglednic. Brez vezanosti na ponudnika. Brez registracije. Vaši ključi, vaša gradnja, vaši jeziki.

> **Berete dokaz.** Ta README je bil preveden z zagonom `bunx translator-agent -s README.md -l all`. Pojdite in preberite [japonsko različico](./translations/ja/README.md) — ni le prevedel "the meter restarts", ampak ga je zamenjal z japonskim poslovnim idiomom. [Nemška različica](./translations/de/README.md) je za 30 % daljša, ker je nemščina pač vedno taka. [Arabska različica](./translations/ar/README.md) se bere z desne proti levi. [Brazilska portugalska različica](./translations/pt-BR/README.md) zveni, kot da jo je napisal Brazilec, ker to je bistvo.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [vseh 71...](./translations/)

---

## Zakaj to deluje

Prevajanje je rešen problem. Lokalizacija ni.

Google Translate lahko spremeni "Our hamsters are working on it" v japonščino. Česar ne more, je prepoznati, da vic v Japonski ne pade dobro, in ga nadomestiti z nečim, kar deluje — kot je omenjanje inženirskega tima, ki dela vso noč, kar je kulturno primerno in smešno v kontekstu.

To orodje ne prevaja. **Transkreira** — isti proces, za katerega oglasne agencije zaračunajo 50.000 $, ko prilagajajo kampanjo različnim trgom. Le da LLM že pozna vsako kulturo, vsak idiom, vsako konvencijo formatiranja. Ve, da:

- `49 $/mesec` postane `月額6.980円` na Japonskem — ne "49 $" z nalepenjem znaka za jen
- Sarkazem ubije v angleščini in propade v formalni japonščini
- "Drowning in paperwork" postane "noyade administrative" v francoščini — pravi francoski izraz, ne dobeseden prevod
- Nemci obdržijo vic s hrčki, ker je Hamsterrad (hrčkov kolešček) pravi nemški idiom
- Brazilci potrebujejo neformalni register, sicer zveni, kot da je napisal robot

Model klasificira vsak niz. Oznake uporabniškega vmesnika dobijo neposreden prevod. Marketinška besedila se prilagodijo. Humor se popolnoma obnovi za ciljno kulturo.

---

## Kaj se zgodi, ko ga poženete

Usmerite ga na svoj izhod gradnje. Klonira celotno drevo datotek za vsako lokalizacijo — prevaja besedilne datoteke, kopira statična sredstva in generira vse potrebno za uvoz:

```
vaša-stran/                         translations/
  index.html                          middleware.ts        ← odkrivanje lokalizacije
  about.html             →            _locales.css         ← tipografija po pisavi
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transkreirano
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1,8 višina vrstice
                                        css/style.css      ← kopirano
                                        js/app.js          ← kopirano
                                        images/logo.png    ← kopirano
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% pisava
                                        ...
                                      de/
                                        ...
```

Vsaka HTML datoteka dobi vstavljene `lang` in `dir="rtl"`. Vsaka lokalizacija dobi CSS s pravilnim nizom pisav, višino vrstice in smer besedila. Generira se Vercel middleware, ki bere `Accept-Language` in preusmerja na pravo lokalizacijo.

Uvoz na Vercel. Uporabnik v Tokiu vidi japonščino s Hiragino Sans pri 1,8 višini vrstice. Uporabnik v Kairu vidi RTL arabščino z Noto Naskh pri 110% velikosti. Uporabnik v Bangkoku vidi tajščino z `word-break: keep-all`, ker tajščina nima presledkov. Brez konfiguracije.

---

## 90 sekund, ne 4 tedni

```bash
# Trije jeziki, ena JSON datoteka
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Končano. 3 datoteke napisane v 9,5 s

# Celotna vaša stran, vsak jezik na Zemlji
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Končano. 142 datotek prevedenih, 284 statičnih datotek kopiranih v 94 s
```

### V vašem procesu gradnje

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Vsak uvoz je v 71 jezikih. Prevodi so artefakti gradnje — predpomnjeni, obnovljeni le, ko se vir spremeni.

---

## Prinesite svoje ključe ali ne

```bash
# Imate ključe — izvaja se lokalno, plačujete svojemu ponudniku LLM neposredno
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Nimate ključev — preprosto deluje
# Samodejno uporabi gostovano storitev
# Plačilo na prevod z USDC prek x402 — brez registracije, brez računa
bunx translator-agent -s ./dist -l all
```

Isti ukaz. Če so API ključi prisotni, se izvaja lokalno z vašim ponudnikom. Če ne, zadene gostovani API in plačuje na zahtevo prek [x402](https://x402.org) — HTTP 402 plačilnega protokola. Vaš odjemalec plačuje USDC na Base, dobi nazaj prevode. Brez avtentifikacije, brez odnosa s ponudnikom, brez računov.

Podpira Anthropic in OpenAI. Prinesite kateri koli model želite:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Vsak sistem pisave, urejen

Orodje ne prevaja le besedila — ve, kako se vsak sistem pisanja prikaže:

| Pisava | Kaj se spremeni | Zakaj |
|---|---|---|
| **Arabščina, hebrejščina, perzijščina, urdu** | `dir="rtl"`, RTL pisave, 110% velikost | Arabščina potrebuje večjo tipografijo za berljivost; celoten razmestitev se zrcali |
| **Japonščina, kitajščina, korejščina** | CJK nizi pisav, 1,8 višina vrstice | Znaki so kvadrati fiksne širine; potrebujejo navpično prostornost |
| **Hindijščina, bengalščina, tamilščina, telugijščina** | Indijske pisave, 1,8 višina vrstice | Glavarice (shirorekha) potrebujejo dodaten navpični prostor |
| **Tajščina** | `word-break: keep-all` | Brez presledkov med besedami — brskalnik potrebuje izrecna pravila za prelom vrstic |
| **Burmščina** | 2,2 višina vrstice | Najvišji glinji katerega koli večjega sistema pisave |
| **Kmerščina** | 2,0 višina vrstice | Podskriptni soglasniški grozdi se zložijo navpično |

Generirani CSS na lokalizacijo:

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

## Predpomnenje

Prevodi so artefakti gradnje. Generiraj ob času gradnje, predpomni izhod, preskoči, če se vir ni spremenil.

### Vercel

Vercel samodejno predpomni izhod gradnje. Dodaj `postbuild` in je končano:

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

Vir nespremenjen = zadetek predpomnilnika = nič LLM klicev = nič stroškov.

---

## Možnosti

```
Uporaba: translator-agent [možnosti]

Možnosti:
  -s, --source <pot>      vdirni imenik ali datoteka za pregled
  -l, --locales <lokalizacije>  ciljne lokalizacije, ločene z vejico ali "all" za 71 jezikov
  -o, --output <pot>      izhodni imenik (privzeto: "./translations")
  -p, --provider <ime>    anthropic | openai (privzeto: "anthropic")
  -m, --model <id>        prepisovanje modela
  -c, --concurrency <n>   največ vzporednih LLM klicev (privzeto: 10)
  --api-url <url>         URL gostovane storitve (samodejno uporabljeno, ko API ključi niso nastavljeni)
```

| Končnica | Strategija |
|---|---|
| `.json` | Prevedi vrednosti, ohrani ključe |
| `.md` / `.mdx` | Prevedi besedilo, ohrani sintakso |
| `.html` / `.htm` | Prevedi besedilo, ohrani oznake, vstavi `lang`/`dir` |
| Vse ostalo | Kopiraj v vsak imenik lokalizacije |

### Vseh 71 lokalizacij

`-l all` pokriva ~95 % internetnih uporabnikov: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licenca

MIT