# translator-agent

O problema de localización de 10.000 $ resolvido en 90 segundos.

As empresas pagan ás axencias entre 0,10 e 0,25 $ por palabra para localizar os seus sitios web. Un sitio de 5.000 palabras en 10 idiomas costa entre 5.000 e 12.000 $ e leva de 2 a 4 semanas. Cada vez que cambias unha cabeceira, o contador vólvese poñer a cero.

Esta ferramenta faille en un comando, en 71 idiomas, durante a túa compilación:

```bash
bunx translator-agent -s ./dist -l all
```

Sen axencia. Sen follas de cálculo. Sen dependencia de provedores. Sen rexistro. As túas claves, a túa compilación, os teus idiomas.

> **Estás lendo a proba.** Este README traduciuse executando `bunx translator-agent -s README.md -l all`. Vai ler a [versión xaponesa](./translations/ja/README.md) — non só traduciu "o contador vólvese poñer a cero", substituíuno por un modismo comercial xaponés. A [versión alemá](./translations/de/README.md) é un 30% máis longa porque o alemán sempre é así. A [versión árabe](./translations/ar/README.md) lese de dereita a esquerda. A [versión en portugués brasileiro](./translations/pt-BR/README.md) soa como se a escribise un brasileiro, porque é ese o obxectivo.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [os 71 completos...](./translations/)

---

## Por que funciona isto

A tradución é un problema resolvido. A localización non.

Google Translate pode converter "Os nosos hámsteres están traballando niso" ao xaponés. O que non pode facer é recoñecer que a graza non funciona en Xapón e substituíla por algo que si — como referenciar ao equipo de enxeñería facendo un desenrolo nocturno, que é tanto culturalmente apropiado como divertido no contexto.

Esta ferramenta non traduce. **Transcrea** — o mesmo proceso polo que as axencias publicitarias cobran 50.000 $ por adaptar unha campaña entre mercados. Agás que o LLM xa coñece todas as culturas, todos os modismos, todas as convencións de formato. Sabe que:

- `$49/month` convértese en `月額6,980円` en Xapón — non "$49" cun símbolo de yen pegado
- O sarcasmo triunfa en inglés e morre no xaponés formal
- "Afogándose no papeleo" convértese en "noyade administrative" en francés — unha expresión francesa real, non unha tradución palabra por palabra
- Os alemáns manteñen a graza do hámster porque Hamsterrad (roda de hámster) é un modismo alemán real
- Os brasileiros necesitan o rexistro casual ou soa como se o escribise un robot

O modelo clasifica cada cadea de texto. As etiquetas da interfaz obteñen tradución directa. O contido de marketing adáptase. O humor recrease completamente para a cultura de destino.

---

## Que pasa cando o executas

Apúntao á túa saída de compilación. Clona toda a árbore de ficheiros por idioma — traducindo ficheiros de texto, copiando recursos estáticos e xerando todo o necesario para o despregamento:

```
your-site/                          translations/
  index.html                          middleware.ts        ← detección de idioma
  about.html             →            _locales.css         ← tipografía por escritura
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreado
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 interliñado
                                        css/style.css      ← copiado
                                        js/app.js          ← copiado
                                        images/logo.png    ← copiado
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% fonte
                                        ...
                                      de/
                                        ...
```

Cada ficheiro HTML recibe `lang` e `dir="rtl"` inxectados. Cada idioma recibe CSS coa pila de fontes correcta, interliñado e dirección de texto. Xérase un middleware de Vercel que le `Accept-Language` e reescribe ao idioma correcto.

Desprega en Vercel. Un usuario en Tokio ve xaponés con Hiragino Sans a 1.8 de interliñado. Un usuario no Cairo ve árabe RTL con Noto Naskh ao 110% de tamaño. Un usuario en Bangkok ve tailandés con `word-break: keep-all` porque o tailandés non ten espazos. Sen configuración.

---

## 90 segundos, non 4 semanas

```bash
# Tres idiomas, un ficheiro JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Rematado. 3 ficheiros escritos en 9,5s

# Todo o teu sitio, todos os idiomas da terra
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Rematado. 142 ficheiros traducidos, 284 ficheiros estáticos copiados en 94s
```

### Na túa canalización de compilación

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Cada despregamento envíase en 71 idiomas. As traducións son artefactos de compilación — almacenados en caché, rexenerados só cando cambia a fonte.

---

## Trae as túas claves ou non

```bash
# Tes claves — execútase local, pagas directamente ao teu provedor de LLM
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Non tes claves — simplemente funciona
# Utiliza automaticamente o servizo aloxado
# Paga por tradución con USDC vía x402 — sen rexistro, sen conta
bunx translator-agent -s ./dist -l all
```

O mesmo comando. Se hai claves de API presentes, execútase localmente co teu provedor. Se non, conecta coa API aloxada e paga por solicitude vía [x402](https://x402.org) — o protocolo de pagamento HTTP 402. O teu cliente paga USDC en Base, recibe as traducións. Sen autenticación, sen relación con provedor, sen facturas.

Admite Anthropic e OpenAI. Trae o modelo que queiras:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Todos os sistemas de escritura, xestionados

A ferramenta non só traduce texto — sabe como se renderiza cada sistema de escritura:

| Escritura | Que cambia | Por que |
|---|---|---|
| **Árabe, hebreo, farsi, urdu** | `dir="rtl"`, fontes RTL, tamaño 110% | O árabe necesita tipo máis grande para ser lexible; todo o deseño reflíctese |
| **Xaponés, chinés, coreano** | Pilas de fontes CJK, 1.8 interliñado | Os caracteres son cadrados de ancho fixo; necesitan espazo vertical para respirar |
| **Hindi, bengalí, tamil, telugu** | Fontes índicas, 1.8 interliñado | Os trazos superiores (shirorekha) necesitan espazo vertical extra |
| **Tailandés** | `word-break: keep-all` | Non hai espazos entre palabras — o navegador necesita regras explícitas de salto de liña |
| **Birmano** | 2.2 interliñado | Os glifos máis altos de calquera escritura principal |
| **Khmer** | 2.0 interliñado | Os grupos de consoantes subscritas apílanse verticalmente |

CSS xerado por idioma:

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

## Caché

As traducións son artefactos de compilación. Xera na compilación, almacena en caché a saída, omite cando a fonte non cambiou.

### Vercel

Vercel almacena automaticamente en caché a saída da compilación. Engade `postbuild` e remataches:

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

Fonte sen cambios = acerto de caché = cero chamadas LLM = cero custo.

---

## Opcións

```
Uso: translator-agent [opcións]

Opcións:
  -s, --source <path>      directorio ou ficheiro fonte para escanear
  -l, --locales <locales>  idiomas de destino, separados por comas ou "all" para 71 idiomas
  -o, --output <path>      directorio de saída (por defecto: "./translations")
  -p, --provider <name>    anthropic | openai (por defecto: "anthropic")
  -m, --model <id>         substitución de modelo
  -c, --concurrency <n>    máximo de chamadas LLM en paralelo (por defecto: 10)
  --api-url <url>          URL do servizo aloxado (úsase auto cando non hai claves API configuradas)
```

| Extensión | Estratexia |
|---|---|
| `.json` | Traducir valores, preservar claves |
| `.md` / `.mdx` | Traducir texto, preservar sintaxe |
| `.html` / `.htm` | Traducir texto, preservar etiquetas, inxectar `lang`/`dir` |
| Todo o demás | Copiar a cada directorio de idioma |

### Os 71 idiomas completos

`-l all` cubre ~95% dos usuarios de internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licenza

MIT

```