# translator-agent

一萬美元的在地化問題，90 秒內解決。

企業支付代理商每字 NT$3–7.5 來在地化網站。一個 5,000 字的網站翻譯成 10 種語言需要 NT$150,000–360,000，耗時 2–4 週。每次你改個標題，計費器就重新開始跳。

這個工具在建構階段用一個指令就能完成，支援 71 種語言：

```bash
bunx translator-agent -s ./dist -l all
```

不用代理商。不用試算表。不會被供應商綁架。不用註冊。你的金鑰，你的建構，你的語言。

> **你正在看證明。** 這個 README 就是執行 `bunx translator-agent -s README.md -l all` 翻譯的。去看看[日文版本](./translations/ja/README.md) — 它不只是翻譯「計費器重新開始跳」，而是換成了日文的商業慣用語。[德文版本](./translations/de/README.md)長了 30% 因為德文向來如此。[阿拉伯文版本](./translations/ar/README.md)從右到左閱讀。[巴西葡萄牙文版本](./translations/pt-BR/README.md)聽起來像巴西人寫的，因為這就是重點。
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [全部 71 種...](./translations/)

---

## 為什麼這個有效

翻譯是已解決的問題。在地化不是。

Google 翻譯能把「我們的倉鼠正在處理中」翻成日文。它做不到的是意識到這個笑話在日本不好笑，然後換成真正好笑的 — 比如提到工程團隊熬夜趕工，這在文化上合適而且在語境中很幽默。

這個工具不翻譯。它**轉創** — 廣告公司在跨市場調整行銷活動時收費 NT$1,500,000 的同樣流程。差別在於大型語言模型已經知道每種文化、每個慣用語、每種格式慣例。它知道：

- `$49/month` 在日本變成 `月額6,980円` — 不是「$49」貼個日圓符號
- 諷刺在英文中管用，在正式日文中完蛋
- 「Drowning in paperwork」在法文變成「noyade administrative」— 真正的法文表達，不是逐字翻譯
- 德國人保留倉鼠笑話，因為 Hamsterrad（倉鼠輪）是真正的德文慣用語
- 巴西人需要隨性語調，否則聽起來像機器人寫的

模型會分類每個字串。介面標籤直接翻譯。行銷文案調整適應。幽默完全重新為目標文化創造。

---

## 執行時會發生什麼

指向你的建構輸出。它會為每個語系複製整個檔案樹 — 翻譯文字檔案、複製靜態資源，並產生部署所需的一切：

```
your-site/                          translations/
  index.html                          middleware.ts        ← 語系偵測
  about.html             →            _locales.css         ← 每種文字的版型設計
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja"，轉創內容
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP，1.8 行距
                                        css/style.css      ← 複製
                                        js/app.js          ← 複製
                                        images/logo.png    ← 複製
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic，110% 字體
                                        ...
                                      de/
                                        ...
```

每個 HTML 檔案都會注入 `lang` 和 `dir="rtl"`。每個語系都有正確字體堆疊、行距和文字方向的 CSS。還會產生讀取 `Accept-Language` 並重寫到正確語系的 Vercel 中介軟體。

部署到 Vercel。東京使用者看到行距 1.8 的 Hiragino Sans 日文。開羅使用者看到 110% 大小的 Noto Naskh RTL 阿拉伯文。曼谷使用者看到有 `word-break: keep-all` 的泰文，因為泰文沒有空格。無需設定。

---

## 90 秒，不是 4 週

```bash
# 三種語言，一個 JSON 檔案
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
完成。3 個檔案在 9.5 秒內寫入

# 你的整個網站，地球上每種語言
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
完成。142 個檔案翻譯，284 個靜態檔案在 94 秒內複製
```

### 在你的建構管道中

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

每次部署都支援 71 種語言。翻譯是建構產物 — 快取，只在來源變更時重新產生。

---

## 帶自己的金鑰或不帶

```bash
# 你有金鑰 — 本地執行，直接付費給你的 LLM 供應商
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# 你沒有金鑰 — 直接可用
# 自動使用託管服務
# 透過 x402 用 USDC 按翻譯付費 — 無需註冊，無需帳號
bunx translator-agent -s ./dist -l all
```

同樣的指令。如果有 API 金鑰，就用你的供應商本地執行。如果沒有，就連接託管 API 並透過 [x402](https://x402.org) 按請求付費 — HTTP 402 付款協定。你的客戶端在 Base 上支付 USDC，取回翻譯。無需驗證，無需供應商關係，無需發票。

支援 Anthropic 和 OpenAI。帶任何你要的模型：

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## 每種文字系統，都處理

這個工具不只翻譯文字 — 它知道每種文字系統如何渲染：

| 文字 | 什麼改變 | 為什麼 |
|---|---|---|
| **阿拉伯文、希伯來文、波斯文、烏爾都文** | `dir="rtl"`，RTL 字體，110% 大小 | 阿拉伯文需要更大字體才清晰；整個版面鏡像 |
| **日文、中文、韓文** | CJK 字體堆疊，1.8 行距 | 字元是定寬方塊；需要垂直呼吸空間 |
| **印地文、孟加拉文、坦米爾文、泰盧固文** | 印度字體，1.8 行距 | 字頭線（shirorekha）需要額外垂直空間 |
| **泰文** | `word-break: keep-all` | 單字間沒有空格 — 瀏覽器需要明確換行規則 |
| **緬甸文** | 2.2 行距 | 所有主要文字中最高的字形 |
| **高棉文** | 2.0 行距 | 子字母組合垂直堆疊 |

產生的每語系 CSS：

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

## 快取

翻譯是建構產物。建構時產生，快取輸出，來源未變更時跳過。

### Vercel

Vercel 自動快取建構輸出。加上 `postbuild` 就完成了：

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

來源未變更 = 快取命中 = 零 LLM 呼叫 = 零成本。

---

## 選項

```
用法: translator-agent [options]

選項:
  -s, --source <path>      要掃描的來源目錄或檔案
  -l, --locales <locales>  目標語系，逗號分隔或 "all" 表示 71 種語言
  -o, --output <path>      輸出目錄 (預設: "./translations")
  -p, --provider <name>    anthropic | openai (預設: "anthropic")
  -m, --model <id>         模型覆寫
  -c, --concurrency <n>    最大平行 LLM 呼叫數 (預設: 10)
  --api-url <url>          託管服務 URL (未設定 API 金鑰時自動使用)
```

| 副檔名 | 策略 |
|---|---|
| `.json` | 翻譯值，保留鍵 |
| `.md` / `.mdx` | 翻譯文字，保留語法 |
| `.html` / `.htm` | 翻譯文字，保留標籤，注入 `lang`/`dir` |
| 其他一切 | 複製到每個語系目錄 |

### 全部 71 種語系

`-l all` 涵蓋約 95% 的網路使用者：zh-CN、zh-TW、ja、ko、vi、th、id、ms、fil、my、hi、bn、ta、te、mr、gu、kn、ml、pa、ur、fa、tr、he、ar、kk、uz、fr、de、es、pt、pt-BR、it、nl、ca、gl、sv、da、no、fi、is、pl、cs、sk、hu、ro、bg、hr、sr、sl、uk、ru、lt、lv、et、el、ga、sw、am、ha、yo、zu、af、km、lo、ne、si、ka、az、mn

---

## 授權

MIT