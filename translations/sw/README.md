# translator-agent

Tatizo la dola 10,000 la utafsiri, limetatuliwa katika sekunde 90.

Makampuni hulipa mashirika $0.10–0.25 kwa neno kutafsiri tovuti zao. Tovuti ya maneno 5,000 katika lugha 10 inagharimu $5,000–12,000 na inachukua majuma 2–4. Kila wakati unabadilisha kichwa cha habari, mzunguko unaanza upya.

Chombo hiki kinafanya kazi hii katika amri moja, katika lugha 71, wakati wa hatua yako ya kujenga:

```bash
bunx translator-agent -s ./dist -l all
```

Hakuna shirika. Hakuna majedwali ya hesabu. Hakuna kufungwa na muuzaji. Hakuna ujisajili. Funguo zako, ujenzi wako, lugha zako.

> **Unakaranta uthibitisho.** README hii ilitafsiriwa kwa kuendesha `bunx translator-agent -s README.md -l all`. Nenda usome [toleo la Kijapani](./translations/ja/README.md) — halikutafsiri tu "mzunguko unaanza upya," lilibadilisha na methali ya biashara ya Kijapani. [Toleo la Kijerumani](./translations/de/README.md) ni ndefu zaidi asilimia 30 kwa sababu Kijerumani daima ni hivyo. [Toleo la Kiarabu](./translations/ar/README.md) linasomwa kutoka kulia-kushoto. [Toleo la Kireno cha Brazil](./translations/pt-BR/README.md) linaonekana kama Mbrazili ameliandika, kwa sababu hilo ndilo lengo.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [zote 71...](./translations/)

---

## Kwa nini hii inafanya kazi

Utafsiri ni tatizo lililotatuliwa. Uhamishaji wa kitamaduni si hivyo.

Google Translate inaweza kubadilisha "Panya wetu wa guinea wanafanya kazi juu yake" kuwa Kijapani. Kile ambacho hakiwezi kufanya ni kutambua kwamba utani huu haufikii Japani, na kuubadilisha na kitu kinachofaa — kama kurejelea timu ya uhandisi inayofanya kazi usiku mzima, jambo linalofaa kitamaduni na la kuchekesha katika muktadha.

Chombo hiki hakitafsiri. Kinaunda upya — mchakato huo huo ambao mashirika ya matangazo huchoza dola 50,000 wanapobadilisha kampeni kupitia masoko. Ila LLM tayari inajua kila utamaduni, kila methali, kila desturi ya umbizo. Inajua kwamba:

- `$49/mwezi` inakuwa `月額6,980円` nchini Japani — si "$49" na alama ya yen iliyobandikwa
- Dhihaka inaua kwa Kiingereza na inafa kwa Kijapani cha rasmi
- "Kuzama katika karatasi za kazi" inakuwa "noyade administrative" kwa Kifaransa — usemi wa kweli wa Kifaransa, si tafsiri ya neno-kwa-neno
- Wajerumani wanaweka utani wa panya kwa sababu Hamsterrad (gurudumu la panya) ni methali halisi ya Kijerumani
- Wabrazili wanahitaji sauti ya kawaida au itaonekana kama roboti ameandika

Muundo unagawa kila kamba. Lebo za UI zinapata tafsiri ya moja kwa moja. Nakala za masoko zinabadilishwa. Utani unaundwa upya kabisa kwa tamaduni lengwa.

---

## Kinachotokea unapokiendesha

Kielekeze kwenye toleo lako la kujenga. Kinakili mti mzima wa mafaili kwa kila eneo — kikitafsiri mafaili ya maandishi, kinakili mali thabiti, na kuzalisha kila kitu kinachohitajika kwa uwekaji:

```
tovuti-yako/                        tafsiri/
  index.html                          middleware.ts        ← utambuzi wa eneo
  about.html             →            _locales.css         ← chapishaji kwa kila hati
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", imeundwa upya
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, urefu wa mistari 1.8
                                        css/style.css      ← imekolewa
                                        js/app.js          ← imekolewa
                                        images/logo.png    ← imekolewa
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, fonti 110%
                                        ...
                                      de/
                                        ...
```

Kila faili la HTML linapata `lang` na `dir="rtl"` iliyoingizwa. Kila eneo linapata CSS yenye mfumo sahihi wa fonti, urefu wa mistari, na mwelekeo wa maandishi. Middleware ya Vercel inazalishwa inayosoma `Accept-Language` na kuandika upya kwenda eneo sahihi.

Weka kwenye Vercel. Mtumiaji Tokyo ataona Kijapani na Hiragino Sans kwenye urefu wa mistari 1.8. Mtumiaji Cairo ataona Kiarabu cha RTL na Noto Naskh kwenye ukubwa wa 110%. Mtumiaji Bangkok ataona Kithai na `word-break: keep-all` kwa sababu Kithai hakina nafasi. Hakuna usanidi.

---

## Sekunde 90, si majuma 4

```bash
# Lugha tatu, faili moja la JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Imekwisha. Mafaili 3 yameandikwa katika sekunde 9.5

# Tovuti yako yote, kila lugha duniani
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Imekwisha. Mafaili 142 yametafsiriwa, mafaili thabiti 284 yamekolewa katika sekunde 94
```

### Katika mfumo wako wa kujenga

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Kila uwekaji unatumiwa kwa lugha 71. Tafsiri ni mazao ya ujenzi — yamehifadhiwa, yanazalishwa upya tu wakati chanzo kinabadilika.

---

## Leta funguo zako au usizilete

```bash
# Una funguo — inafanya kazi ndani, unalipa mtoa huduma wa LLM moja kwa moja
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Huna funguo — inafanya kazi tu
# Hutumia huduma iliyopangwa kiotomatiki
# Lipa kwa tafsiri kwa USDC kupitia x402 — hakuna ujisajili, hakuna akaunti
bunx translator-agent -s ./dist -l all
```

Amri ile ile. Ikiwa funguo za API zipo, inafanya kazi ndani na mtoa wako. Ikiwa sivyo, inafika API iliyopangwa na kulipa kwa kila ombi kupitia [x402](https://x402.org) — itifaki ya malipo ya HTTP 402. Mteja wako analipa USDC kwenye Base, anapata tafsiri kurudi. Hakuna uhalalishaji, hakuna uhusiano wa muuzaji, hakuna ankara.

Inasaidia Anthropic na OpenAI. Leta muundo wowote unaotaka:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Kila mfumo wa hati, umeshughulikiwa

Chombo hakitafsiri tu maandishi — kinajua jinsi kila mfumo wa uandishi unavyoonyeshwa:

| Hati | Kinachobadilika | Kwa nini |
|---|---|---|
| **Kiarabu, Kiyahudi, Kifarisi, Kiurdu** | `dir="rtl"`, fonti za RTL, ukubwa wa 110% | Kiarabu kinahitaji aina kubwa zaidi ili kiweze kusomeka; mpangilio wote unainama |
| **Kijapani, Kichina, Kikorea** | Mifumo ya fonti za CJK, urefu wa mistari 1.8 | Herufi ni mraba za upana uliosongwa; zinahitaji nafasi ya kupumua wima |
| **Kihindi, Kibengali, Kitamil, Kitelugu** | Fonti za Kihindi, urefu wa mistari 1.8 | Michoro ya kichwa (shirorekha) inahitaji nafasi ya ziada ya wima |
| **Kithai** | `word-break: keep-all` | Hakuna nafasi kati ya maneno — kivinjari kinahitaji kanuni mahsusi za uvunjaji wa mistari |
| **Kiburma** | Urefu wa mistari 2.2 | Herufi ndefu zaidi za hati kuu yoyote |
| **Kikamboja** | Urefu wa mistari 2.0 | Vikundi vya konsonanti za chini vinapangwa wima |

CSS iliyozalishwa kwa kila eneo:

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

## Uhifadhi

Tafsiri ni mazao ya ujenzi. Zalisha wakati wa kujenga, hifadhi toleo, ruka wakati chanzo hakijabadilika.

### Vercel

Vercel inahifadhi toleo la ujenzi kiotomatiki. Ongeza `postbuild` na umekwisha:

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

Chanzo hakijabadilika = patuliwa kwenye hifadhi = simu za LLM sifuri = gharama sifuri.

---

## Chaguo

```
Matumizi: translator-agent [chaguo]

Chaguo:
  -s, --source <njia>      saraka au faili la chanzo la kuchunguza
  -l, --locales <maeneo>   maeneo lengwa, yaliyotengwa kwa koma au "all" kwa lugha 71
  -o, --output <njia>      saraka ya toleo (chaguomsingi: "./translations")
  -p, --provider <jina>    anthropic | openai (chaguomsingi: "anthropic")
  -m, --model <kitambulisho> muundo wa kubadilisha
  -c, --concurrency <n>    kiwango cha juu cha simu za LLM sambamba (chaguomsingi: 10)
  --api-url <url>          URL ya huduma iliyopangwa (hutumika kiotomatiki wakati hakuna funguo za API)
```

| Kiendelezi | Mkakati |
|---|---|
| `.json` | Tafsiri maadili, hifadhi funguo |
| `.md` / `.mdx` | Tafsiri maandishi, hifadhi sintaksi |
| `.html` / `.htm` | Tafsiri maandishi, hifadhi lebo, ingiza `lang`/`dir` |
| Kila kingine | Nakili katika kila saraka ya eneo |

### Maeneo yote 71

`-l all` inashughulikia ~95% ya watumiaji wa mtandao: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Leseni

MIT