# translator-agent

1万ドルのローカライゼーション問題を90秒で解決。

企業はサイトのローカライゼーションのために、1単語あたり0.10〜0.25ドルを代理店に支払っています。5,000単語のサイトを10言語に翻訳すると、5,000〜12,000ドルかかり、2〜4週間の時間が必要です。見出しを1つ変更するたびに、費用は一からやり直しです。

このツールは、ビルドステップの中で一つのコマンドで71言語に対応します：

```bash
bunx translator-agent -s ./dist -l all
```

代理店も、スプレッドシートも、ベンダーロックインも、会員登録も不要。あなたのキー、あなたのビルド、あなたの言語。

> **これがその証明です。**このREADMEは`bunx translator-agent -s README.md -l all`を実行して翻訳されました。[日本語版](./translations/ja/README.md)をご覧ください。単に「the meter restarts」を翻訳するのではなく、日本のビジネス慣用句で置き換えています。[ドイツ語版](./translations/de/README.md)は30％長くなっていますが、ドイツ語は常にそうです。[アラビア語版](./translations/ar/README.md)は右から左に読みます。[ブラジルポルトガル語版](./translations/pt-BR/README.md)はブラジル人が書いたような文章になっています。なぜならそれこそが本質だからです。
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [全71言語...](./translations/)

---

## なぜこれが機能するのか

翻訳は解決済みの問題です。ローカライゼーションは違います。

Google翻訳は「Our hamsters are working on it」を日本語に変換できます。しかし、その冗談が日本では通じないことを認識し、エンジニアチームが徹夜で作業しているという、文化的に適切でかつ文脈上おもしろい表現に置き換えることはできません。

このツールは翻訳しません。**トランスクリエーション**を行います。広告代理店が市場間でキャンペーンを展開する際に5万ドルで請求するのと同じプロセスです。ただし、LLMはすでにあらゆる文化、あらゆる慣用句、あらゆる書式規則を知っています。以下のことを理解しています：

- `$49/month`は日本では`月額6,980円`になる—「$49」に円マークをつけただけではない
- 皮肉は英語では効果的だが、フォーマルな日本語では機能しない
- 「Drowning in paperwork」はフランス語で「noyade administrative」になる—実在するフランス語表現であり、直訳ではない
- ドイツ人はハムスターの冗談を維持する—Hamsterrad（ハムスターホイール）は実在するドイツ語慣用句だから
- ブラジル人にはカジュアルな文体が必要、でないとロボットが書いたように聞こえる

モデルは各文字列を分類します。UIラベルは直接翻訳されます。マーケティングコピーは適応されます。ユーモアは対象文化のために完全に再創造されます。

---

## 実行時に何が起こるか

ビルド出力を指定します。ロケールごとに完全なファイルツリーがクローンされ、テキストファイルは翻訳され、静的アセットはコピーされ、デプロイに必要なすべてが生成されます：

```
your-site/                          translations/
  index.html                          middleware.ts        ← ロケール検出
  about.html             →            _locales.css         ← 文字体系ごとのタイポグラフィ
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja"、トランスクリエーション済み
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP、1.8行間
                                        css/style.css      ← コピー済み
                                        js/app.js          ← コピー済み
                                        images/logo.png    ← コピー済み
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic、110%フォント
                                        ...
                                      de/
                                        ...
```

すべてのHTMLファイルに`lang`と`dir="rtl"`が挿入されます。すべてのロケールが正しいフォントスタック、行間、文字方向を持つCSSを取得します。`Accept-Language`を読み取って適切なロケールにリライトするVercelミドルウェアが生成されます。

Vercelにデプロイします。東京のユーザーはヒラギノサンスで1.8行間の日本語を見ます。カイロのユーザーは110%サイズのNoto NaskhでRTLアラビア語を見ます。バンコクのユーザーは、タイ語にはスペースがないため`word-break: keep-all`を持つタイ語を見ます。設定不要。

---

## 4週間ではなく90秒

```bash
# 3言語、1つのJSONファイル
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
完了。3ファイルを9.5秒で書き込み

# サイト全体、地球上のあらゆる言語
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
完了。142ファイルを翻訳、284静的ファイルを94秒でコピー
```

### ビルドパイプラインで

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

すべてのデプロイが71言語で出荷されます。翻訳はビルド成果物—キャッシュされ、ソースが変更されたときのみ再生成されます。

---

## 自分のキーを持参するか、しないか

```bash
# キーを持っている場合—ローカルで実行、LLMプロバイダーに直接支払い
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# キーを持っていない場合—そのまま動作
# ホスト型サービスを自動使用
# x402経由でUSDCで翻訳ごとに支払い—登録不要、アカウント不要
bunx translator-agent -s ./dist -l all
```

同じコマンドです。APIキーが存在する場合、あなたのプロバイダーでローカルで実行されます。そうでなければ、ホスト型APIにアクセスし、[x402](https://x402.org)経由でリクエストごとに支払います—HTTP 402支払いプロトコル。あなたのクライアントがBase上でUSDCを支払い、翻訳を受け取ります。認証なし、ベンダー関係なし、請求書なし。

AnthropicとOpenAIをサポート。お好みのモデルを持参：

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## すべての文字体系に対応

このツールはテキストを翻訳するだけでなく、各文字体系がどのようにレンダリングされるかを知っています：

| 文字体系 | 変更内容 | 理由 |
|---|---|---|
| **アラビア語、ヘブライ語、ペルシャ語、ウルドゥー語** | `dir="rtl"`、RTLフォント、110%サイズ | アラビア語は読みやすくするために大きなタイプが必要；レイアウト全体が反転 |
| **日本語、中国語、韓国語** | CJKフォントスタック、1.8行間 | 文字は固定幅の正方形；垂直方向の余白が必要 |
| **ヒンディー語、ベンガル語、タミル語、テルグ語** | インド系フォント、1.8行間 | シローレーカ（ヘッドストローク）は追加の垂直スペースが必要 |
| **タイ語** | `word-break: keep-all` | 単語間にスペースがない—ブラウザには明示的な改行ルールが必要 |
| **ビルマ語** | 2.2行間 | 主要文字体系の中で最も高いグリフ |
| **クメール語** | 2.0行間 | 下付き子音クラスターが垂直にスタック |

ロケールごとに生成されるCSS：

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

## キャッシュ

翻訳はビルド成果物です。ビルド時に生成し、出力をキャッシュし、ソースが変更されていない場合はスキップします。

### Vercel

Vercelはビルド出力を自動的にキャッシュします。`postbuild`を追加するだけで完了：

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

ソース未変更 = キャッシュヒット = LLM呼び出しゼロ = コストゼロ。

---

## オプション

```
使用方法: translator-agent [オプション]

オプション:
  -s, --source <path>      スキャンするソースディレクトリまたはファイル
  -l, --locales <locales>  ターゲットロケール、カンマ区切りまたは71言語の場合は「all」
  -o, --output <path>      出力ディレクトリ（デフォルト: "./translations"）
  -p, --provider <name>    anthropic | openai（デフォルト: "anthropic"）
  -m, --model <id>         モデルオーバーライド
  -c, --concurrency <n>    最大並列LLM呼び出し（デフォルト: 10）
  --api-url <url>          ホスト型サービスURL（APIキーが設定されていない場合に自動使用）
```

| 拡張子 | 戦略 |
|---|---|
| `.json` | 値を翻訳、キーを保持 |
| `.md` / `.mdx` | テキストを翻訳、構文を保持 |
| `.html` / `.htm` | テキストを翻訳、タグを保持、`lang`/`dir`を挿入 |
| その他すべて | 各ロケールディレクトリにコピー |

### 全71ロケール

`-l all`はインターネットユーザーの約95%をカバー：zh-CN、zh-TW、ja、ko、vi、th、id、ms、fil、my、hi、bn、ta、te、mr、gu、kn、ml、pa、ur、fa、tr、he、ar、kk、uz、fr、de、es、pt、pt-BR、it、nl、ca、gl、sv、da、no、fi、is、pl、cs、sk、hu、ro、bg、hr、sr、sl、uk、ru、lt、lv、et、el、ga、sw、am、ha、yo、zu、af、km、lo、ne、si、ka、az、mn

---

## ライセンス

MIT