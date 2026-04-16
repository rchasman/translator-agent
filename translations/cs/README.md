# translator-agent

Problém lokalizace za 10 000 $ vyřešený za 90 sekund.

Firmy platí agenturám 2,50–6,25 Kč za slovo na lokalizaci svých webů. Web s 5000 slovy do 10 jazyků stojí 125 000–300 000 Kč a trvá 2–4 týdny. Při každé změně titulku začíná počítání znovu.

Tento nástroj to zvládne jedním příkazem, do 71 jazyků, během vašeho sestavování:

```bash
bunx translator-agent -s ./dist -l all
```

Žádná agentura. Žádné tabulky. Žádná závislost na dodavateli. Žádná registrace. Vaše klíče, vaše sestavení, vaše jazyky.

> **Čtete důkaz.** Tento README byl přeložen spuštěním `bunx translator-agent -s README.md -l all`. Přečtěte si [japonskou verzi](./translations/ja/README.md) — nejen že přeložila „meter restarts", ale nahradila to japonskou obchodní frází. [Německá verze](./translations/de/README.md) je o 30 % delší, protože němčina prostě je. [Arabská verze](./translations/ar/README.md) se čte zprava doleva. [Brazilsko-portugalská verze](./translations/pt-BR/README.md) zní, jako by ji psal Brazilec, protože to je přesně smysl.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [všech 71...](./translations/)

---

## Proč to funguje

Překlad je vyřešený problém. Lokalizace není.

Google Překladač dokáže změnit „Naši křečci na tom pracují" do japonštiny. Co nedokáže, je poznat, že vtip v Japonsku nezafunguje, a nahradit ho něčím, co funguje — třeba narážkou na vývojový tým, který táhne noční směnu, což je kulturně přiměřené a v kontextu vtipné.

Tento nástroj nepřekládá. **Transkreuje** — stejný proces, za který si reklamní agentury účtují 1,2 milionu korun při adaptaci kampaně napříč trhy. Akorát LLM už zná každou kulturu, každou frázi, každou konvenci formátování. Ví, že:

- `$49/month` se v Japonsku stane `月額6,980円` — ne „$49" se symbolem jenu na konci
- Sarkasmus zabíjí v angličtině a umírá ve formální japonštině
- „Drowning in paperwork" se ve francouzštině stane „noyade administrative" — opravdový francouzský výraz, ne doslovný překlad
- Němci si nechají vtip o křečkovi, protože Hamsterrad (křečí kolo) je skutečná německá fráze
- Brazilci potřebují neformální styl, jinak to zní, jako by to psal robot

Model klasifikuje každý řetězec. UI štítky dostanou přímý překlad. Marketingové texty se adaptují. Humor se kompletně přetváří pro cílovou kulturu.

---

## Co se stane, když to spustíte

Namiřte to na výstup vašeho sestavení. Naklonuje celý strom souborů pro každé prostředí — překládá textové soubory, kopíruje statická média a generuje vše potřebné pro nasazení:

```
your-site/                          translations/
  index.html                          middleware.ts        ← detekce prostředí
  about.html             →            _locales.css         ← typografie pro písmo
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transkreováno
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 řádkování
                                        css/style.css      ← zkopírováno
                                        js/app.js          ← zkopírováno
                                        images/logo.png    ← zkopírováno
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% písmo
                                        ...
                                      de/
                                        ...
```

Do každého HTML souboru se vloží `lang` a `dir="rtl"`. Každé prostředí dostane CSS se správnou sadou písem, řádkováním a směrem textu. Vygeneruje se Vercel middleware, které čte `Accept-Language` a přesměruje na správné prostředí.

Nasaďte na Vercel. Uživatel v Tokiu vidí japonštinu s Hiragino Sans při řádkování 1,8. Uživatel v Káhiře vidí arabštinu RTL s Noto Naskh při velikosti 110 %. Uživatel v Bangkoku vidí thajštinu s `word-break: keep-all`, protože thajština nemá mezery. Žádná konfigurace.

---

## 90 sekund, ne 4 týdny

```bash
# Tři jazyky, jeden JSON soubor
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Hotovo. 3 soubory napsané za 9,5s

# Celý váš web, každý jazyk na Zemi
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Hotovo. 142 souborů přeloženo, 284 statických souborů zkopírováno za 94s
```

### Ve vašem sestavovacím pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Každé nasazení dodává v 71 jazycích. Překlady jsou artefakty sestavení — kešují se, regenerují pouze při změně zdroje.

---

## Přineste si své klíče nebo nepřinášejte

```bash
# Máte klíče — běží lokálně, platíte svému LLM poskytovateli přímo
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Nemáte klíče — prostě funguje
# Automaticky používá hostovanou službu
# Platíte za překlad pomocí USDC přes x402 — žádná registrace, žádný účet
bunx translator-agent -s ./dist -l all
```

Stejný příkaz. Pokud jsou přítomny API klíče, běží lokálně s vaším poskytovatelem. Pokud ne, osloví hostované API a platí za požadavek přes [x402](https://x402.org) — protokol plateb HTTP 402. Váš klient platí USDC na Base, dostává překlady zpět. Žádná autentizace, žádný dodavatelský vztah, žádné faktury.

Podporuje Anthropic a OpenAI. Přineste si jakýkoli model chcete:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Každý systém písma zpracovaný

Nástroj nejen překládá text — ví, jak se každý systém písma renderuje:

| Písmo | Co se mění | Proč |
|---|---|---|
| **Arabština, hebrejština, perština, urdu** | `dir="rtl"`, RTL písma, 110% velikost | Arabština potřebuje větší písmo pro čitelnost; celé rozložení se zrcadlí |
| **Japonština, čínština, korejština** | CJK sady písem, 1,8 řádkování | Znaky jsou čtverce s pevnou šířkou; potřebují vertikální prostor |
| **Hindština, bengálština, tamilština, telugština** | Indická písma, 1,8 řádkování | Horní tahy (shirorekha) potřebují extra vertikální prostor |
| **Thajština** | `word-break: keep-all` | Žádné mezery mezi slovy — prohlížeč potřebuje explicitní pravidla pro zalomení |
| **Barmština** | 2,2 řádkování | Nejvyšší glyfy ze všech hlavních písem |
| **Khmerština** | 2,0 řádkování | Podskriptové souhláskové klastry se skládají vertikálně |

Generované CSS pro prostředí:

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

## Kešování

Překlady jsou artefakty sestavení. Generují se při sestavení, výstup se kešuje, přeskakuje se při nezměněném zdroji.

### Vercel

Vercel automaticky kešuje výstup sestavení. Přidejte `postbuild` a máte hotovo:

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

Nezměněný zdroj = zásah keše = nula LLM volání = nulové náklady.

---

## Možnosti

```
Použití: translator-agent [možnosti]

Možnosti:
  -s, --source <cesta>      zdrojový adresář nebo soubor ke skenování
  -l, --locales <prostředí>  cílová prostředí, oddělená čárkou nebo "all" pro 71 jazyků
  -o, --output <cesta>      výstupní adresář (výchozí: "./translations")
  -p, --provider <název>    anthropic | openai (výchozí: "anthropic")
  -m, --model <id>         přepsání modelu
  -c, --concurrency <n>    max paralelních LLM volání (výchozí: 10)
  --api-url <url>          URL hostované služby (auto-použito při absenci API klíčů)
```

| Přípona | Strategie |
|---|---|
| `.json` | Přeložit hodnoty, zachovat klíče |
| `.md` / `.mdx` | Přeložit text, zachovat syntax |
| `.html` / `.htm` | Přeložit text, zachovat tagy, vložit `lang`/`dir` |
| Vše ostatní | Zkopírovat do každého adresáře prostředí |

### Všech 71 prostředí

`-l all` pokrývá ~95 % uživatelů internetu: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licence

MIT