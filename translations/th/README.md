# translator-agent

ปัญหาการแปลเพื่อการตลาดข้ามวัฒนธรรมที่มีมูลค่า 360,000 บาท แก้ได้ใน 90 วินาที

บริษัทต่างๆ จ่ายให้เอเจนซี 3.50–9.00 บาท ต่อคำเพื่อแปลเว็บไซต์ เว็บไซต์ 5,000 คำ แปลไป 10 ภาษา ใช้เงิน 175,000–430,000 บาท และใช้เวลา 2–4 สัปดาห์ ทุกครั้งที่เปลี่ยนหัวเรื่อง ต้องนับมิเตอร์ใหม่

เครื่องมือนี้ทำได้ในคำสั่งเดียว แปลได้ 71 ภาษา ระหว่างขั้นตอน build:

```bash
bunx translator-agent -s ./dist -l all
```

ไม่ต้องใช้เอเจนซี ไม่ต้อง spreadsheets ไม่มี vendor lock-in ไม่ต้องสมัคร ใช้ key ของคุณ build ของคุณ ภาษาของคุณ

> **คุณกำลังอ่านตัวอย่างจริง** README นี้แปลด้วยการรัน `bunx translator-agent -s README.md -l all` ลองไปอ่าน[เวอร์ชันญี่ปุ่น](./translations/ja/README.md) — มันไม่ได้แค่แปลว่า "the meter restarts" แต่เปลี่ยนเป็นสำนวนธุรกิจญี่ปุ่น [เวอร์ชันเยอรมัน](./translations/de/README.md) ยาวขึ้น 30% เพราะภาษาเยอรมันเป็นแบบนั้น [เวอร์ชันอาหรับ](./translations/ar/README.md) อ่านจากขวาไปซ้าย [เวอร์ชันโปรตุเกสบราซิล](./translations/pt-BR/README.md) ฟังดูเหมือนคนบราซิลเขียน เพราะนั่นคือจุดประสงค์
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [ทั้งหมด 71 ภาษา...](./translations/)

---

## ทำไมวิธีนี้ถึงได้ผล

การแปลเป็นปัญหาที่แก้แล้ว การแปลเพื่อการตลาดข้ามวัฒนธรรมยังไม่

Google Translate แปล "Our hamsters are working on it" เป็นญี่ปุ่นได้ แต่ทำไม่ได้คือรู้ว่าข้อความตลกนั้นไม่ได้ในญี่ปุ่น และเปลี่ยนเป็นอย่างที่ได้ผล — เช่น พูดถึงทีมวิศวกรที่ทำงานข้ามคืน ซึ่งเหมาะสมตามวัฒนธรรมและตลกในบริบทนั้น

เครื่องมือนี้ไม่แปล แต่**สร้างใหม่** — กระบวนการเดียวกับที่เอเจนซีโฆษณาคิดเงิน 1.8 ล้านบาทในการดัดแปลงแคมเปญข้ามตลาด เพียงแต่ LLM รู้จักทุกวัฒนธรรม ทุกสำนวน ทุกรูปแบบการจัดรูปแบบอยู่แล้ว มันรู้ว่า:

- `$49/month` กลายเป็น `月額6,980円` ในญี่ปุ่น — ไม่ใช่ "$49" กับสัญลักษณ์เยนมาแปะ
- การพูดเหน็บแนมทำได้ในอังกฤษ แต่ตายในญี่ปุ่นที่เป็นทางการ
- "Drowning in paperwork" กลายเป็น "noyade administrative" ในฝรั่งเศส — สำนวนฝรั่งเศสจริง ไม่ใช่การแปลตัวต่อตัว
- เยอรมันเก็บมุกฮ่ำสเตอร์ไว้ เพราะ Hamsterrad (ล้อฮ่ำสเตอร์) เป็นสำนวนเยอรมันจริง
- บราซิลต้องใช้การพูดเป็นกันเอง ไม่งั้นฟังดูเหมือนหุ่นยนต์เขียน

โมเดลแยกประเภทสตริงแต่ละตัว ป้ายกำกับ UI แปลตรงๆ เนื้อหาการตลาดปรับให้เหมาะ มุกตลกสร้างใหม่ให้เข้ากับวัฒนธรรมเป้าหมาย

---

## สิ่งที่เกิดขึ้นเมื่อคุณรัน

ชี้ไปที่ build output ของคุณ มันโคลน file tree ทั้งหมดต่อ locale — แปลไฟล์ข้อความ คัดลอกไฟล์ static และสร้างทุกอย่างที่จำเป็นสำหรับ deploy:

```
your-site/                          translations/
  index.html                          middleware.ts        ← ตรวจจับ locale
  about.html             →            _locales.css         ← typography ต่อ script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", สร้างใหม่
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← คัดลอก
                                        js/app.js          ← คัดลอก
                                        images/logo.png    ← คัดลอก
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

ไฟล์ HTML ทุกไฟล์ได้รับ `lang` และ `dir="rtl"` ที่ใส่เข้าไป locale ทุกอันได้ CSS พร้อม font stack, line-height และทิศทางข้อความที่ถูกต้อง สร้าง Vercel middleware ที่อ่าน `Accept-Language` และเขียนใหม่ไปยัง locale ที่ถูก

Deploy ไป Vercel ผู้ใช้ในโตเกียวเห็นญี่ปุ่นด้วย Hiragino Sans ที่ 1.8 line-height ผู้ใช้ในไคโรเห็นอาหรับ RTL ด้วย Noto Naskh ที่ขนาด 110% ผู้ใช้ในกรุงเทพเห็นไทยด้วย `word-break: keep-all` เพราะไทยไม่มีช่องว่าง ไม่ต้องตั้งค่า

---

## 90 วินาที ไม่ใช่ 4 สัปดาห์

```bash
# สามภาษา หนึ่งไฟล์ JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
เสร็จ เขียน 3 ไฟล์ใน 9.5 วิ

# เว็บไซต์ทั้งหมดของคุณ ทุกภาษาบนโลก
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
เสร็จ แปล 142 ไฟล์ คัดลอกไฟล์ static 284 ไฟล์ใน 94 วิ
```

### ใน build pipeline ของคุณ

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

การ deploy ทุกครั้งส่งใน 71 ภาษา การแปลเป็น build artifacts — ถูก cache สร้างใหม่เฉพาะเมื่อ source เปลี่ยน

---

## เอา key ของคุณมาหรือไม่ก็ได้

```bash
# คุณมี keys — รันในเครื่อง คุณจ่าย LLM provider โดยตรง
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# คุณไม่มี keys — ใช้ได้เลย
# ใช้ hosted service อัตโนมัติ
# จ่ายต่อการแปลด้วย USDC ผ่าน x402 — ไม่ต้องสมัคร ไม่ต้องบัญชี
bunx translator-agent -s ./dist -l all
```

คำสั่งเดียวกัน ถ้ามี API keys มันรันในเครื่องด้วย provider ของคุณ ถ้าไม่ มันไปที่ hosted API และจ่ายต่อ request ผ่าน [x402](https://x402.org) — โปรโตคอลการชำระเงิน HTTP 402 client ของคุณจ่าย USDC บน Base ได้การแปลกลับมา ไม่มี auth ไม่มีความสัมพันธ์ vendor ไม่มีใบแจ้งหนี้

รองรับ Anthropic และ OpenAI เอาโมเดลไหนก็ได้ที่คุณต้องการ:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## ทุกระบบตัวอักษร จัดการแล้ว

เครื่องมือนี้ไม่ได้แค่แปลข้อความ — มันรู้ว่าระบบการเขียนแต่ละอันแสดงผลอย่างไร:

| Script | สิ่งที่เปลี่ยน | เหตุผล |
|---|---|---|
| **อาหรับ, ฮีบรู, เปอร์เซีย, อูรดู** | `dir="rtl"`, RTL fonts, ขนาด 110% | อาหรับต้องใช้ตัวใหญ่ขึ้นให้อ่านได้ เลย์เอาต์ทั้งหมดกลับด้าน |
| **ญี่ปุ่น, จีน, เกาหลี** | CJK font stacks, 1.8 line-height | ตัวอักษรเป็นสี่เหลี่ยมความกว้างคงที่ ต้องมีพื้นที่หายใจแนวตั้ง |
| **ฮินดี, เบงกอลี, ทมิฬ, เตลูกู** | Indic fonts, 1.8 line-height | เส้นหัว (shirorekha) ต้องมีพื้นที่แนวตั้งเพิ่ม |
| **ไทย** | `word-break: keep-all` | ไม่มีช่องว่างระหว่างคำ — เบราว์เซอร์ต้องมีกฎการตัดบรรทัดชัดเจน |
| **พม่า** | 2.2 line-height | glyphs ที่สูงที่สุดในบรรดา script หลัก |
| **เขมร** | 2.0 line-height | กลุ่มพยัญชนะ subscript ซ้อนกันแนวตั้ง |

CSS ต่อ locale ที่สร้าง:

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

การแปลเป็น build artifacts สร้างตอน build time cache ผลลัพธ์ ข้ามเมื่อ source ไม่เปลี่ยน

### Vercel

Vercel cache build output อัตโนมัติ เพิ่ม `postbuild` แล้วเสร็จ:

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

Source ไม่เปลี่ยน = cache hit = LLM calls ศูน = ค่าใช้จ่ายศูน

---

## ตัวเลือก

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      ไดเรกทอรีหรือไฟล์ต้นทางที่จะสแกน
  -l, --locales <locales>  locale เป้าหมาย คั่นด้วยจุลภาคหรือ "all" สำหรับ 71 ภาษา
  -o, --output <path>      ไดเรกทอรีผลลัพธ์ (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         โมเดลที่จะใช้แทน
  -c, --concurrency <n>    การเรียก LLM แบบขนานสูงสุด (default: 10)
  --api-url <url>          URL hosted service (ใช้อัตโนมัติเมื่อไม่มี API keys)
```

| นามสกุล | กลยุทธ์ |
|---|---|
| `.json` | แปลค่า เก็บ keys |
| `.md` / `.mdx` | แปลข้อความ เก็บ syntax |
| `.html` / `.htm` | แปลข้อความ เก็บ tags ใส่ `lang`/`dir` |
| อย่างอื่น | คัดลอกเข้าไดเรกทอรี locale แต่ละอัน |

### ทั้งหมด 71 locales

`-l all` ครอบคลุม ~95% ผู้ใช้อินเทอร์เน็ต: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## ใบอนุญาต

MIT