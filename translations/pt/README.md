# translator-agent

O problema de localização de R$ 50.000 resolvido em 90 segundos.

Empresas pagam para agências R$ 0,50–1,25 por palavra para localizar seus sites. Um site de 5.000 palavras em 10 idiomas custa R$ 25.000–60.000 e demora de 2 a 4 semanas. Toda vez que você muda um título, o cronômetro zera.

Esta ferramenta faz isso com um comando, em 71 idiomas, durante o seu build:

```bash
bunx translator-agent -s ./dist -l all
```

Sem agência. Sem planilhas. Sem prisão tecnológica. Sem cadastro. Suas chaves, seu build, seus idiomas.

> **Você está lendo a prova.** Este README foi traduzido executando `bunx translator-agent -s README.md -l all`. Vá ler a [versão japonesa](./translations/ja/README.md) — ela não apenas traduziu "o cronômetro zera", mas substituiu por um idioma empresarial japonês. A [versão alemã](./translations/de/README.md) é 30% mais longa porque alemão sempre é. A [versão árabe](./translations/ar/README.md) lê da direita para esquerda. A [versão em português brasileiro](./translations/pt-BR/README.md) soa como se um brasileiro tivesse escrito, porque esse é o ponto.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [todos os 71...](./translations/)

---

## Por que funciona

Tradução é um problema resolvido. Localização não é.

Google Translate consegue transformar "Nossos hamsters estão trabalhando nisso" em japonês. O que ele não consegue fazer é reconhecer que a piada não cola no Japão, e substituí-la por algo que funcione — como referenciar a equipe de engenharia puxando uma virada, que é culturalmente apropriado e engraçado no contexto.

Esta ferramenta não traduz. Ela **transcria** — o mesmo processo pelo qual agências de publicidade cobram R$ 250.000 para adaptar uma campanha entre mercados. Só que o LLM já conhece toda cultura, todo idioma, toda convenção de formatação. Ele sabe que:

- `R$ 49/mês` vira `月額6,980円` no Japão — não "R$ 49" com um símbolo de yen colado
- Sarcasmo mata em inglês e morre em japonês formal
- "Afogado em papelada" vira "noyade administrative" em francês — uma expressão francesa real, não uma tradução palavra por palavra
- Alemães mantêm a piada do hamster porque Hamsterrad (roda de hamster) é um idioma alemão real
- Brasileiros precisam do registro casual ou soa como se um robô tivesse escrito

O modelo classifica cada string. Labels de UI recebem tradução direta. Copy de marketing é adaptado. Humor é totalmente recriado para a cultura alvo.

---

## O que acontece quando você executa

Aponte para seu output de build. Ele clona toda a árvore de arquivos por locale — traduzindo arquivos de texto, copiando assets estáticos, e gerando tudo que precisa para deploy:

```
your-site/                          translations/
  index.html                          middleware.ts        ← detecção de locale
  about.html             →            _locales.css         ← tipografia por script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcriado
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, altura de linha 1.8
                                        css/style.css      ← copiado
                                        js/app.js          ← copiado
                                        images/logo.png    ← copiado
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, fonte 110%
                                        ...
                                      de/
                                        ...
```

Todo arquivo HTML recebe `lang` e `dir="rtl"` injetados. Todo locale recebe CSS com a pilha de fontes correta, altura de linha, e direção de texto. Um middleware Vercel é gerado que lê `Accept-Language` e reescreve para o locale certo.

Faça deploy na Vercel. Um usuário em Tóquio vê japonês com Hiragino Sans em altura de linha 1.8. Um usuário no Cairo vê árabe RTL com Noto Naskh em tamanho 110%. Um usuário em Bangkok vê tailandês com `word-break: keep-all` porque tailandês não tem espaços. Sem config.

---

## 90 segundos, não 4 semanas

```bash
# Três idiomas, um arquivo JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Pronto. 3 arquivos escritos em 9.5s

# Seu site inteiro, todos os idiomas do mundo
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

Todo deploy sai em 71 idiomas. Traduções são artefatos de build — cacheados, regenerados apenas quando a fonte muda.

---

## Traga suas próprias chaves ou não

```bash
# Você tem chaves — roda local, você paga seu provedor de LLM diretamente
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Você não tem chaves — simplesmente funciona
# Usa automaticamente o serviço hospedado
# Pague por tradução com USDC via x402 — sem cadastro, sem conta
bunx translator-agent -s ./dist -l all
```

Mesmo comando. Se chaves de API estiverem presentes, roda local com seu provedor. Se não, acessa a API hospedada e paga por requisição via [x402](https://x402.org) — o protocolo de pagamento HTTP 402. Seu cliente paga USDC na Base, recebe traduções de volta. Sem auth, sem relacionamento com vendor, sem notas fiscais.

Suporta Anthropic e OpenAI. Traga qualquer modelo que quiser:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Todo sistema de escrita, tratado

A ferramenta não apenas traduz texto — ela sabe como cada sistema de escrita renderiza:

| Script | O que muda | Por quê |
|---|---|---|
| **Árabe, Hebraico, Farsi, Urdu** | `dir="rtl"`, fontes RTL, tamanho 110% | Árabe precisa de tipo maior para ser legível; layout inteiro espelha |
| **Japonês, Chinês, Coreano** | Pilhas de fonte CJK, altura de linha 1.8 | Caracteres são quadrados de largura fixa; precisam de espaço vertical |
| **Hindi, Bengali, Tamil, Telugu** | Fontes índicas, altura de linha 1.8 | Traços superiores (shirorekha) precisam de espaço vertical extra |
| **Tailandês** | `word-break: keep-all` | Sem espaços entre palavras — o navegador precisa de regras explícitas de quebra de linha |
| **Birmanês** | Altura de linha 2.2 | Glifos mais altos de qualquer script maior |
| **Khmer** | Altura de linha 2.0 | Clusters de consoantes subscritas empilham verticalmente |

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

Traduções são artefatos de build. Gere no tempo de build, cache a saída, pule quando a fonte não mudou.

### Vercel

Vercel cacheia saída de build automaticamente. Adicione `postbuild` e pronto:

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
  -l, --locales <locales>  locales alvo, separados por vírgula ou "all" para 71 idiomas
  -o, --output <path>      diretório de saída (padrão: "./translations")
  -p, --provider <name>    anthropic | openai (padrão: "anthropic")
  -m, --model <id>         substituição de modelo
  -c, --concurrency <n>    máximo de chamadas LLM paralelas (padrão: 10)
  --api-url <url>          URL do serviço hospedado (auto-usado quando sem chaves API)
```

| Extensão | Estratégia |
|---|---|
| `.json` | Traduz valores, preserva chaves |
| `.md` / `.mdx` | Traduz texto, preserva sintaxe |
| `.html` / `.htm` | Traduz texto, preserva tags, injeta `lang`/`dir` |
| Todo o resto | Copia para cada diretório de locale |

### Todos os 71 locales

`-l all` cobre ~95% dos usuários da internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licença

MIT