# translator-agent

10 000$ lokaliseerimise probleem lahendatud 90 sekundiga.

Ettevõtted maksavad asutustele 0,10–0,25$ sõna eest oma saitide lokaliseerimise eest. 5000-sõnaline sait 10 keelde maksab 5000–12 000$ ja võtab aega 2–4 nädalat. Iga kord, kui te pealkirja muudate, hakkab arvestus otsast peale.

See tööriist teeb selle ühe käsuga 71 keelde, teie ehitusprotsessi ajal:

```bash
bunx translator-agent -s ./dist -l all
```

Pole vaja asutust. Pole vaja tabeleid. Pole hankija-sõltuvust. Pole registreerumist. Teie võtmed, teie ehitus, teie keeled.

> **Te loete tõendit.** See README tõlgiti käivitades `bunx translator-agent -s README.md -l all`. Minge lugege [jaapanikeelset versiooni](./translations/ja/README.md) — see ei tõlkinud lihtsalt väljendit "arvestus hakkab otsast peale", vaid asendas selle jaapani äriidioomiga. [Saksa versioon](./translations/de/README.md) on 30% pikem, sest saksa keel on alati selline. [Araabiakeelne versioon](./translations/ar/README.md) loetakse paremalt vasakule. [Brasiilia portugali versioon](./translations/pt-BR/README.md) kõlab nagu brasiillane oleks selle kirjutanud, sest see on ju mõte.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [kõik 71...](./translations/)

---

## Miks see toimib

Tõlkimine on lahendatud probleem. Lokaliseerimine mitte.

Google Translate oskab muuta "Meie hamstrid töötavad selle kallal" jaapani keelde. Aga see ei oska ära tunda, et nali ei toimi Jaapanis, ja asendada selle millegi sobivaga — näiteks viidata inseneride meeskonnale, kes teeb läbipõlemist, mis on kultuuriliselt sobiv ja kontekstis naljakas.

See tööriist ei tõlgi. Ta **transkreeerib** — sama protsess, mille eest reklaamiagentuurid võtavad 50 000$, kui kohandavad kampaaniat erinevatele turgudele. Ainult et LLM teab juba kõiki kultuure, kõiki idioome, kõiki vormistustavasid. Ta teab, et:

- `$49/month` muutub Jaapanis `月額6,980円`-ks — mitte "$49" jeeni sümboliga
- Sarkasm töötab inglise keeles ja sureb tõsises jaapani keeles
- "Dokumendituules uppumine" muutub prantsu keeles "noyade administrative"'ks — see on päris prantsuse väljend, mitte sõna-sõnalt tõlge
- Sakslased jätavad hamstri nali alles, sest Hamsterrad (hamstrite ratas) on päris saksa idioom
- Brasiillased vajavad mitteametlikku registrit, muidu kõlab nagu robot oleks selle kirjutanud

Mudel liigitab iga stringi. UI sildid saavad otsese tõlke. Turundussisu kohandatakse. Huumor luuakse sihtkultuuri jaoks täiesti uuesti.

---

## Mis juhtub, kui seda käivitate

Suunake see oma ehitustulemile. Ta kloonib kogu failipuu iga lokaadi kohta — tõlgib tekstifailid, kopeerib staatilised failid ja genereerib kõik juurutamiseks vajalik:

```
your-site/                          translations/
  index.html                          middleware.ts        ← lokaadi tuvastamine
  about.html             →            _locales.css         ← tüpograafia kirjasüsteemi kohta
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transkreeeritud
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 reakõrgus
                                        css/style.css      ← kopeeritud
                                        js/app.js          ← kopeeritud
                                        images/logo.png    ← kopeeritud
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Igasse HTML faili süstitakse `lang` ja `dir="rtl"`. Iga lokaat saab CSS-i õige fontikomplektiga, reakõrguse ja tekstisuunaga. Genereeritakse Vercel middleware, mis loeb `Accept-Language` ja suunab ümber õigele lokaadile.

Juurutage Vercelis. Tokyo kasutaja näeb jaapanikeelset teksti Hiragino Sans fondiga 1.8 reakõrgusega. Kairo kasutaja näeb paremalt vasakule araabia keelt Noto Naskh fondiga 110% suurusega. Bangkoki kasutaja näeb tai keelt `word-break: keep-all`-iga, sest tai keeles pole tühikuid. Ilma konfiguratsioonita.

---

## 90 sekundit, mitte 4 nädalat

```bash
# Kolm keelt, üks JSON-fail
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Valmis. 3 faili kirjutatud 9,5s jooksul

# Kogu teie sait, kõik Maa keeled
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Valmis. 142 faili tõlgitud, 284 staatilist faili kopeeritud 94s jooksul
```

### Teie ehituskonveieris

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Iga juurutus toimub 71 keeles. Tõlked on ehituse artefaktid — puhverdatud, uuesti genereeritud ainult siis, kui lähtekood muutub.

---

## Tuge oma võtmed või ära tee seda

```bash
# Teil on võtmed — töötab lokaalselt, te maksate LLM pakkujale otse
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Teil pole võtmeid — lihtsalt toimib
# Kasutab automaatselt hostitud teenust
# Makske tõlke eest USDC-ga x402 kaudu — pole registreerumist, pole kontot
bunx translator-agent -s ./dist -l all
```

Sama käsk. Kui API võtmed on olemas, töötab lokaalselt teie pakkujaga. Kui mitte, pöördub hostitud API poole ja maksab päringu eest [x402](https://x402.org) kaudu — HTTP 402 makse protokoll. Teie klient maksab USDC-ga Base'is, saab tõlked tagasi. Pole autentimist, pole hankija suhet, pole arveid.

Toetab Anthropic ja OpenAI. Tuge mis tahes mudel, mida soovite:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Iga kirjasüsteem käsitletud

Tööriist ei tõlgi lihtsalt teksti — see teab, kuidas iga kirjasüsteem renderdub:

| Kirjasüsteem | Mis muutub | Miks |
|---|---|---|
| **Araabia, heebrea, pärsia, urdu** | `dir="rtl"`, RTL fondid, 110% suurus | Araabia vajab loetavuse jaoks suuremat kirja; kogu paigutus peegelduv |
| **Jaapani, hiina, korea** | CJK fondikomplektid, 1.8 reakõrgus | Märgid on fikseeritud laiusega ruudud; vajavad vertikaalset hingamisruumi |
| **Hindi, bengali, tamil, telugu** | India fondid, 1.8 reakõrgus | Pealkriipsud (shirorekha) vajavad lisavertikaalset ruumi |
| **Tai** | `word-break: keep-all` | Sõnade vahel pole tühikuid — brauser vajab selgesõnalisi reavahetus reegleid |
| **Birma** | 2.2 reakõrgus | Kõige kõrgemad glüüfid suuremas kirjasüsteemis |
| **Khmeeri** | 2.0 reakõrgus | Alakaashääliku klastrid kuhjuvad vertikaalselt |

Genereeritud lokaadi kohta CSS:

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

## Puhverdamine

Tõlked on ehituse artefaktid. Genereeri ehitusajal, puhverda väljund, jäta vahele, kui lähtekood ei ole muutunud.

### Vercel

Vercel puhverdab ehitusväljundi automaatselt. Lisage `postbuild` ja olete valmis:

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

Lähtekood muutmata = puhvri tabamus = null LLM kõnet = null kulu.

---

## Valikud

```
Kasutamine: translator-agent [valikud]

Valikud:
  -s, --source <tee>       lähtekaust või fail skaneerimiseks
  -l, --locales <lokaadid> siht-lokaadid, komaga eraldatud või "all" 71 keele jaoks
  -o, --output <tee>       väljundkaust (vaikimisi: "./translations")
  -p, --provider <nimi>    anthropic | openai (vaikimisi: "anthropic")
  -m, --model <id>         mudeli alistamine
  -c, --concurrency <n>    maksimaalne paralleelsete LLM kõnede arv (vaikimisi: 10)
  --api-url <url>          hostitud teenuse URL (automaatselt kasutatav, kui API võtmed puuduvad)
```

| Laiend | Strateegia |
|---|---|
| `.json` | Tõlgi väärtused, säilita võtmed |
| `.md` / `.mdx` | Tõlgi tekst, säilita süntaks |
| `.html` / `.htm` | Tõlgi tekst, säilita sildid, süsti `lang`/`dir` |
| Kõik muu | Kopeeri iga lokaadi kausta |

### Kõik 71 lokaati

`-l all` katab ~95% interneti kasutajatest: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Litsents

MIT