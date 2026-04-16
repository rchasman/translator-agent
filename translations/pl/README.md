# translator-agent

Problem lokalizacji za 40 000 zł rozwiązany w 90 sekund.

Firmy płacą agencjom 0,40–1,00 zł za słowo za lokalizację stron. Strona z 5 000 słów w 10 językach kosztuje 20 000–50 000 zł i zajmuje 2–4 tygodnie. Za każdym razem, gdy zmienisz nagłówek, licznik zaczyna odliczanie od nowa.

To narzędzie robi to jedną komendą, na 71 języków, podczas procesu budowania:

```bash
bunx translator-agent -s ./dist -l all
```

Bez agencji. Bez arkuszy kalkulacyjnych. Bez uzależnienia od dostawcy. Bez rejestracji. Twoje klucze, twoja kompilacja, twoje języki.

> **Czytasz właśnie dowód.** Ten README został przetłumaczony przez uruchomienie `bunx translator-agent -s README.md -l all`. Przeczytaj [wersję japońską](./translations/ja/README.md) — nie tylko przetłumaczyła „licznik zaczyna odliczanie od nowa", ale zastąpiła to japońskim idiomem biznesowym. [Wersja niemiecka](./translations/de/README.md) jest o 30% dłuższa, bo niemecki zawsze taki jest. [Wersja arabska](./translations/ar/README.md) czyta się z prawa na lewo. [Wersja brazylijsko-portugalska](./translations/pt-BR/README.md) brzmi jak napisał ją Brazylijczyk, bo o to właśnie chodzi.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [wszystkie 71...](./translations/)

---

## Dlaczego to działa

Tłumaczenie to problem rozwiązany. Lokalizacja już nie.

Google Tłumacz potrafi zamienić „Nasze chomiki nad tym pracują" na japoński. Czego nie potrafi, to rozpoznać, że żart nie wypali w Japonii, i zastąpić go czymś, co wypali — jak nawiązanie do zespołu inżynierów pracującego całą noc, co jest kulturowo odpowiednie i zabawne w kontekście.

To narzędzie nie tłumaczy. Ono **transkreuje** — ten sam proces, za który agencje reklamowe pobierają 200 000 zł przy adaptacji kampanii na różne rynki. Tyle że LLM już zna każdą kulturę, każdy idiom, każdą konwencję formatowania. Wie, że:

- `49 zł/miesiąc` staje się `月額6,980円` w Japonii — nie „49 zł" z dolepionym symbolem jena
- Sarkazm zabija po angielsku i umiera w oficjalnej japońszczyźnie
- „Tonąć w papierach" staje się „noyade administrative" po francusku — prawdziwe francuskie wyrażenie, nie tłumaczenie słowo w słowo
- Niemcy zachowują żart o chomikach, bo Hamsterrad (kołowrotek dla chomika) to prawdziwy niemiecki idiom
- Brazylijczycy potrzebują nieformalnego rejestru, bo inaczej brzmi jak robot to napisał

Model klasyfikuje każdy ciąg. Etykiety interfejsu dostają bezpośrednie tłumaczenie. Teksty marketingowe są adaptowane. Humor jest kompletnie odtwarzany dla kultury docelowej.

---

## Co się dzieje, gdy to uruchomisz

Wskaż na swój wynik kompilacji. Klonuje całe drzewo plików na każdą lokalizację — tłumacząc pliki tekstowe, kopiując zasoby statyczne i generując wszystko potrzebne do wdrożenia:

```
twoja-strona/                       translations/
  index.html                          middleware.ts        ← wykrywanie lokalizacji
  about.html             →            _locales.css         ← typografia na pismo
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transkreacja
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 wysokość linii
                                        css/style.css      ← skopiowane
                                        js/app.js          ← skopiowane
                                        images/logo.png    ← skopiowane
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% czcionki
                                        ...
                                      de/
                                        ...
```

Każdy plik HTML dostaje wstrzyknięte `lang` i `dir="rtl"`. Każda lokalizacja dostaje CSS z właściwym stosem czcionek, wysokością linii i kierunkiem tekstu. Generuje się middleware Vercel, który czyta `Accept-Language` i przekierowuje do właściwej lokalizacji.

Wdróż na Vercel. Użytkownik w Tokio widzi japoński z Hiragino Sans o wysokości linii 1.8. Użytkownik w Kairze widzi arabski RTL z Noto Naskh o rozmiarze 110%. Użytkownik w Bangkoku widzi tajski z `word-break: keep-all`, bo tajski nie ma spacji. Bez konfiguracji.

---

## 90 sekund, nie 4 tygodnie

```bash
# Trzy języki, jeden plik JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Gotowe. 3 pliki zapisane w 9,5s

# Cała twoja strona, każdy język na ziemi
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Gotowe. 142 pliki przetłumaczone, 284 pliki statyczne skopiowane w 94s
```

### W twoim pipeline'ie kompilacji

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Każde wdrożenie wysyła się w 71 językach. Tłumaczenia to artefakty kompilacji — cache'owane, regenerowane tylko gdy zmienia się źródło.

---

## Przynieś swoje klucze albo nie

```bash
# Masz klucze — działa lokalnie, płacisz bezpośrednio swojemu dostawcy LLM
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Nie masz kluczy — po prostu działa
# Automatycznie używa usługi hostowanej
# Płać za tłumaczenie przez USDC via x402 — bez rejestracji, bez konta
bunx translator-agent -s ./dist -l all
```

Ta sama komenda. Jeśli klucze API są obecne, działa lokalnie z twoim dostawcą. Jeśli nie, odpytuje hostowane API i płaci za żądanie przez [x402](https://x402.org) — protokół płatności HTTP 402. Twój klient płaci USDC na Base, dostaje z powrotem tłumaczenia. Bez autoryzacji, bez relacji z dostawcą, bez faktur.

Obsługuje Anthropic i OpenAI. Przynieś jaki chcesz model:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Każdy system pisma, obsłużony

Narzędzie nie tylko tłumaczy tekst — wie, jak renderuje się każdy system pisma:

| Pismo | Co się zmienia | Dlaczego |
|---|---|---|
| **Arabski, hebrajski, perski, urdu** | `dir="rtl"`, czcionki RTL, 110% rozmiaru | Arabski potrzebuje większej czcionki żeby być czytelny; cały układ się odbija |
| **Japoński, chiński, koreański** | Stosy czcionek CJK, wysokość linii 1.8 | Znaki to kwadraty o stałej szerokości; potrzebują pionowego oddechu |
| **Hindi, bengalski, tamilski, telugu** | Czcionki indyjskie, wysokość linii 1.8 | Górne kreski (shirorekha) potrzebują dodatkowej przestrzeni pionowej |
| **Tajski** | `word-break: keep-all` | Brak spacji między słowami — przeglądarka potrzebuje jawnych reguł łamania linii |
| **Birmański** | Wysokość linii 2.2 | Najwyższe glify ze wszystkich głównych pism |
| **Khmerski** | Wysokość linii 2.0 | Klastry spółgłosek podpisanych układają się pionowo |

Generowany CSS na lokalizację:

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

## Cache'owanie

Tłumaczenia to artefakty kompilacji. Generuj w czasie kompilacji, cache'uj wynik, pomijaj gdy źródło się nie zmieniło.

### Vercel

Vercel cache'uje wynik kompilacji automatycznie. Dodaj `postbuild` i gotowe:

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

Źródło niezmienione = trafienie cache'u = zero wywołań LLM = zero kosztów.

---

## Opcje

```
Użycie: translator-agent [opcje]

Opcje:
  -s, --source <ścieżka>      katalog lub plik źródłowy do skanowania
  -l, --locales <lokalizacje> lokalizacje docelowe, oddzielone przecinkami lub "all" dla 71 języków
  -o, --output <ścieżka>      katalog wyjściowy (domyślnie: "./translations")
  -p, --provider <nazwa>      anthropic | openai (domyślnie: "anthropic")
  -m, --model <id>            przesłonięcie modelu
  -c, --concurrency <n>       max równoległych wywołań LLM (domyślnie: 10)
  --api-url <url>             URL usługi hostowanej (auto-używane gdy brak kluczy API)
```

| Rozszerzenie | Strategia |
|---|---|
| `.json` | Tłumacz wartości, zachowaj klucze |
| `.md` / `.mdx` | Tłumacz tekst, zachowaj składnię |
| `.html` / `.htm` | Tłumacz tekst, zachowaj tagi, wstrzyknij `lang`/`dir` |
| Wszystko inne | Kopiuj do każdego katalogu lokalizacji |

### Wszystkie 71 lokalizacji

`-l all` pokrywa ~95% użytkowników internetu: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licencja

MIT