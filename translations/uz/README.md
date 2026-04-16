# tarjimon-agent

10 000 $ localizatsiya muammosi 90 soniyada hal qilindi.

Kompaniyalar o'z saytlarini joylashtirishga so'z uchun $0.10-0.25 to'lashadi. 5000 so'zli saytni 10 tilga tarjima qilish $5000-12000 turadi va 2-4 hafta davom etadi. Har safar sarlavhani o'zgartirganda hisoblagich qayta boshlanadi.

Bu vosita buni bitta buyruq bilan, 71 tilga, build jarayoni vaqtida bajaradi:

```bash
bunx translator-agent -s ./dist -l all
```

Agentlik yo'q. Jadvallar yo'q. Vendor bog'liqligi yo'q. Ro'yxatdan o'tish yo'q. Sizning kalitlaringiz, sizning build'ingiz, sizning tillaringiz.

> **Siz dalilni o'qiyapsiz.** Bu README fayl `bunx translator-agent -s README.md -l all` buyrug'ini ishga tushirish orqali tarjima qilindi. [Yapon versiyasini](./translations/ja/README.md) o'qing — u shunchaki "hisoblagich qayta boshlanadi" deb tarjima qilmay, balki yapon biznes idiomasi bilan almashtirdi. [Nemis versiyasi](./translations/de/README.md) 30% uzunroq, chunki nemischa har doim ham shunday. [Arab versiyasi](./translations/ar/README.md) o'ngdan chapga o'qiladi. [Brazil Portugal versiyasi](./translations/pt-BR/README.md) braziliyalik yozgandek eshitiladi, chunki maqsad shu.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [barcha 71...](./translations/)

---

## Bu nima uchun ishlaydi

Tarjima hal qilingan muammo. Lokalizatsiya emas.

Google Translate "Bizning hamsterlarimiz bu ustida ishlayapti" degan jumlani yapon tiliga aylantirishi mumkin. Lekin u bu hazilning Yaponiyada o'tmasligini tan olay olmaydi va uni o'rniga ishlaydigan narsa bilan almashtiray olmaydi — masalan, muhandislik jamoasi tunu kun qilayotgani haqida, bu mamlakat madaniyati nuqtai nazaridan ham mos va kontekstda hazilli.

Bu vosita tarjima qilmaydi. U **transkreatsiya** qiladi — reklama agentliklari kampaniyani bozorlar bo'yicha moslashtirishda $50,000 oladigan jarayon. Faqat LLM allaqachon har bir madaniyat, har bir idioma, har bir formatlash an'anasini biladi. U biladi:

- `$49/month` Yaponiyada `月額6,980円` bo'ladi — yen belgisi qo'yilgan "$49" emas
- Sarkazm ingliz tilida o'ldirishga qodir, rasmiy yapon tilida o'ladi  
- "Qog'oz ishlarida g'arq bo'lish" fransuzchada "noyade administrative" bo'ladi — haqiqiy fransuz iborasi, so'zma-so'z tarjima emas
- Nemislar hamster hazilini saqlab qolishadi, chunki Hamsterrad (hamster g'ildirrigi) haqiqiy nemis idiomasidir
- Braziliyaliklarga norasmiy uslub kerak, aks holda robot yozgandek eshitiladi

Model har bir satrni tasniflaydi. UI yorliqlari to'g'ridan-to'g'ri tarjima qilinadi. Marketing matnlari moslashtiriladi. Hazil maqsadli madaniyat uchun to'liq qayta yaratiladi.

---

## Uni ishga tushirganingizda nima sodir bo'ladi

Uni build natijangizga yo'naltiring. U har bir til uchun butun fayl daraxtini klonlaydi — matn fayllarini tarjima qilib, statik aktivlarni nusxalab va joylashtirish uchun zarur bo'lgan hamma narsani yaratadi:

```
your-site/                          translations/
  index.html                          middleware.ts        ← til aniqlash
  about.html             →            _locales.css         ← skript uchun tipografiya
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transkreatsiya
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 qator balandligi
                                        css/style.css      ← nusxalangan
                                        js/app.js          ← nusxalangan
                                        images/logo.png    ← nusxalangan
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% shrift
                                        ...
                                      de/
                                        ...
```

Har bir HTML fayliga `lang` va `dir="rtl"` kiritiladi. Har bir til to'g'ri shrift to'plami, qator balandligi va matn yo'nalishi bilan CSS oladi. `Accept-Language` o'qib, to'g'ri tilga yo'naltiradigan Vercel middleware yaratiladi.

Vercel'ga joylashtiring. Tokiodagi foydalanuvchi 1.8 qator balandligida Hiragino Sans bilan yaponchani ko'radi. Qohiradagi foydalanuvchi 110% o'lchamda Noto Naskh bilan RTL arabchani ko'radi. Bangkokdagi foydalanuvchi `word-break: keep-all` bilan taychani ko'radi, chunki taychada bo'sh joylar yo'q. Sozlash shart emas.

---

## 90 soniya, 4 hafta emas

```bash
# Uch til, bitta JSON fayl
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Tayyor. 3 ta fayl 9.5 soniyada yozildi

# Butun saytingiz, yer yuzidagi har bir til
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Tayyor. 142 ta fayl tarjima qilindi, 284 ta statik fayl 94 soniyada nusxalandi
```

### Build pipeline'ida

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Har bir deploy 71 tilada jo'natiladi. Tarjimalar build artifaktlari — keshlanadi, faqat manba o'zgarganida qayta yaratiladi.

---

## O'z kalitlaringizni oling yoki olmang

```bash
# Sizda kalitlar bor — mahalliy ishga tushadi, LLM provayderingizga to'g'ridan-to'g'ri to'laysiz
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Sizda kalitlar yo'q — shunchaki ishlaydi
# Avtomatik ravishda joylashtirilgan xizmatdan foydalanadi
# x402 orqali USDC bilan tarjima uchun to'lang — ro'yxat yo'q, hisob yo'q
bunx translator-agent -s ./dist -l all
```

Xuddi shu buyruq. Agar API kalitlari mavjud bo'lsa, u sizning provayderingiz bilan mahalliy ishlaydi. Aks holda, joylashtirilgan API'ga murojaat qiladi va [x402](https://x402.org) orqali so'rov uchun to'laydi — HTTP 402 to'lov protokoli. Sizning mijozingiz Base'da USDC to'laydi, tarjimalarni qaytarib oladi. Autentifikatsiya yo'q, vendor aloqasi yo'q, schyot-fakturalar yo'q.

Anthropic va OpenAI'ni qo'llab-quvvatlaydi. Xohlagan modelingizni olib keling:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Har bir skript tizimi boshqariladi

Vosita shunchaki matnni tarjima qilmaydi — u har bir yozuv tizimi qanday ko'rinishini biladi:

| Skript | Nima o'zgaradi | Nega |
|---|---|---|
| **Arab, ibroniy, forsiy, urdu** | `dir="rtl"`, RTL shriftlar, 110% o'lcham | Arab kattaroq turiga muhtoj — butun tartib aks ettiriladi |
| **Yapon, xitoy, koreys** | CJK shrift to'plamlari, 1.8 qator balandligi | Belgilar sobit kengligi kvadratlar; vertikal nafas olish joyi kerak |
| **Hindi, bengal, tamil, telugu** | Hind shriftlari, 1.8 qator balandligi | Bosh chiziqlar (shirorekha) qo'shimcha vertikal joy talab qiladi |
| **Tay** | `word-break: keep-all` | So'zlar orasida bo'sh joy yo'q — brauzerga aniq qator uzilish qoidalari kerak |
| **Birma** | 2.2 qator balandligi | Har qanday asosiy skriptning eng baland gliflari |
| **Xmer** | 2.0 qator balandligi | Pastki undosh klasterlari vertikal ravishda joylashadi |

Til uchun yaratilgan CSS:

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

## Keshlash

Tarjimalar build artifaktlari. Build vaqtida yarating, natijani keshlab qo'ying, manba o'zgarmaganda o'tkazib yuboring.

### Vercel

Vercel build natijalarini avtomatik ravishda keshlaydi. `postbuild` qo'shing va tugatdingiz:

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

Manba o'zgarmaganida = kesh ishladi = nol LLM chaqiruvlari = nol xarajat.

---

## Variantlar

```
Foydalanish: translator-agent [variantlar]

Variantlar:
  -s, --source <yo'l>      skanerlash uchun manba katalogi yoki fayl
  -l, --locales <tillar>   maqsadli tillar, vergul bilan ajratilgan yoki 71 til uchun "all"
  -o, --output <yo'l>      chiqish katalogi (standart: "./translations")
  -p, --provider <nom>     anthropic | openai (standart: "anthropic")
  -m, --model <id>         model ustidan
  -c, --concurrency <n>    maksimal parallel LLM chaqiruvlari (standart: 10)
  --api-url <url>          joylashtirilgan xizmat URL'i (API kalitlari yo'q bo'lsa avtomatik ishlatiladi)
```

| Kengaytma | Strategiya |
|---|---|
| `.json` | Qiymatlarni tarjima qiling, kalitlarni saqlang |
| `.md` / `.mdx` | Matnni tarjima qiling, sintaksisni saqlang |
| `.html` / `.htm` | Matnni tarjima qiling, teglarni saqlang, `lang`/`dir` kiritng |
| Boshqa hamma narsa | Har bir til kataloqiga nusxalang |

### Barcha 71 til

`-l all` internet foydalanuvchilarining ~95% ni qamrab oladi: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Litsenziya

MIT