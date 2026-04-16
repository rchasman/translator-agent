# translator-agent

10 000 dollarin lokalisointiongelma, ratkaistu 90 sekunnissa.

Yritykset maksavat toimistoille 0,10–0,25 dollaria sanalta sivustojen lokalisoimisesta. 5000 sanan sivusto 10 kielelle maksaa 5000–12 000 dollaria ja kestää 2–4 viikkoa. Joka kerta kun muutat otsikkoa, kello alkaa tikittää uudestaan.

Tämä työkalu tekee sen yhdellä komennolla, 71 kielelle, rakennusvaiheen aikana:

```bash
bunx translator-agent -s ./dist -l all
```

Ei toimistoa. Ei taulukkolaskentaa. Ei vendor lock-inia. Ei rekisteröitymistä. Omat avaimet, oma rakennus, omat kielet.

> **Luet parhaillaan todisteita.** Tämä README käännettiin ajamalla `bunx translator-agent -s README.md -l all`. Lue [japanilainen versio](./translations/ja/README.md) — se ei vain kääntänyt "kello alkaa tikittää uudestaan", vaan korvasi sen japanilaisella liike-idiomilla. [Saksalainen versio](./translations/de/README.md) on 30 % pidempi, koska saksa on aina. [Arabialainen versio](./translations/ar/README.md) luetaan oikealta vasemmalle. [Brasilialainen portugalilainen versio](./translations/pt-BR/README.md) kuulostaa siltä, että brasilialainen kirjoitti sen, koska siinä se pointti onkin.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [kaikki 71...](./translations/)

---

## Miksi tämä toimii

Kääntäminen on ratkaistu ongelma. Lokalisointi ei.

Google Translate osaa muuttaa "Hamsterimme työstävät asiaa" japaniksi. Se ei osaa tunnistaa, että vitsi ei toimi Japanissa, ja korvata sitä jollain mikä toimii — kuten viittaus insinööritiimiin, joka vetää yötyötä, mikä on sekä kulttuurisesti sopiva että hauska kontekstissa.

Tämä työkalu ei käännä. Se **transkreoi** — sama prosessi, josta mainostoimistot veloittavat 50 000 dollaria sovittaessaan kampanjaa eri markkinoille. Paitsi että LLM tuntee jo jokaisen kulttuurin, jokaisen idioomin, jokaisen muotoilukäytännön. Se tietää, että:

- `$49/month` tulee `月額6,980円`:ksi Japanissa — ei "$49" jen-symboli liimattu päälle
- Sarkasmi tappaa englanniksi ja kuolee muodollisessa japanissa
- "Hukkua paperitöihin" tulee "noyade administrative" ranskaksi — oikea ranskalainen ilmaus, ei sana-sanalta käännös
- Saksalaiset pitävät hamsterivitsin koska Hamsterrad (hamsteripyörä) on oikea saksalainen idioomi
- Brasilialaiset tarvitsevat epämuodollisen rekisterin tai se kuulostaa siltä, että robotti kirjoitti sen

Malli luokittelee jokaisen merkkijonon. UI-labelit saavat suoran käännöksen. Markkinointisisältö mukautetaan. Huumori luodaan täysin uudestaan kohdekulttuurille.

---

## Mitä tapahtuu kun ajat sen

Osoita se rakennetun tuotoksesi. Se kloonaa koko tiedostopuun locale-kohtaisesti — kääntäen tekstitiedostot, kopioden staattiset resurssit ja luoden kaiken tarvittavan julkaisuun:

```
your-site/                          translations/
  index.html                          middleware.ts        ← localen tunnistus
  about.html             →            _locales.css         ← typografia kirjoitusjärjestelmittäin
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transkreoitu
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 rivikorkeus
                                        css/style.css      ← kopioitu
                                        js/app.js          ← kopioitu
                                        images/logo.png    ← kopioitu
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% fontti
                                        ...
                                      de/
                                        ...
```

Jokainen HTML-tiedosto saa `lang`- ja `dir="rtl"`-injektiot. Jokainen locale saa CSS:n oikealla fonttiperheellä, rivikorkeudella ja tekstisuunnalla. Vercel-middleware generoidaan, joka lukee `Accept-Language`-headerin ja uudelleenohjaa oikeaan localeen.

Julkaise Verceliin. Tokiolainen käyttäjä näkee japania Hiragino Sans -fontilla 1.8 rivikorkeudella. Kairolainen käyttäjä näkee RTL-arabia Noto Naskh -fontilla 110 % koossa. Bangkokilainen käyttäjä näkee thaia `word-break: keep-all` -säännöllä koska thaissa ei ole välilyöntejä. Ei konfiguraatiota.

---

## 90 sekuntia, ei 4 viikkoa

```bash
# Kolme kieltä, yksi JSON-tiedosto
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Valmis. 3 tiedostoa kirjoitettu 9,5 sekunnissa

# Koko sivustosi, jokainen kieli maan päällä
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Valmis. 142 tiedostoa käännetty, 284 staattista tiedostoa kopioitu 94 sekunnissa
```

### Rakennusputkessasi

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Jokainen julkaisu toimitetaan 71 kielellä. Käännökset ovat rakennusartefakteja — välimuistissa, regeneroidaan vain kun lähde muuttuu.

---

## Tuo omat avaimet tai älä

```bash
# Sinulla on avaimet — ajaa paikallisesti, maksat LLM-palveluntarjoajallesi suoraan
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Sinulla ei ole avaimia — vain toimii
# Käyttää automaattisesti hosted-palvelua
# Maksa käännöstä kohden USDC:llä x402:n kautta — ei rekisteröitymistä, ei tiliä
bunx translator-agent -s ./dist -l all
```

Sama komento. Jos API-avaimet ovat läsnä, se ajaa paikallisesti palveluntarjoajasi kanssa. Jos ei, se käyttää hosted-APIa ja maksaa pyyntöä kohden [x402](https://x402.org):n kautta — HTTP 402 -maksuprotokolla. Asiakkaasi maksaa USDC:tä Basessa, saa käännöksiä takaisin. Ei auth:ia, ei vendor-suhdetta, ei laskuja.

Tukee Anthropicia ja OpenAI:ta. Tuo minkä mallin haluat:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Jokainen kirjoitusjärjestelmä, käsitelty

Työkalu ei vain käännä tekstiä — se tietää miten kukin kirjoitusjärjestelmä renderöityy:

| Kirjoitusjärjestelmä | Mikä muuttuu | Miksi |
|---|---|---|
| **Arabia, heprea, farsi, urdu** | `dir="rtl"`, RTL-fontit, 110 % koko | Arabia tarvitsee isompaa tekstiä ollakseen luettava; koko layout peilautuu |
| **Japani, kiina, korea** | CJK-fonttiperheet, 1.8 rivikorkeus | Merkit ovat kiinteänlevyisiä neliöitä; tarvitsevat pystyhengitystilaa |
| **Hindi, bengali, tamil, telugu** | Indic-fontit, 1.8 rivikorkeus | Päätahdit (shirorekha) tarvitsevat ylimääräistä pystytilaa |
| **Thai** | `word-break: keep-all` | Ei välilyöntejä sanojen välissä — selain tarvitsee eksplisiittisiä rivinjako-sääntöjä |
| **Burma** | 2.2 rivikorkeus | Korkeimmat glyffit mistään merkittävästä kirjoitusjärjestelmästä |
| **Khmer** | 2.0 rivikorkeus | Alaindeksikonsonanttiryppäät pinoutuvat pystysuunnassa |

Generoitu locale-kohtainen CSS:

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

## Välimuistitus

Käännökset ovat rakennusartefakteja. Generoi rakennusaikana, välimuistita tuotos, ohita kun lähde ei ole muuttunut.

### Vercel

Vercel välimuistittaa rakennustuotoksen automaattisesti. Lisää `postbuild` ja olet valmis:

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

Lähde muuttumaton = cache hit = nolla LLM-kutsua = nolla kustannusta.

---

## Vaihtoehdot

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      lähdehakemisto tai -tiedosto skannattavaksi
  -l, --locales <locales>  kohdelocalet, pilkulla eroteltuna tai "all" 71 kielelle
  -o, --output <path>      tuotoshakemisto (oletus: "./translations")
  -p, --provider <name>    anthropic | openai (oletus: "anthropic")
  -m, --model <id>         mallin ylikirjoitus
  -c, --concurrency <n>    maksimi rinnakkaisia LLM-kutsuja (oletus: 10)
  --api-url <url>          hosted service URL (käytetään automaattisesti kun API-avaimia ei ole asetettu)
```

| Pääte | Strategia |
|---|---|
| `.json` | Käännä arvot, säilytä avaimet |
| `.md` / `.mdx` | Käännä teksti, säilytä syntaksi |
| `.html` / `.htm` | Käännä teksti, säilytä tagit, injektoi `lang`/`dir` |
| Kaikki muu | Kopioi jokaiseen locale-hakemistoon |

### Kaikki 71 localea

`-l all` kattaa ~95 % internetin käyttäjistä: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Lisenssi

MIT