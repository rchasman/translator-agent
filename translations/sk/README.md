# translator-agent

Problém lokalizácie za 10 000 $ vyriešený za 90 sekúnd.

Firmy platia agentúram 0,10–0,25 € za slovo za lokalizáciu svojich stránok. Stránka s 5 000 slovami do 10 jazykov stojí 5 000–12 000 € a trvá 2–4 týždne. Vždy, keď zmeníte nadpis, merač sa spustí znova.

Tento nástroj to spraví jedným príkazom, do 71 jazykov, počas vášho build procesu:

```bash
bunx translator-agent -s ./dist -l all
```

Žiadna agentúra. Žiadne tabuľky. Žiadne uzamknutie k dodávateľovi. Žiadna registrácia. Vaše kľúče, váš build, vaše jazyky.

> **Čítate dôkaz.** Tento README bol preložený spustením `bunx translator-agent -s README.md -l all`. Prečítajte si [japonskú verziu](./translations/ja/README.md) — nevysvetlil len "merač sa spustí znova," ale nahradil to japonským obchodným idiómom. [Nemecká verzia](./translations/de/README.md) je o 30% dlhšia, pretože nemčina jednoducho vždy je. [Arabská verzia](./translations/ar/README.md) sa čítá sprava doľava. [Brazílska portugalská verzia](./translations/pt-BR/README.md) znie, akoby ju písal Brazílčan, a o to ide.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [všetkých 71...](./translations/)

---

## Prečo to funguje

Preklad je vyriešený problém. Lokalizácia nie je.

Google Translate dokáže zmeniť "Naše škrečky na tom pracujú" do japončiny. Čo nedokáže, je rozpoznať, že ten vtip v Japonsku nezafunguje, a nahradiť ho niečím, čo funguje — ako napríklad narážka na technický tím, ktorý si robí nočnú zmenu, čo je kultúrne vhodné a vtipné v kontexte.

Tento nástroj neprekladá. **Transkreuje** — ten istý proces, za ktorý reklamné agentúry účtujú 50 000 $ pri adaptácii kampane na rôzne trhy. Okrem toho, že LLM už pozná každú kultúru, každý idiom, každú formátovaciu konvenciu. Vie, že:

- `$49/month` sa stáva `49 €/mesačne` na Slovensku — nie "$49" s € symbolom nalepeným
- Sarkazmus zabíja v angličtine a umiera vo formálnej japončine
- "Toniemo v byrokracii" sa stáva "noyade administrative" vo francúzštine — skutočný francúzsky výraz, nie doslovný preklad
- Nemci si ponechajú ten vtip so škrečkami, pretože Hamsterrad (kolotoč škrečkov) je skutočný nemecký idiom
- Brazílčania potrebujú neformálny register, inak to znie, ako keby to písal robot

Model klasifikuje každý reťazec. UI labely dostanú priamy preklad. Marketingový obsah sa adaptuje. Humor sa úplne pretvára pre cieľovú kultúru.

---

## Čo sa stane, keď to spustíte

Nasmerujte ho na váš build výstup. Naklonuje celý strom súborov pre každý jazyk — prekladá textové súbory, kopíruje statické assety a generuje všetko potrebné pre nasadenie:

```
vasa-stranka/                       translations/
  index.html                          middleware.ts        ← detekcia jazyka
  about.html             →            _locales.css         ← typografia pre písmo
  css/style.css                       sk/
  js/app.js                             index.html         ← lang="sk", transkreované
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans, 1.8 line-height
                                        css/style.css      ← skopírované
                                        js/app.js          ← skopírované
                                        images/logo.png    ← skopírované
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Každý HTML súbor dostane `lang` a `dir="rtl"` injektované. Každý jazyk dostane CSS so správnym font stackom, line-height a smerom textu. Vygeneruje sa Vercel middleware, ktorý číta `Accept-Language` a presmeruje na správny jazyk.

Nasaďte na Vercel. Používateľ v Tokiu uvidí japončinu s Hiragino Sans pri 1.8 line-height. Používateľ v Káhire uvidí RTL arabčinu s Noto Naskh pri 110% veľkosti. Používateľ v Bangkoku uvidí thajčinu s `word-break: keep-all`, pretože thajčina nemá medzery. Žiadna konfigurácia.

---

## 90 sekúnd, nie 4 týždne

```bash
# Tri jazyky, jeden JSON súbor
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Hotovo. 3 súbory zapísané za 9,5s

# Celá vaša stránka, každý jazyk na zemi
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Hotovo. 142 súborov preložených, 284 statických súborov skopírovaných za 94s
```

### Vo vašom build pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Každé nasadenie sa doručuje v 71 jazykoch. Preklady sú build artefakty — cache-ované, regenerované len keď sa zmení zdroj.

---

## Prineste si vlastné kľúče alebo nie

```bash
# Máte kľúče — beží lokálne, platíte svojmu LLM poskytovateľovi priamo
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Nemáte kľúče — jednoducho funguje
# Automaticky používa hostovanú službu
# Platíte za preklad USDC cez x402 — žiadna registrácia, žiadny účet
bunx translator-agent -s ./dist -l all
```

Ten istý príkaz. Ak sú prítomné API kľúče, beží lokálne s vaším poskytovateľom. Ak nie, osloví hostované API a platí za požiadavku cez [x402](https://x402.org) — HTTP 402 platobný protokol. Váš klient platí USDC na Base, dostane preklady späť. Žiadne overenie, žiadny vzťah s dodávateľom, žiadne faktúry.

Podporuje Anthropic a OpenAI. Prineste si ktorýkoľvek model chcete:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Každý systém písma, riešený

Nástroj neprekladá len text — pozná, ako sa každý systém písma renderuje:

| Písmo | Čo sa mení | Prečo |
|---|---|---|
| **Arabčina, hebrejčina, perzština, urdčina** | `dir="rtl"`, RTL fonty, 110% veľkosť | Arabčina potrebuje väčší typ pre čitateľnosť; celý layout sa zrkadlí |
| **Japončina, čínština, kórejčina** | CJK font stacky, 1.8 line-height | Znaky sú štvorce s fixnou šírkou; potrebujú vertikálny priestor na dýchanie |
| **Hindčina, bengálčina, tamilčina, telugčina** | Indické fonty, 1.8 line-height | Hlavičkové ťahy (shirorekha) potrebujú extra vertikálny priestor |
| **Thajčina** | `word-break: keep-all` | Žiadne medzery medzi slovami — prehliadač potrebuje explicitné pravidlá pre zlom riadku |
| **Barmčina** | 2.2 line-height | Najvyššie glyfy zo všetkých hlavných písiem |
| **Khmerčina** | 2.0 line-height | Podradné súhláskovité zhluky sa skladajú vertikálne |

Generované CSS pre každý jazyk:

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

## Cache-ovanie

Preklady sú build artefakty. Generujte v build time, cache-ujte výstup, preskočte keď sa zdroj nezmenil.

### Vercel

Vercel cache-uje build výstup automaticky. Pridajte `postbuild` a je to:

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

Zdroj nezmenený = cache hit = nula LLM volaní = nulové náklady.

---

## Možnosti

```
Použitie: translator-agent [možnosti]

Možnosti:
  -s, --source <path>      zdrojový adresár alebo súbor na skenovanie
  -l, --locales <locales>  cieľové jazyky, oddelené čiarkami alebo "all" pre 71 jazykov
  -o, --output <path>      výstupný adresár (predvolené: "./translations")
  -p, --provider <name>    anthropic | openai (predvolené: "anthropic")
  -m, --model <id>         prepísanie modelu
  -c, --concurrency <n>    max paralelných LLM volaní (predvolené: 10)
  --api-url <url>          URL hostovanej služby (auto-použije keď nie sú nastavené API kľúče)
```

| Prípona | Stratégia |
|---|---|
| `.json` | Preloží hodnoty, zachová kľúče |
| `.md` / `.mdx` | Preloží text, zachová syntax |
| `.html` / `.htm` | Preloží text, zachová tagy, injektuje `lang`/`dir` |
| Všetko ostatné | Skopíruje do každého jazykového adresára |

### Všetkých 71 jazykov

`-l all` pokrýva ~95% používateľov internetu: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licencia

MIT