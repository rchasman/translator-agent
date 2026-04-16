# translator-agent

A 10 000 dolláros lokalizációs probléma, 90 másodperc alatt megoldva.

A cégek 40-100 forintot fizetnek ügynökségeknek szavanként, hogy lokalizálják az oldalukat. Egy 5000 szavas oldal lefordítása 10 nyelvre 2-4 millió forintba kerül és 2-4 hetet vesz igénybe. Minden alkalommal, amikor megváltóztatsz egy címsort, az óra újraindul.

Ez az eszköz egyetlen paranccsal csinálja meg, 71 nyelvre, a build folyamat részeként:

```bash
bunx translator-agent -s ./dist -l all
```

Nincs ügynökség. Nincs táblázatkezelő. Nincs beszállítói függőség. Nincs regisztráció. A te kulcsaid, a te builded, a te nyelveid.

> **A bizonyítékot olvasod.** Ez a README úgy készült, hogy lefuttattuk a `bunx translator-agent -s README.md -l all` parancsot. Olvasd el a [japán verziót](./translations/ja/README.md) — nem csak lefordította, hogy „az óra újraindul", hanem egy japán üzleti közmondásra cserélte. A [német verzió](./translations/de/README.md) 30%-kal hosszabb, mert a német mindig az. Az [arab verzió](./translations/ar/README.md) jobbról balra olvasható. A [brazil-portugál verzió](./translations/pt-BR/README.md) úgy hangzik, mintha egy brazil írta volna, mert ez a lényeg.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [mind a 71...](./translations/)

---

## Miért működik ez

A fordítás egy megoldott probléma. A lokalizáció nem.

A Google Fordító át tudja alakítani azt, hogy „A hörcsögeink dolgoznak rajta" japánra. Amit nem tud, az felismerni, hogy a vicc nem működik Japánban, és olyasmivel helyettesíteni, ami igen — például hivatkozni arra, hogy a fejlesztőcsapat egész éjjel dolgozik, ami kulturálisan megfelelő és kontextusban vicces is.

Ez az eszköz nem fordít. **Transzkkreál** — ugyanaz a folyamat, amiért a reklámügynökségek 20 millió forintot kérnek, amikor egy kampányt adaptálnak különböző piacokra. Csak az LLM már ismeri minden kultúrát, minden közmondást, minden formázási konvenciót. Tudja, hogy:

- A `$49/month` Japánban `月額6,980円` lesz — nem „$49" jen szimbólummal rányomva
- A szarkazmus angolul öl, formális japánul meghal
- A „Drowning in paperwork" franciául „noyade administrative" lesz — egy igazi francia kifejezés, nem szó szerinti fordítás
- A németek megtartják a hörcsögös viccet, mert a Hamsterrad (hörcsögkerék) igazi német közmondás
- A braziloknak kell a közvetlen stílus, különben úgy hangzik, mintha robot írta volna

A modell kategorizálja minden stringet. A felhasználói felület címkéi közvetlen fordítást kapnak. A marketing szöveg adaptálódik. A humor teljesen újraalkotódik a célkultúrának.

---

## Mi történik, amikor lefuttatod

Rámutatod a build kimenetedre. Klónozza a teljes fájlstruktúrát locale-onként — lefordítja a szöveges fájlokat, másolja a statikus eszközöket, és generálja mindent, ami a telepítéshez kell:

```
your-site/                          translations/
  index.html                          middleware.ts        ← locale felismerés
  about.html             →            _locales.css         ← tipográfia írásrendszerenként
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transzkreálva
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 sormagasság
                                        css/style.css      ← másolva
                                        js/app.js          ← másolva
                                        images/logo.png    ← másolva
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% betű
                                        ...
                                      de/
                                        ...
```

Minden HTML fájl megkapja a `lang` és `dir="rtl"` beillesztést. Minden locale megfelelő font stackkel, sormagassággal és szövegirányítással ellátott CSS-t kap. Egy Vercel middleware generálódik, ami olvassa az `Accept-Language`-t és átirányít a megfelelő locale-ra.

Telepítsd Vercelre. Egy tokiói felhasználó japánt lát Hiragino Sans-szal 1.8 sormagasságon. Egy kairói felhasználó jobbról balra arab szöveget lát Noto Naskh-sal 110% méretben. Egy bangkoki felhasználó thaiföldit lát `word-break: keep-all`-lal, mert a thainak nincsenek szóközei. Nincs konfiguráció.

---

## 90 másodperc, nem 4 hét

```bash
# Három nyelv, egy JSON fájl
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Kész. 3 fájl írva 9.5 másodperc alatt

# A teljes oldalad, a földön minden nyelv
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Kész. 142 fájl lefordítva, 284 statikus fájl másolva 94 másodperc alatt
```

### A build pipeline-odban

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Minden deploy 71 nyelven szállít. A fordítások build artifactok — cache-elve, csak akkor regenerálódnak, ha a forrás változik.

---

## Hozd a saját kulcsaidat vagy ne

```bash
# Van kulcsod — helyben fut, közvetlenül fizetsz az LLM szolgáltatódnak
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Nincs kulcsod — csak működik
# Automatikusan a hostolt szolgáltatást használja
# Fizess fordításonként USDC-vel x402 protokollon — nincs regisztráció, nincs fiók
bunx translator-agent -s ./dist -l all
```

Ugyanaz a parancs. Ha vannak API kulcsok, helyben fut a szolgáltatóddal. Ha nincsenek, eléri a hostolt API-t és kérésenként fizet [x402](https://x402.org)-n keresztül — a HTTP 402 fizetési protokoll. A kliensed USDC-t fizet Base-en, fordításokat kap vissza. Nincs hitelesítés, nincs szállítói kapcsolat, nincsenek számlák.

Támogatja az Anthropic-ot és az OpenAI-t. Hozd azt a modellt, amelyiket akarod:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Minden írásrendszer, kezelve

Az eszköz nem csak szöveget fordít — tudja, hogyan renderelődik minden írásrendszer:

| Írásrendszer | Mi változik | Miért |
|---|---|---|
| **Arab, héber, perzsa, urdu** | `dir="rtl"`, RTL betűk, 110% méret | Az arabnak nagyobb betűre van szüksége, hogy olvasható legyen; a teljes elrendezés tükrözött |
| **Japán, kínai, koreai** | CJK font stackek, 1.8 sormagasság | A karakterek fix szélességű négyzetek; függőleges lélegzetvételi helyre van szükségük |
| **Hindi, bengáli, tamil, telugu** | Indiai betűk, 1.8 sormagasság | A fejvonásoknak (shirorekha) extra függőleges helyre van szükségük |
| **Thai** | `word-break: keep-all` | Nincsenek szóközök a szavak között — a böngészőnek explicit sortörési szabályokra van szüksége |
| **Burmai** | 2.2 sormagasság | A legmagasabb karakterek bármely nagy írásrendszerben |
| **Khmer** | 2.0 sormagasság | Az alsó mássalhangzó-csoportok függőlegesen rakódnak |

Locale-onként generált CSS:

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

## Cache-elés

A fordítások build artifactok. Generáld build időben, cache-eld a kimenetet, hagyd ki, amikor a forrás nem változott.

### Vercel

A Vercel automatikusan cache-eli a build kimenetet. Adj hozzá `postbuild`-et és kész:

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

Forrás változatlan = cache találat = nulla LLM hívás = nulla költség.

---

## Opciók

```
Használat: translator-agent [opciók]

Opciók:
  -s, --source <útvonal>      forrás könyvtár vagy fájl szkenneléshez
  -l, --locales <locale-k>    cél locale-k, vessző-elválasztva vagy "all" a 71 nyelvhez
  -o, --output <útvonal>      kimeneti könyvtár (alapértelmezett: "./translations")
  -p, --provider <név>        anthropic | openai (alapértelmezett: "anthropic")
  -m, --model <id>            modell felülírás
  -c, --concurrency <n>       max párhuzamos LLM hívások (alapértelmezett: 10)
  --api-url <url>             hostolt szolgáltatás URL (automatikusan használt, ha nincsenek API kulcsok)
```

| Kiterjesztés | Stratégia |
|---|---|
| `.json` | Értékek fordítása, kulcsok megőrzése |
| `.md` / `.mdx` | Szöveg fordítása, szintaxis megőrzése |
| `.html` / `.htm` | Szöveg fordítása, tagek megőrzése, `lang`/`dir` beillesztése |
| Minden más | Másolás minden locale könyvtárba |

### Mind a 71 locale

A `-l all` lefedi az internetfelhasználók ~95%-át: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licenc

MIT