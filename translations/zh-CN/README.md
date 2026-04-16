# translator-agent

价值一万美元的本地化问题，90秒内搞定。

公司付给代理商每字0.10-0.25美元来本地化网站。一个5000字的网站本地化到10种语言需要5000-12000美元，耗时2-4周。每次修改标题，计费器都会重新开始。

这个工具用一条命令就能搞定，支持71种语言，在构建过程中完成：

```bash
bunx translator-agent -s ./dist -l all
```

不需要代理。不需要电子表格。不会被供应商绑架。不需要注册。你的密钥，你的构建，你的语言。

> **你看到的就是证明。** 这份README通过运行`bunx translator-agent -s README.md -l all`进行翻译。去看看[日语版本](./translations/ja/README.md)——它不是简单翻译"计费器重启"，而是用日式商业用语来表达。[德语版本](./translations/de/README.md)比原版长30%，因为德语就是这样。[阿拉伯语版本](./translations/ar/README.md)是从右到左阅读的。[巴西葡萄牙语版本](./translations/pt-BR/README.md)听起来像巴西人写的，这就是重点。
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [全部71种...](./translations/)

---

## 为什么有效

翻译是已解决的问题。本地化不是。

Google翻译能把"我们的仓鼠正在处理"翻译成日语。但它做不到的是识别这个笑话在日本行不通，并替换成行得通的东西——比如说工程团队熬夜加班，这既符合文化又有趣。

这个工具不翻译。它**转创**——广告公司在跨市场改编营销活动时收费5万美元的同一个过程。只不过LLM已经了解每种文化、每个习语、每种格式规范。它知道：

- `$49/month`在日本变成`月額6,980円`——而不是简单在"$49"后面加个日元符号
- 讽刺在英语中很棒，在正式的日语中就死了
- "文件堆积如山"在法语中变成"noyade administrative"——一个真正的法语表达，而不是逐词翻译
- 德国人保留仓鼠笑话，因为Hamsterrad（仓鼠轮）是真正的德语习语
- 巴西人需要随意的语调，否则听起来像机器人写的

模型对每个字符串进行分类。UI标签直接翻译。营销文案进行改编。幽默为目标文化完全重新创作。

---

## 运行时发生什么

指向你的构建输出。它为每个语言环境克隆整个文件树——翻译文本文件，复制静态资源，生成部署所需的一切：

```
your-site/                          translations/
  index.html                          middleware.ts        ← 语言环境检测
  about.html             →            _locales.css         ← 每种文字的字体
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja"，转创内容
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP，1.8行高
                                        css/style.css      ← 复制
                                        js/app.js          ← 复制
                                        images/logo.png    ← 复制
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic，110%字体
                                        ...
                                      de/
                                        ...
```

每个HTML文件都会注入`lang`和`dir="rtl"`。每个语言环境都有正确字体栈、行高和文本方向的CSS。生成的Vercel中间件读取`Accept-Language`并重写到正确的语言环境。

部署到Vercel。东京用户看到1.8行高的Hiragino Sans日语。开罗用户看到110%大小的RTL阿拉伯语Noto Naskh。曼谷用户看到带有`word-break: keep-all`的泰语，因为泰语没有空格。无需配置。

---

## 90秒，不是4周

```bash
# 三种语言，一个JSON文件
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
完成。3个文件在9.5秒内写入

# 整个网站，地球上每种语言
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
完成。142个文件翻译，284个静态文件在94秒内复制
```

### 在构建管道中

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

每次部署都支持71种语言。翻译是构建产物——缓存，仅在源代码更改时重新生成。

---

## 使用你自己的密钥或不用

```bash
# 你有密钥——本地运行，直接付费给LLM提供商
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# 你没有密钥——直接可用
# 自动使用托管服务
# 通过x402用USDC按翻译付费——无需注册，无需账户
bunx translator-agent -s ./dist -l all
```

相同命令。如果有API密钥，它与你的提供商本地运行。如果没有，它访问托管API并通过[x402](https://x402.org)按请求付费——HTTP 402支付协议。你的客户端在Base上支付USDC，获得翻译。无需认证，无需供应商关系，无需发票。

支持Anthropic和OpenAI。使用你想要的任何模型：

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## 每种文字系统，都能处理

工具不只是翻译文本——它了解每种书写系统如何渲染：

| 文字 | 变化内容 | 原因 |
|---|---|---|
| **阿拉伯语、希伯来语、波斯语、乌尔都语** | `dir="rtl"`，RTL字体，110%大小 | 阿拉伯语需要更大字体才清晰；整个布局镜像 |
| **日语、中文、韩语** | CJK字体栈，1.8行高 | 字符是固定宽度方块；需要垂直间距 |
| **印地语、孟加拉语、泰米尔语、泰卢固语** | 印度文字字体，1.8行高 | 顶部笔画需要额外垂直空间 |
| **泰语** | `word-break: keep-all` | 词间无空格——浏览器需要明确的换行规则 |
| **缅甸语** | 2.2行高 | 所有主要文字中最高的字形 |
| **高棉语** | 2.0行高 | 下标辅音群垂直堆叠 |

生成的每语言环境CSS：

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

## 缓存

翻译是构建产物。构建时生成，缓存输出，源代码未更改时跳过。

### Vercel

Vercel自动缓存构建输出。添加`postbuild`就完成了：

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

源代码未更改 = 缓存命中 = 零LLM调用 = 零成本。

---

## 选项

```
用法: translator-agent [选项]

选项:
  -s, --source <path>      要扫描的源目录或文件
  -l, --locales <locales>  目标语言环境，逗号分隔或"all"表示71种语言
  -o, --output <path>      输出目录 (默认: "./translations")
  -p, --provider <name>    anthropic | openai (默认: "anthropic")
  -m, --model <id>         模型覆盖
  -c, --concurrency <n>    最大并行LLM调用数 (默认: 10)
  --api-url <url>          托管服务URL (未设置API密钥时自动使用)
```

| 扩展名 | 策略 |
|---|---|
| `.json` | 翻译值，保留键 |
| `.md` / `.mdx` | 翻译文本，保留语法 |
| `.html` / `.htm` | 翻译文本，保留标签，注入`lang`/`dir` |
| 其他所有文件 | 复制到每个语言环境目录 |

### 全部71个语言环境

`-l all`覆盖约95%的互联网用户：zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## 许可证

MIT