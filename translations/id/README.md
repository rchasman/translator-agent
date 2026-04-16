# translator-agent

Masalah lokalisasi $10.000 diselesaikan dalam 90 detik.

Perusahaan bayar agen $0,10–0,25 per kata buat lokalisasi situs mereka. Situs 5.000 kata ke 10 bahasa biayanya $5.000–12.000 dan butuh 2–4 minggu. Tiap kali ganti headline, meter mulai lagi dari nol.

Tool ini bikin dalam satu command, ke 71 bahasa, saat proses build:

```bash
bunx translator-agent -s ./dist -l all
```

Tanpa agen. Tanpa spreadsheet. Tanpa vendor lock-in. Tanpa daftar. Key kamu, build kamu, bahasa kamu.

> **Kamu lagi baca buktinya.** README ini diterjemahin dengan menjalankan `bunx translator-agent -s README.md -l all`. Coba baca [versi Jepang](./translations/ja/README.md) — bukan cuma translate "the meter restarts," tapi ganti dengan idiom bisnis Jepang. [Versi Jerman](./translations/de/README.md) 30% lebih panjang karena ya gitu bahasa Jerman. [Versi Arab](./translations/ar/README.md) baca kanan-kiri. [Versi Portugis Brasil](./translations/pt-BR/README.md) kedengerannya kayak ditulis orang Brasil, soalnya itu tujuannya.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [semua 71...](./translations/)

---

## Kenapa ini work

Translation udah solved. Localization belum.

Google Translate bisa ubah "Our hamsters are working on it" ke bahasa Jepang. Yang gak bisa dia lakukan adalah ngerti kalo joke itu gak nyambung di Jepang, terus gantinya dengan sesuatu yang nyambung — kayak ngomongin tim engineering yang begadang sampe pagi, yang pas secara budaya dan lucu sesuai konteks.

Tool ini gak translate. Dia **transcreate** — proses yang sama kayak agen advertising yang charge $50.000 buat adaptasi campaign ke berbagai market. Bedanya LLM udah tau semua budaya, semua idiom, semua konvensi formatting. Dia tau kalo:

- `Rp750.000/bulan` di Indonesia — bukan "$49" dengan simbol rupiah ditempel doang
- Sarkasme keren di bahasa Inggris tapi mati di bahasa Jepang formal
- "Tenggelam dalam paperwork" jadi "tenggelam dalam tumpukan dokumen" — ekspresi Indonesia yang natural, bukan terjemahan kata per kata
- Orang Jerman tetep pake joke hamster karena Hamsterrad (roda hamster) emang idiom Jerman beneran
- Orang Brasil butuh register kasual atau kedengerannya kayak robot yang nulis

Model mengklasifikasi tiap string. Label UI diterjemahkan langsung. Copy marketing diadaptasi. Humor direkreasi ulang buat budaya target.

---

## Yang terjadi pas kamu jalanin

Arahin ke build output kamu. Dia clone seluruh file tree per locale — translate file teks, copy static assets, dan generate semua yang dibutuhin buat deployment:

```
your-site/                          translations/
  index.html                          middleware.ts        ← deteksi locale
  about.html             →            _locales.css         ← tipografi per script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreated
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← dicopy
                                        js/app.js          ← dicopy
                                        images/logo.png    ← dicopy
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Tiap file HTML dapet inject `lang` dan `dir="rtl"`. Tiap locale dapet CSS dengan font stack yang bener, line-height, dan text direction. Middleware Vercel digenerate yang baca `Accept-Language` dan rewrite ke locale yang tepat.

Deploy ke Vercel. User di Tokyo liat Jepang pake Hiragino Sans dengan 1.8 line-height. User di Kairo liat RTL Arab pake Noto Naskh ukuran 110%. User di Bangkok liat Thai dengan `word-break: keep-all` karena Thai gak ada spasi. Tanpa config.

---

## 90 detik, bukan 4 minggu

```bash
# Tiga bahasa, satu file JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Done. 3 files written in 9.5s

# Seluruh situs kamu, semua bahasa di bumi
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Done. 142 files translated, 284 static files copied in 94s
```

### Di build pipeline kamu

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Setiap deploy ship dalam 71 bahasa. Translations adalah build artifacts — di-cache, regenerate cuma pas source berubah.

---

## Bawa key sendiri atau gak usah

```bash
# Kamu punya key — jalan lokal, bayar LLM provider langsung
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Gak punya key — langsung jalan
# Otomatis pake hosted service
# Bayar per translation pake USDC via x402 — tanpa daftar, tanpa akun
bunx translator-agent -s ./dist -l all
```

Command yang sama. Kalo ada API key, jalan lokal pake provider kamu. Kalo gak, hit hosted API dan bayar per request via [x402](https://x402.org) — HTTP 402 payment protocol. Client kamu bayar USDC di Base, dapet translations balik. Tanpa auth, tanpa vendor relationship, tanpa invoice.

Support Anthropic dan OpenAI. Bawa model mana aja yang kamu mau:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Semua script system, di-handle

Tool ini gak cuma translate teks — dia tau gimana tiap writing system di-render:

| Script | Yang berubah | Kenapa |
|---|---|---|
| **Arab, Hebrew, Farsi, Urdu** | `dir="rtl"`, font RTL, ukuran 110% | Arab butuh type yang lebih besar buat legible; seluruh layout mirror |
| **Jepang, Cina, Korea** | Font stack CJK, 1.8 line-height | Karakter kotak fixed-width; butuh ruang bernapas vertikal |
| **Hindi, Bengali, Tamil, Telugu** | Font Indic, 1.8 line-height | Headstroke (shirorekha) butuh ruang vertikal ekstra |
| **Thai** | `word-break: keep-all` | Gak ada spasi antar kata — browser butuh aturan line-break eksplisit |
| **Burma** | 2.2 line-height | Glyph paling tinggi dari semua script major |
| **Khmer** | 2.0 line-height | Cluster konsonan subscript stack secara vertikal |

CSS yang digenerate per locale:

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

Translations adalah build artifacts. Generate pas build time, cache output-nya, skip pas source gak berubah.

### Vercel

Vercel cache build output otomatis. Tambahin `postbuild` dan kelar:

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

Source gak berubah = cache hit = nol LLM calls = nol biaya.

---

## Options

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      direktori atau file source yang mau di-scan
  -l, --locales <locales>  target locale, dipisah koma atau "all" untuk 71 bahasa
  -o, --output <path>      direktori output (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         override model
  -c, --concurrency <n>    max parallel LLM calls (default: 10)
  --api-url <url>          URL hosted service (auto-used pas gak ada API key)
```

| Extension | Strategy |
|---|---|
| `.json` | Translate values, preserve key |
| `.md` / `.mdx` | Translate teks, preserve syntax |
| `.html` / `.htm` | Translate teks, preserve tag, inject `lang`/`dir` |
| Yang lain | Copy ke tiap direktori locale |

### Semua 71 locale

`-l all` cover ~95% user internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## License

MIT