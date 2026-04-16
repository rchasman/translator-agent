# translator-agent

Masalah penyetempatan RM42,000, diselesaikan dalam 90 saat.

Syarikat membayar agensi RM0.40–RM1.00 setiap perkataan untuk menyetempatkan tapak web mereka. Tapak 5,000 perkataan ke dalam 10 bahasa memerlukan kos RM21,000–RM50,000 dan mengambil masa 2–4 minggu. Setiap kali anda mengubah tajuk, meter bermula semula.

Alat ini melakukannya dalam satu arahan, ke dalam 71 bahasa, semasa langkah pembinaan anda:

```bash
bunx translator-agent -s ./dist -l all
```

Tiada agensi. Tiada hamparan kerja. Tiada keterikatan vendor. Tiada pendaftaran. Kunci anda, binaan anda, bahasa anda.

> **Anda sedang membaca buktinya.** README ini telah diterjemahkan dengan menjalankan `bunx translator-agent -s README.md -l all`. Pergi baca [versi Jepun](./translations/ja/README.md) — ia bukan sekadar menterjemah "the meter restarts," ia menggantikannya dengan idiom perniagaan Jepun. [Versi Jerman](./translations/de/README.md) 30% lebih panjang kerana Jerman memang begitu. [Versi Arab](./translations/ar/README.md) dibaca dari kanan ke kiri. [Versi Portugis Brazil](./translations/pt-BR/README.md) kedengaran seperti ditulis oleh orang Brazil, kerana itulah tujuannya.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [kesemua 71...](./translations/)

---

## Kenapa ini berjaya

Penterjemahan sudah selesai masalahnya. Penyetempatan tidak.

Google Translate boleh menukar "Our hamsters are working on it" ke bahasa Jepun. Apa yang tidak boleh dilakukan ialah mengenali jenaka itu tidak menjadi di Jepun, dan menggantikannya dengan sesuatu yang menjadi — seperti merujuk kepada pasukan kejuruteraan yang berjaga sepanjang malam, yang sesuai dengan budaya dan lucu dalam konteks.

Alat ini tidak menerjemah. Ia **mentranskrea** — proses yang sama yang dikenakan bayaran RM210,000 oleh agensi iklan apabila menyesuaikan kempen merentas pasaran. Kecuali LLM sudah tahu setiap budaya, setiap idiom, setiap konvensyen pemformatan. Ia tahu bahawa:

- `$49/month` menjadi `月額6,980円` di Jepun — bukan "$49" dengan simbol yen yang ditampal
- Sarkasme mematikan dalam Bahasa Inggeris dan mati dalam Bahasa Jepun formal
- "Drowning in paperwork" menjadi "noyade administrative" dalam Bahasa Perancis — ungkapan Perancis sebenar, bukan terjemahan perkataan demi perkataan
- Jerman mengekalkan jenaka hamster kerana Hamsterrad (roda hamster) adalah idiom Jerman sebenar
- Orang Brazil memerlukan register santai atau ia kedengaran seperti robot yang menulisnya

Model mengklasifikasikan setiap rentetan. Label UI mendapat terjemahan langsung. Salinan pemasaran disesuaikan. Humor dicipta semula sepenuhnya untuk budaya sasaran.

---

## Apa yang berlaku apabila anda menjalankannya

Tunjukkan pada output binaan anda. Ia mengklon seluruh pokok fail setiap tempat — menerjemah fail teks, menyalin aset statik, dan menjana semua yang diperlukan untuk penggunaan:

```
your-site/                          translations/
  index.html                          middleware.ts        ← pengesanan tempat
  about.html             →            _locales.css         ← tipografi setiap skrip
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", ditranskrea
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, tinggi baris 1.8
                                        css/style.css      ← disalin
                                        js/app.js          ← disalin
                                        images/logo.png    ← disalin
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, fon 110%
                                        ...
                                      de/
                                        ...
```

Setiap fail HTML mendapat `lang` dan `dir="rtl"` disuntik. Setiap tempat mendapat CSS dengan susunan fon yang betul, tinggi baris, dan arah teks. Middleware Vercel dijana yang membaca `Accept-Language` dan menulis semula ke tempat yang betul.

Deploy ke Vercel. Pengguna di Tokyo melihat Jepun dengan Hiragino Sans pada tinggi baris 1.8. Pengguna di Kaherah melihat Arab RTL dengan Noto Naskh pada saiz 110%. Pengguna di Bangkok melihat Thai dengan `word-break: keep-all` kerana Thai tiada ruang. Tiada konfigurasi.

---

## 90 saat, bukan 4 minggu

```bash
# Tiga bahasa, satu fail JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Selesai. 3 fail ditulis dalam 9.5s

# Seluruh tapak anda, setiap bahasa di bumi
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Selesai. 142 fail diterjemah, 284 fail statik disalin dalam 94s
```

### Dalam pipeline binaan anda

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Setiap deploy dihantar dalam 71 bahasa. Terjemahan adalah artifak binaan — dicache, dijana semula hanya apabila sumber berubah.

---

## Bawa kunci anda sendiri atau jangan

```bash
# Anda ada kunci — berjalan tempatan, anda bayar penyedia LLM secara langsung
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Anda tiada kunci — cuma berfungsi
# Secara automatik menggunakan perkhidmatan yang dihoskan
# Bayar setiap terjemahan dengan USDC melalui x402 — tiada pendaftaran, tiada akaun
bunx translator-agent -s ./dist -l all
```

Arahan sama. Jika kunci API ada, ia berjalan secara tempatan dengan penyedia anda. Jika tidak, ia mencapai API yang dihoskan dan membayar setiap permintaan melalui [x402](https://x402.org) — protokol pembayaran HTTP 402. Klien anda membayar USDC di Base, mendapat terjemahan kembali. Tiada pengesahan, tiada hubungan vendor, tiada invois.

Menyokong Anthropic dan OpenAI. Bawa model mana yang anda mahu:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Setiap sistem skrip, dikendalikan

Alat ini bukan sekadar menerjemah teks — ia tahu bagaimana setiap sistem penulisan dipaparkan:

| Skrip | Apa yang berubah | Kenapa |
|---|---|---|
| **Arab, Ibrani, Parsi, Urdu** | `dir="rtl"`, fon RTL, saiz 110% | Arab memerlukan jenis yang lebih besar untuk jelas; seluruh susun atur bercermin |
| **Jepun, Cina, Korea** | Susunan fon CJK, tinggi baris 1.8 | Aksara adalah segi empat lebar tetap; memerlukan ruang bernapas menegak |
| **Hindi, Bengali, Tamil, Telugu** | Fon Indic, tinggi baris 1.8 | Sapuan kepala (shirorekha) memerlukan ruang menegak tambahan |
| **Thai** | `word-break: keep-all` | Tiada ruang antara perkataan — pelayar memerlukan peraturan pemisahan baris eksplisit |
| **Burma** | Tinggi baris 2.2 | Glif tertinggi dalam mana-mana skrip utama |
| **Khmer** | Tinggi baris 2.0 | Kelompok konsonan subskrip bertindan secara menegak |

CSS yang dijana setiap tempat:

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

Terjemahan adalah artifak binaan. Jana pada masa binaan, cache output, langkau apabila sumber tidak berubah.

### Vercel

Vercel cache output binaan secara automatik. Tambah `postbuild` dan anda selesai:

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

Sumber tidak berubah = cache hit = sifar panggilan LLM = sifar kos.

---

## Pilihan

```
Penggunaan: translator-agent [pilihan]

Pilihan:
  -s, --source <path>      direktori atau fail sumber untuk diimbas
  -l, --locales <locales>  tempat sasaran, dipisahkan koma atau "all" untuk 71 bahasa
  -o, --output <path>      direktori output (lalai: "./translations")
  -p, --provider <name>    anthropic | openai (lalai: "anthropic")
  -m, --model <id>         penggantian model
  -c, --concurrency <n>    panggilan LLM selari maksimum (lalai: 10)
  --api-url <url>          URL perkhidmatan yang dihoskan (auto-guna apabila tiada kunci API ditetapkan)
```

| Sambungan | Strategi |
|---|---|
| `.json` | Terjemah nilai, pelihara kunci |
| `.md` / `.mdx` | Terjemah teks, pelihara sintaks |
| `.html` / `.htm` | Terjemah teks, pelihara tag, suntik `lang`/`dir` |
| Semua yang lain | Salin ke dalam setiap direktori tempat |

### Semua 71 tempat

`-l all` meliputi ~95% pengguna internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Lesen

MIT