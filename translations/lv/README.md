# translator-agent

10 000 $ lokalizācijas problēma, atrisināta 90 sekundēs.

Uzņēmumi maksā aģentūrām 0,10–0,25 $ par vārdu, lai lokalizētu savas vietnes. 5 000 vārdu vietnes tulkošana 10 valodās maksā 5 000–12 000 $ un aizņem 2–4 nedēļas. Katru reizi, kad maini virsrakstu, skaitītājs sāk no jauna.

Šis rīks to izdara ar vienu komandu 71 valodā, izveides posmā:

```bash
bunx translator-agent -s ./dist -l all
```

Bez aģentūras. Bez izklājlapām. Bez piesaistes. Bez reģistrācijas. Tavi atslēdznieki, tava izveide, tavas valodas.

> **Tu lasi pierādījumu.** Šis README tika tulkots, palaižot `bunx translator-agent -s README.md -l all`. Paskatieties [japāņu versiju](./translations/ja/README.md) — tas ne tikai tulkoja "skaitītājs sāk no jauna", bet aizvietoja to ar japāņu biznesa idiomas izteicienu. [Vācu versija](./translations/de/README.md) ir par 30% garāka, jo vāciski vienmēr tā ir. [Arābu versija](./translations/ar/README.md) lasās no labās uz kreiso. [Brazīlijas portugāļu versija](./translations/pt-BR/README.md) skan tā, it kā to būtu rakstījis brazīlietis, jo tāda ir jēga.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [visas 71...](./translations/)

---

## Kāpēc tas darbojas

Tulkošana ir atrisināta problēma. Lokalizācija nav.

Google Tulkotājs var pārvērst "Mūsu kāmji strādā pie tā" japāniski. Kas tas nevar darīt, ir atpazīt, ka joks Japānā nenostrādā, un aizvietot to ar kaut ko, kas nostrādā — piemēram, atsaucoties uz inženieru komandu, kas vilkās cauru nakti, kas ir gan kultūrviski piemērots, gan smieklīgs kontekstā.

Šis rīks netulko. Tas **pārrada** — to pašu procesu, par ko reklāmas aģentūras ņem 50 000 $, kad adaptē kampaņu dažādos tirgos. Izņemot to, ka LLM jau zina katru kultūru, katru idiomu, katru noformējuma konvenciju. Tas zina, ka:

- `$49/month` Japānā kļūst par `月額6,980円` — nevis "$49" ar jenas simbolu uzlīmētu virsū
- Sarkasms angliski uzplaukst, bet formālā japāņu valodā nomirst
- "Noslīkst dokumentos" franciski kļūst par "noyade administrative" — īsts franču izteiciens, nevis vārds vārdā tulkojums
- Vācieši saglabā kāmja joku, jo Hamsterrad (kāmja ritenis) ir īsta vācu idioma
- Brazīlieši vajag neformālu stilu, citādi skan, it kā to būtu rakstījis robots

Modelis klasificē katru rindu. UI etiķetes tiek tulkotas tieši. Mārketinga teksts tiek adaptēts. Humors tiek pilnībā pārveidots mērķa kultūrai.

---

## Kas notiek, kad to palaid

Norādi uz savu izveides izvadi. Tas klonē visu failu koku katrai lokalizācijai — tulkojot teksta failus, kopējot statiskos resursus un ģenerējot visu, kas vajadzīgs izvietošanai:

```
your-site/                          translations/
  index.html                          middleware.ts        ← lokalizācijas noteikšana
  about.html             →            _locales.css         ← tipogrāfija katram rakstam
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", pārradīts
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1,8 rindu augstums
                                        css/style.css      ← nokopēts
                                        js/app.js          ← nokopēts
                                        images/logo.png    ← nokopēts
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% fonts
                                        ...
                                      de/
                                        ...
```

Katrā HTML failā tiek iesprausts `lang` un `dir="rtl"`. Katra lokalizācija saņem CSS ar pareizo fontu komplektu, rindu augstumu un teksta virzienu. Tiek ģenerēts Vercel starpprogrammatūras fails, kas nolasa `Accept-Language` un pārvirza uz pareizo lokalizāciju.

Izvieto uz Vercel. Lietotājs Tokijā redz japāņu valodu ar Hiragino Sans un 1,8 rindu augstumu. Lietotājs Kairā redz RTL arābu valodu ar Noto Naskh un 110% izmēru. Lietotājs Bangkokā redz tajiešu valodu ar `word-break: keep-all`, jo tajiešu valodā nav atstarpes. Bez konfigurācijas.

---

## 90 sekundes, nevis 4 nedēļas

```bash
# Trīs valodas, viens JSON fails
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Pabeigts. 3 faili uzrakstīti 9,5s

# Visa tava vietne, katra valoda uz zemes
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Pabeigts. 142 faili tulkoti, 284 statiski faili kopēti 94s
```

### Tavā izveides sistēmā

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Katra izvietošana tiek piegādāta 71 valodā. Tulkojumi ir izveides artefakti — kešoti, reģenerēti tikai tad, kad mainās avots.

---

## Izmanto savus atslēdzniekus vai neizmanto

```bash
# Tev ir atslēdznieki — darbojas lokāli, tu maksā tieši LLM piegādātājam
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Tev nav atslēdznieku — vienkārši darbojas
# Automātiski izmanto mitināto pakalpojumu
# Maksā par tulkojumu ar USDC caur x402 — bez reģistrācijas, bez konta
bunx translator-agent -s ./dist -l all
```

Tā pati komanda. Ja ir API atslēdznieki, tas darbojas lokāli ar tavu piegādātāju. Ja nav, tas saslēdzas ar mitināto API un maksā par pieprasījumu caur [x402](https://x402.org) — HTTP 402 maksājuma protokolu. Tavs klients maksā USDC uz Base, saņem tulkojumus atpakaļ. Bez autentifikācijas, bez piegādātāja attiecībām, bez rēķiniem.

Atbalsta Anthropic un OpenAI. Izmanto jebkuru modeli, kādu vēlies:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Katra rakstu sistēma, norisināta

Rīks ne tikai tulko tekstu — tas zina, kā katra rakstu sistēma tiek atveidota:

| Raksts | Kas mainās | Kāpēc |
|---|---|---|
| **Arābu, ebreju, farsi, urdu** | `dir="rtl"`, RTL fonti, 110% izmērs | Arābu rakstam vajag lielāku tipu, lai būtu salasāms; visa izkārtojuma spoguļošana |
| **Japāņu, ķīniešu, korejiešu** | CJK fontu komplekti, 1,8 rindu augstums | Rakstzīmes ir fiksēta platuma kvadrāti; vajag vertikālu elpu |
| **Hindi, bengāļu, tamilu, telugu** | Indiešu fonti, 1,8 rindu augstums | Galvas svītrojumiem (shirorekha) vajag papildu vertikālu vietu |
| **Taju** | `word-break: keep-all` | Nav atstarpu starp vārdiem — pārlūkprogrammai vajag skaidrus rindas pārtraukuma noteikumus |
| **Birmiešu** | 2,2 rindu augstums | Augstākās glīfas jebkurā galvenajā rakstā |
| **Khmeru** | 2,0 rindu augstums | Apakšraksta līdzskalu kopa krājas vertikāli |

Ģenerētā lokalizācijas CSS:

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

## Kešošana

Tulkojumi ir izveides artefakti. Ģenerē izveides laikā, keš izvadi, izlaid, ja avots nav mainījies.

### Vercel

Vercel automātiski keš izveides izvadi. Pievieno `postbuild` un viss gatavs:

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

Avots nemainīgs = keša trāpījums = nulle LLM izsaukumu = nulles izmaksas.

---

## Opcijas

```
Lietošana: translator-agent [opcijas]

Opcijas:
  -s, --source <ceļš>      avota direktorija vai fails skenēšanai
  -l, --locales <lokalizācijas>  mērķa lokalizācijas, ar komatiem atdalītas vai "all" 71 valodām
  -o, --output <ceļš>      izvades direktorija (noklusējums: "./translations")
  -p, --provider <nosaukums>    anthropic | openai (noklusējums: "anthropic")
  -m, --model <id>         modeļa pārdefinēšana
  -c, --concurrency <n>    maksimālais paralēlo LLM izsaukumu skaits (noklusējums: 10)
  --api-url <url>          mitinātā pakalpojuma URL (auto-izmanto, ja nav API atslēdznieku)
```

| Paplašinājums | Stratēģija |
|---|---|
| `.json` | Tulkot vērtības, saglabāt atslēgas |
| `.md` / `.mdx` | Tulkot tekstu, saglabāt sintaksi |
| `.html` / `.htm` | Tulkot tekstu, saglabāt tagus, iespraust `lang`/`dir` |
| Viss pārējais | Kopēt katrā lokalizācijas direktorijā |

### Visas 71 lokalizācijas

`-l all` aptver ~95% interneta lietotāju: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licence

MIT