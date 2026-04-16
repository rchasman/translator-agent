# translator-agent

Problem od 10.000$ za lokalizaciju, rešen za 90 sekundi.

Kompanije plaćaju agencijama 0,10–0,25$ po reči za lokalizaciju svojih sajtova. Sajt od 5.000 reči na 10 jezika košta 5.000–12.000$ i traje 2–4 nedelje. Svaki put kada promenite naslov, brojač počinje ispočetka.

Ovaj alat to radi jednom komandom, na 71 jezik, tokom vašeg build procesa:

```bash
bunx translator-agent -s ./dist -l all
```

Bez agencije. Bez tabela. Bez vezivanja za dobavljače. Bez registracije. Vaši ključevi, vaš build, vaši jezici.

> **Čitate dokaz.** Ovaj README je preveden pokretanjem `bunx translator-agent -s README.md -l all`. Pročitajte [japansku verziju](./translations/ja/README.md) — nije samo prevela "the meter restarts", već je zamenila japanskim poslovnim idiomom. [Nemačka verzija](./translations/de/README.md) je 30% duža jer nemački uvek jeste. [Arapska verzija](./translations/ar/README.md) se čita zdesna nalevo. [Brazilska portugalska verzija](./translations/pt-BR/README.md) zvuči kao da ju je napisao Brazilac, jer to je poenta.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [svih 71...](./translations/)

---

## Zašto ovo funkcioniše

Prevođenje je rešen problem. Lokalizacija nije.

Google Translate može da pretvori "Our hamsters are working on it" u japanski. Ono što ne može je da prepozna da šala ne pali u Japanu, i da je zameni nečim što pali — kao što je referenciranje na inženjerski tim koji povlači celu noć, što je i kulturno prikladno i smešno u kontekstu.

Ovaj alat ne prevodi. On **transkreira** — isti proces za koji reklamne agencije naplaćuju 50.000$ kada prilagođavaju kampanje različitim tržištima. Osim što LLM već zna svaku kulturu, svaki idiom, svaku konvenciju formatiranja. Zna da:

- `$49/month` postaje `月額6,980円` u Japanu — ne "$49" sa nalepljenim jen simbolom
- Sarkazam ubija na engleskom i umire u formalnom japanskom
- "Drowning in paperwork" postaje "noyade administrative" na francuskom — pravi francuski izraz, ne prevod reč za reč
- Nemci zadržavaju šalu o hrčku jer je Hamsterrad (točak za hrčka) pravi nemački idiom
- Brazilci trebaju neformalni ton ili zvuči kao da je robot pisao

Model klasifikuje svaki string. UI labeli dobijaju direktan prevod. Marketing sadržaj se prilagođava. Humor se potpuno kreira za ciljnu kulturu.

---

## Šta se dešava kada ga pokrenete

Usmeriti ga na vaš build izlaz. Klonira celo stablo fajlova po lokalitetu — prevodeći tekstualne fajlove, kopiraju statičke resurse, i generiše sve potrebno za deployment:

```
your-site/                          translations/
  index.html                          middleware.ts        ← detekcija lokaliteta
  about.html             →            _locales.css         ← tipografija po pismu
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transkreiran
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← kopiran
                                        js/app.js          ← kopiran
                                        images/logo.png    ← kopiran
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Svaki HTML fajl dobija `lang` i `dir="rtl"` ubačene. Svaki lokalitet dobija CSS sa ispravnim fontom, line-height, i smerom teksta. Generiše se Vercel middleware koji čita `Accept-Language` i preusmerava na pravi lokalitet.

Deploy na Vercel. Korisnik u Tokiju vidi japanski sa Hiragino Sans na 1.8 line-height. Korisnik u Kairu vidi RTL arapski sa Noto Naskh na 110% veličine. Korisnik u Bangkoku vidi tajski sa `word-break: keep-all` jer tajski nema razmake. Bez konfiguracije.

---

## 90 sekundi, ne 4 nedelje

```bash
# Tri jezika, jedan JSON fajl
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Gotovo. 3 fajla napisana za 9,5s

# Ceo vaš sajt, svaki jezik na planeti
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Gotovo. 142 fajla prevedena, 284 statička fajla kopirana za 94s
```

### U vašem build pipeline-u

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Svaki deployment se isporučuje na 71 jezik. Prevodi su build artifakti — keširani, regenerisani samo kada se izvor promeni.

---

## Donesite svoje ključeve ili ne

```bash
# Imate ključeve — pokreće se lokalno, plaćate direktno vašem LLM pružaocu
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Nemate ključeve — samo funkcioniše
# Automatski koristi hosted servis
# Platite po prevodu sa USDC preko x402 — bez registracije, bez naloga
bunx translator-agent -s ./dist -l all
```

Ista komanda. Ako su API ključevi prisutni, pokreće se lokalno sa vašim pružaocem. Ako nisu, pogađa hosted API i plaća po zahtjvu preko [x402](https://x402.org) — HTTP 402 payment protokol. Vaš klijent plaća USDC na Base, dobija prevode nazad. Bez autentifikacije, bez odnosa sa dobavljačem, bez faktura.

Podržava Anthropic i OpenAI. Donesete koji god model želite:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Svaki sistem pisma, obrađen

Alat ne prevodi samo tekst — zna kako se svaki sistem pisma prikazuje:

| Pismo | Šta se menja | Zašto |
|---|---|---|
| **Arapski, hebrejski, farsi, urdu** | `dir="rtl"`, RTL fontovi, 110% veličina | Arapski treba veći tip da bude čitljiv; ceo layout se obrće |
| **Japanski, kineski, korejski** | CJK font stacks, 1.8 line-height | Karakteri su kvadrati fiksne širine; trebaju vertikalni prostor za disanje |
| **Hindi, bengalski, tamilski, telugu** | Indijski fontovi, 1.8 line-height | Gornje crte (shirorekha) trebaju dodatni vertikalni prostor |
| **Tajski** | `word-break: keep-all` | Nema razmaka između reči — browser treba eksplicitna pravila za prelom |
| **Burmanski** | 2.2 line-height | Najviši glifovi od svih glavnih pisama |
| **Kmerski** | 2.0 line-height | Klaster podskript suglasnika se stavljaju vertikalno |

Generisan CSS po lokalitetu:

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

## Keširanje

Prevodi su build artifakti. Generiši u build vreme, keširaj izlaz, preskoči kada se izvor nije promenio.

### Vercel

Vercel automatski kešira build izlaz. Dodaj `postbuild` i gotovo:

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

Izvor nepromenjen = cache hit = nula LLM poziva = nula troškova.

---

## Opcije

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      source direktorijum ili fajl za skeniranje
  -l, --locales <locales>  ciljni lokaliteti, odvojeni zapetom ili "all" za 71 jezik
  -o, --output <path>      output direktorijum (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         override modela
  -c, --concurrency <n>    max paralelnih LLM poziva (default: 10)
  --api-url <url>          hosted servis URL (auto-koristi se kada API ključevi nisu postavljeni)
```

| Ekstenzija | Strategija |
|---|---|
| `.json` | Prevedi vrednosti, sačuvaj ključeve |
| `.md` / `.mdx` | Prevedi tekst, sačuvaj sintaksu |
| `.html` / `.htm` | Prevedi tekst, sačuvaj tagove, ubaci `lang`/`dir` |
| Sve ostalo | Kopiraj u svaki direktorijum lokaliteta |

### Svih 71 lokaliteta

`-l all` pokriva ~95% korisnika interneta: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licenca

MIT