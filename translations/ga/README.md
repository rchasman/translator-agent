# translator-agent

An fhadhb logánaithe $10,000, réitithe in 90 soicind.

Íocann cuideachtaí le gníomhaireachtaí $0.10–0.25 in aghaidh na focla chun a suímh Ghréasáin a logánú. Cosnaíonn suíomh 5,000 focal i 10 dteanga $5,000–12,000 agus tógann sé 2–4 seachtaine. Gach uair a athraíonn tú ceannlíne, tosaíonn an méadar arís.

Déanann an uirlis seo é in aon ordú amháin, isteach i 71 teanga, le linn do chéim tógála:

```bash
bunx translator-agent -s ./dist -l all
```

Gan ghníomhaireacht. Gan scarbhileoga. Gan glasáil díoltóra. Gan chlárú. Do eochracha féin, do thógáil féin, do theangacha féin.

> **Léann tú an chruthúnas.** Aistríodh an README seo trí `bunx translator-agent -s README.md -l all` a rith. Téigh agus léigh an [leagan Seapánach](./translations/ja/README.md) — ní hamháin gur aistrigh sé "tosaíonn an méadar arís," chuir sé nathanna cainte gnó Seapánacha ina áit. Tá an [leagan Gearmánach](./translations/de/README.md) 30% níos faide mar go bhfuil Gearmáinis i gcónaí. Léitear an [leagan Arabach](./translations/ar/README.md) ó dheas go clé. Fuaimnníonn an [leagan Portaingéilise na Brasaíle](./translations/pt-BR/README.md) cosúil gur scríobh Brasaíleach é, toisc gurb é sin an pointe.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [na 71 go léir...](./translations/)

---

## Cén fáth a n-oibríonn sé seo

Is fadhb réitithe í an t-aistriúchán. Ní hí an logánú.

Is féidir le Google Translate "Tá ár hampstair ag obair air" a thiontú go Seapáinis. Ní féidir leis aithint nach n-oibríonn an greann sa tSeapáin, agus rud éigin eile a chur ina áit a oibríonn — mar thagairt d'fhoireann innealtóireachta ag obair go déanach san oíche, rud atá iomchuí go cultúrtha agus greannmhar sa chomhthéacs.

Ní aistriú a dhéanann an uirlis seo. Déanann sí **tras-chruthú** — an próiseas céanna a ghearrann gníomhaireachtaí fógraíochta $50,000 air nuair a dhéanann siad feachtas a oiriúnú thar mhargaí éagsúla. Ach is eol don LLM gach cultúr cheana féin, gach nathanna cainte, gach gnás formáidithe. Tá a fhios aige:

- Go n-athraítear `$49/month` go `月額6,980円` sa tSeapáin — ní "$49" le siombail yen leagtha air
- Go maraíonn an tarcaisne i mBéarla agus go faigheann sé bás i Seapáinis foirmiúil
- Go n-athraítear "Drowning in paperwork" go "noyade administrative" i bhFraincis — frása Fraincise fíor, ní aistriúchán focal ar fhocal
- Go gcoinníonn na Gearmánaigh an greann faoi na hamstair toisc go bhfuil Hamsterrad (roth hampstair) ina nathanna cainte fíor Gearmánacha
- Go dteastaíonn cláir neamhfhoirmiúil ó na Brasaíligh nó fuaimneoidh sé cosúil gur scríobh róbat é

Déanann an tsamhail aicmiú ar gach teaghrán. Faigheann lipéid UI aistriúchán díreach. Déantar cóip margaíochta a oiriúnú. Déantar greann a athchruthú go hiomlán don chultúr sprice.

---

## Céard a tharlaíonn nuair a ritheann tú é

Díriú é ar d'aschuir tógála. Clónáileann sé crann iomlán na gcomhad in aghaidh na logchaighdeáin — ag aistriú comhaid téacs, ag cóipeáil sócmhainní statach, agus ag giniúint gach rud atá ag teastáil le haghaidh imscaradh:

```
your-site/                          translations/
  index.html                          middleware.ts        ← braith logchaighdeán
  about.html             →            _locales.css         ← clóghrafaíocht in aghaidh script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", tras-chruthaithe
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 airde líne
                                        css/style.css      ← cóipeáilte
                                        js/app.js          ← cóipeáilte
                                        images/logo.png    ← cóipeáilte
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% cló
                                        ...
                                      de/
                                        ...
```

Faigheann gach comhad HTML `lang` agus `dir="rtl"` instealladh. Faigheann gach logchaighdeán CSS leis an stac cló ceart, airde líne, agus treo téacs. Gintear ware láir Vercel a léann `Accept-Language` agus a athscríobhann chuig an logchaighdeán ceart.

Imscaradh go Vercel. Feiceann úsáideoir i dTokyo Seapáinis le Hiragino Sans ag airde líne 1.8. Feiceann úsáideoir i gCairo Araibis RTL le Noto Naskh ag méid 110%. Feiceann úsáideoir i Bangkok Téalannais le `word-break: keep-all` toisc nach bhfuil spásanna ag Téalannais. Gan cumraíocht.

---

## 90 soicind, ní 4 seachtaine

```bash
# Trí theanga, comhad JSON amháin
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Críochnaithe. 3 comhad scríofa in 9.5s

# Do shuíomh iomlán, gach teanga ar domhan
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Críochnaithe. 142 comhad aistrithe, 284 comhad statach cóipeáilte in 94s
```

### I do phíblíne tógála

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Gach imscaradh á sheachadadh i 71 teanga. Is saothair tógála iad na haistriúcháin — taiscthe, ath-ghinte nuair amháin a athraítear foinse.

---

## Tabhair d'eochracha féin nó ná tabhair

```bash
# Tá eochracha agat — ritheann go háitiúil, íocann tú do sholáthraí LLM go díreach
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Níl eochracha agat — oibríonn díreach
# Úsáideann an tseirbhís óstaithe go huathoibríoch
# Íoc in aghaidh an aistriúcháin le USDC via x402 — gan chlárú, gan chuntas
bunx translator-agent -s ./dist -l all
```

An t-ordú céanna. Má tá eochracha API i láthair, ritheann sé go háitiúil le do sholáthraí féin. Mura bhfuil, buaileann sé an API óstaithe agus íocann in aghaidh an iarratais via [x402](https://x402.org) — prótacal íocaíochta HTTP 402. Íocann do chliant USDC ar Base, faigheann aistriúcháin ar ais. Gan fhíordheimhniú, gan ghaol díoltóra, gan bhillí.

Tacaíonn le Anthropic agus OpenAI. Tabhair cibé samhail a theastaíonn uait:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Gach córas scríbhneoireachta, láimhseáilte

Ní aistriú téacs amháin a dhéanann an uirlis — tá a fhios aici conas a dhéanann gach córas scríbhneoireachta rindreáil:

| Script | Céard a athraíonn | Cén fáth |
|---|---|---|
| **Araibis, Eabhrais, Fairsí, Urdais** | `dir="rtl"`, clónna RTL, 110% méid | Teastaíonn cineál níos mó ó Araibis le bheith inléite; déanann an leagan iomlán scáthánú |
| **Seapáinis, Sínis, Coiréis** | staic clónna CJK, 1.8 airde líne | Is cearnóga leithead socair iad na carachtair; teastaíonn spás anála ingearach |
| **Hiondúis, Beangáilis, Taimilis, Teileagúis** | clónna Indiacha, 1.8 airde líne | Teastaíonn spás breise ingearach ó strokeanna cinn (shirorekha) |
| **Téalannais** | `word-break: keep-all` | Gan spásanna idir focail — teastaíonn rialacha briste líne sainráite ón mbrabhsálaí |
| **Burmais** | 2.2 airde líne | Na glifs is airde d'aon script mhór |
| **Ciméiris** | 2.0 airde líne | Déanann braislí consain foscripte stácáil go hingearach |

CSS ginte in aghaidh na logchaighdeáin:

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

## Taiscéadh

Is saothair tógála iad na haistriúcháin. Gin ag am tógála, taisc an t-aschur, scipeáil nuair nach n-athraíonn an fhoinse.

### Vercel

Taiscíonn Vercel aschur tógála go huathoibríoch. Cuir `postbuild` agus tá tú réidh:

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

Foinse gan athrú = buille taisce = glaoite LLM nialas = costas nialas.

---

## Roghanna

```
Úsáid: translator-agent [roghanna]

Roghanna:
  -s, --source <cosán>      eolaire nó comhad foinse le scanadh
  -l, --locales <logchaighdeáin>  logchaighdeáin sprice, scartha le camóga nó "all" le haghaidh 71 teanga
  -o, --output <cosán>      eolaire aschuir (réamhshocrú: "./translations")
  -p, --provider <ainm>     anthropic | openai (réamhshocrú: "anthropic")
  -m, --model <id>         sárú samhla
  -c, --concurrency <n>    uasmhéid glaoite LLM comhthreomhara (réamhshocrú: 10)
  --api-url <url>          URL seirbhíse óstaithe (úsáidte go huath nuair nach bhfuil eochracha API socraithe)
```

| Síneadh | Straitéis |
|---|---|
| `.json` | Aistrigh luachanna, caomhnaigh eochracha |
| `.md` / `.mdx` | Aistrigh téacs, caomhnaigh comhréir |
| `.html` / `.htm` | Aistrigh téacs, caomhnaigh clibeanna, instealladh `lang`/`dir` |
| Gach rud eile | Cóipeáil isteach i ngach eolaire logchaighdeáin |

### Na 71 logchaighdeán go léir

Clúdaíonn `-l all` ~95% d'úsáideoirí idirlín: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Ceadúnas

MIT