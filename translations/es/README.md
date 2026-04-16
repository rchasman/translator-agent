# translator-agent

El problema de localización de $10,000, resuelto en 90 segundos.

Las empresas pagan a las agencias $0.10–0.25 por palabra para localizar sus sitios. Un sitio de 5,000 palabras en 10 idiomas cuesta $5,000–12,000 y toma 2–4 semanas. Cada vez que cambias un titular, el reloj vuelve a empezar.

Esta herramienta lo hace con un solo comando, en 71 idiomas, durante tu proceso de construcción:

```bash
bunx translator-agent -s ./dist -l all
```

Sin agencia. Sin hojas de cálculo. Sin dependencia de proveedores. Sin registro. Tus claves, tu build, tus idiomas.

> **Estás leyendo la prueba.** Este README fue traducido ejecutando `bunx translator-agent -s README.md -l all`. Lee la [versión japonesa](./translations/ja/README.md) — no solo tradujo "the meter restarts," lo reemplazó con un modismo de negocios japonés. La [versión alemana](./translations/de/README.md) es 30% más larga porque el alemán siempre lo es. La [versión árabe](./translations/ar/README.md) se lee de derecha a izquierda. La [versión en portugués brasileño](./translations/pt-BR/README.md) suena como si la hubiera escrito un brasileño, porque ese es el punto.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [los 71...](./translations/)

---

## Por qué funciona

La traducción es un problema resuelto. La localización no.

Google Translate puede convertir "Our hamsters are working on it" al japonés. Lo que no puede hacer es reconocer que el chiste no funciona en Japón, y reemplazarlo con algo que sí funcione — como mencionar al equipo de ingeniería desvelándose toda la noche, que es tanto culturalmente apropiado como gracioso en contexto.

Esta herramienta no traduce. **Transcrea** — el mismo proceso por el que las agencias publicitarias cobran $50,000 cuando adaptan una campaña a diferentes mercados. Excepto que el LLM ya conoce cada cultura, cada expresión idiomática, cada convención de formato. Sabe que:

- `$49/month` se convierte en `月額6,980円` en Japón — no "$49" con un símbolo de yen pegado
- El sarcasmo mata en inglés y muere en japonés formal
- "Drowning in paperwork" se convierte en "noyade administrative" en francés — una expresión francesa real, no una traducción palabra por palabra
- Los alemanes mantienen el chiste del hámster porque Hamsterrad (rueda de hámster) es un modismo alemán real
- Los brasileños necesitan el registro casual o suena como si lo hubiera escrito un robot

El modelo clasifica cada cadena. Las etiquetas de UI obtienen traducción directa. El copy de marketing se adapta. El humor se recrea completamente para la cultura objetivo.

---

## Qué pasa cuando lo ejecutas

Apúntalo a tu salida de build. Clona todo el árbol de archivos por idioma — traduciendo archivos de texto, copiando assets estáticos, y generando todo lo necesario para el despliegue:

```
your-site/                          translations/
  index.html                          middleware.ts        ← detección de idioma
  about.html             →            _locales.css         ← tipografía por script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreado
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← copiado
                                        js/app.js          ← copiado
                                        images/logo.png    ← copiado
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Cada archivo HTML obtiene `lang` y `dir="rtl"` inyectados. Cada idioma obtiene CSS con la pila de fuentes correcta, altura de línea y dirección de texto. Se genera un middleware de Vercel que lee `Accept-Language` y reescribe al idioma correcto.

Despliega en Vercel. Un usuario en Tokio ve japonés con Hiragino Sans a 1.8 de altura de línea. Un usuario en El Cairo ve árabe RTL con Noto Naskh al 110% de tamaño. Un usuario en Bangkok ve tailandés con `word-break: keep-all` porque el tailandés no tiene espacios. Sin configuración.

---

## 90 segundos, no 4 semanas

```bash
# Tres idiomas, un archivo JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Listo. 3 archivos escritos en 9.5s

# Todo tu sitio, todos los idiomas del planeta
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Listo. 142 archivos traducidos, 284 archivos estáticos copiados en 94s
```

### En tu pipeline de build

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Cada despliegue se entrega en 71 idiomas. Las traducciones son artefactos de build — cacheados, regenerados solo cuando el fuente cambia.

---

## Trae tus propias claves o no

```bash
# Tienes claves — se ejecuta local, pagas a tu proveedor de LLM directamente
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# No tienes claves — simplemente funciona
# Usa automáticamente el servicio alojado
# Paga por traducción con USDC vía x402 — sin registro, sin cuenta
bunx translator-agent -s ./dist -l all
```

Mismo comando. Si las claves API están presentes, se ejecuta localmente con tu proveedor. Si no, accede a la API alojada y paga por petición vía [x402](https://x402.org) — el protocolo de pago HTTP 402. Tu cliente paga USDC en Base, recibe traducciones de vuelta. Sin autenticación, sin relación con proveedor, sin facturas.

Compatible con Anthropic y OpenAI. Trae el modelo que quieras:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Todos los sistemas de escritura, manejados

La herramienta no solo traduce texto — sabe cómo se renderiza cada sistema de escritura:

| Script | Qué cambia | Por qué |
|---|---|---|
| **Árabe, Hebreo, Farsi, Urdu** | `dir="rtl"`, fuentes RTL, tamaño 110% | El árabe necesita tipo más grande para ser legible; todo el layout se refleja |
| **Japonés, Chino, Coreano** | Pilas de fuentes CJK, line-height 1.8 | Los caracteres son cuadrados de ancho fijo; necesitan espacio vertical |
| **Hindi, Bengalí, Tamil, Telugu** | Fuentes Índicas, line-height 1.8 | Los trazos superiores (shirorekha) necesitan espacio vertical extra |
| **Tailandés** | `word-break: keep-all` | Sin espacios entre palabras — el navegador necesita reglas explícitas de salto de línea |
| **Birmano** | line-height 2.2 | Los glifos más altos de cualquier script principal |
| **Khmer** | line-height 2.0 | Los grupos de consonantes en subíndice se apilan verticalmente |

CSS generado por idioma:

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

Las traducciones son artefactos de build. Genera en tiempo de build, cachea la salida, omite cuando el fuente no ha cambiado.

### Vercel

Vercel cachea la salida de build automáticamente. Agrega `postbuild` y listo:

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

Fuente sin cambios = acierto de caché = cero llamadas LLM = cero costo.

---

## Opciones

```
Uso: translator-agent [opciones]

Opciones:
  -s, --source <path>      directorio o archivo fuente para escanear
  -l, --locales <locales>  idiomas objetivo, separados por comas o "all" para 71 idiomas
  -o, --output <path>      directorio de salida (predeterminado: "./translations")
  -p, --provider <name>    anthropic | openai (predeterminado: "anthropic")
  -m, --model <id>         anular modelo
  -c, --concurrency <n>    máx llamadas LLM paralelas (predeterminado: 10)
  --api-url <url>          URL del servicio alojado (auto-usado cuando no hay claves API)
```

| Extensión | Estrategia |
|---|---|
| `.json` | Traducir valores, preservar claves |
| `.md` / `.mdx` | Traducir texto, preservar sintaxis |
| `.html` / `.htm` | Traducir texto, preservar etiquetas, inyectar `lang`/`dir` |
| Todo lo demás | Copiar en cada directorio de idioma |

### Los 71 idiomas

`-l all` cubre ~95% de usuarios de internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licencia

MIT