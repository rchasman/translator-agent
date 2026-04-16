# translator-agent

Problem lokalizacije od 77.000 kuna, riješen za 90 sekundi.

Tvrtke plaćaju agencijama 0,75–1,90 kn po riječi za lokalizaciju svojih stranica. Stranica od 5.000 riječi na 10 jezika košta 37.500–90.000 kn i traje 2–4 tjedna. Svaki put kad promijenite naslov, brojač počinje ispočetka.

Ovaj alat to radi jednom naredbom, na 71 jeziku, tijekom vašeg build procesa:

```bash
bunx translator-agent -s ./dist -l all
```

Bez agencije. Bez spreadsheet-ova. Bez vezivanja za dobavljača. Bez registracije. Vaši ključevi, vaš build, vaši jezici.

> **Čitate dokaz.** Ovaj README je preveden pokretanjem `bunx translator-agent -s README.md -l all`. Pročitajte [japansku verziju](./translations/ja/README.md) — nije samo prevela "brojač počinje ispočetka," zamijenila je to japanskim poslovnim idiomom. [Njemačka verzija](./translations/de/README.md) je 30% duža jer njemački uvijek jest. [Arapska verzija](./translations/ar/README.md) čita se zdesna ulijevo. [Brazilska portugalska verzija](./translations/pt-BR/README.md) zvuči kao da ju je pisao Brazilac, jer to je i poanta.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [svih 71...](./translations/)

---

## Zašto ovo funkcionira

Prevođenje je riješen problem. Lokalizacija nije.

Google Translate može pretvoriti "Naši hrčci rade na tome" u japanski. Ono što ne može je prepoznati da šala ne prolazi u Japanu i zamijeniti je nečim što prolazi — poput referiranja na inženjerski tim koji radi cijelu noć, što je i kulturno prikladno i smiješno u kontekstu.

Ovaj alat ne prevodi. On **transkreira** — isti proces za koji reklamne agencije naplaćuju 375.000 kn kada prilagođavaju kampanje različitim tržištima. Samo što LLM već poznaje svaku kulturu, svaki idiom, svaku konvenciju formatiranja. Zna da:

- `$49/month` postaje `mjesečno 370 kn` u Hrvatskoj — ne "$49" s kunama naljepljenim na to
- Sarkazam ubija na engleskom i umire u formalnom japanskom
- "Utapanje u papirologiji" postaje "noyade administrative" na francuskom — pravi francuski izraz, a ne doslovni prijevod
- Nijemci zadržavaju šalu s hrčkom jer je Hamsterrad (kotačić za hrčka) pravi njemački idiom
- Brazilci trebaju ležerni registar ili zvuči kao da je robot napisao

Model klasificira svaki string. UI oznake dobivaju direktan prijevod. Marketinški sadržaj se prilagođava. Humor se potpuno rekreira za ciljnu kulturu.

---

## Što se događa kada to pokretate

Usmjerite to na svoj build output. Klonira cijelo stablo datoteka po locale-u — prevodeći tekstualne datoteke, kopirajući statičke resurse i generirajući sve potrebno za implementaciju:

```
your-site/                          translations/
  index.html                          middleware.ts        ← prepoznavanje locale-a
  about.html             →            _locales.css         ← tipografija po pismu
  css/style.css                       hr/
  js/app.js                             index.html         ← lang="hr", transkreira
  images/logo.png                       about.html
                                        _locale.css        ← Arial, 1.6 line-height
                                        css/style.css      ← kopirano
                                        js/app.js          ← kopirano
                                        images/logo.png    ← kopirano
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Svaka HTML datoteka dobiva `lang` i `dir="rtl"` umetnut. Svaki locale dobiva CSS s ispravnim fontom, line-height-om i smjerom teksta. Generira se Vercel middleware koji čita `Accept-Language` i preusmjerava na pravi locale.

Implementirajte na Vercel. Korisnik u Tokiju vidi japanski s Hiragino Sans na 1.8 line-height. Korisnik u Kairu vidi RTL arapski s Noto Naskh na 110% veličini. Korisnik u Bangkoku vidi tajski s `word-break: keep-all` jer tajski nema razmake. Bez konfiguracije.

---

## 90 sekundi, ne 4 tjedna

```bash
# Tri jezika, jedna JSON datoteka
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Gotovo. 3 datoteke napisane za 9,5s

# Cijela vaša stranica, svaki jezik na zemlji
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Gotovo. 142 datoteke prevedene, 284 statičke datoteke kopirane za 94s
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

Svaka implementacija isporučuje se na 71 jeziku. Prijevodi su build artefakti — cache-irani, regenerirani samo kad se source promijeni.

---

## Donesite svoje ključeve ili ne

```bash
# Imate ključeve — pokreće se lokalno, plaćate LLM pružatelju direktno
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Nemate ključeve — samo radi
# Automatski koristi hosted servis
# Plaćajte po prijevodu s USDC preko x402 — bez registracije, bez računa
bunx translator-agent -s ./dist -l all
```

Ista naredba. Ako su API ključevi prisutni, pokreće se lokalno s vašim pružateljem. Ako nisu, poziva hosted API i plaća po zahtjevu preko [x402](https://x402.org) — HTTP 402 protokol za plaćanje. Vaš klijent plaća USDC na Base-u, dobiva prijevode nazad. Bez autentifikacije, bez odnosa s dobavljačem, bez računa.

Podržava Anthropic i OpenAI. Donesite koji god model želite:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Svaki sustav pisma, riješen

Alat ne prevodi samo tekst — zna kako se svaki sustav pisma prikazuje:

| Pismo | Što se mijenja | Zašto |
|---|---|---|
| **Arapski, hebrejski, perzijski, urdu** | `dir="rtl"`, RTL fontovi, 110% veličina | Arapskom trebaju veći tipovi da budu čitljivi; cijeli layout se zrcali |
| **Japanski, kineski, korejski** | CJK font stacks, 1.8 line-height | Znakovi su kvadrati fiksne širine; trebaju vertikalni prostor za disanje |
| **Hindi, bengalski, tamilski, telugu** | Indijski fontovi, 1.8 line-height | Glavne linije (shirorekha) trebaju dodatni vertikalni prostor |
| **Tajski** | `word-break: keep-all` | Nema razmaka između riječi — pregljedač treba eksplicitna pravila prijeloma |
| **Burmanski** | 2.2 line-height | Najviši glifovi bilo kojeg glavnog pisma |
| **Khmerski** | 2.0 line-height | Podskriptni klastersi suglasnika slažu se vertikalno |

Generirani CSS po locale-u:

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

## Cache-iranje

Prijevodi su build artefakti. Generirajte u build vremenu, cache-irajte output, preskačite kad se source nije promijenio.

### Vercel

Vercel cache-ira build output automatski. Dodajte `postbuild` i gotovi ste:

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

Source nepromijenjen = cache hit = nula LLM poziva = nula troška.

---

## Opcije

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      izvorni direktorij ili datoteka za skeniranje
  -l, --locales <locales>  ciljni locale-ovi, odvojeni zarezom ili "all" za 71 jezik
  -o, --output <path>      izlazni direktorij (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         model override
  -c, --concurrency <n>    max paralelnih LLM poziva (default: 10)
  --api-url <url>          hosted service URL (auto-koristi se kad nema API ključeva)
```

| Ekstenzija | Strategija |
|---|---|
| `.json` | Prevedi vrijednosti, sačuvaj ključeve |
| `.md` / `.mdx` | Prevedi tekst, sačuvaj sintaksu |
| `.html` / `.htm` | Prevedi tekst, sačuvaj tagove, umetni `lang`/`dir` |
| Sve ostalo | Kopiraj u svaki locale direktorij |

### Svih 71 locale-a

`-l all` pokriva ~95% korisnika interneta: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licenca

MIT