# translator-agent

ဒေါ်လာ ၁၀,၀၀၀ ကျပ်တဲ့ localization ပြဿနာကို ၉၀ စက္ကန့်မှာ ဖြေရှင်းလိုက်ပါ။

ကုမ္ပဏီတွေက သူတို့ရဲ့ site များကို localize လုပ်ဖို့ agency တွေကို စာလုံးတစ်လုံးလျှင် $၀.၁၀–၀.၂၅ ပေးရတယ်။ စာလုံး ၅,၀၀၀ ပါတဲ့ site တစ်ခုကို ဘာသာ ၁၀ မျိုးထဲကို ဘာသာပြန်မယ်ဆိုရင် $၅,၀၀၀–၁၂,၀၀၀ ကုန်ပြီး ၂–၄ ပတ် ကြာတယ်။ headline တစ်ခုကို ပြောင်းတိုင်း ပိုက်ဆံမီတာက ပြန်လည်ုံးတယ်။

ဒီ tool က command တစ်ခုတည်းနေ့ ဘာသာ ၇၁ မျိုးကို build step မှာပဲ လုပ်ပေးနိုင်တယ်:

```bash
bunx translator-agent -s ./dist -l all
```

Agency မလိုဘူး။ spreadsheet တွေမလိုဘူး။ vendor lock-in မရှိဘူး။ အကောင့်ဖွင့်စရာမလိုဘူး။ မင်းရဲ့ keys, မင်းရဲ့ build, မင်းရဲ့ ဘာသာများ။

> **မင်းဖတ်နေတာက သက်သေပါပဲ။** ဒီ README ကို `bunx translator-agent -s README.md -l all` ဆိုပြီး run လိုက်တဲ့အခါ ဘာသာပြန်လိုက်တာ။ [ဂျပန်ဗားရှင်း](./translations/ja/README.md) ကို သွားဖတ်ကြည့် — "the meter restarts" ကို ဘာသာပြန်တာမဟုတ်ဘဲ ဂျပန်လုပ်ငန်းထုံးစံ idiom နဲ့ အစားထိုးလိုက်တယ်။ [ဂျာမန်ဗားရှင်း](./translations/de/README.md) က ၃၀% ပိုရှည်တယ် ဂျာမန်ကအမြဲတမ်းချဲ့လို့။ [အာရဗစ်ဗားရှင်း](./translations/ar/README.md) က ညာကနေဘယ်ကို ဖတ်ရတယ်။ [ဘရာဇီးပေါ်တူဂီဗားရှင်း](./translations/pt-BR/README.md) က ဘရာဇီးသားတစ်ယောက်က ရေးသလို ထွက်နေတယ်၊ ဘာကြောင့်လဲဆိုတော့ ဒါပဲ ပန်းတိုင်လို့။
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [၇၁ ခုလုံး...](./translations/)

---

## ဘာကြောင့်လုပ်ဆောင်နိုင်လဲ

Translation က ဖြေရှင်းပြီးသား ပြဿနာ။ Localization က မဟုတ်ဘူး။

Google Translate က "Our hamsters are working on it" ကို ဂျပန်ဘာသာပြန်နိုင်တယ်။ မလုပ်နိုင်တာက ဂျပန်မှာ ဒီ joke က မကောင်းဘူးဆိုတာကို သိပြီး ယဉ်ကျေးမှုအရ သင့်လျော်ပြီး ရယ်စရာကောင်းတဲ့ engineering team က တစ်ညလုံး အလုပ်လုပ်တာမျိုး နဲ့အစားထိုးတာမျိုး မလုပ်နိုင်ဘူး။

ဒီ tool က ဘာသာပြန်တာမဟုတ်ဘူး။ **transcreate** လုပ်တယ် — ad agency တွေက campaign တစ်ခုကို ဈေးကွက်အတွင်းမှာ လိုက်လျောညီထွေလုပ်ဖို့ $၅၀,၀၀၀ ကောက်ခံတဲ့ လုပ်ငန်းစဉ်ပဲ။ သို့သော် LLM က ယဉ်ကျေးမှုအားလုံး၊ idiom အားလုံး၊ formatting စည်းမျဉ်းအားလုံးကို သိပြီးသားပါ။ ဥပမာ:

- `$၄၉/လ` က ဂျပန်မှာ `月額၆,၉၈၀円` ဖြစ်သွားတယ် — "$၄၉" ကို yen သင်္ကေတ တပ်လိုက်တာမဟုတ်ဘူး
- Sarcasm က အင်္ဂလိပ်မှာ ကောင်းပေမဲ့ တရားဝင် ဂျပန်မှာ မသေတယ်
- "Drowning in paperwork" က ပြင်သစ်မှာ "noyade administrative" ဖြစ်သွားတယ် — အစစ်အမှန် ပြင်သစ် expression တစ်ခု၊ စာလုံးအတိုင်း ဘာသာပြန်တာမဟုတ်ဘူး
- ဂျာမန်တွေက hamster joke ကို ထားတယ် ဘာကြောင့်လဲဆိုတော့ Hamsterrad (hamster wheel) က အစစ်အမှန် ဂျာမန် idiom လို့
- ဘရာဇီးသားတွေကို casual register လိုတယ် မဟုတ်ရင် robot က ရေးသလို ထွက်မယ်

Model က string တစ်ခုစီကို အမျိုးအစား ခွဲခြားတယ်။ UI label တွေက တိုက်ရိုက် ဘာသာပြန်ခံရတယ်။ Marketing copy တွေက လိုက်လျောညီထွေ ပြုလုပ်ခံရတယ်။ Humor တွေက target culture အတွက် လုံးဝ ပြန်ဖန်တီးခံရတယ်။

---

## Run လိုက်တဲ့အခါ ဘာတွေ ဖြစ်သွားလဲ

မင်းရဲ့ build output ကို point လုပ်လိုက်။ ၄င်းက locale တစ်ခုစီအတွက် file tree တစ်ခုလုံးကို copy လုပ်တယ် — text file တွေကို ဘာသာပြန်ပြီး၊ static asset တွေကို copy လုပ်ပြီး၊ deployment အတွက် လိုအပ်တဲ့ အရာအားလုံးကို ထုတ်ပေးတယ်:

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

HTML file တိုင်းမှာ `lang` နဲ့ `dir="rtl"` inject လုပ်တယ်။ locale တိုင်းမှာ မှန်တဲ့ font stack, line-height, text direction နဲ့ CSS ရတယ်။ `Accept-Language` ကို ဖတ်ပြီး မှန်တဲ့ locale ကို rewrite လုပ်တဲ့ Vercel middleware တစ်ခု ထုတ်လုပ်ပေးတယ်။

Vercel ကို deploy လုပ်။ တိုကျိုမှာရှိတဲ့ user က Hiragino Sans font နေ့ 1.8 line-height နဲ့ ဂျပန်စာ မြင်တယ်။ ကိုင်ရိုမှာရှိတဲ့ user က RTL အာရဗစ်ကို Noto Naskh font နဲ့ ၁၁၀% size နဲ့ မြင်တယ်။ ဘန်ကောက်မှာရှိတဲ့ user က `word-break: keep-all` နဲ့ ထိုင်းစာ မြင်တယ် ထိုင်းမှာ စကားလုံးကြား space မရှိလို့။ config မလိုဘူး။

---

## ၉၀ စက္ကန့်၊ ၄ ပတ်မဟုတ်ဘူး

```bash
# ဘာသာသုံးမျိုး၊ JSON file တစ်ခု
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
ပြီးပါပြီ။ file ၃ ခုကို ၉.၅s မှာ ရေးလိုက်ပြီ

# မင်းရဲ့ site တစ်ခုလုံး၊ ကမ္ဘာပေါ်မှာရှိတဲ့ ဘာသာအားလုံး
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
ပြီးပါပြီ။ file ၁၄၂ ခု ဘာသာပြန်ပြီး၊ static file ၂၈၄ ခု copy လုပ်ပြီး ၉၄s မှာ

```

### မင်းရဲ့ build pipeline မှာ

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

deploy တိုင်း ဘာသာ ၇၁ မျိုးနဲ့ ship လုပ်တယ်။ Translation တွေက build artifact များပါ — cache လုပ်ထားပြီး source ပြောင်းလဲတဲ့အခါမှာပဲ ပြန် generate လုပ်တယ်။

---

## မင်းရဲ့ key တွေ သယ်လာ ဒါမှမဟုတ် မသယ်လာ

```bash
# မင်းမှာ key တွေရှိတယ် — local မှာ run တယ်၊ မင်းရဲ့ LLM provider ကို တိုက်ရိုက်ပေးတယ်
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# မင်းမှာ key တွေမရှိဘူး — အလုပ်လုပ်တယ်
# hosted service ကို အလိုအလျောက်သုံးတယ်
# x402 နဲ့ USDC နဲ့ translation တစ်ခုလျှင် ပေးတယ် — အကောင့်ဖွင့်စရာမလိုဘူး
bunx translator-agent -s ./dist -l all
```

command တစ်ခုတည်း။ API key တွေရှိရင် မင်းရဲ့ provider နဲ့ local မှာ run တယ်။ မရှိရင် hosted API ကို hit လုပ်ပြီး [x402](https://x402.org) — HTTP ၄၀၂ payment protocol နဲ့ request တစ်ခုလျှင် ပေးတယ်။ မင်းရဲ့ client က Base ပေါ်မှာ USDC ပေးပြီး translation တွေ ပြန်ရတယ်။ auth မလိုဘူး၊ vendor ဆက်ဆံရေးမလိုဘူး၊ invoice မလိုဘူး။

Anthropic နဲ့ OpenAI ကို support လုပ်တယ်။ မင်းလိုတဲ့ model ကို သယ်လာ:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## script system တိုင်းကို ကိုင်တွယ်တယ်

ဒီ tool က text ကို ဘာသာပြန်တာမဟုတ်ပဲ — writing system တစ်ခုစီက ဘယ်လို render လုပ်သလဲဆိုတာ သိတယ်:

| Script | ဘာတွေ ပြောင်းလဲမလဲ | ဘာကြောင့်လဲ |
|---|---|---|
| **အာရဗစ်၊ ဟီဗရူး၊ ဖာရ်စီ၊ အူရ်ဒူ** | `dir="rtl"`, RTL fonts, ၁၁၀% size | အာရဗစ်က ဖတ်လို့ရအောင် type ပိုကြီးရတယ်; layout တစ်ခုလုံး mirror လုပ်တယ် |
| **ဂျပန်၊ တရုတ်၊ ကိုရီးယား** | CJK font stacks, ၁.၈ line-height | character တွေက fixed-width square များပါ; vertical breathing room လိုတယ် |
| **ဟိန္ဒီ၊ ဘင်္ဂါလီ၊ တမီလ်၊ တီလီဂူ** | Indic fonts, ၁.၈ line-height | Headstroke တွေ (shirorekha) က vertical space ပိုလိုတယ် |
| **ထိုင်း** | `word-break: keep-all` | စကားလုံးကြား space မရှိဘူး — browser ကို explicit line-break rule တွေလိုတယ် |
| **ဗမာ** | ၂.၂ line-height | major script အားလုံးထဲမှာ အမြင့်ဆုံး glyph တွေ |
| **ခမာ** | ၂.၀ line-height | Subscript consonant cluster တွေ vertically stack လုပ်တယ် |

locale တစ်ခုစီအတွက် ထုတ်လုပ်ထားတဲ့ CSS:

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

Translation တွေက build artifact များပါ။ build time မှာ generate လုပ်၊ output ကို cache လုပ်၊ source မပြောင်းရင် skip လုပ်။

### Vercel

Vercel က build output ကို အလိုအလျောက် cache လုပ်တယ်။ `postbuild` ထည့်လိုက်ရင် ပြီးပါပြီ:

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

Source မပြောင်းဘူး = cache hit ရတယ် = LLM call သုည = ကုန်ကျစရိတ်သုည။

---

## Option တွေ

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      scan လုပ်မဲ့ source directory သို့မဟုတ် file
  -l, --locales <locales>  target locale တွေ၊ comma-separated သို့မဟုတ် ဘာသာ ၇၁ မျိုးအတွက် "all"
  -o, --output <path>      output directory (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         model override
  -c, --concurrency <n>    max parallel LLM call တွေ (default: ၁၀)
  --api-url <url>          hosted service URL (API key တွေမရှိတဲ့အခါ အလိုအလျောက်သုံးတယ်)
```

| Extension | Strategy |
|---|---|
| `.json` | value တွေကို ဘာသာပြန်၊ key တွေကို ထိန်းသိမ်း |
| `.md` / `.mdx` | text ကို ဘာသာပြန်၊ syntax ကို ထိန်းသိမ်း |
| `.html` / `.htm` | text ကို ဘာသာပြန်၊ tag တွေကို ထိန်းသိမ်း၊ `lang`/`dir` inject လုပ် |
| အခြားအားလုံး | locale directory တစ်ခုစီထဲကို copy လုပ် |

### ၇၁ locale အားလုံး

`-l all` က internet user တွေရဲ့ ~၉၅% ကို ကာမိတယ်: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## License

MIT