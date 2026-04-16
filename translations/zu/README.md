# translator-agent

Inkinga yokuguqulela kwamakhono ezinkulungwaneni ezingama-$10,000, ixazululiwe emasekhondini angama-90.

Izinkampani zikhokha ama-ejenseli ama-$0.10–0.25 ngegama ngalinye ukuze baguqulele amasayithi azo ezilimini zakuleli. Isayithi esinegama elinkulungwane ezi-5,000 liye ezilimini ezi-10 libiza u-$5,000–12,000 futhi luthatha amaviki angu-2–4. Njalo uma ushintsha isihloko, ukhathi uyaphinda uqala kabusha.

Leli tholakala likwenza ngomyalo owodwa, liye ezilimini ezingama-71, phakathi nokuphakamiswa kwakho:

```bash
bunx translator-agent -s ./dist -l all
```

Akunayo i-ejenseli. Azikho izipredishithi. Akukho ukubotshelwa kumthengisi. Asikho ukubhaliswa. Okhiye bakho, ukwakhiwa kwakho, izilimi zakho.

> **Ufunda ubufakazi.** Le README iguqulelwe ngokuqhuba `bunx translator-agent -s README.md -l all`. Hamba uyofunda [inguqulo yesiJapane](./translations/ja/README.md) — ayizange iguqulele nje "imetha iyaphinda," iyishintshe ngesisho sebhizinisi laseJapane. [Inguqulo yesiJalimane](./translations/de/README.md) inde ngamaphesenti angama-30 ngoba isiJalimane sihlale sinejwayelo. [Inguqulo yesi-Arabhu](./translations/ar/README.md) ifundwa ukusuka kwesokudla kuya kwesokunxele. [Inguqulo yesiPutukezi saseBrazil](./translations/pt-BR/README.md) izwakala sengathi umBrazilian oyibhalile, ngoba yilolo iphuzu.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [zonke ezingama-71...](./translations/)

---

## Kungani lokhu kusebenza

Ukuguqulela kuyinkinga esixazululiwe. Ukujwayela emasikweni akulona.

I-Google Translate ingaguqulela "Ama-hamster ethu asebenza ngalokho" ibe isiJapane. Lokho engakwazi ukukwenza ukubona ukuthi utshani aluzwakali eJapane, bese lufaka okunye okuzwakala — njengokubhekisa ithimba labenjiniyela elisebenza ubusuku bonke, okufanele kwamasiko futhi kuhlekisayo ngendlela okusetshenziswa ngayo.

Leli tholakala aliguquleli. Li**yakha kabusha** — inqubo efanayo ama-ejenseli emiklamo ayikhokhela u-$50,000 ngayo uma ejwayeza umkhankaso emalokishini. Ngaphandle kokuthi i-LLM seyazi wonke amasiko, zonke izisho, konke ukufomatha okujwayelekile. Iyazi ukuthi:

- `$49/month` kuba yi-`月額6,980円` eJapane — hhayi "$49" nophawu lwe-yen olunamathiselwe
- Ukukloloda kudubula esiNgisini kodwa kufe esiJapanesini esesimweni
- "Drowning in paperwork" kuba yi-"noyade administrative" esiFrenchini — isisho sangempela sesiFrench, hhayi ukuguqulela igama ngegama
- AmaJalimane agcina utshani lwe-hamster ngoba i-Hamsterrad (isongo se-hamster) isisho sangempela sesiJalimane
- AmaBrazilian adinga indlela ejwayelekile noma kuzwakale sengathi irobhothi eyibhalile

Imodeli ihlukanisa intambo ngayinye. Amalebuli e-UI athola ukuguqulelwa okuqondile. Imithombo yokumaketha ilungiselelwa. Ubuhlakani bwakhiwa kabusha ngokuphelele ngamasiko aqondiwe.

---

## Okwenzeka uma ukuqhuba

Ikubhekisele ekuphumeni kwakho. Ikopisha umthi wenkomba yonke ngokwendawo ngayinye — iguqulela amafayela wombhalo, ikopisha izimpahla ezimile, futhi ikhiqize konke okudingekayo ukuthunyelwa:

```
your-site/                          translations/
  index.html                          middleware.ts        ← ukubona indawo
  about.html             →            _locales.css         ← ukubhala ngeskripthi ngasinye
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", yakhelwe kabusha
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, ubude 1.8 bomugqa
                                        css/style.css      ← ikopishwe
                                        js/app.js          ← ikopishwe
                                        images/logo.png    ← ikopishwe
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, ifonti 110%
                                        ...
                                      de/
                                        ...
```

Yonke ifayela le-HTML ithola `lang` ne-`dir="rtl"` efakiwe. Yonke indawo ithola i-CSS enesitaki se-fonti efanele, ubude bomugqa, nendlela yokubhala. Kakhiqizwa i-middleware ye-Vercel efunda `Accept-Language` futhi ibhale kabusha yaye endaweni efanele.

Thunyelwa ku-Vercel. Umsebenzisi eTokyo ubona isiJapane ne-Hiragino Sans ebundeni bomugqa obu-1.8. Umsebenzisi eCairo ubona isi-RTL Arabic ne-Noto Naskh ebudeni obu-110%. Umsebenzisi eBangkok ubona isiThai esi-`word-break: keep-all` ngoba isiThai asinazikhala. Awukho ukulungiselela.

---

## Amasekhondi angama-90, hhayi amaviki ama-4

```bash
# Izilimi ezintathu, ifayela elilodwa le-JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Kuphelile. Amafayela ama-3 abhalwe ngamasekhondi angu-9.5

# Lonke isayithi lakho, zonke izilimi emhlabeni
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Kuphelile. Amafayela angu-142 aguqulelwe, amafayela azimele angu-284 akopishwe ngamasekhondi angama-94
```

### Emgqeni wakho wokwakhiwa

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Ukuthunyelwa ngakunye kuhamba ngezilimi ezingama-71. Ukuguqulela kuyizinto zokwakhiwa — zifakwe kwakhona, zikhiqizwe kabusha kuphela lapho umthombo eshintsha.

---

## Letha okhiye bakho noma ungalethi

```bash
# Unokhiye — uqhuba endaweni, ukhokhela umhlinzeki wakho we-LLM ngqo
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Awunawo okhiye — kuyasebenza nje
# Kusebenzisa ngokuzenzakalelayo isevisi esungulwe
# Khokha ngokuguqulela nge-USDC nga-x402 — asikho ukubhaliswa, akunayo iakhawunti
bunx translator-agent -s ./dist -l all
```

Umyalo ofanayo. Uma okhiye be-API bekhona, uqhuba endaweni nomhlinzeki wakho. Uma kungekho, ushaya i-API esungulwe futhi akhokhele ngesicelo nga-[x402](https://x402.org) — umthetho wokuhweba we-HTTP 402. Iklayenti lakho likhokha i-USDC ku-Base, lithola ukuguqulela emuva. Asikho isigunyazo, asikho ubuhlobo nomthengisi, azikho ama-invoyisi.

Isekela i-Anthropic ne-OpenAI. Letha noma iyiphi imodeli oyifunayo:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Yonke inqubo yohlelo, iphathelwe

Itholakala aliguquleli umbhalo nje — liyazi ukuthi yilelipi uhlelo lokubhala lunikezwa:

| Iskripthi | Okushintshayo | Kungani |
|---|---|---|
| **Isi-Arabhu, IsiHebheru, IsiFarsi, Isi-Urdu** | `dir="rtl"`, amafonti e-RTL, usayizi we-110% | Isi-Arabhu sidinga uhlobo olukhulu ukuze lubonakale; lonke uchazelo luvumelaniswe |
| **IsiJapane, IsiShayina, IsiKorea** | Izigxeko zamafonti e-CJK, ubude bomugqa 1.8 | Izinhlamvu zinobubanzi obulungisiwe bezikwele; zidinga isikhala sokuphefumula ngokoqanda |
| **IsiHindi, IsiBengali, IsiTamil, IsiTelugu** | Amafonti e-Indic, ubude bomugqa 1.8 | Ama-headstrokes (shirorekha) adinga isikhala sengeziwe ngokoqanda |
| **IsiThai** | `word-break: keep-all` | Azikho izikhala phakathi kwamagama — isiphequluli sidinga imithetho ecacile yokuhlukanisa umugqa |
| **IsiBurmese** | Ubude bomugqa 2.2 | Ama-glyphs aphakeme kakhulu kunawo wonke amaskripthi amakhulu |
| **IsiKhmer** | Ubude bomugqa 2.0 | Amaqoqo ama-consonant angezansi ama-stacks ngokoqanda |

I-CSS ekhiqizwe ngendawo ngayinye:

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

## Ukufaka isitoreji

Ukuguqulela kuyizinto zokwakhiwa. Khiqiza ngesikhathi sokwakhiwa, faka isitoreji esiphumayo, yeqa lapho umthombo ungashintshanga.

### I-Vercel

I-Vercel ifaka isitoreji esiphumayo sokwakhiwa ngokuzenzakalelayo. Engeza `postbuild` futhi uphelile:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

### I-CI

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

Umthombo oshintshile = ukushaya kwesitoreji = amacingo e-LLM azero = izindleko zizero.

---

## Izinketho

```
Ukusetshenziswa: translator-agent [options]

Izinketho:
  -s, --source <path>      umkhombandlela womthombo noma ifayela lokuhlola
  -l, --locales <locales>  izindawo eziqondiwe, zihlukaniswe ngokhefana noma "all" yezilimi ezingama-71
  -o, --output <path>      umkhombandlela wokuphumayo (okuzenzakalela: "./translations")
  -p, --provider <name>    anthropic | openai (okuzenzakalela: "anthropic")
  -m, --model <id>         ukweqa imodeli
  -c, --concurrency <n>    amacingo e-LLM agcono kakhulu (okuzenzakalela: 10)
  --api-url <url>          i-URL yesevisi esungulwe (isetshenziselwa ngokuzenzakalela lapho kungenazo okhiye be-API)
```

| Isinengiso | Isu |
|---|---|
| `.json` | Guqulela amanani, gcina okhiye |
| `.md` / `.mdx` | Guqulela umbhalo, gcina isistimu |
| `.html` / `.htm` | Guqulela umbhalo, gcina ama-tag, faka `lang`/`dir` |
| Konke okunye | Kopisha emkhombandleleni wendawo ngayinye |

### Zonke izindawo ezingama-71

`-l all` ihlanganisa ~95% yabasebenzisi be-inthanethi: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Ilayisense

MIT