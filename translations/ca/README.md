# translator-agent

El problema de localització de 10.000 €, resolt en 90 segons.

Les empreses paguen agències entre 0,10 i 0,25 € per paraula per localitzar els seus webs. Un lloc de 5.000 paraules a 10 idiomes costa entre 5.000 i 12.000 € i triga entre 2 i 4 setmanes. Cada vegada que canvies un titular, el comptador es reinicia.

Aquesta eina ho fa en una sola comanda, en 71 idiomes, durant el procés de construcció:

```bash
bunx translator-agent -s ./dist -l all
```

Sense agència. Sense fulls de càlcul. Sense dependència de proveïdors. Sense registre. Les teves claus, la teva construcció, els teus idiomes.

> **Estàs llegint la prova.** Aquest README s'ha traduït executant `bunx translator-agent -s README.md -l all`. Ves a llegir la [versió japonesa](./translations/ja/README.md) — no només va traduir "el comptador es reinicia", sinó que ho va substituir per un modisme empresarial japonès. La [versió alemanya](./translations/de/README.md) és un 30% més llarga perquè l'alemany sempre ho és. La [versió àrab](./translations/ar/README.md) es llegeix de dreta a esquerra. La [versió portuguesa del Brasil](./translations/pt-BR/README.md) sona com si l'hagués escrit un brasiler, i aquest és el punt.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [tots 71...](./translations/)

---

## Per què funciona

La traducció és un problema resolt. La localització no.

Google Translate pot convertir "Els nostres hàmsters hi estan treballant" al japonès. El que no pot fer és reconèixer que la broma no funciona al Japó, i substituir-la per alguna cosa que sí que funcioni — com fer referència a l'equip d'enginyeria fent nocturn, que és tant culturalment apropiat com divertit en context.

Aquesta eina no tradueix. **Transcrea** — el mateix procés pel qual les agències de publicitat cobren 50.000 € quan adapten una campanya entre mercats. Excepte que el LLM ja coneix cada cultura, cada modisme, cada convenció de format. Sap que:

- `49 €/mes` es converteix en `月額6.980円` al Japó — no "49 €" amb un símbol de ien enganxat
- El sarcasme mata en anglès i mor en japonès formal
- "Ofegar-se en paperassa" es converteix en "noyade administrative" en francès — una expressió francesa real, no una traducció paraula per paraula
- Els alemanys mantenen la broma del hàmster perquè Hamsterrad (roda de hàmster) és un modisme alemany real
- Els brasilers necessiten el registre casual o sona com si l'hagués escrit un robot

El model classifica cada cadena. Les etiquetes d'interfície reben traducció directa. El text de màrqueting s'adapta. L'humor es recrea completament per a la cultura objectiu.

---

## Què passa quan ho executes

Apunta'l a la sortida de construcció. Clona tot l'arbre de fitxers per localització — traduint fitxers de text, copiant recursos estàtics i generant tot el necessari per al desplegament:

```
el-teu-web/                         translations/
  index.html                          middleware.ts        ← detecció de localització
  about.html             →            _locales.css         ← tipografia per sistema d'escriptura
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreat
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 interlineat
                                        css/style.css      ← copiat
                                        js/app.js          ← copiat
                                        images/logo.png    ← copiat
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Cada fitxer HTML rep `lang` i `dir="rtl"` injectat. Cada localització rep CSS amb la pila de fonts correcta, l'interlineat i la direcció del text. Es genera un middleware de Vercel que llegeix `Accept-Language` i redirigeix a la localització correcta.

Desplega a Vercel. Un usuari de Tòquio veu japonès amb Hiragino Sans a 1.8 d'interlineat. Un usuari del Caire veu àrab RTL amb Noto Naskh a 110% de mida. Un usuari de Bangkok veu tailandès amb `word-break: keep-all` perquè el tailandès no té espais. Sense configuració.

---

## 90 segons, no 4 setmanes

```bash
# Tres idiomes, un fitxer JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Fet. 3 fitxers escrits en 9,5s

# Tot el teu web, cada idioma de la terra
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Fet. 142 fitxers traduïts, 284 fitxers estàtics copiats en 94s
```

### En el teu pipeline de construcció

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Cada desplegament s'envia en 71 idiomes. Les traduccions són artefactes de construcció — cachejats, regenerats només quan la font canvia.

---

## Porta les teves claus o no

```bash
# Tens claus — s'executa local, pagues el teu proveïdor LLM directament
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# No tens claus — simplement funciona
# Utilitza automàticament el servei allotjat
# Paga per traducció amb USDC via x402 — sense registre, sense compte
bunx translator-agent -s ./dist -l all
```

Mateixa comanda. Si hi ha claus API presents, s'executa localment amb el teu proveïdor. Si no, contacta amb l'API allotjada i paga per petició via [x402](https://x402.org) — el protocol de pagament HTTP 402. El teu client paga USDC a Base, rep traduccions de tornada. Sense autenticació, sense relació amb proveïdors, sense factures.

Suporta Anthropic i OpenAI. Porta el model que vulguis:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Cada sistema d'escriptura, gestionat

L'eina no només tradueix text — sap com es renderitza cada sistema d'escriptura:

| Sistema d'escriptura | Què canvia | Per què |
|---|---|---|
| **Àrab, hebreu, farsi, urdú** | `dir="rtl"`, fonts RTL, 110% mida | L'àrab necessita tipus més grans per ser llegible; tot el disseny es reflecteix |
| **Japonès, xinès, coreà** | Piles de fonts CJK, 1.8 interlineat | Els caràcters són quadrats d'amplada fixa; necessiten espai vertical per respirar |
| **Hindi, bengalí, tàmil, telugu** | Fonts índiques, 1.8 interlineat | Els traços superiors (shirorekha) necessiten espai vertical extra |
| **Tailandès** | `word-break: keep-all` | No hi ha espais entre paraules — el navegador necessita regles explícites de salt de línia |
| **Birmà** | 2.2 interlineat | Els glifs més alts de qualsevol sistema d'escriptura major |
| **Khmer** | 2.0 interlineat | Els clústers de consonants subscrites s'apilen verticalment |

CSS generat per localització:

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

## Cachejat

Les traduccions són artefactes de construcció. Genera en temps de construcció, cacheja la sortida, omet quan la font no ha canviat.

### Vercel

Vercel cacheja la sortida de construcció automàticament. Afegeix `postbuild` i ja està:

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

Font sense canvis = encert de cache = zero crides LLM = zero cost.

---

## Opcions

```
Ús: translator-agent [opcions]

Opcions:
  -s, --source <ruta>      directori o fitxer font per escanejar
  -l, --locales <locales>  localitzacions objectiu, separades per comes o "all" per 71 idiomes
  -o, --output <ruta>      directori de sortida (per defecte: "./translations")
  -p, --provider <nom>     anthropic | openai (per defecte: "anthropic")
  -m, --model <id>         sobreescriptura de model
  -c, --concurrency <n>    màx crides LLM paral·leles (per defecte: 10)
  --api-url <url>          URL del servei allotjat (s'usa auto quan no hi ha claus API configurades)
```

| Extensió | Estratègia |
|---|---|
| `.json` | Tradueix valors, preserva claus |
| `.md` / `.mdx` | Tradueix text, preserva sintaxi |
| `.html` / `.htm` | Tradueix text, preserva etiquetes, injecta `lang`/`dir` |
| Tot la resta | Copia al directori de cada localització |

### Totes les 71 localitzacions

`-l all` cobreix ~95% dels usuaris d'internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Llicència

MIT