# translator-agent

O problema de US$ 10 mil de localização, resolvido em 90 segundos.

As empresas pagam às agências R$ 0,50 a R$ 1,25 por palavra para localizar seus sites. Um site de 5 mil palavras para 10 idiomas custa R$ 25 mil a R$ 60 mil e leva de 2 a 4 semanas. Toda vez que você muda um título, o cronômetro zera.

Esta ferramenta faz isso em um comando, para 71 idiomas, durante a sua build:

```bash
bunx translator-agent -s ./dist -l all
```

Sem agência. Sem planilhas. Sem dependência de fornecedor. Sem cadastro. Suas chaves, sua build, seus idiomas.

> **Você está lendo a prova.** Este README foi traduzido rodando `bunx translator-agent -s README.md -l all`. Vá ler a [versão japonesa](./translations/ja/README.md) — ela não apenas traduziu "o cronômetro zera", mas substituiu por uma expressão empresarial japonesa. A [versão alemã](./translations/de/README.md) é 30% maior porque alemão sempre é. A [versão árabe](./translations/ar/README.md) lê da direita para esquerda. A [versão portuguesa brasileira](./translations/pt-BR/README.md) soa como se um brasileiro tivesse escrito, porque essa é a ideia.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [todos os 71...](./translations/)

---

## Por que isso funciona

Tradução é um problema resolvido. Localização não é.

O Google Translate consegue transformar "Nossos hamsters estão trabalhando nisso" em japonês. O que ele não consegue é reconhecer que a piada não cola no Japão, e substituir por algo que funciona — tipo referenciar a equipe de engenharia fazendo uma virada, que é tanto culturalmente apropriado quanto engraçado no contexto.

Esta ferramenta não traduz. Ela **recria** — o mesmo processo que agências de publicidade cobram R$ 250 mil para adaptar campanhas entre mercados. Só que o LLM já sabe todas as culturas, expressões idiomáticas e convenções de formatação. Ele sabe que:

- `$49/month` vira `月額6.980円` no Japão — não "$49" com um símbolo de iene enfiado
- Sarcasmo mata em inglês e morre em japonês formal
- "Afogando em papelada" vira "noyade administrative" em francês — uma expressão francesa real, não tradução palavra por palavra
- Alemães mantêm a piada do hamster porque Hamsterrad (roda de hamster) é uma expressão alemã de verdade
- Brasileiros precisam do registro casual ou soa como se um robô tivesse escrito

O modelo classifica cada string. Labels de UI levam tradução direta. Textos de marketing são adaptados. Humor é totalmente recriado para a cultura de destino.

---

## O que acontece quando você roda

Aponte para sua build. Ele clona toda a árvore de arquivos por localidade — traduzindo arquivos de texto, copiando assets estáticos e gerando tudo o que é necessário para deploy:

```
seu-site/                           translations/
  index.html                          middleware.ts        ← detecção de localidade
  about.html             →            _locales.css         ← tipografia por script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", recriado
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, altura 1.8
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

Todo arquivo HTML recebe `lang` e `dir="rtl"` injetado. Toda localidade ganha CSS com a pilha de fontes correta, altura de linha e direção do texto. Um middleware do Vercel é gerado que lê `Accept-Language` e reescreve para a localidade certa.

Deploy no Vercel. Um usuário em Tóquio vê japonês com Hiragino Sans em altura 1.8. Um usuário no Cairo vê árabe RTL com Noto Naskh em tamanho 110%. Um usuário em Bangkok vê tailandês com `word-break: keep-all` porque tailandês não tem espaços. Sem configuração.

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

Todo deploy sai em 71 idiomas. Traduções são artefatos de build — cacheados, regenerados apenas quando o source muda.

---

## Traga suas próprias chaves ou não

```bash
# Você tem chaves — roda local, você paga seu provedor de LLM diretamente
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Você não tem chaves — só funciona
# Automaticamente usa o serviço hospedado
# Pague por tradução com USDC via x402 — sem cadastro, sem conta
bunx translator-agent -s ./dist -l all
```

Mesmo comando. Se chaves de API estão presentes, roda local com seu provedor. Se não, bate na API hospedada e paga por request via [x402](https://x402.org) — o protocolo HTTP 402 de pagamento. Seu cliente paga USDC na Base, recebe traduções de volta. Sem auth, sem relacionamento com fornecedor, sem faturas.

Suporta Anthropic e OpenAI. Traga qualquer modelo que quiser:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Todos os sistemas de escrita, tratados

A ferramenta não só traduz texto — ela sabe como cada sistema de escrita renderiza:

| Script | O que muda | Por quê |
|---|---|---|
| **Árabe, Hebraico, Farsi, Urdu** | `dir="rtl"`, fontes RTL, tamanho 110% | Árabe precisa de tipo maior para ser legível; layout inteiro espelha |
| **Japonês, Chinês, Coreano** | Pilhas de fontes CJK, altura 1.8 | Caracteres são quadrados de largura fixa; precisam de respiração vertical |
| **Hindi, Bengali, Tamil, Telugu** | Fontes índicas, altura 1.8 | Traços superiores (shirorekha) precisam de espaço vertical extra |
| **Tailandês** | `word-break: keep-all` | Sem espaços entre palavras — o browser precisa de regras de quebra de linha explícitas |
| **Birmanês** | Altura 2.2 | Glifos mais altos de qualquer script principal |
| **Khmer** | Altura 2.0 | Clusters de consoantes subscritas empilham verticalmente |

CSS gerado por localidade:

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

Traduções são artefatos de build. Gere no build time, cache a saída, pule quando o source não mudou.

### Vercel

Vercel cacheia saída de build automaticamente. Adicione `postbuild` e você terminou:

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

Source inalterado = hit de cache = zero chamadas de LLM = zero custo.

---

## Opções

```
Uso: translator-agent [opções]

Opções:
  -s, --source <caminho>      diretório ou arquivo fonte para escanear
  -l, --locales <localidades> localidades de destino, separadas por vírgula ou "all" para 71 idiomas
  -o, --output <caminho>      diretório de saída (padrão: "./translations")
  -p, --provider <nome>       anthropic | openai (padrão: "anthropic")
  -m, --model <id>            sobrescrita do modelo
  -c, --concurrency <n>       máx chamadas paralelas de LLM (padrão: 10)
  --api-url <url>             URL do serviço hospedado (auto-usada quando sem chaves API)
```

| Extensão | Estratégia |
|---|---|
| `.json` | Traduz valores, preserva chaves |
| `.md` / `.mdx` | Traduz texto, preserva sintaxe |
| `.html` / `.htm` | Traduz texto, preserva tags, injeta `lang`/`dir` |
| Todo o resto | Copia para cada diretório de localidade |

### Todas as 71 localidades

`-l all` cobre ~95% dos usuários de internet: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licença

MIT