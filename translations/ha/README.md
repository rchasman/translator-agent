# translator-agent

Matsalar gargajiya ta dala ₦4,000,000 ta localization, an warware a cikin daƙiƙa 90.

Kamfanoni suna biyan hukumomi ₦40–100 kowace kalma don gyara rubutun gidan yanar gizon su. Gidan yanar gizon da ke da kalmomi 5,000 zuwa harsuna 10 yana kashe ₦2,000,000–4,800,000 kuma yana ɗaukar makonni 2–4. Duk lokacin da kuka canza taken shafi, mita yana sake farawa.

Wannan kayan aiki yana yin hakan cikin umurni ɗaya, zuwa harsuna 71, lokacin aikin gini:

```bash
bunx translator-agent -s ./dist -l all
```

Babu wakilci. Babu takardun lissafi. Babu kulle mai siyarwa. Babu rajista. Maɓallinka, ginin ka, harsunanki.

> **Kana karanta hujjar.** An fassara wannan README ta hanyar gudana `bunx translator-agent -s README.md -l all`. Je karanta [sigar Japan](./translations/ja/README.md) — bai kawai fassara "mita yana sake farawa" ba, ya maye shi da kalmar kasuwanci ta Japan. [Sigar Jamus](./translations/de/README.md) ta fi tsayi kashi 30% saboda Jamus ko da yaushe haka yake. [Sigar Larabci](./translations/ar/README.md) ana karantawa daga dama zuwa hagu. [Sigar Brazil Portuguese](./translations/pt-BR/README.md) yana jin kamar ɗan Brazil ne ya rubuta shi, saboda shi ne manufar.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [duk 71...](./translations/)

---

## Me yasa wannan ke aiki

Fassara matsala ce da aka warware. Gyare-gyare na yanki ba haka ba ne.

Google Translate yana iya juya "Hamsters dinmu suna aiki a kai" zuwa Japananci. Abin da ba zai iya yi ba shi ne gane cewa wannan barkwanci bai yi nasara a Japan ba, sannan ya maye shi da wani abu da zai yi — kamar yin magana akan ƙungiyar injiniya suna yin aiki dare tsawon dare, wanda ya dace da al'ada kuma yana da ban dariya a matsayin.

Wannan kayan aiki ba ya fassara. Yana yin **sake ƙirƙira** — tsari ɗaya da hukumomin talla ke cajin ₦20,000,000 lokacin da suke gyara yaƙin neman nasara a kasuwanni. Sai dai LLM ya riga ya san kowane al'ada, kowane karin magana, kowane tsarin tsarawa. Ya san cewa:

- `₦19,600/wata` yana zama `月額6,980円` a Japan — ba "₦19,600" da alamar yen da aka manna ba
- Sarkacin maganganu yana kashe a Turanci kuma yana mutuwa a Japananci na yau da kullun
- "Nutse a cikin takardun aiki" yana zama "noyade administrative" a Faransanci — ainihin maganganun Faransa, ba fassarar kalma-da-kalma ba
- Jamusawa suna riƙe da barkwancin hamster saboda Hamsterrad (dabaran hamster) ainihin kalmar Jamus ce
- Brazilians suna buƙatar matsayi na yau da kullun ko kuma zai yi kamar robot ne ya rubuta shi

Samfurin yana rarraba kowane zagi. Tambarin UI suna samun fassara kai tsaye. Kwafin tallace-tallace ana gyarawa. Ana sake ƙirƙira barkwanci gabaɗaya don al'adar da ake nufi.

---

## Me ke faruwa lokacin da kuka gudana shi

Nuna shi ga fitowar gininki. Yana kwafi dukan bishiyar fayil kowace yanki — yana fassara fayilolin rubutu, yana kwafi kadarorin da ba sa motsi, kuma yana samar da duk abin da ake buƙata don turawa:

```
gidan-yanar-gizonku/                 fassarori/
  index.html                          middleware.ts        ← gano yanki
  about.html             →            _locales.css         ← rubutun kowane rubutu
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", sake ƙirƙira
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← kwafi
                                        js/app.js          ← kwafi
                                        images/logo.png    ← kwafi
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Kowane fayil ɗin HTML yana samun `lang` da `dir="rtl"` da aka shigar. Kowane yanki yana samun CSS tare da daidaitaccen tsarin font, line-height, da alkiblar rubutu. Ana samar da middleware na Vercel wanda ke karanta `Accept-Language` kuma yana sake rubutu zuwa yankin da ya dace.

Tura zuwa Vercel. Mai amfani a Tokyo yana ganin Japananci tare da Hiragino Sans a 1.8 line-height. Mai amfani a Cairo yana ganin RTL Larabci tare da Noto Naskh a girman 110%. Mai amfani a Bangkok yana ganin Thai tare da `word-break: keep-all` saboda Thai ba shi da wurare. Babu config.

---

## Daƙiƙa 90, ba makonni 4 ba

```bash
# Harsuna uku, fayil JSON ɗaya
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
An gama. Fayiloli 3 da aka rubuta a cikin 9.5s

# Duk gidan yanar-gizonku, kowane harshe a duniya
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
An gama. Fayiloli 142 da aka fassara, fayiloli 284 da ba sa motsi da aka kwafi a cikin 94s
```

### A cikin bututun gininku

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Kowane jigilar kaya tana fitowa cikin harsuna 71. Fassarori kadarorin gini ne — an adana su, ana sake samar da su ne kawai lokacin da tushen ya canza.

---

## Kawo maɓallinku ko kada ku kawo

```bash
# Kuna da maɓalli — yana gudana a gida, kuna biyan mai bada LLM kai tsaye
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Ba ku da maɓalli — yana aiki kawai
# Yana amfani da sabis ɗin da aka shirya ta atomatik
# Biya kowace fassara da USDC ta hanyar x402 — babu rajista, babu asusu
bunx translator-agent -s ./dist -l all
```

Umurni ɗaya. Idan maɓallan API suna nan, yana gudana a gida tare da mai bada ku. Idan ba haka ba, yana bugi API ɗin da aka shirya kuma yana biya kowace buƙata ta hanyar [x402](https://x402.org) — ka'idar biyan kuɗin HTTP 402. Abokin cinikinku yana biyan USDC akan Base, yana samun fassarori. Babu izini, babu dangantakar mai siyarwa, babu lissafin kuɗi.

Yana tallafawa Anthropic da OpenAI. Kawo duk samfurin da kuke so:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Kowane tsarin rubutu, da aka kula da shi

Kayan aikin ba kawai yana fassara rubutu ba — ya san yadda kowane tsarin rubutu ke fitowa:

| Rubutu | Me ke canzawa | Me yasa |
|---|---|---|
| **Larabci, Ibrananci, Farisi, Urdu** | `dir="rtl"`, fonts na RTL, girman 110% | Larabci yana buƙatar babban nau'in rubutu don a iya karantawa; dukan tsarin yana madubi |
| **Japananci, Sinanci, Koranci** | CJK font stacks, 1.8 line-height | Haruffa suna da faɗin kafaffen murabba'ai; suna buƙatar tazarar numfashi a tsaye |
| **Hindi, Bengali, Tamil, Telugu** | Indic fonts, 1.8 line-height | Headstrokes (shirorekha) suna buƙatar ƙarin sarari a tsaye |
| **Thai** | `word-break: keep-all` | Babu wurare tsakanin kalmomi — browser yana buƙatar ƙa'idodin karya-layi na zahiri |
| **Burmese** | 2.2 line-height | Mafi tsayin glyphs na kowane babban rubutu |
| **Khmer** | 2.0 line-height | Ƙungiyoyin baƙar magana suna tattarawa a tsaye |

CSS da aka samar kowace yanki:

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

## Ajiyewa

Fassarori kadarorin gini ne. Samar a lokacin gini, adana fitowar, tsallake lokacin da tushen bai canza ba.

### Vercel

Vercel yana adana fitowar gini ta atomatik. Ƙara `postbuild` kuma kun gama:

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

Tushen bai canza ba = cache hit = sifili LLM kira = sifili farashi.

---

## Zaɓuɓɓuka

```
Amfani: translator-agent [zaɓuɓɓuka]

Zaɓuɓɓuka:
  -s, --source <path>      kundin tushen ko fayil da za a duba
  -l, --locales <locales>  yankuna da ake buƙata, rarraba da waƙafi ko "all" don harsuna 71
  -o, --output <path>      kundin fitarwa (tsoho: "./translations")
  -p, --provider <name>    anthropic | openai (tsoho: "anthropic")
  -m, --model <id>         tsire-tsire na samfuri
  -c, --concurrency <n>    mafi yawan kiran LLM na layi ɗaya (tsoho: 10)
  --api-url <url>          URL na sabis ɗin da aka shirya (yana amfani da shi ta atomatik lokacin da babu maɓallan API)
```

| Tsawo | Dabara |
|---|---|
| `.json` | Fassara dabi'u, kiyaye maɓalli |
| `.md` / `.mdx` | Fassara rubutu, kiyaye tsarin rubutu |
| `.html` / `.htm` | Fassara rubutu, kiyaye tags, shigar da `lang`/`dir` |
| Komai dabam | Kwafi cikin kowane kundin yanki |

### Duk yankuna 71

`-l all` ya rufe kusan kashi 95% na masu amfani da intanet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Lasisi

MIT