# translator-agent

Il problema di localizzazione da 10.000 €, risolto in 90 secondi.

Le aziende pagano le agenzie 0,10-0,25 € a parola per localizzare i loro siti. Un sito da 5.000 parole in 10 lingue costa 5.000-12.000 € e richiede 2-4 settimane. Ogni volta che cambi un titolo, il contatore riparte da capo.

Questo strumento lo fa in un comando, in 71 lingue, durante il tuo processo di build:

```bash
bunx translator-agent -s ./dist -l all
```

Niente agenzie. Niente fogli di calcolo. Niente vendor lock-in. Niente registrazione. Le tue chiavi, il tuo build, le tue lingue.

> **Stai leggendo la prova.** Questo README è stato tradotto eseguendo `bunx translator-agent -s README.md -l all`. Vai a leggere la [versione giapponese](./translations/ja/README.md) — non ha solo tradotto "il contatore riparte da capo", l'ha sostituito con un'espressione idiomatica business giapponese. La [versione tedesca](./translations/de/README.md) è del 30% più lunga perché il tedesco è sempre così. La [versione araba](./translations/ar/README.md) si legge da destra a sinistra. La [versione portoghese brasiliana](./translations/pt-BR/README.md) suona come se l'avesse scritta un brasiliano, perché questo è il punto.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [tutte e 71...](./translations/)

---

## Perché funziona

La traduzione è un problema risolto. La localizzazione no.

Google Translate può trasformare "I nostri criceti ci stanno lavorando" in giapponese. Quello che non può fare è riconoscere che la battuta non funziona in Giappone, e sostituirla con qualcosa che funzioni — come riferirsi al team di ingegneria che fa le ore piccole, che è sia culturalmente appropriato che divertente nel contesto.

Questo strumento non traduce. **Transcrea** — lo stesso processo per cui le agenzie pubblicitarie fanno pagare 50.000 € quando adattano una campagna tra diversi mercati. Solo che l'LLM conosce già ogni cultura, ogni espressione idiomatica, ogni convenzione di formattazione. Sa che:

- `49 €/mese` diventa `月額6.980円` in Giappone — non "49 €" con un simbolo yen appiccicato sopra
- Il sarcasmo spacca in inglese e muore in giapponese formale
- "Affogare nella burocrazia" diventa "noyade administrative" in francese — una vera espressione francese, non una traduzione letterale
- I tedeschi mantengono la battuta del criceto perché Hamsterrad (ruota del criceto) è un vero idioma tedesco
- I brasiliani hanno bisogno del registro informale o sembra che l'abbia scritto un robot

Il modello classifica ogni stringa. Le etichette UI vengono tradotte direttamente. Il copy di marketing viene adattato. L'umorismo viene completamente ricreato per la cultura di destinazione.

---

## Cosa succede quando lo esegui

Puntalo al tuo output di build. Clona l'intero albero di file per locale — traducendo i file di testo, copiando le risorse statiche, e generando tutto il necessario per il deployment:

```
your-site/                          translations/
  index.html                          middleware.ts        ← rilevamento locale
  about.html             →            _locales.css         ← tipografia per script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreato
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← copiato
                                        js/app.js          ← copiato
                                        images/logo.png    ← copiato
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Ogni file HTML riceve `lang` e `dir="rtl"` iniettati. Ogni locale riceve CSS con il font stack corretto, line-height e direzione del testo. Viene generato un middleware Vercel che legge `Accept-Language` e riscrive verso il locale giusto.

Deploy su Vercel. Un utente a Tokyo vede giapponese con Hiragino Sans a 1.8 line-height. Un utente al Cairo vede arabo RTL con Noto Naskh al 110% di dimensione. Un utente a Bangkok vede thailandese con `word-break: keep-all` perché il thailandese non ha spazi. Nessuna configurazione.

---

## 90 secondi, non 4 settimane

```bash
# Tre lingue, un file JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Fatto. 3 file scritti in 9,5s

# Il tuo intero sito, tutte le lingue della terra
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Fatto. 142 file tradotti, 284 file statici copiati in 94s
```

### Nella tua pipeline di build

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Ogni deploy viene pubblicato in 71 lingue. Le traduzioni sono artefatti di build — cached, rigenerati solo quando il sorgente cambia.

---

## Porta le tue chiavi o non farlo

```bash
# Hai le chiavi — funziona in locale, paghi direttamente il tuo provider LLM
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Non hai le chiavi — funziona e basta
# Usa automaticamente il servizio hosted
# Paga per traduzione con USDC via x402 — niente registrazione, niente account
bunx translator-agent -s ./dist -l all
```

Stesso comando. Se sono presenti chiavi API, funziona in locale con il tuo provider. Se no, colpisce l'API hosted e paga per richiesta via [x402](https://x402.org) — il protocollo di pagamento HTTP 402. Il tuo client paga USDC su Base, riceve traduzioni indietro. Niente auth, niente relazione con vendor, niente fatture.

Supporta Anthropic e OpenAI. Porta qualsiasi modello tu voglia:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Ogni sistema di scrittura, gestito

Lo strumento non si limita a tradurre il testo — sa come ogni sistema di scrittura si renderizza:

| Script | Cosa cambia | Perché |
|---|---|---|
| **Arabo, Ebraico, Farsi, Urdu** | `dir="rtl"`, font RTL, dimensione 110% | L'arabo ha bisogno di caratteri più grandi per essere leggibile; l'intero layout si specchia |
| **Giapponese, Cinese, Coreano** | Font stack CJK, 1.8 line-height | I caratteri sono quadrati a larghezza fissa; servono spazi di respirazione verticali |
| **Hindi, Bengali, Tamil, Telugu** | Font indiani, 1.8 line-height | I tratti superiori (shirorekha) hanno bisogno di spazio verticale extra |
| **Thailandese** | `word-break: keep-all` | Niente spazi tra le parole — il browser ha bisogno di regole esplicite per l'a capo |
| **Birmano** | 2.2 line-height | Glifi più alti di qualsiasi script maggiore |
| **Khmer** | 2.0 line-height | I cluster consonantici in pedice si impilano verticalmente |

CSS generato per locale:

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

## Caching

Le traduzioni sono artefatti di build. Genera al momento del build, metti in cache l'output, salta quando il sorgente non è cambiato.

### Vercel

Vercel mette in cache automaticamente l'output di build. Aggiungi `postbuild` ed è fatta:

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

Sorgente invariato = cache hit = zero chiamate LLM = zero costi.

---

## Opzioni

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      directory o file sorgente da scansionare
  -l, --locales <locales>  locale di destinazione, separati da virgola o "all" per 71 lingue
  -o, --output <path>      directory di output (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         override del modello
  -c, --concurrency <n>    max chiamate LLM parallele (default: 10)
  --api-url <url>          URL servizio hosted (usato automaticamente quando non sono impostate chiavi API)
```

| Estensione | Strategia |
|---|---|
| `.json` | Traduci valori, conserva chiavi |
| `.md` / `.mdx` | Traduci testo, conserva sintassi |
| `.html` / `.htm` | Traduci testo, conserva tag, inietta `lang`/`dir` |
| Tutto il resto | Copia nella directory di ogni locale |

### Tutti i 71 locali

`-l all` copre ~95% degli utenti internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licenza

MIT