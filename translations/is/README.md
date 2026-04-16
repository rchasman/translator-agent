# translator-agent

10.000 dollara þýðingavandamálið, leyst á 90 sekúndum.

Fyrirtæki borga stofnunum 0,10–0,25 dollara á orð til að þýða síður sínar. 5.000 orða síða yfir á 10 tungumál kostar 5.000–12.000 dollara og tekur 2–4 vikur. Í hvert skipti sem þú breytir fyrirsögn byrjar klukkan aftur.

Þetta tól gerir það með einni skipun, yfir á 71 tungumál, í byggingarferlinu þínu:

```bash
bunx translator-agent -s ./dist -l all
```

Engin stofnun. Engir töflureiknar. Ekkert læsing hjá seljanda. Engin nýskráning. Þínir lyklar, þín bygging, þín tungumál.

> **Þú ert að lesa sönnunina.** Þessi README var þýdd með því að keyra `bunx translator-agent -s README.md -l all`. Farðu að lesa [japönsku útgáfuna](./translations/ja/README.md) — hún þýddi ekki bara "the meter restarts," hún skipti því út fyrir japanskt viðskiptaorðtak. [Þýska útgáfan](./translations/de/README.md) er 30% lengri vegna þess að þýska er alltaf það. [Arabíska útgáfan](./translations/ar/README.md) lesist frá hægri til vinstri. [Brasilíanska portúgölsku útgáfan](./translations/pt-BR/README.md) hljómar eins og Brasilíubúi hafi skrifað hana, vegna þess að það er tilgangurinn.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [öll 71...](./translations/)

---

## Af hverju þetta virkar

Þýðing er útklárt vandamál. Staðfærsla er það ekki.

Google Translate getur breytt "Our hamsters are working on it" í japönsku. Það sem það getur ekki gert er að þekkja að brandurinn verður blár í Japan og skipta honum út fyrir eitthvað sem virkar — eins og að vísa til verkfræðiteymisins sem er að draga nóttina, sem er bæði menningarlega viðeigandi og fyndið í samhengi.

Þetta tól þýðir ekki. Það **endurskapar** — sama ferlið og auglýsingastofur rukka 50.000 dollara fyrir þegar þær aðlaga herferð á markaða. Nema LLM-ið þekkir nú þegar alla menningarheima, öll orðtök, alla sniðsreglu. Það veit að:

- `49 dollarar/mánuður` verður `月額6.980円` í Japan — ekki "49 dollarar" með jen-tákni límt á
- Háðung drepur á ensku og deyr í formlegu japönsku
- "Drowning in paperwork" verður "noyade administrative" á frönsku — raunverulegt franskt orðtak, ekki orð-fyrir-orð þýðing
- Þjóðverjar halda hamsturbranduranum vegna þess að Hamsterrad (hamstrarhjól) er raunverulegt þýskt orðtak
- Brasilíubúar þurfa óformlegur tón annars hljómar það eins og vélmenni hafi skrifað það

Líkanið flokkar hvern streng. Viðmótsmerkingar fá beina þýðingu. Markaðstexti er aðlagaður. Húmor er endurskapaður að fullu fyrir markmenningu.

---

## Hvað gerist þegar þú keyrir það

Beindu því á byggingúrtakið þitt. Það afritaar allt skráatréið fyrir hvert landssvæði — þýðir textaskrár, afritar föstar eignir og býr til allt sem þarf til uppsetningar:

```
síðan-þín/                           þýðingar/
  index.html                          middleware.ts        ← landsgreining
  about.html             →            _locales.css         ← leturfræði fyrir ritmál
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", endurskapað
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 línuhæð
                                        css/style.css      ← afritað
                                        js/app.js          ← afritað
                                        images/logo.png    ← afritað
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% letur
                                        ...
                                      de/
                                        ...
```

Sérhver HTML skrá fær `lang` og `dir="rtl"` sprauted inn. Sérhvert landssvæði fær CSS með réttri leturhrús, línuhæð og textastefnu. Vercel millivara er búin til sem les `Accept-Language` og endurskrifar í rétt landssvæði.

Settu upp á Vercel. Notandi í Tókýó sér japönsku með Hiragino Sans á 1.8 línuhæð. Notandi í Kaíró sér RTL arabísku með Noto Naskh á 110% stærð. Notandi í Bangkok sér taílenska með `word-break: keep-all` vegna þess að taílenska hefur engin bil. Engin stillingar.

---

## 90 sekúndur, ekki 4 vikur

```bash
# Þrjú tungumál, ein JSON skrá
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Lokið. 3 skrár skrifaðar á 9,5s

# Öll síðan þín, öll tungumál á jörðinni
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Lokið. 142 skrár þýddar, 284 fastar skrár afritaðar á 94s
```

### Í byggingarkeðjunni þinni

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Sérhver uppsetning sendir á 71 tungumáli. Þýðingar eru byggingarafurðir — geymdar, endurgerðar aðeins þegar uppruni breytist.

---

## Komdu með þína eigin lykla eða ekki

```bash
# Þú ert með lykla — keyrir staðbundið, þú borgar LLM þjónustuveituna beint
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Þú ert ekki með lykla — bara virkar
# Notar sjálfkrafa hýsta þjónustu
# Borgaðu fyrir þýðingu með USDC í gegnum x402 — engin nýskráning, enginn reikningur
bunx translator-agent -s ./dist -l all
```

Sama skipun. Ef API lyklar eru til staðar keyrir það staðbundið með þjónustuveitunni þinni. Ef ekki, það fer á hýsta API og borgar fyrir beiðni í gegnum [x402](https://x402.org) — HTTP 402 greiðslusamskiptareglur. Biðlarinn þinn borgar USDC á Base, fær þýðingar til baka. Engin auðkenning, engin seljendatengsl, engir reikningar.

Styður Anthropic og OpenAI. Komdu með hvaða líkan sem þú vilt:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Sérhvert ritkerfi, meðhöndlað

Tólið þýðir ekki bara texta — það veit hvernig sérhvert ritkerfi birtist:

| Ritmál | Hvað breytist | Af hverju |
|---|---|---|
| **Arabískt, hebreska, persneska, úrdú** | `dir="rtl"`, RTL letur, 110% stærð | Arabíska þarf stærra letur til að vera læsilegt; öll útlit speglast |
| **Japanska, kínverska, kóreska** | CJK leturhrísi, 1.8 línuhæð | Stafir eru föst ferningar; þurfa lóðrétt andrúm |
| **Hindí, bengalska, tamílska, telúgú** | Indversk letur, 1.8 línuhæð | Höfuðstrik (shirorekha) þurfa aukalegt lóðrétt pláss |
| **Taílenska** | `word-break: keep-all` | Engin bil milli orða — vafrinn þarf skýrar línurofareglur |
| **Búrmenska** | 2.2 línuhæð | Hæstu stafir allra helstu ritmála |
| **Khmer** | 2.0 línuhæð | Undirhljóðstafaflokkar stafla lóðrétt |

Búin til CSS fyrir hvert landssvæði:

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

## Geymsla

Þýðingar eru byggingarafurðir. Búðu til á byggingatíma, geymdu úttakið, slepptu þegar uppruni hefur ekki breyst.

### Vercel

Vercel geymir byggingúrtak sjálfkrafa. Bættu við `postbuild` og þú ert kominn:

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

Uppruni óbreyttur = cache hit = núll LLM símtöl = núll kostnaður.

---

## Valkostir

```
Notkun: translator-agent [valkostir]

Valkostir:
  -s, --source <slóð>      uppruni möppu eða skrá til að skanna
  -l, --locales <landssvæði>  marklandssvæði, aðskilin með kommu eða "all" fyrir 71 tungumál
  -o, --output <slóð>      úttaksmappa (sjálfgefið: "./translations")
  -p, --provider <nafn>    anthropic | openai (sjálfgefið: "anthropic")
  -m, --model <id>         líkanyfirskriftun
  -c, --concurrency <n>    hámarks samhliða LLM símtöl (sjálfgefið: 10)
  --api-url <url>          hýst þjónustuslóð (sjálfnotuð þegar engir API lyklar eru stilltar)
```

| Ending | Stefna |
|---|---|
| `.json` | Þýða gildi, varðveita lykla |
| `.md` / `.mdx` | Þýða texta, varðveita málskipan |
| `.html` / `.htm` | Þýða texta, varðveita merki, sprauta `lang`/`dir` |
| Allt annað | Afrita í hverja landsssvæðismöppu |

### Öll 71 landssvæði

`-l all` nær til ~95% internetnotenda: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Leyfi

MIT