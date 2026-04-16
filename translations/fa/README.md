# translator-agent

راه‌حل مشکل ۱۰ هزار دلاری بومی‌سازی، در ۹۰ ثانیه.

شرکت‌ها به آژانس‌ها ۰.۱۰ تا ۰.۲۵ دلار به ازای هر کلمه برای بومی‌سازی سایت‌هایشان می‌پردازند. یک سایت ۵ هزار کلمه‌ای به ۱۰ زبان ۵ تا ۱۲ هزار دلار هزینه داشته و ۲ تا ۴ هفته زمان می‌برد. هر بار که یک تیتر تغییر کنید، شمارنده دوباره شروع می‌شود.

این ابزار همه‌اش را با یک دستور، به ۷۱ زبان، در مرحله build انجام می‌دهد:

```bash
bunx translator-agent -s ./dist -l all
```

نه آژانس. نه فایل‌های اکسل. نه وابستگی به فروشنده. نه ثبت‌نام. کلیدهای شما، build شما، زبان‌های شما.

> **شما در حال خواندن شاهد هستید.** این README با اجرای `bunx translator-agent -s README.md -l all` ترجمه شده. برید [نسخه ژاپنی](./translations/ja/README.md) را بخوانید — نه تنها "شمارنده دوباره شروع می‌شود" را ترجمه نکرد، بلکه آن را با یک اصطلاح تجاری ژاپنی جایگزین کرد. [نسخه آلمانی](./translations/de/README.md) ۳۰٪ طولانی‌تر است چون آلمانی همیشه اینطور است. [نسخه عربی](./translations/ar/README.md) از راست به چپ خوانده می‌شود. [نسخه پرتغالی برزیلی](./translations/pt-BR/README.md) طوری صدا می‌کند که انگار یک برزیلی آن را نوشته، چون این هدف کار است.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [همه ۷۱...](./translations/)

---

## چرا این کار می‌کند

ترجمه مسئله‌ای حل‌شده است. بومی‌سازی نیست.

گوگل ترنسلیت می‌تواند "همسترهای ما روی آن کار می‌کنند" را به ژاپنی تبدیل کند. آنچه نمی‌تواند انجام دهد این است که تشخیص دهد شوخی در ژاپن جا نمی‌افتد، و آن را با چیزی که جا می‌افتد جایگزین کند — مثل اشاره به تیم مهندسی که شب‌زنده‌داری می‌کند، که هم از نظر فرهنگی مناسب است و هم در آن زمینه خنده‌دار است.

این ابزار ترجمه نمی‌کند. **بازآفرینی** می‌کند — همان فرآیندی که آژانس‌های تبلیغاتی برای تطبیق یک کمپین در بازارهای مختلف ۵۰ هزار دلار می‌گیرند. جز اینکه LLM از قبل همه فرهنگ‌ها، همه اصطلاحات، همه قراردادهای قالب‌بندی را می‌داند. می‌داند که:

- `$49/month` در ژاپن می‌شود `月額6,980円` — نه "$49" با یک نماد ین چسبانده شده
- طنز در انگلیسی کشنده است و در ژاپنی رسمی می‌میرد
- "در کاغذبازی غرق شدن" در فرانسوی می‌شود "noyade administrative" — یک عبارت واقعی فرانسوی، نه ترجمه کلمه‌به‌کلمه
- آلمانی‌ها شوخی همستر را نگه می‌دارند چون Hamsterrad (چرخ همستر) یک اصطلاح واقعی آلمانی است
- برزیلی‌ها به register غیررسمی نیاز دارند وگرنه طوری صدا می‌کند که یک ربات آن را نوشته

مدل هر string را طبقه‌بندی می‌کند. لیبل‌های UI ترجمه مستقیم می‌شوند. متن‌های بازاریابی تطبیق پیدا می‌کنند. طنز برای فرهنگ هدف کاملاً بازآفرینی می‌شود.

---

## چه اتفاقی می‌افتد وقتی آن را اجرا می‌کنید

آن را به خروجی build خود نشان دهید. کل درخت فایل را برای هر locale کلون می‌کند — فایل‌های متنی را ترجمه می‌کند، دارایی‌های استاتیک را کپی می‌کند، و هر چیزی که برای deployment لازم است تولید می‌کند:

```
your-site/                          translations/
  index.html                          middleware.ts        ← تشخیص locale
  about.html             →            _locales.css         ← تایپوگرافی برای هر script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja"، بازآفرینی شده
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP، 1.8 line-height
                                        css/style.css      ← کپی شده
                                        js/app.js          ← کپی شده
                                        images/logo.png    ← کپی شده
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic، 110% فونت
                                        ...
                                      de/
                                        ...
```

هر فایل HTML مقادیر `lang` و `dir="rtl"` را تزریق می‌کند. هر locale فایل CSS با font stack صحیح، line-height، و جهت متن دریافت می‌کند. یک middleware ورسل تولید می‌شود که `Accept-Language` را می‌خواند و به locale درست rewrite می‌کند.

روی ورسل deploy کنید. کاربری در توکیو ژاپنی را با Hiragino Sans در 1.8 line-height می‌بیند. کاربری در قاهره عربی RTL را با Noto Naskh در اندازه 110% می‌بیند. کاربری در بانکوک تایلندی را با `word-break: keep-all` می‌بیند چون تایلندی فاصله ندارد. هیچ تنظیماتی لازم نیست.

---

## ۹۰ ثانیه، نه ۴ هفته

```bash
# سه زبان، یک فایل JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
انجام شد. 3 فایل در 9.5 ثانیه نوشته شد

# کل سایت شما، تمام زبان‌های روی زمین
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
انجام شد. 142 فایل ترجمه شد، 284 فایل استاتیک در 94 ثانیه کپی شد
```

### در pipeline build شما

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

هر deploy به ۷۱ زبان ارسال می‌شود. ترجمه‌ها artifact های build هستند — کش می‌شوند، فقط زمانی که منبع تغییر کند دوباره تولید می‌شوند.

---

## کلیدهای خود را بیاورید یا نیاورید

```bash
# کلید دارید — محلی اجرا می‌شود، مستقیماً به ارائه‌دهنده LLM پرداخت می‌کنید
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# کلید ندارید — فقط کار می‌کند
# به طور خودکار از سرویس میزبان شده استفاده می‌کند
# به ازای هر ترجمه با USDC از طریق x402 پرداخت کنید — نه ثبت‌نام، نه حساب
bunx translator-agent -s ./dist -l all
```

همان دستور. اگر کلیدهای API موجود باشند، محلی با ارائه‌دهنده شما اجرا می‌شود. اگر نه، API میزبان شده را زده و از طریق [x402](https://x402.org) در هر درخواست پرداخت می‌کند — پروتکل پرداخت HTTP 402. کلاینت شما USDC روی Base پرداخت می‌کند، ترجمه‌ها را برمی‌گرداند. نه احراز هویت، نه رابطه فروشنده، نه فاکتور.

Anthropic و OpenAI را پشتیبانی می‌کند. هر مدلی که می‌خواهید بیاورید:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## هر سیستم خط، رسیدگی شده

این ابزار تنها متن ترجمه نمی‌کند — می‌داند هر سیستم نوشتاری چگونه رندر می‌شود:

| خط | چه چیزی تغییر می‌کند | چرا |
|---|---|---|
| **عربی، عبری، فارسی، اردو** | `dir="rtl"`، فونت‌های RTL، اندازه 110% | عربی برای خوانایی به حروف بزرگ‌تر نیاز دارد؛ کل layout آینه می‌شود |
| **ژاپنی، چینی، کره‌ای** | font stack های CJK، 1.8 line-height | حروف مربع‌های عرض ثابت هستند؛ به فضای تنفس عمودی نیاز دارند |
| **هندی، بنگالی، تامیل، تلوگو** | فونت‌های هندی، 1.8 line-height | headstroke ها (shirorekha) به فضای عمودی اضافی نیاز دارند |
| **تایلندی** | `word-break: keep-all` | هیچ فاصله‌ای بین کلمات نیست — مرورگر به قوانین صریح line-break نیاز دارد |
| **برمه‌ای** | 2.2 line-height | بلندترین glyph های هر خط اصلی |
| **خمر** | 2.0 line-height | cluster های صامت زیرنویس به صورت عمودی روی هم قرار می‌گیرند |

CSS تولید شده برای هر locale:

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

## کش

ترجمه‌ها artifact های build هستند. در زمان build تولید کنید، خروجی را کش کنید، وقتی منبع تغییر نکرده از آن عبور کنید.

### ورسل

ورسل خروجی build را به طور خودکار کش می‌کند. `postbuild` را اضافه کنید و تمام:

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

منبع تغییر نکرده = cache hit = صفر تماس LLM = صفر هزینه.

---

## گزینه‌ها

```
کاربرد: translator-agent [گزینه‌ها]

گزینه‌ها:
  -s, --source <path>      دایرکتوری یا فایل منبع برای اسکن
  -l, --locales <locales>  locale های هدف، جدا شده با کاما یا "all" برای 71 زبان
  -o, --output <path>      دایرکتوری خروجی (پیش‌فرض: "./translations")
  -p, --provider <name>    anthropic | openai (پیش‌فرض: "anthropic")
  -m, --model <id>         override مدل
  -c, --concurrency <n>    حداکثر تماس‌های موازی LLM (پیش‌فرض: 10)
  --api-url <url>          URL سرویس میزبان شده (زمانی که کلیدهای API تنظیم نشده خودکار استفاده می‌شود)
```

| پسوند | استراتژی |
|---|---|
| `.json` | مقادیر را ترجمه کن، کلیدها را حفظ کن |
| `.md` / `.mdx` | متن را ترجمه کن، syntax را حفظ کن |
| `.html` / `.htm` | متن را ترجمه کن، tag ها را حفظ کن، `lang`/`dir` را تزریق کن |
| هر چیز دیگر | در دایرکتوری هر locale کپی کن |

### همه ۷۱ locale

`-l all` حدود ۹۵٪ کاربران اینترنت را پوشش می‌دهد: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## مجوز

MIT