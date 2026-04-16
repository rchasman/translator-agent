# translator-agent

የ $10,000 ዶላር የአካባቢያዊነት ችግር በ 90 ሰከንድ ውስጥ ተፈቷል።

ኩባንያዎች ድህረ ገጾቻቸውን ለማካባቢያዊ ማድረግ በአንድ ቃል $0.10–0.25 ሳንቲም ለኤጀንሲዎች ይከፍላሉ። 5,000 ቃላት ያለው ድህረ ገጽ ወደ 10 ቋንቋዎች የማስተርጎም ወጪው $5,000–12,000 ሲሆን 2–4 ሳምንታት ይወስዳል። ርዕስ ለወጡ ቁጥር ሂሳቡ እንደገና ይጀመራል።

ይህ መሳሪያ በአንድ ትዕዛዝ፣ ወደ 71 ቋንቋዎች፣ በእርስዎ የግንባታ ሂደት ውስጥ ያከናውነዋል፦

```bash
bunx translator-agent -s ./dist -l all
```

ኤጀንሲ አይደለም። የስፕሬድሺት የለም። የቅጥረኛ ትስስር የለም። ምዝገባ የለም። እርስዎ ቁልፎች፣ እርስዎ ግንባታ፣ እርስዎ ቋንቋዎች።

> **እየተንበቡት ያለው ማረጋገጫው ነው።** ይህ README `bunx translator-agent -s README.md -l all` በማሄድ ተተርጉሟል። [የጃፓን ስሪቱን](./translations/ja/README.md) ለማንበብ ይሞክሩ — "ሂሳቡ እንደገና ይጀመራል" ብቻ ሳይተርጎም፣ በጃፓን የንግድ አባባል ተክቶታል። [የጀርመን ስሪቱ](./translations/de/README.md) ጀርመኛ ሁልጊዜ እንደሚሆን 30% ረዘም ያለ ነው። [የአረብ ስሪቱ](./translations/ar/README.md) ቀኝ ወደ ግራ ይነበባል። [የብራዚላዊ ፖርቱጋልኛ ስሪቱ](./translations/pt-BR/README.md) የብራዚላዊ እንደጻፈው ይሰማል፣ ምክንያቱም ያ ነው ዓላማው።
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [ሁሉም 71...](./translations/)

---

## ይህ ለምን እንደሚሰራ

ትርጉም የተፈታ ችግር ነው። አካባቢያዊነት አይደለም።

Google Translate "አሻንጉሊቶቻችን በዚህ ላይ እየሰሩ ነው" ወደ ጃፓንኛ ሊተረጐም ይችላል። ማድረግ የማይችለው አስቂኙ በጃፓን አንደማይሳተፍ መገንዘብ እና በሚሳተፍ ነገር መተካት ነው — እንደ የምህንድስና ቡድኑ ሌሊቱን ሙሉ መስራት፣ ይህ ባሕላዊ በሚያስፈልግ ሁኔታ እና አስቂኝ ነው።

ይህ መሳሪያ አይተርጎምም። **ይፈጥራል** — ተመሳሳይ ሂደት የማስታወቂያ ኤጀንሲዎች መስመር በኩል ዘመቻን ሲያስተካክሉ $50,000 የሚያስከፍል። ኤልኤምን ለሁሉም ባሕል፣ ለሁሉም አባባል፣ ለሁሉም የቅርጸት ስምምነት ቀድሞ ያውቃል። የሚያውቀው፦

- `$49/month` በጃፓን `月額6,980円` ይሆናል — "$49" ዬን ምልክት ላይ አይተወትም
- ስድብ በእንግሊዝኛ ይገድላል በመደበኛ ጃፓንኛ ይሞታል
- "በወረቀት መስራት ውስጥ መስጠም" በፈረንሳይኛ "noyade administrative" ይሆናል — እውነተኛ የፈረንሳይ አገላለጽ፣ ቃል በቃል ትርጉም አይደለም
- ጀርመኖች የአሻንጉሊት አስቂኙን ይይዛሉ ምክንያቱም Hamsterrad (አሻንጉሊት ጎማ) እውነተኛ የጀርመን አባባል ነው
- ብራዚላዊዎች ተራ መመዝገብ ያስፈልጋቸዋል ወይም ሮቦት እንደጻፈው ይሰማል

ሞዴሉ እያንዳንዱን ሕብረቁምፊ ይመድባል። የUIመለያዎች ቀጥተኛ ትርጉም ያገኛሉ። የግብይት ቅጅ ይስተካከላል። አስቂኝነት ለዒላማ ባሕል በሙሉ ይዳስሳል።

---

## በሚያሄዱት ጊዜ ምን ይከሰታል

በግንባታ ውፅዓት ላይ ይጠቁሙ። በእያንዳንዱ አካባቢ አጠቃላይ የፋይል ዛፍን ይቀዳል — የጽሑፍ ፋይሎችን በመተርጓም፣ የማይንቀሳቀስ ንብረቶችን በመቅዳት፣ እና ለስርግዛት የሚያስፈልገውን ሁሉ በማመንጨት፦

```
your-site/                          translations/
  index.html                          middleware.ts        ← አካባቢ ማወቅ
  about.html             →            _locales.css         ← በስክሪፕት የጽሑፍ አደረጃጀት
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreated
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← ተቀድቷል
                                        js/app.js          ← ተቀድቷል
                                        images/logo.png    ← ተቀድቷል
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

እያንዳንዱ HTML ፋይል `lang` እና `dir="rtl"` ይወጉበታል። እያንዳንዱ አካባቢ ትክክለኛ የፊደል መጀመሪያ፣ የመስመር ቁመት፣ እና የጽሑፍ አቅጣጫ ከCSS ጋር ያገኛል። `Accept-Language`ን የሚነበብ እና ወደ ትክክለኛው አካባቢ የሚዳይሪክት የVercel middleware ይመነጫል።

ወደ Vercel ይሰራጩ። በቶኪዮ ያለ ተጠቃሚ የጃፓንኛን በHiragino Sans በ 1.8 መስመር ቁመት ያያል። በካይሮ ያለ ተጠቃሚ RTL አረብኛን በNoto Naskh በ 110% መጠን ያያል። በባንኮክ ያለ ተጠቃሚ ታይኛን በ `word-break: keep-all` ያያል ምክንያቱም ታይኛ ክፍተት የለውም። ውቅሮች የለም።

---

## 90 ሰከንድ፣ 4 ሳምንታት ሳይሆን

```bash
# ሦስት ቋንቋዎች፣ አንድ JSON ፋይል
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
ተጠናቋል። 3 ፋይሎች በ 9.5 ሰከንድ ተጽፈዋል

# አጠቃላይ ድህረ ገፅዎ፣ በምድር ላይ ያለ እያንዳንዱ ቋንቋ
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
ተጠናቋል። 142 ፋይሎች ተተረጎሟል፣ 284 የማይንቀሳቀስ ፋይሎች በ 94 ሰከንድ ተቀድተዋል
```

### በእርስዎ የግንባታ ቧንቧ ውስጥ

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

እያንዳንዱ ስርግዛት በ 71 ቋንቋዎች ይላካል። ትርጉሞች የግንባታ ውጤቶች ናቸው — ተዘግበዋል፣ ምንጭ በሚቀይርበት ጊዜ ብቻ እንደገና ይመነጫሉ።

---

## የራስዎን ቁልፎች ያመጡ ወይም አያመጡ

```bash
# ቁልፎች አለዎት — በአካባቢያዊ ይሮጣል፣ LLM አቅራቢዎን በቀጥታ ይከፍላሉ
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# ቁልፎች የሎትም — ብቻ ይሰራል
# በራስ-አመራር የሚያገልግል አገልግሎት ይጠቀማል
# በx402 በኩል USDC በመክፈል ለእያንዳንዱ ትርጉም ይከፍላሉ — ምዝገባ ወይም አካውንት የለም
bunx translator-agent -s ./dist -l all
```

ተመሳሳይ ትዕዛዝ። API ቁልፎች ካሉ፣ በአካባቢያዊ በአቅራቢዎ ጋር ይሮጣል። ካልሆነ፣ የሚያገልግለውን API ይመታ እና በ[x402](https://x402.org) በኩል በጥያቄ ይከፍላል — HTTP 402 የክፍያ ፕሮቶኮል። ደንበኛዎ USDC በBase ላይ ይከፍላ፣ ትርጉሞችን ተመላሽ ያገኛል። ፍቃድ ወይም አቅራቢ ግንኙነት፣ ወይም ደረሰኞች የለም።

Anthropic እና OpenAI ይደግፋል። የሚፈልጉትን ሞዴል ያመጡ፦

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## እያንዳንዱ የስክሪፕት ሥርዓት፣ ተያዛ

መሳሪያው ጽሑፍን ብቻ አይተረጉምም — እያንዳንዱ የመጻሕፍት ሥርዓት እንዴት እንደሚሰራ ያውቃል፦

| ስክሪፕት | ምን ይቀያል | ለምን |
|---|---|---|
| **አረብኛ፣ እብራይስጥ፣ ፋርሲ፣ ኡርዱ** | `dir="rtl"`፣ RTL ፊደላት፣ 110% መጠን | አረብኛ የሚነበብ ለመሆን ትልቅ አይነት ያስፈልገዋል; አጠቃላይ አሠራር ይምራል |
| **ጃፓንኛ፣ ቻይንኛ፣ ኮሪያኛ** | CJK የፊደል መስመሮች፣ 1.8 መስመር ቁመት | ገጸ ባህሪያት ቋሚ ስፋት ካሬዎች ናቸው; ቁመት መተንፈሻ ክፍተት ያስፈልጋቸዋል |
| **ሕንድኛ፣ ቤንጋሊ፣ ታሚል፣ ቴሉጉ** | ሕንድ ፊደላት፣ 1.8 መስመር ቁመት | የራስ-መልእክቶች (shirorekha) ተጨማሪ ቁመት ክፍተት ያስፈልጋቸዋል |
| **ታይኛ** | `word-break: keep-all` | በቃላት መካከል ክፍተት የለም — አሳሽ ግልጽ የመስመር መስብር ደንቦች ያስፈልጉታል |
| **በርሳንኛ** | 2.2 መስመር ቁመት | በማንኛውም ዋና ስክሪፕት ውስጥ በጣም ከፍ ያለ ገጸ ባህሪያት |
| **ክሜር** | 2.0 መስመር ቁመት | የተሸጋጋሪ ሆሄያት ስብስቦች በቁመት ይቀመጣሉ |

በአካባቢ የመነጩ CSS፦

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

## ማኅዞን

ትርጉሞች የግንባታ ውጤቶች ናቸው። በግንባታ ጊዜ ያመንጩ፣ ውጤቱን ያኅዙ፣ ምንጭ ሳይቀይር ይትዑ።

### Vercel

Vercel የግንባታ ውጤት በራስ-አመራር ያኅዛል። `postbuild` ጨምሩ እና ተጠናቋል፦

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

ምንጭ ያልተቀየረ = የማኅዞን ፍጥነት = ዜሮ LLM ጥሪዎች = ዜሮ ወጪ።

---

## አማራጮች

```
አጠቃቀም: translator-agent [አማራጮች]

አማራጮች:
  -s, --source <መንገድ>      ለመቃኘት ምንጭ ማውጫ ወይም ፋይል
  -l, --locales <አካባቢዎች>  የዒላማ አካባቢዎች፣ በኮማ የተለዩ ወይም "all" ለ71 ቋንቋዎች
  -o, --output <መንገድ>      የውጤት ማውጫ (ነባሪ: "./translations")
  -p, --provider <ስም>    anthropic | openai (ነባሪ: "anthropic")
  -m, --model <id>         ሞዴል እንክዋን
  -c, --concurrency <n>    ከፍተኛ ባለመጋደል LLM ጥሪዎች (ነባሪ: 10)
  --api-url <url>          የሚያገልግል አገልግሎት URL (API ቁልፎች ሳይሰቀሉ በራስ-አመራር ጥቅም ላይ ይውላል)
```

| ቅጥያ | ስትራቴጂ |
|---|---|
| `.json` | እሴቶችን ተርጓሚ፣ ቁልፎችን ጠብቅ |
| `.md` / `.mdx` | ጽሑፍን ተርጓሚ፣ አገባብን ጠብቅ |
| `.html` / `.htm` | ጽሑፍን ተርጓሚ፣ ምልክቶችን ጠብቅ፣ `lang`/`dir` ውስጥ ውገብ |
| ሌላ ሁሉ | ወደ እያንዳንዱ አካባቢ ማውጫ ቅዳ |

### ሁሉም 71 አካባቢዎች

`-l all` የበይነ መረብ ተጠቃሚዎች ~95% ይሸፍናል: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## ፈቃድ

MIT