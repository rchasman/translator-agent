# translator-agent

10.000$'lık yerelleştirme sorunu, 90 saniyede çözüldü.

Şirketler sitelerini yerelleştirmek için ajanslara kelime başına 0,10–0,25$ ödüyor. 5.000 kelimelik bir site 10 dile çevrildiğinde 5.000–12.000$'a mal oluyor ve 2–4 hafta sürüyor. Her başlık değiştirdiğinizde sayaç sıfırlanıyor.

Bu araç bunu tek komutta, 71 dile, build aşamanızda yapıyor:

```bash
bunx translator-agent -s ./dist -l all
```

Ajans yok. Spreadsheet yok. Vendor bağımlılığı yok. Kayıt yok. Sizin key'leriniz, sizin build'iniz, sizin dilleriniz.

> **Okuduğunuz şey kanıt.** Bu README `bunx translator-agent -s README.md -l all` çalıştırılarak çevrildi. [Japonca versiyonuna](./translations/ja/README.md) bakın — sadece "sayaç sıfırlanıyor" çevirmemiş, yerine Japonca iş deyimi koymuş. [Almanca versiyon](./translations/de/README.md) %30 daha uzun çünkü Almanca hep öyle. [Arapça versiyon](./translations/ar/README.md) sağdan sola okunuyor. [Brezilya Portekizcesi versiyonu](./translations/pt-BR/README.md) sanki bir Brezilyalı yazmış gibi duruyor, çünkü mesele bu zaten.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [tüm 71 dil...](./translations/)

---

## Neden işe yarar

Çeviri çözülmüş bir problem. Yerelleştirme değil.

Google Translate "Hamsterlarımız üzerinde çalışıyor" ifadesini Japonca'ya çevirebilir. Yapamadığı şey bu şakanın Japonya'da tutmayacağını fark edip, tutan bir şeyle — mesela gece vardiyasındaki geliştirici ekibinden bahsetmek gibi — değiştirmek. Bu hem kültürel olarak uygun hem de bağlamda komik.

Bu araç çeviri yapmıyor. **Transcreation** yapıyor — reklam ajanslarının bir kampanyayı pazarlara adapte ederken 50.000$ aldığı sürecin aynısı. Fark şu ki LLM zaten her kültürü, her deyimi, her format kuralını biliyor. Biliyor ki:

- `$49/month` Japonya'da `月額6,980円` oluyor — yen sembolü yapıştırılmış "$49" değil
- Sarkasm İngilizce'de öldürür, resmi Japonca'da ölür
- "Evrak işinde boğulmak" Fransızca'da "noyade administrative" olur — gerçek bir Fransız ifadesi, kelimesi kelimesine çeviri değil
- Almanlar hamster şakasını tutar çünkü Hamsterrad (hamster çarkı) gerçek bir Alman deyimi
- Brezilyalılar samimi tonu ister yoksa robot yazmış gibi durur

Model her string'i sınıflandırır. UI etiketleri direkt çeviri alır. Pazarlama metni uyarlanır. Humor hedef kültür için tamamen yeniden yaratılır.

---

## Çalıştırdığınızda ne olur

Build çıktınızı gösterin. Her locale için tüm dosya ağacını klonlar — metin dosyalarını çevirir, statik varlıkları kopyalar ve deployment için gereken her şeyi üretir:

```
your-site/                          translations/
  index.html                          middleware.ts        ← locale tespiti
  about.html             →            _locales.css         ← script başına tipografi
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreated
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 satır aralığı
                                        css/style.css      ← kopyalandı
                                        js/app.js          ← kopyalandı
                                        images/logo.png    ← kopyalandı
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Her HTML dosyasına `lang` ve `dir="rtl"` enjekte edilir. Her locale doğru font stack, satır aralığı ve metin yönüyle CSS alır. `Accept-Language` okuyan ve doğru locale'e yönlendiren Vercel middleware üretilir.

Vercel'e deploy edin. Tokyo'daki kullanıcı 1.8 satır aralığında Hiragino Sans ile Japonca görür. Kahire'deki kullanıcı %110 boyutta Noto Naskh ile RTL Arapça görür. Bangkok'taki kullanıcı `word-break: keep-all` ile Tayca görür çünkü Tayca'da boşluk yoktur. Yapılandırma yok.

---

## 4 hafta değil, 90 saniye

```bash
# Üç dil, bir JSON dosyası
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Bitti. 9.5 saniyede 3 dosya yazıldı

# Tüm siteniz, dünyadaki her dil
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Bitti. 142 dosya çevrildi, 284 statik dosya kopyalandı 94 saniyede
```

### Build pipeline'ınızda

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Her deploy 71 dilde çıkar. Çeviriler build artifact'ı — cache'lenir, sadece kaynak değiştiğinde yeniden üretilir.

---

## Kendi key'lerinizi getirin ya da getirmeyin

```bash
# Key'iniz var — local çalışır, LLM provider'ına direkt ödeme
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Key'iniz yok — çalışır
# Otomatik hosted servis kullanır
# x402 ile USDC ile çeviri başına ödeme — kayıt yok, hesap yok
bunx translator-agent -s ./dist -l all
```

Aynı komut. API key'leri varsa provider'ınızla local çalışır. Yoksa hosted API'ya gider ve [x402](https://x402.org) ile request başına öder — HTTP 402 ödeme protokolü. Client'ınız Base'de USDC öder, çeviri alır. Auth yok, vendor ilişkisi yok, fatura yok.

Anthropic ve OpenAI destekler. İstediğiniz modeli getirin:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Her yazı sistemi, halledildi

Araç sadece metin çevirmez — her yazı sisteminin nasıl render olacağını bilir:

| Yazı | Değişen | Neden |
|---|---|---|
| **Arapça, İbranice, Farsça, Urdu** | `dir="rtl"`, RTL fontlar, %110 boyut | Arapça okunaklı olması için büyük font gerekir; tüm layout aynalı |
| **Japonca, Çince, Korece** | CJK font stack'i, 1.8 satır aralığı | Karakterler sabit genişlik kareler; dikey nefes alma alanı lazım |
| **Hintçe, Bengalce, Tamilce, Telugu** | Indic fontlar, 1.8 satır aralığı | Üst çizgiler (shirorekha) extra dikey alan gerektirir |
| **Tayca** | `word-break: keep-all` | Kelimeler arası boşluk yok — browser'a açık satır kırma kuralı lazım |
| **Birmanca** | 2.2 satır aralığı | Major script'lerin en uzun glyph'ı |
| **Khmer** | 2.0 satır aralığı | Subscript ünsüz kümeler dikey stack olur |

Locale başına üretilen CSS:

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

## Cache

Çeviriler build artifact'ı. Build'de üret, çıktıyı cache'le, kaynak değişmemişse atla.

### Vercel

Vercel build çıktısını otomatik cache'ler. `postbuild` ekle, bitti:

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

Kaynak değişmemiş = cache hit = sıfır LLM çağrısı = sıfır maliyet.

---

## Seçenekler

```
Kullanım: translator-agent [seçenekler]

Seçenekler:
  -s, --source <path>      taranacak kaynak dizin veya dosya
  -l, --locales <locales>  hedef locale'ler, virgülle ayrılmış veya 71 dil için "all"
  -o, --output <path>      çıktı dizini (varsayılan: "./translations")
  -p, --provider <name>    anthropic | openai (varsayılan: "anthropic")
  -m, --model <id>         model override
  -c, --concurrency <n>    max paralel LLM çağrısı (varsayılan: 10)
  --api-url <url>          hosted servis URL'i (API key'ler set edilmemişse otomatik kullanılır)
```

| Uzantı | Strateji |
|---|---|
| `.json` | Value'ları çevir, key'leri koru |
| `.md` / `.mdx` | Metni çevir, syntax'ı koru |
| `.html` / `.htm` | Metni çevir, tag'leri koru, `lang`/`dir` enjekte et |
| Diğer her şey | Her locale dizinine kopyala |

### Tüm 71 locale

`-l all` internet kullanıcılarının ~%95'ini kapsar: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Lisans

MIT