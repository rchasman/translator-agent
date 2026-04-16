# translator-agent

$10,000 کی لوکلائزیشن مسئلہ، 90 سیکنڈ میں حل۔

کمپنیاں ایجنسیوں کو اپنی ویب سائٹس کو لوکل بنانے کے لیے $0.10–0.25 فی لفظ ادا کرتی ہیں۔ 5,000 الفاظ کی ویب سائٹ کو 10 زبانوں میں ترجمہ کرنا $5,000–12,000 کی لاگت آتی ہے اور 2–4 ہفتے لگتے ہیں۔ ہر بار جب آپ کوئی عنوان تبدیل کرتے ہیں، تو پیسے کا گنتی کا عمل دوبارہ شروع ہو جاتا ہے۔

یہ ٹول ایک کمانڈ میں، 71 زبانوں میں، آپ کے build step کے دوران یہ کام کر دیتا ہے:

```bash
bunx translator-agent -s ./dist -l all
```

کوئی ایجنسی نہیں۔ کوئی اسپریڈ شیٹ نہیں۔ کوئی vendor lock-in نہیں۔ کوئی اکاؤنٹ بنانا نہیں۔ آپ کی keys، آپ کا build، آپ کی زبانیں۔

> **آپ اس کا ثبوت پڑھ رہے ہیں۔** یہ README `bunx translator-agent -s README.md -l all` چلا کر ترجمہ کیا گیا۔ جا کر [جاپانی ورژن](./translations/ja/README.md) پڑھیں — اس نے صرف "the meter restarts" کا ترجمہ نہیں کیا، بلکہ اسے جاپانی کاروباری محاورے سے بدل دیا۔ [جرمن ورژن](./translations/de/README.md) 30% لمبا ہے کیونکہ جرمن ہمیشہ ایسا ہی ہوتا ہے۔ [عربی ورژن](./translations/ar/README.md) دائیں سے بائیں پڑھا جاتا ہے۔ [برازیلی پرتگیزی ورژن](./translations/pt-BR/README.md) ایسے لگتا ہے جیسے کسی برازیلی نے لکھا ہو، کیونکہ یہی تو مقصد ہے۔
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [تمام 71...](./translations/)

---

## یہ کیوں کام کرتا ہے

ترجمہ ایک حل شدہ مسئلہ ہے۔ لوکلائزیشن نہیں ہے۔

Google Translate "Our hamsters are working on it" کو جاپانی میں تبدیل کر سکتا ہے۔ جو کام یہ نہیں کر سکتا وہ یہ پہچاننا ہے کہ یہ مذاق جاپان میں نہیں چلے گا، اور اس کی جگہ کوئی ایسی چیز لگانا جو چل جائے — جیسے انجینئرنگ ٹیم کے رات بھر جاگ کر کام کرنے کا حوالہ، جو ثقافتی لحاظ سے موزوں بھی ہے اور سیاق میں مضحکہ خیز بھی۔

یہ ٹول ترجمہ نہیں کرتا۔ یہ **transcreate** کرتا ہے — وہی عمل جس کے لیے اشتہاری ایجنسیاں $50,000 وصول کرتی ہیں جب مارکیٹوں میں مہم کو ڈھالتے ہیں۔ سوائے اس کے کہ LLM پہلے سے ہی ہر ثقافت، ہر محاورہ، ہر formatting کنونشن جانتا ہے۔ یہ جانتا ہے کہ:

- `$49/month` جاپان میں `月額6,980円` بن جاتا ہے — صرف "$49" پر yen کی علامت لگانا نہیں
- طنز انگریزی میں کامیاب ہوتا ہے اور رسمی جاپانی میں فیل ہو جاتا ہے
- "Drowning in paperwork" فرانسیسی میں "noyade administrative" بن جاتا ہے — ایک حقیقی فرانسیسی اظہار، لفظ بہ لفظ ترجمہ نہیں
- جرمن hamster کا مذاق رکھتے ہیں کیونکہ Hamsterrad (hamster wheel) ایک حقیقی جرمن محاورہ ہے
- برازیلیوں کو casual register چاہیے ورنہ ایسا لگتا ہے جیسے روبوٹ نے لکھا ہو

ماڈل ہر string کو classify کرتا ہے۔ UI labels کو direct ترجمہ ملتا ہے۔ Marketing copy کو adapt کیا جاتا ہے۔ مزاح کو target culture کے لیے مکمل طور پر دوبارہ بنایا جاتا ہے۔

---

## جب آپ اسے چلاتے ہیں تو کیا ہوتا ہے

اسے اپنے build output پر point کریں۔ یہ ہر locale کے لیے پوری فائل ٹری کلون کرتا ہے — text فائلوں کا ترجمہ کرتا ہے، static assets کاپی کرتا ہے، اور deployment کے لیے ضروری ہر چیز پیدا کرتا ہے:

```
your-site/                          translations/
  index.html                          middleware.ts        ← locale detection
  about.html             →            _locales.css         ← typography per script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreated
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← copied
                                        js/app.js          ← copied
                                        images/logo.png    ← copied
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

ہر HTML فائل میں `lang` اور `dir="rtl"` inject ہوتا ہے۔ ہر locale کو صحیح font stack، line-height، اور text direction کے ساتھ CSS ملتا ہے۔ ایک Vercel middleware پیدا کیا جاتا ہے جو `Accept-Language` پڑھتا ہے اور صحیح locale پر rewrite کرتا ہے۔

Vercel پر deploy کریں۔ ٹوکیو کا یوزر 1.8 line-height پر Hiragino Sans کے ساتھ جاپانی دیکھتا ہے۔ قاہرے کا یوزر 110% سائز پر Noto Naskh کے ساتھ RTL عربی دیکھتا ہے۔ بنکاک کا یوزر `word-break: keep-all` کے ساتھ تھائی دیکھتا ہے کیونکہ تھائی میں spaces نہیں ہوتے۔ کوئی config نہیں۔

---

## 4 ہفتے نہیں، 90 سیکنڈ

```bash
# تین زبانیں، ایک JSON فائل
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
مکمل۔ 9.5s میں 3 فائلیں لکھی گئیں

# آپ کی پوری ویب سائٹ، زمین کی ہر زبان
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
مکمل۔ 142 فائلیں ترجمہ کیں، 284 static فائلیں 94s میں کاپی کیں
```

### آپ کے build pipeline میں

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

ہر deploy 71 زبانوں میں ship ہوتا ہے۔ ترجمے build artifacts ہیں — cache ہوتے ہیں، صرف source تبدیل ہونے پر دوبارہ generate ہوتے ہیں۔

---

## اپنی keys لائیں یا نہ لائیں

```bash
# آپ کے پاس keys ہیں — مقامی طور پر چلتا ہے، آپ اپنے LLM provider کو براہ راست ادائیگی کرتے ہیں
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# آپ کے پاس keys نہیں ہیں — بس کام کرتا ہے
# خودکار طور پر hosted service استعمال کرتا ہے
# x402 کے ذریعے USDC سے فی ترجمہ ادا کریں — کوئی signup نہیں، کوئی account نہیں
bunx translator-agent -s ./dist -l all
```

وہی کمانڈ۔ اگر API keys موجود ہیں، تو یہ آپ کے provider کے ساتھ مقامی طور پر چلتا ہے۔ اگر نہیں، تو یہ hosted API کو hit کرتا ہے اور [x402](https://x402.org) کے ذریعے فی درخواست ادا کرتا ہے — HTTP 402 payment protocol۔ آپ کا کلائنٹ Base پر USDC ادا کرتا ہے، ترجمے واپس ملتے ہیں۔ کوئی auth نہیں، کوئی vendor رشتہ نہیں، کوئی invoices نہیں۔

Anthropic اور OpenAI کو support کرتا ہے۔ جو چاہیں model لے کر آئیں:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## ہر script system، handle کیا گیا

یہ ٹول صرف text کا ترجمہ نہیں کرتا — یہ جانتا ہے کہ ہر writing system کیسے render ہوتی ہے:

| Script | کیا تبدیل ہوتا ہے | کیوں |
|---|---|---|
| **عربی، عبرانی، فارسی، اردو** | `dir="rtl"`، RTL fonts، 110% سائز | عربی کو legible ہونے کے لیے بڑے type کی ضرورت ہے؛ پوری layout آئینہ بن جاتی ہے |
| **جاپانی، چینی، کوریائی** | CJK font stacks، 1.8 line-height | حروف fixed-width squares ہیں؛ vertical breathing room چاہیے |
| **ہندی، بنگالی، تمل، تیلگو** | Indic fonts، 1.8 line-height | Headstrokes (shirorekha) کو extra vertical space چاہیے |
| **تھائی** | `word-break: keep-all` | الفاظ کے درمیان کوئی spaces نہیں — browser کو explicit line-break rules چاہیے |
| **برمی** | 2.2 line-height | کسی بھی بڑے script کے سب سے لمبے glyphs |
| **خمیر** | 2.0 line-height | Subscript consonant clusters عمودی طور پر stack ہوتے ہیں |

فی locale پیدا کیا گیا CSS:

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

ترجمے build artifacts ہیں۔ Build time پر پیدا کریں، output کو cache کریں، source نہ بدلا ہو تو skip کریں۔

### Vercel

Vercel خودکار طور پر build output کو cache کرتا ہے۔ `postbuild` شامل کریں اور ہو گیا:

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

Source unchanged = cache hit = صفر LLM calls = صفر لاگت۔

---

## اختیارات

```
استعمال: translator-agent [options]

اختیارات:
  -s, --source <path>      scan کرنے کے لیے source directory یا فائل
  -l, --locales <locales>  target locales، comma-separated یا 71 زبانوں کے لیے "all"
  -o, --output <path>      output directory (پہلے سے طے شدہ: "./translations")
  -p, --provider <name>    anthropic | openai (پہلے سے طے شدہ: "anthropic")
  -m, --model <id>         model override
  -c, --concurrency <n>    زیادہ سے زیادہ parallel LLM calls (پہلے سے طے شدہ: 10)
  --api-url <url>          hosted service URL (جب کوئی API keys set نہ ہوں تو خودکار استعمال)
```

| Extension | حکمت عملی |
|---|---|
| `.json` | values کا ترجمہ، keys محفوظ |
| `.md` / `.mdx` | text کا ترجمہ، syntax محفوظ |
| `.html` / `.htm` | text کا ترجمہ، tags محفوظ، `lang`/`dir` inject |
| باقی سب | ہر locale directory میں کاپی |

### تمام 71 locales

`-l all` انٹرنیٹ صارفین کے ~95% کو کور کرتا ہے: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## لائسنس

MIT