# translator-agent

O problema de localização de R$ 50.000, resolvido em 90 segundos.

Empresas pagam para agências R$ 0,50–1,25 por palavra para localizar seus sites. Um site de 5.000 palavras para 10 idiomas custa R$ 25.000–60.000 e leva 2–4 semanas. Toda vez que você muda um título, o cronômetro zera.

Esta ferramenta faz isso em um comando, para 71 idiomas, durante o seu build:

```bash
bunx translator-agent -s ./dist -l all
```

Sem agência. Sem planilhas. Sem vendor lock-in. Sem cadastro. Suas chaves, seu build, seus idiomas.

> **Você está lendo a prova.** Este README foi traduzido rodando `bunx translator-agent -s README.md -l all`. Vai ler a [versão japonesa](./translations/ja/README.md) — ela não só traduziu "o cronômetro zera", ela substituiu por um idioma empresarial japonês. A [versão alemã](./translations/de/README.md) é 30% mais longa porque alemão sempre é. A [versão árabe](./translations/ar/README.md) lê da direita para esquerda. A [versão brasileira](./translations/pt-BR/README.md) soa como se um brasileiro escreveu, porque esse é o ponto.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [todos os 71...](./translations/)

---

## Por que isso funciona

Tradução é um problema resolvido. Localização não é.

O Google Translate consegue transformar "Nossos hamsters estão trabalhando nisso" em japonês. O que ele não consegue fazer é reconhecer que a piada não funciona no Japão, e trocar por algo que funciona — tipo referenciar a equipe de engenharia virando a madrugada, que é tanto culturalmente apropriado quanto engraçado no contexto.

Esta ferramenta não traduz. Ela **transcria** — o mesmo processo que agências de publicidade cobram R$ 250.000 para adaptar uma campanha entre mercados. Só que a LLM já conhece todas as culturas, todos os idiomas, todas as convenções de formatação. Ela sabe que:

- `R$ 49/mês` vira `月額6,980円` no Japão — não "R$ 49" com um símbolo de iene colado
- Sarcasmo mata em inglês e morre em japonês formal
- "Drowning in paperwork" vira "noyade administrative" em francês — uma expressão francesa real, não tradução palavra por palavra
- Alemães mantêm a piada do hamster porque Hamsterrad (roda de hamster) é um idioma alemão de verdade
- Brasileiros precisam do registro casual ou soa que foi um robô que escreveu

O modelo classifica cada string. Labels de UI ganham tradução direta. Copy de marketing é adaptado. Humor é completamente recriado para a cultura de destino.

---

## O que acontece quando você roda

Aponte para o output do seu build. Ele clona a árvore inteira de arquivos por locale — traduzindo arquivos de texto, copiando assets estáticos, e gerando tudo que precisa para deploy:

```
seu-site/                           translations/
  index.html                          middleware.ts        ← detecção de locale
  about.html             →            _locales.css         ← tipografia por script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcriado
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

Todo arquivo HTML ganha `lang` e `dir="rtl"` injetados. Todo locale ganha CSS com o font stack correto, line-height, e direção de texto. Um middleware do Vercel é gerado que lê `Accept-Language` e redireciona para o locale certo.

Faz deploy no Vercel. Um usuário em Tóquio vê japonês com Hiragino Sans a 1.8 line-height. Um usuário no Cairo vê árabe RTL com Noto Naskh a 110% de tamanho. Um usuário em Bangkok vê tailandês com `word-break: keep-all` porque tailandês não tem espaços. Zero config.

---

## 90 segundos, não 4 semanas

```bash
# Três idiomas, um arquivo JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Pronto. 3 arquivos escritos em 9.5s

# Seu site inteiro, todos os idiomas da terra
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Pronto. 142 arquivos traduzidos, 284 arquivos estáticos copiados em 94s
```

### No seu pipeline de build

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Todo deploy sai em 71 idiomas. Traduções são artefatos de build — cachados, regenerados só quando a fonte muda.

---

## Traga suas próprias chaves ou não

```bash
# Você tem chaves — roda local, você paga direto pro provedor LLM
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Você não tem chaves — simplesmente funciona
# Usa automaticamente o serviço hospedado
# Paga por tradução com USDC via x402 — sem cadastro, sem conta
bunx translator-agent -s ./dist -l all
```

Mesmo comando. Se as chaves de API estão presentes, roda local com seu provedor. Se não, bate na API hospedada e paga por request via [x402](https://x402.org) — o protocolo de pagamento HTTP 402. Seu cliente paga USDC na Base, recebe traduções de volta. Sem auth, sem relacionamento com vendor, sem faturas.

Suporta Anthropic e OpenAI. Traga qualquer modelo que quiser:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Todos os sistemas de escrita, tratados

A ferramenta não só traduz texto — ela sabe como cada sistema de escrita renderiza:

| Script | O que muda | Por quê |
|---|---|---|
| **Árabe, Hebraico, Farsi, Urdu** | `dir="rtl"`, fontes RTL, 110% de tamanho | Árabe precisa de tipo maior para ser legível; layout inteiro espelha |
| **Japonês, Chinês, Coreano** | Font stacks CJK, 1.8 line-height | Caracteres são quadrados de largura fixa; precisam de respiro vertical |
| **Hindi, Bengali, Tamil, Telugu** | Fontes índicas, 1.8 line-height | Traços superiores (shirorekha) precisam de espaço vertical extra |
| **Tailandês** | `word-break: keep-all` | Sem espaços entre palavras — o navegador precisa de regras explícitas de quebra de linha |
| **Birmanês** | 2.2 line-height | Glifos mais altos de qualquer script principal |
| **Khmer** | 2.0 line-height | Clusters de consoantes subscritas empilham verticalmente |

CSS gerado por locale:

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

## Cache

Traduções são artefatos de build. Gere em build time, faça cache do output, pule quando a fonte não mudou.

### Vercel

O Vercel faz cache do output de build automaticamente. Adicione `postbuild` e pronto:

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

Fonte inalterada = cache hit = zero chamadas LLM = zero custo.

---

## Opções

```
Uso: translator-agent [opções]

Opções:
  -s, --source <path>      diretório ou arquivo fonte para escanear
  -l, --locales <locales>  locales de destino, separados por vírgula ou "all" para 71 idiomas
  -o, --output <path>      diretório de output (padrão: "./translations")
  -p, --provider <name>    anthropic | openai (padrão: "anthropic")
  -m, --model <id>         override do modelo
  -c, --concurrency <n>    máx chamadas LLM paralelas (padrão: 10)
  --api-url <url>          URL do serviço hospedado (auto-usado quando sem chaves API)
```

| Extensão | Estratégia |
|---|---|
| `.json` | Traduzir valores, preservar chaves |
| `.md` / `.mdx` | Traduzir texto, preservar sintaxe |
| `.html` / `.htm` | Traduzir texto, preservar tags, injetar `lang`/`dir` |
| Todo o resto | Copiar para cada diretório de locale |

### Todos os 71 locales

`-l all` cobre ~95% dos usuários de internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licença

MIT