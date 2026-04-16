# translator-agent

10.000 dollarlıq lokallaşdırma problemi 90 saniyədə həll edilir.

Şirkətlər öz saytlarını lokallaşdırmaq üçün agentliklərə hər söz üçün 0,10-0,25 dollar ödəyirlər. 5.000 sözlük saytı 10 dilə tərcümə etmək 5.000-12.000 dollara başa gəlir və 2-4 həftə vaxt aparır. Hər dəfə başlıq dəyişdiyinizdə sayğac sıfırlanır.

Bu alət bunu bir əmrlə 71 dilə, qurma mərhələsində edir:

```bash
bunx translator-agent -s ./dist -l all
```

Nə agentlik. Nə elektron cədvəllər. Nə tədarükçü bağımlılığı. Nə qeydiyyat. Sizin açarlarınız, sizin qurmanız, sizin dilləriniz.

> **Siz sübutunu oxuyursunuz.** Bu README `bunx translator-agent -s README.md -l all` əmrini işlətməklə tərcümə edilib. Gedin [Yapon versiyasını](./translations/ja/README.md) oxuyun — o sadəcə "sayğac sıfırlanır" ifadəsini tərcümə etməyib, onu yapon biznes idiomu ilə əvəz edib. [Alman versiyası](./translations/de/README.md) 30% uzundur, çünki alman dili həmişə belədir. [Ərəb versiyası](./translations/ar/README.md) sağdan sola oxunur. [Braziliya portuqal versiyası](./translations/pt-BR/README.md) sanki braziliyalı yazıbmış kimi səslənir, çünki məqsəd budur.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [bütün 71...](./translations/)

---

## Bu niyə işləyir

Tərcümə həll edilmiş problemdir. Lokallaşdırma deyil.

Google Translate "Cricələrimiz bunun üstündə işləyir" ifadəsini yaponca çevirə bilər. Amma edə bilmədiyi şey bu zarafatın Yaponiyada anlaşılmayacağını dərk edib onu başqası ilə əvəz etməkdir — məsələn, gecə-gündüz işləyən mühəndislik komandasına istinad etmək, ki bu həm mədəni cəhətdən uyğundur, həm də kontekstdə gülməlidir.

Bu alət tərcümə etmir. O **yenidən yaradır** — eyni proses ki, reklam agentlikləri bir kampaniyanı bazarlara uyğunlaşdırarkən 50.000 dollar tələb edirlər. Fərqi ondadır ki, LLM artıq hər mədəniyyəti, hər idiomu, hər format konvensiyasını bilir. O bilir ki:

- `$49/ay` Yaponiyada `月額6,980円` olur — yen simvolu yapışdırılmış "$49" deyil
- Sarkazm ingiliscədə işləyir, formal yaponca dilində ölür
- "Kağız işlərində boğulma" fransızcada "noyade administrative" olur — real fransız ifadəsi, söz-söz tərcümə deyil
- Almanlar cricə zarafatını saxlayırlar, çünki Hamsterrad (cricə təkəri) real alman idiomudur
- Braziliyalılar rəsmi olmayan üslub istəyirlər, yoxsa robot yazmış kimi səslənir

Model hər sətri təsnif edir. UI etiketləri birbaşa tərcümə olunur. Marketinq mətnləri uyğunlaşdırılır. Zarafatlar hədəf mədəniyyət üçün tamamilə yenidən yaradılır.

---

## Onu işə saldığınızda nə baş verir

Qurma çıxışınıza yönəldin. O, bütün fayl ağacını hər yerel yer üçün klonlayır — mətn fayllarını tərcümə edib, statik aktivləri köçürüb və yerləşdirmə üçün lazım olan hər şeyi yaradır:

```
sizin-saytınız/                     tərcümələr/
  index.html                          middleware.ts        ← yerel yer aşkarlaması
  about.html             →            _locales.css         ← yazı sistemi üçün tipoqrafiya
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", yenidən yaradılmış
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 sətir yüksəkliyi
                                        css/style.css      ← köçürülmüş
                                        js/app.js          ← köçürülmüş
                                        images/logo.png    ← köçürülmüş
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% şrift
                                        ...
                                      de/
                                        ...
```

Hər HTML faylına `lang` və `dir="rtl"` əlavə edilir. Hər yerel yer düzgün şrift yığımı, sətir yüksəkliyi və mətn istiqaməti ilə CSS alır. `Accept-Language` başlığını oxuyan və doğru yerel yerə yönləndirən Vercel middleware yaradılır.

Vercel-ə yerləşdirin. Tokyo-dakı istifadəçi 1.8 sətir yüksəkliyində Hiragino Sans ilə yaponca görür. Qahirədəki istifadəçi 110% ölçüdə Noto Naskh ilə RTL ərəbcə görür. Bangkok-dakı istifadəçi `word-break: keep-all` ilə tay dili görür, çünki tay dilində boşluq yoxdur. Heç konfiqurasiya yoxdur.

---

## 90 saniyə, 4 həftə deyil

```bash
# Üç dil, bir JSON faylı
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Hazırdır. 3 fayl 9.5 saniyədə yazılıb

# Bütün saytınız, yer üzündəki bütün dillər
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Hazırdır. 142 fayl tərcümə edilib, 284 statik fayl 94 saniyədə köçürülüb
```

### Qurma xəttinizdə

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Hər yerləşdirmə 71 dildə göndərilir. Tərcümələr qurma məhsullarıdır — keşlənir, yalnız mənbə dəyişdiyində yenidən yaradılır.

---

## Öz açarlarınızı gətirin və ya gətirməyin

```bash
# Açarlarınız var — yerli işləyir, LLM tədarükçünüzə birbaşa ödəyiş edirsiniz
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Açarlarınız yoxdur — sadəcə işləyir
# Avtomatik olaraq host edilmiş xidməti istifadə edir
# x402 vasitəsilə USDC ilə tərcümə üçün ödəniş — qeydiyyat yoxdur, hesab yoxdur
bunx translator-agent -s ./dist -l all
```

Eyni əmr. API açarları varsa, tədarükçünüzlə yerli işləyir. Yoxdursa, host edilmiş API-yə müraciət edib [x402](https://x402.org) vasitəsilə sorğu üçün ödəniş edir — HTTP 402 ödəniş protokolu. Müştəriniz Base-də USDC ödəyir, tərcümələri geri alır. Autentifikasiya yoxdur, tədarükçü münasibəti yoxdur, faktura yoxdur.

Anthropic və OpenAI-ı dəstəkləyir. İstədiyiniz modeli gətirin:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Hər yazı sistemi, idarə edilir

Alət sadəcə mətni tərcümə etmir — hər yazı sisteminin necə göstərildiyini bilir:

| Yazı | Nə dəyişir | Niyə |
|---|---|---|
| **Ərəb, İvrit, Fars, Urdu** | `dir="rtl"`, RTL şriftlər, 110% ölçü | Ərəb daha böyük şrift tələb edir; bütün tərtibat əks olur |
| **Yapon, Çin, Koreya** | CJK şrift yığımları, 1.8 sətir yüksəkliyi | Simvollar sabit enliyində kvadratlardır; şaquli nəfəs alaraq tələb edir |
| **Hindi, Benqal, Tamil, Telugu** | Hind şriftləri, 1.8 sətir yüksəkliyi | Baş cizgilər (shirorekha) əlavə şaquli yer tələb edir |
| **Tay** | `word-break: keep-all` | Sözlər arasında boşluq yoxdur — brauzer açıq sətir-kəsmə qaydalarına ehtiyac duyur |
| **Birman** | 2.2 sətir yüksəkliyi | Böyük yazı sistemlərindən ən hündür qliflər |
| **Xmer** | 2.0 sətir yüksəkliyi | Altindeks samit klasterləri şaquli yığılır |

Yerel yer üçün yaradılmış CSS:

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

## Keşləmə

Tərcümələr qurma məhsullarıdır. Qurma zamanında yaradın, çıxışı keşləyin, mənbə dəyişməyəndə keçin.

### Vercel

Vercel qurma çıxışını avtomatik keşləyir. `postbuild` əlavə edin və hazırsınız:

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

Mənbə dəyişməmiş = keş hit = sıfır LLM çağırış = sıfır xərc.

---

## Seçimlər

```
İstifadə: translator-agent [seçimlər]

Seçimlər:
  -s, --source <yol>       tarama üçün mənbə qovluğu və ya fayl
  -l, --locales <yerlərlər>  hədəf yerləri, vergüllə ayrılmış və ya 71 dil üçün "all"
  -o, --output <yol>       çıxış qovluğu (standart: "./translations")
  -p, --provider <ad>      anthropic | openai (standart: "anthropic")
  -m, --model <id>         model üstündən keçmə
  -c, --concurrency <n>    maksimum paralel LLM çağırışları (standart: 10)
  --api-url <url>          host edilmiş xidmət URL-i (API açarları təyin edilmədiyində avtomatik istifadə olunur)
```

| Uzantı | Strategiya |
|---|---|
| `.json` | Dəyərləri tərcümə et, açarları saxla |
| `.md` / `.mdx` | Mətni tərcümə et, sintaksisi saxla |
| `.html` / `.htm` | Mətni tərcümə et, teqləri saxla, `lang`/`dir` daxil et |
| Hər şey digər | Hər yerel qovluğa köçür |

### Bütün 71 yerel yer

`-l all` internetin ~95%-ni əhatə edir: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Lisenziya

MIT