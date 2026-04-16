# translator-agent

Das 10.000€-Lokalisierungsproblem, gelöst in 90 Sekunden.

Unternehmen zahlen Agenturen 0,10–0,25€ pro Wort für die Lokalisierung ihrer Websites. Eine 5.000-Wörter-Website in 10 Sprachen kostet 5.000–12.000€ und dauert 2–4 Wochen. Jedes Mal wenn Sie eine Überschrift ändern, läuft die Uhr wieder von vorn.

Dieses Tool macht es mit einem Befehl, in 71 Sprachen, während Ihres Build-Prozesses:

```bash
bunx translator-agent -s ./dist -l all
```

Keine Agentur. Keine Tabellen. Keine Anbieterabhängigkeit. Keine Anmeldung. Ihre Schlüssel, Ihr Build, Ihre Sprachen.

> **Sie lesen den Beweis.** Diese README wurde übersetzt, indem `bunx translator-agent -s README.md -l all` ausgeführt wurde. Lesen Sie die [japanische Version](./translations/ja/README.md) — sie hat nicht nur „the meter restarts" übersetzt, sondern mit einem japanischen Geschäftsidiom ersetzt. Die [deutsche Version](./translations/de/README.md) ist 30% länger, weil Deutsch das eben so ist. Die [arabische Version](./translations/ar/README.md) liest sich von rechts nach links. Die [brasilianisch-portugiesische Version](./translations/pt-BR/README.md) klingt, als hätte sie ein Brasilianer geschrieben, denn das ist der Punkt.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [alle 71...](./translations/)

---

## Warum das funktioniert

Übersetzung ist ein gelöstes Problem. Lokalisierung ist es nicht.

Google Translate kann „Our hamsters are working on it" ins Japanische übersetzen. Was es nicht kann: erkennen, dass der Witz in Japan nicht ankommt, und ihn durch etwas ersetzen, das funktioniert — wie eine Anspielung auf das Entwicklungsteam, das eine Nachtschicht einlegt, was sowohl kulturell angemessen als auch im Kontext witzig ist.

Dieses Tool übersetzt nicht. Es **transcreiert** — derselbe Prozess, für den Werbeagenturen 50.000€ verlangen, wenn sie eine Kampagne für verschiedene Märkte adaptieren. Nur dass das LLM bereits jede Kultur, jedes Idiom, jede Formatierungskonvention kennt. Es weiß, dass:

- `49€/Monat` in Japan zu `月額6,980円` wird — nicht „49€" mit einem Yen-Symbol darübergestülpt
- Sarkasmus im Englischen brilliert und im formellen Japanischen stirbt
- „Drowning in paperwork" zu „noyade administrative" im Französischen wird — ein echter französischer Ausdruck, keine Wort-für-Wort-Übersetzung
- Deutsche den Hamster-Witz behalten, weil Hamsterrad ein echtes deutsches Idiom ist
- Brasilianer den lockeren Ton brauchen, sonst klingt es wie von einem Roboter geschrieben

Das Modell klassifiziert jeden String. UI-Labels werden direkt übersetzt. Marketing-Texte werden angepasst. Humor wird vollständig für die Zielkultur neu geschaffen.

---

## Was passiert, wenn Sie es ausführen

Richten Sie es auf Ihre Build-Ausgabe. Es klont den gesamten Dateibaum pro Sprachraum — übersetzt Textdateien, kopiert statische Assets und generiert alles für die Bereitstellung:

```
your-site/                          translations/
  index.html                          middleware.ts        ← Spracherkennung
  about.html             →            _locales.css         ← Typografie pro Schrift
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreiert
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 Zeilenhöhe
                                        css/style.css      ← kopiert
                                        js/app.js          ← kopiert
                                        images/logo.png    ← kopiert
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% Schrift
                                        ...
                                      de/
                                        ...
```

Jede HTML-Datei bekommt `lang` und `dir="rtl"` eingefügt. Jeder Sprachraum bekommt CSS mit der richtigen Schriftfamilie, Zeilenhöhe und Textrichtung. Eine Vercel-Middleware wird generiert, die `Accept-Language` liest und zur richtigen Sprache umleitet.

Auf Vercel bereitstellen. Ein Nutzer in Tokio sieht Japanisch mit Hiragino Sans bei 1.8 Zeilenhöhe. Ein Nutzer in Kairo sieht RTL-Arabisch mit Noto Naskh bei 110% Größe. Ein Nutzer in Bangkok sieht Thai mit `word-break: keep-all`, weil Thai keine Leerzeichen hat. Keine Konfiguration.

---

## 90 Sekunden, nicht 4 Wochen

```bash
# Drei Sprachen, eine JSON-Datei
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Fertig. 3 Dateien geschrieben in 9,5s

# Ihre gesamte Website, jede Sprache der Erde
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Fertig. 142 Dateien übersetzt, 284 statische Dateien kopiert in 94s
```

### In Ihrer Build-Pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Jede Bereitstellung wird in 71 Sprachen ausgeliefert. Übersetzungen sind Build-Artefakte — gecacht, nur regeneriert wenn sich die Quelle ändert.

---

## Bringen Sie Ihre eigenen Schlüssel mit oder auch nicht

```bash
# Sie haben Schlüssel — läuft lokal, Sie zahlen Ihren LLM-Anbieter direkt
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Sie haben keine Schlüssel — funktioniert einfach
# Verwendet automatisch den gehosteten Service
# Zahlen Sie per Übersetzung mit USDC via x402 — keine Anmeldung, kein Account
bunx translator-agent -s ./dist -l all
```

Derselbe Befehl. Wenn API-Schlüssel vorhanden sind, läuft es lokal mit Ihrem Anbieter. Wenn nicht, nutzt es die gehostete API und zahlt per Anfrage via [x402](https://x402.org) — das HTTP 402 Zahlungsprotokoll. Ihr Client zahlt USDC auf Base, bekommt Übersetzungen zurück. Keine Authentifizierung, keine Anbieterbeziehung, keine Rechnungen.

Unterstützt Anthropic und OpenAI. Bringen Sie jedes gewünschte Modell mit:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Jedes Schriftsystem, berücksichtigt

Das Tool übersetzt nicht nur Text — es weiß, wie jedes Schriftsystem dargestellt wird:

| Schrift | Was sich ändert | Warum |
|---|---|---|
| **Arabisch, Hebräisch, Farsi, Urdu** | `dir="rtl"`, RTL-Schriften, 110% Größe | Arabisch braucht größere Schrift für Lesbarkeit; gesamtes Layout spiegelt sich |
| **Japanisch, Chinesisch, Koreanisch** | CJK-Schriftfamilien, 1.8 Zeilenhöhe | Zeichen sind Quadrate fester Breite; brauchen vertikalen Freiraum |
| **Hindi, Bengali, Tamil, Telugu** | Indische Schriften, 1.8 Zeilenhöhe | Kopfstriche (Shirorekha) brauchen extra vertikalen Platz |
| **Thai** | `word-break: keep-all` | Keine Leerzeichen zwischen Wörtern — Browser braucht explizite Zeilenumbruch-Regeln |
| **Birmanisch** | 2.2 Zeilenhöhe | Höchste Glyphen aller großen Schriften |
| **Khmer** | 2.0 Zeilenhöhe | Subskript-Konsonanten-Cluster stapeln vertikal |

Generiertes sprachspezifisches CSS:

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

Übersetzungen sind Build-Artefakte. Zur Build-Zeit generieren, Ausgabe cachen, überspringen wenn sich die Quelle nicht geändert hat.

### Vercel

Vercel cached Build-Ausgaben automatisch. `postbuild` hinzufügen und fertig:

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

Quelle unverändert = Cache-Treffer = null LLM-Aufrufe = null Kosten.

---

## Optionen

```
Verwendung: translator-agent [Optionen]

Optionen:
  -s, --source <pfad>      Quellverzeichnis oder -datei zum Scannen
  -l, --locales <locales>  Ziel-Sprachräume, kommagetrennt oder "all" für 71 Sprachen
  -o, --output <pfad>      Ausgabeverzeichnis (Standard: "./translations")
  -p, --provider <name>    anthropic | openai (Standard: "anthropic")
  -m, --model <id>         Modell überschreiben
  -c, --concurrency <n>    max parallele LLM-Aufrufe (Standard: 10)
  --api-url <url>          Gehostete Service-URL (automatisch verwendet ohne API-Schlüssel)
```

| Erweiterung | Strategie |
|---|---|
| `.json` | Werte übersetzen, Schlüssel beibehalten |
| `.md` / `.mdx` | Text übersetzen, Syntax beibehalten |
| `.html` / `.htm` | Text übersetzen, Tags beibehalten, `lang`/`dir` einfügen |
| Alles andere | In jedes Sprachverzeichnis kopieren |

### Alle 71 Sprachräume

`-l all` deckt ~95% der Internet-Nutzer ab: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Lizenz

MIT