# translator-agent

10 000 $ lokalizavimo problema išspręsta per 90 sekundžių.

Įmonės moka agentūroms 0,10–0,25 $ už žodį savo svetainių lokalizavimui. 5000 žodžių svetainės vertimas į 10 kalbų kainuoja 5000–12 000 $ ir trunka 2–4 savaites. Kiekvieną kartą pakeitus antraštę, skaitiklis prasideda iš naujo.

Šis įrankis tai padaro viena komanda, į 71 kalbą, jūsų kūrimo proceso metu:

```bash
bunx translator-agent -s ./dist -l all
```

Nei agentūros. Nei skaičiuoklių. Nei priklausomybės nuo tiekėjo. Nei registracijos. Jūsų raktai, jūsų kūrimas, jūsų kalbos.

> **Jūs skaitote įrodymą.** Šis README buvo išverstas paleidus `bunx translator-agent -s README.md -l all`. Paskaitykite [japonų versiją](./translations/ja/README.md) — ji ne tik išvertė „skaitiklis prasideda iš naujo", bet pakeitė tai japonų verslo idioma. [Vokiečių versija](./translations/de/README.md) yra 30% ilgesnė, nes vokiečių kalba visada tokia. [Arabų versija](./translations/ar/README.md) skaitoma iš dešinės į kairę. [Brazilų portugalų versija](./translations/pt-BR/README.md) skamba tarsi ją parašė brazilas, nes tai ir yra esmė.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [visos 71...](./translations/)

---

## Kodėl tai veikia

Vertimas yra išspręsta problema. Lokalizavimas — ne.

Google Translate gali paversti „Mūsų žiurkėnai dirba ties tuo" į japonų kalbą. Ko jis negali padaryti, tai atpažinti, kad šis pokštas neveiks Japonijoje, ir pakeisti jį kažkuo, kas veiks — pavyzdžiui, paminėti inžinierių komandą, kuri darbuojasi visą naktį, kas yra ir kultūriškai tinkama, ir juokinga kontekste.

Šis įrankis neišverčia. Jis **perkuria** — tą patį procesą, už kurį reklamos agentūros ima 50 000 $, pritaikydamos kampaniją skirtingose rinkose. Tik LLM jau žino kiekvieną kultūrą, kiekvieną idiomą, kiekvieną formatavimo konvenciją. Jis žino, kad:

- `49 $/mėn.` Japonijoje tampa `月額6,980円` — ne „49 $" su užkabintu jenos simboliu
- Sarkazmas puikiai veikia anglų kalba ir miršta formalaus japonų kalboje
- „Skęsti dokumentuose" prancūzų kalba tampa „noyade administrative" — tikra prancūzų išraiška, o ne pažodinis vertimas
- Vokiečiai palieka žiurkėno pokštą, nes Hamsterrad (žiurkėno ratas) yra tikra vokiečių idioma
- Braziliams reikia neoficialaus registro, kitaip skambi tarsi robotas tai parašė

Modelis klasifikuoja kiekvieną eilutę. UI etiketės gaunami tiesioginį vertimą. Reklaminiai tekstai adaptuojami. Humoras visiškai perkuriamas tikslinei kultūrai.

---

## Kas vyksta paleidus

Nukreipkite jį į savo kūrimo išvestį. Jis klonuoja visą failų medį kiekvienai lokalei — išverčia teksto failus, kopijuoja statinius išteklius ir generuoja viską, kas reikalinga diegimui:

```
jūsų-svetainė/                      translations/
  index.html                          middleware.ts        ← lokalės aptikimas
  about.html             →            _locales.css         ← tipografija kiekvienam rašmenų sistemai
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", perkurta
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 eilutės aukštis
                                        css/style.css      ← nukopijuota
                                        js/app.js          ← nukopijuota
                                        images/logo.png    ← nukopijuota
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% šriftas
                                        ...
                                      de/
                                        ...
```

Kiekvienoje HTML failuose įterpiami `lang` ir `dir="rtl"`. Kiekviena lokalė gauna CSS su teisingu šriftų rinkiniu, eilutės aukščiu ir teksto kryptimi. Generuojama Vercel tarpinė programinė įranga, kuri skaito `Accept-Language` ir nukreipia į tinkamą lokalę.

Diekite į Vercel. Tokijo naudotojas mato japonų kalba su Hiragino Sans 1.8 eilutės aukščiu. Kairo naudotojas mato RTL arabų kalba su Noto Naskh 110% dydžiu. Bankoko naudotojas mato tajų kalba su `word-break: keep-all`, nes tajų kalboje nėra tarpų. Jokio konfigūravimo.

---

## 90 sekundžių, o ne 4 savaitės

```bash
# Trys kalbos, vienas JSON failas
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Atlikta. 3 failai parašyti per 9,5s

# Visa jūsų svetainė, visos žemės kalbos
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Atlikta. 142 failai išversti, 284 statiniai failai nukopijuoti per 94s
```

### Jūsų kūrimo grandinėje

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Kiekvienas diegimas išleidžiamas 71 kalba. Vertimai yra kūrimo artefaktai — kešuojami, pergenruojami tik keičiantis šaltiniui.

---

## Naudokite savo raktus arba ne

```bash
# Turite raktus — veikia vietoje, mokate savo LLM tiekėjui tiesiogiai
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Neturite raktų — tiesiog veikia
# Automatiškai naudoja nuomojamą paslaugą
# Mokėkite už vertimą USDC per x402 — be registracijos, be paskyros
bunx translator-agent -s ./dist -l all
```

Ta pati komanda. Jei API raktai yra, veiks vietoje su jūsų tiekėju. Jei ne, kreipiasi į nuomojamą API ir moka už užklausą per [x402](https://x402.org) — HTTP 402 mokėjimo protokolą. Jūsų klientas moka USDC Base tinkle, gauna vertimus atgal. Jokios autentifikacijos, jokių tiekėjų santykių, jokių sąskaitų faktūrų.

Palaiko Anthropic ir OpenAI. Naudokite bet kurį modelį:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Kiekviena rašmenų sistema tvarkoma

Įrankis ne tik išverčia tekstą — jis žino, kaip kiekviena rašymo sistema atrodo:

| Rašmenys | Kas keičiasi | Kodėl |
|---|---|---|
| **Arabų, hebrajų, persų, urdu** | `dir="rtl"`, RTL šriftai, 110% dydis | Arabų kalbai reikia didesnio tipo, kad būtų įskaitomas; visas išdėstymas atsispindi |
| **Japonų, kinų, korėjiečių** | CJK šriftų rinkiniai, 1.8 eilutės aukštis | Simboliai yra fiksuoto pločio kvadratai; reikia vertikalaus kvėpavimo tarpo |
| **Hindi, bengalų, tamilų, telugu** | Indijos šriftai, 1.8 eilutės aukštis | Galvos brūkšniams (shirorekha) reikia papildomo vertikalaus tarpo |
| **Tajų** | `word-break: keep-all` | Nėra tarpų tarp žodžių — naršyklei reikalingos aiškios eilutės lūžio taisyklės |
| **Birmiečių** | 2.2 eilutės aukštis | Aukščiausi bet kurios pagrindinės rašmenų sistemos ženklai |
| **Khmerų** | 2.0 eilutės aukštis | Indeksų priebalsių sankaupos rikiuojasi vertikaliai |

Generuojamas CSS kiekvienai lokalei:

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

## Kešavimas

Vertimai yra kūrimo artefaktai. Generuokite kūrimo metu, kešuokite išvestį, praleiskite, kai šaltinis nepasikeitė.

### Vercel

Vercel automatiškai kešuoja kūrimo išvestį. Pridėkite `postbuild` ir viskas:

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

Šaltinis nepasikeitė = kešo pataikymas = nulis LLM iškvietimų = nulis išlaidų.

---

## Parinktys

```
Naudojimas: translator-agent [parinktys]

Parinktys:
  -s, --source <kelias>      šaltinio katalogas ar failas skenavimui
  -l, --locales <lokalės>    tikslinės lokalės, atskirtos kableliais arba "all" 71 kalbai
  -o, --output <kelias>      išvesties katalogas (numatytasis: "./translations")
  -p, --provider <pavadinimas> anthropic | openai (numatytasis: "anthropic")
  -m, --model <id>           modelio perrašymas
  -c, --concurrency <n>      maksimalūs lygiagretus LLM iškvietimai (numatytasis: 10)
  --api-url <url>            nuomojamos paslaugos URL (automatiškai naudojamas, kai nenustatyti API raktai)
```

| Plėtinys | Strategija |
|---|---|
| `.json` | Išversti reikšmes, išsaugoti raktus |
| `.md` / `.mdx` | Išversti tekstą, išsaugoti sintaksę |
| `.html` / `.htm` | Išversti tekstą, išsaugoti žymas, įterpti `lang`/`dir` |
| Visa kita | Kopijuoti į kiekvieno lokalės katalogą |

### Visos 71 lokalės

`-l all` aprėpia ~95% interneto naudotojų: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licencija

MIT