# translator-agent

Giải quyết bài toán bản địa hóa trị giá 10.000 USD trong 90 giây.

Các công ty trả cho các agency từ 0,10–0,25 USD mỗi từ để bản địa hóa website. Một site 5.000 từ ra 10 ngôn ngữ tốn 5.000–12.000 USD và mất 2–4 tuần. Mỗi lần bạn thay đổi một tiêu đề, lại phải tính lại từ đầu.

Công cụ này làm được điều đó chỉ với một lệnh, ra 71 ngôn ngữ, ngay trong bước build:

```bash
bunx translator-agent -s ./dist -l all
```

Không cần agency. Không cần bảng tính. Không bị khóa nhà cung cấp. Không cần đăng ký. Dùng key của bạn, build của bạn, ngôn ngữ của bạn.

> **Bạn đang đọc bằng chứng.** README này được dịch bằng cách chạy `bunx translator-agent -s README.md -l all`. Hãy đọc [phiên bản tiếng Nhật](./translations/ja/README.md) — nó không chỉ dịch "the meter restarts," mà thay bằng một thành ngữ kinh doanh Nhật Bản. [Phiên bản tiếng Đức](./translations/de/README.md) dài hơn 30% vì tiếng Đức luôn thế. [Phiên bản tiếng Ả Rập](./translations/ar/README.md) đọc từ phải sang trái. [Phiên bản tiếng Bồ Đào Nha Brazil](./translations/pt-BR/README.md) nghe như được người Brazil viết, và đó chính là điểm mấu chốt.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [tất cả 71...](./translations/)

---

## Tại sao điều này hiệu quả

Dịch thuật đã được giải quyết. Bản địa hóa thì chưa.

Google Translate có thể chuyển "Our hamsters are working on it" thành tiếng Nhật. Nhưng nó không thể nhận ra rằng câu đùa này không phù hợp ở Nhật, và thay bằng cái gì đó phù hợp hơn — như nói về team kỹ sư thức trắng đêm, vừa phù hợp văn hóa vừa hài hước trong bối cảnh này.

Công cụ này không dịch. Nó **transcreate** — quy trình mà các agency quảng cáo tính 50.000 USD khi chuyển thể chiến dịch sang các thị trường khác. Chỉ khác là LLM đã biết mọi nền văn hóa, mọi thành ngữ, mọi quy ước định dạng. Nó biết rằng:

- `$49/month` trở thành `月額6,980円` ở Nhật — không phải "$49" với ký hiệu yen dán vào
- Mỉa mai cực hay bằng tiếng Anh nhưng chết ngắc ở tiếng Nhật trang trọng
- "Drowning in paperwork" trở thành "noyade administrative" bằng tiếng Pháp — một biểu đạt Pháp thực sự, không phải dịch từng từ
- Người Đức giữ nguyên câu đùa chuột hamster vì Hamsterrad (bánh xe chuột) là thành ngữ Đức thật
- Người Brazil cần giọng điệu thân mật nếu không nghe như robot viết

Model phân loại từng chuỗi. Label UI được dịch trực tiếp. Copy marketing được chuyển thể. Câu đùa được tạo lại hoàn toàn cho nền văn hóa đích.

---

## Điều gì xảy ra khi bạn chạy nó

Chỉ vào build output. Nó clone toàn bộ cây thư mục cho mỗi locale — dịch file text, copy static asset, và tạo mọi thứ cần thiết để deploy:

```
your-site/                          translations/
  index.html                          middleware.ts        ← phát hiện locale
  about.html             →            _locales.css         ← typography theo script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", đã transcreate
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, line-height 1.8
                                        css/style.css      ← đã copy
                                        js/app.js          ← đã copy
                                        images/logo.png    ← đã copy
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, font 110%
                                        ...
                                      de/
                                        ...
```

Mọi file HTML được inject `lang` và `dir="rtl"`. Mọi locale được tạo CSS với font stack đúng, line-height và hướng text. Một Vercel middleware được tạo ra đọc `Accept-Language` và rewrite đến locale đúng.

Deploy lên Vercel. User ở Tokyo thấy tiếng Nhật với Hiragino Sans line-height 1.8. User ở Cairo thấy tiếng Ả Rập RTL với Noto Naskh kích thước 110%. User ở Bangkok thấy tiếng Thái với `word-break: keep-all` vì tiếng Thái không có dấu cách. Không cần config.

---

## 90 giây, không phải 4 tuần

```bash
# Ba ngôn ngữ, một file JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Xong. 3 file được tạo trong 9.5s

# Toàn bộ site của bạn, mọi ngôn ngữ trên trái đất
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Xong. 142 file đã dịch, 284 file static đã copy trong 94s
```

### Trong build pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Mọi lần deploy đều ship 71 ngôn ngữ. Bản dịch là build artifact — được cache, chỉ tạo lại khi source thay đổi.

---

## Mang key riêng hoặc không cần

```bash
# Bạn có key — chạy local, bạn trả trực tiếp cho LLM provider
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Bạn không có key — cứ việc dùng
# Tự động sử dụng hosted service
# Trả tiền cho từng bản dịch bằng USDC qua x402 — không cần đăng ký, không cần tài khoản
bunx translator-agent -s ./dist -l all
```

Cùng một lệnh. Nếu có API key, nó chạy local với provider của bạn. Nếu không, nó gọi hosted API và trả theo request qua [x402](https://x402.org) — giao thức thanh toán HTTP 402. Client của bạn trả USDC trên Base, nhận bản dịch về. Không cần auth, không có quan hệ vendor, không có hóa đơn.

Hỗ trợ Anthropic và OpenAI. Mang model nào bạn muốn:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Mọi hệ thống chữ viết, đều được xử lý

Công cụ không chỉ dịch text — nó biết cách mỗi hệ thống chữ viết render:

| Chữ viết | Thay đổi gì | Tại sao |
|---|---|---|
| **Ả Rập, Hebrew, Farsi, Urdu** | `dir="rtl"`, font RTL, kích thước 110% | Chữ Ả Rập cần font lớn hơn để dễ đọc; toàn bộ layout đảo ngược |
| **Nhật, Trung, Hàn** | Font stack CJK, line-height 1.8 | Ký tự có độ rộng cố định hình vuông; cần khoảng cách dọc |
| **Hindi, Bengali, Tamil, Telugu** | Font Indic, line-height 1.8 | Headstroke (shirorekha) cần thêm khoảng cách dọc |
| **Thái** | `word-break: keep-all` | Không có dấu cách giữa các từ — browser cần quy tắc ngắt dòng rõ ràng |
| **Miến Điện** | line-height 2.2 | Glyph cao nhất trong các chữ viết chính |
| **Khmer** | line-height 2.0 | Cụm phụ âm subscript xếp chồng theo chiều dọc |

CSS được tạo cho từng locale:

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

Bản dịch là build artifact. Tạo ở build time, cache output, bỏ qua khi source không đổi.

### Vercel

Vercel tự động cache build output. Thêm `postbuild` là xong:

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

Source không đổi = cache hit = zero LLM call = zero chi phí.

---

## Tùy chọn

```
Cách dùng: translator-agent [options]

Tùy chọn:
  -s, --source <path>      thư mục hoặc file nguồn để quét
  -l, --locales <locales>  locale đích, cách nhau bằng dấu phẩy hoặc "all" cho 71 ngôn ngữ
  -o, --output <path>      thư mục output (mặc định: "./translations")
  -p, --provider <name>    anthropic | openai (mặc định: "anthropic")
  -m, --model <id>         ghi đè model
  -c, --concurrency <n>    tối đa LLM call song song (mặc định: 10)
  --api-url <url>          URL hosted service (tự động dùng khi không có API key)
```

| Extension | Chiến lược |
|---|---|
| `.json` | Dịch value, giữ nguyên key |
| `.md` / `.mdx` | Dịch text, giữ nguyên syntax |
| `.html` / `.htm` | Dịch text, giữ nguyên tag, inject `lang`/`dir` |
| Tất cả khác | Copy vào thư mục mỗi locale |

### Tất cả 71 locale

`-l all` bao phủ ~95% người dùng internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Giấy phép

MIT