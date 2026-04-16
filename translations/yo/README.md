# translator-agent

Iṣoro localization ti ₦4,000,000 ($10,000), ti a yanju laarin iseju 90.

Awọn ile-iṣẹ n san awọn ajẹnti ₦40-₦100 ($0.10–0.25) fun ọrọ kọọkan lati ṣe localization oju-opo wọn. Oju-opo ti o ni ọrọ 5,000 sinu ede 10 naa ṣe ₦2,000,000-₦4,800,000 ($5,000–12,000) ti o si gba ọsẹ 2-4. Gbogbo igba ti o ba yi akọle kan pada, kaunta naa bẹrẹ tuntun.

Ohun elo yii ṣe e ninu pipaṣẹ kan, sinu ede 71, lakoko igbesẹ kiko rẹ:

```bash
bunx translator-agent -s ./dist -l all
```

Ko si ajẹnti. Ko si spreadsheets. Ko si titiipa onjẹmi. Ko si forukọsilẹ. Awọn bọtini rẹ, ikọ rẹ, awọn ede rẹ.

> **O n ka ẹri naa.** A ti tuymelọ README yii nipa ṣiṣe `bunx translator-agent -s README.md -l all`. Lọ ka [ẹya Japanese](./translations/ja/README.md) — ko kan tuymelọ "kaunta naa bẹrẹ tuntun," o rọpo rẹ pẹlu owe iṣowo Japanese. [Ẹya German](./translations/de/README.md) gun diẹ 30% nitori German nigbagbogbo gun ju. [Ẹya Arabic](./translations/ar/README.md) ka lati ọtun si osi. [Ẹya Brazilian Portuguese](./translations/pt-BR/README.md) dun bi Brazilian lo kọ, nitori iyẹn ni ero naa.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [gbogbo 71...](./translations/)

---

## Idi ti o fi n ṣiṣẹ

Itumọ jẹ iṣoro ti a ti yanju. Localization kii ṣe bẹ.

Google Translate le yi "Awọn hamsters wa n ṣiṣẹ lori" si Japanese. Eyi ti ko le ṣe ni lati mọ pe awada naa ko da si Japan, o si rọpo pẹlu ohun ti o ba da — bi titọka si ẹgbẹ engineering ti n ṣiṣẹ ni alẹ gbogbo, eyi ti o ba aṣa mu ti o si dun ninu ipo naa.

Ohun elo yii ko tuymelọ. O **transcreates** — ọna kanna ti awọn ajẹnti ipolowo gba ₦20,000,000 ($50,000) fun nigbati wọn n ṣatunṣe ipolowo kan kọja awọn ọja. Ṣugbọn LLM mọ gbogbo aṣa tẹlẹ, gbogbo owe, gbogbo ilana iforukọsilẹ. O mọ pe:

- `$49/month` di `oṣu kọọkan ₦78,400` ni Nigeria — kii ṣe "$49" pẹlu ami naira ti a fi kun
- Ẹgan ṣiṣẹ daradara ni English ṣugbọn o ku ni Japanese ti o tọ
- "Riri ninu iwe" di "omi iwe-iṣẹ" ni French — gbọlọhun French gidi, kii ṣe itumọ ọrọ-fun-ọrọ
- Awọn German pa awada hamster mọ nitori Hamsterrad (kẹkẹ hamster) jẹ owe German gidi
- Awọn Brazilian nilo iṣesi ainidii tabi o yoo dun bi roboti lo kọ

Awoṣe naa pin ọrọ kọọkan si ẹka. Awọn aami UI gba itumọ taara. Iwe ipolowo gba atunṣe. Awada ti a tun ṣẹda ni kikun fun aṣa ibi-afẹde.

---

## Kini yoo ṣẹlẹ nigbati o ba ṣe e

Tọju si abajade ikọ rẹ. O ṣẹda aṣa faili gbogbo fun ede kọọkan — tuymelọ awọn faili ọrọ, daakọ awọn ohun elo aimi, ati ṣe ipilẹṣẹ gbogbo ohun ti o nilo fun iṣẹ ṣiṣe:

```
your-site/                          translations/
  index.html                          middleware.ts        ← iwadii ede
  about.html             →            _locales.css         ← titẹ fun iwe kọọkan
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreated
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← daakọ
                                        js/app.js          ← daakọ
                                        images/logo.png    ← daakọ
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% ọrọ
                                        ...
                                      de/
                                        ...
```

Gbogbo faili HTML gba `lang` ati `dir="rtl"` ti a fi sinu. Gbogbo ede gba CSS pẹlu stack ọrọ ti o tọ, giga-laini, ati itọsọna ọrọ. A ṣe middleware Vercel ti o ka `Accept-Language` ti o si tun kọ si ede ti o tọ.

Fi si Vercel. Onilo ni Tokyo ri Japanese pẹlu Hiragino Sans ni giga-laini 1.8. Onilo ni Cairo ri Arabic RTL pẹlu Noto Naskh ni iwọn 110%. Onilo ni Bangkok ri Thai pẹlu `word-break: keep-all` nitori Thai ko ni awọn aaye. Ko si iṣeto.

---

## Iseju 90, kii ṣe ọsẹ 4

```bash
# Awọn ede mẹta, faili JSON kan
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Ti pari. Awọn faili 3 ti a kọ ni 9.5s

# Gbogbo oju-opo rẹ, gbogbo ede lori aye
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Ti pari. Awọn faili 142 ti a tumọ, awọn faili aimi 284 ti a daakọ ni 94s
```

### Ninu ọna ikọ rẹ

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Gbogbo ifilọlẹ fi jade ni ede 71. Awọn itumọ jẹ awọn ohun ikọ — ti a pamọ, ti a tun ṣe nigbati orisun ba yi pada nikan.

---

## Mu awọn bọtini rẹ wa tabi maṣe

```bash
# O ni awọn bọtini — n ṣiṣẹ ni agbegbe, o san fun olupese LLM rẹ taara
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# O ko ni awọn bọtini — o kan ṣiṣẹ
# Lo iṣẹ ti a gbe loju-opo laifọwọyi
# San fun itumọ kọọkan pẹlu USDC nipasẹ x402 — ko si forukọsilẹ, ko si akọọlẹ
bunx translator-agent -s ./dist -l all
```

Pipaṣẹ kanna. Ti awọn bọtini API ba wa, o ṣiṣẹ ni agbegbe pẹlu olupese rẹ. Ti ko ba si, o lu API ti a gbe ti o si san fun ibeere kọọkan nipasẹ [x402](https://x402.org) — ilana sisanwo HTTP 402. Onibara rẹ san USDC lori Base, gba awọn itumọ pada. Ko si ijẹrisi, ko si ibasọrọ onjẹmi, ko si awọn iwe-owo.

O ṣe atilẹyin Anthropic ati OpenAI. Mu awoṣe eyikeyi ti o fẹ:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Gbogbo eto iwe, ti a bojuto

Ohun elo naa ko kan tuymelọ ọrọ — o mọ bii eto iwe kọọkan ṣe n han:

| Iwe | Kini yipada | Idi |
|---|---|---|
| **Arabic, Hebrew, Farsi, Urdu** | `dir="rtl"`, awọn ọrọ RTL, iwọn 110% | Arabic nilo titẹ ti o tobi ju lati le kika; gbogbo eto dojukọ |
| **Japanese, Chinese, Korean** | Awọn stack ọrọ CJK, giga-laini 1.8 | Awọn kikọ jẹ awọn onigun mẹrin iwọn-iduroṣinṣin; nilo aaye mimi inaro |
| **Hindi, Bengali, Tamil, Telugu** | Awọn ọrọ Indic, giga-laini 1.8 | Awọn ila ori (shirorekha) nilo aaye inaro afikun |
| **Thai** | `word-break: keep-all` | Ko si awọn aaye laarin awọn ọrọ — aṣawakiri nilo awọn ofin yiya-laini ti o han |
| **Burmese** | giga-laini 2.2 | Awọn glyphs ti o ga julo ti eto iwe pataki eyikeyi |
| **Khmer** | giga-laini 2.0 | Awọn akopọ kọnsọnanti abẹ-iwe ti kọja si inaro |

CSS ti a ṣẹda fun ede kọọkan:

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

## Pamọ

Awọn itumọ jẹ awọn ohun ikọ. Ṣẹda ni akoko ikọ, pamọ abajade, fo kọja nigbati orisun ko ba ti yipada.

### Vercel

Vercel pa abajade ikọ mọ laifọwọyi. Fi `postbuild` kun o si ti pari:

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

Orisun ko yipada = cache hit = awọn ipe LLM odo = idiyele odo.

---

## Awọn aṣayan

```
Lilo: translator-agent [awọn aṣayan]

Awọn aṣayan:
  -s, --source <ọna>      itọsọna orisun tabi faili lati ṣayẹwo
  -l, --locales <awọn-ede>  awọn ede ibi-afẹde, ti a pin pẹlu koma tabi "all" fun ede 71
  -o, --output <ọna>      itọsọna abajade (aiyipada: "./translations")
  -p, --provider <orukọ>    anthropic | openai (aiyipada: "anthropic")
  -m, --model <id>         ayipada awoṣe
  -c, --concurrency <n>    awọn ipe LLM parepo ti o pọju (aiyipada: 10)
  --api-url <url>          URL iṣẹ ti a gbe (lo-laifọwọyi nigbati ko si awọn bọtini API)
```

| Idagbasoke | Ilana |
|---|---|
| `.json` | Tuymelọ awọn iye, tọju awọn bọtini |
| `.md` / `.mdx` | Tuymelọ ọrọ, tọju iṣiro |
| `.html` / `.htm` | Tuymelọ ọrọ, tọju awọn aami, fi `lang`/`dir` sinu |
| Gbogbo miiran | Daakọ sinu itọsọna ede kọọkan |

### Gbogbo ede 71

`-l all` bo ~95% awọn onilo intanẹẹti: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Laisi

MIT