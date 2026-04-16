# translator-agent

1万ドルのローカリゼーション課題を90秒で解決。

企業は代理店に単語あたり0.10〜0.25ドルを支払ってサイトをローカライズしています。5,000語のサイトを10言語に展開するには5,000〜12,000ドルのコストと2〜4週間の時間がかかります。見出しを一度変更するたびに、また一からやり直しです。

このツールは、ビルド時にワンコマンドで71言語に対応します：

```bash
bunx translator-agent -s ./dist -l all
```

代理店不要。スプレッドシート不要。ベンダーロックイン不要。サインアップ不要。あなたのキー、あなたのビルド、あなたの言語。

> **これがその証明です。** このREADMEは `bunx translator-agent -s README.md -l all` を実行して翻訳されました。[日本語版](./translations/ja/README.md)をご覧ください — 単に「the meter restarts」を翻訳するのではなく、日本のビジネス慣用句に置き換えています。[ドイツ語版](./translations/de/README.md)はドイツ語らしく30%長くなっています。[アラビア語版](./translations/ar/README.md)は右から左に読みます。[ブラジルポルトガル語版](./translations/pt-BR/README.md)はブラジル人が書いたような自然さです。それがポイントなのです。
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [全71言語...](./translations/)

---

## なぜ効果的なのか

翻訳は解決済みの問題です。ローカリゼーションは違います。

Google翻訳は「Our hamsters are working on it」を日本語にすることはできます。しかし、その冗談が日本では通じないことを認識し、文化的に適切で文脈上面白い「エンジニアチームが徹夜で対応中」のような表現に置き換えることはできません。

このツールは翻訳ではありません。**トランスクリエーション**を行います — 広告代理店が複数市場にキャンペーンを展開する際に5万ドルを請求するのと同じプロセスです。ただし、LLMはすでにあらゆる文化、あらゆる慣用句、あらゆる書式規則を知っています。以下のことを理解しています：

- `$49/month` は日本では `月額6,980円` になります — 円マークを付けた「$49」ではありません
- 皮肉は英語では効果的ですが、フォーマルな日本語では通じません
- 「Drowning in paperwork」はフランス語で「noyade administrative」になります — 逐語訳ではなく、実際のフランス語表現です
- ドイツ人はハムスターのジョークを残します。Hamsterrad（ハムスターの回し車）は実際のドイツ語慣用句だからです
- ブラジル人にはカジュアルな表現が必要です。そうしないとロボットが書いたように聞こえます

モデルは各文字列を分類します。UIラベルは直接翻訳。マーケティングコピーは適応。ユーモアは対象文化に合わせて完全に再構築されます。

---

## 実行時の動作

ビルド出力を指定すると、ロケールごとにファイルツリー全体を複製し — テキストファイルを翻訳し、静的アセットをコピーし、デプロイに必要なすべてを生成します：

```
your-site/                          translations/
  index.html                          middleware.ts        ← ロケール検出
  about.html             →            _locales.css         ← スクリプトごとのタイポグラフィ
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

すべてのHTMLファイルに `lang` と `dir="rtl"` が注入されます。すべてのロケールに正しいフォントスタック、行間、テキスト方向のCSSが生成されます。`Accept-Language` を読み取って適切なロケールにリライトするVercelミドルウェアが生成されます。

Vercelにデプロイします。東京のユーザーには1.8行間のヒラギノサンスで日本語が表示されます。カイロのユーザーには110%サイズのNoto NaskhでRTLアラビア語が表示されます。バンコクのユーザーには、スペースがないため `word-break: keep-all` のタイ語が表示されます。設定は不要です。

---

## 4週間ではなく90秒

```bash
# 3言語、1つのJSONファイル
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
完了。9.5秒で3ファイルを作成

# サイト全体、地球上のすべての言語
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
完了。94秒で142ファイルを翻訳、284の静的ファイルをコピー
```

### ビルドパイプライン内で

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

すべてのデプロイが71言語で配信されます。翻訳はビルド成果物として — キャッシュされ、ソースが変更された時のみ再生成されます。

---

## キーを持参するか、しないか

```bash
# キーをお持ちの場合 — ローカルで実行、LLMプロバイダーに直接支払い
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# キーをお持ちでない場合 — そのまま動作
# 自動的にホストされたサービスを使用
# x402経由でUSDCで翻訳ごとに支払い — サインアップ、アカウント不要
bunx translator-agent -s ./dist -l all
```

同じコマンドです。APIキーがあればお使いのプロバイダーでローカル実行。なければホストされたAPIにアクセスし、[x402](https://x402.org) — HTTP 402ペイメントプロトコル経由でリクエストごとに支払い。クライアントはBase上でUSDCを支払い、翻訳結果を受け取ります。認証、ベンダー関係、請求書は不要です。

AnthropicとOpenAIをサポート。お好みのモデルをご利用ください：

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## すべての文字体系に対応

このツールはテキストを翻訳するだけでなく、各文字体系のレンダリング方法を理解しています：

| 文字体系 | 変更内容 | 理由 |
|---|---|---|
| **アラビア語、ヘブライ語、ペルシア語、ウルドゥー語** | `dir="rtl"`、RTLフォント、110%サイズ | アラビア語は判読性のためにより大きな文字が必要；レイアウト全体が反転 |
| **日本語、中国語、韓国語** | CJKフォントスタック、1.8行間 | 文字は固定幅の正方形；縦の余白が必要 |
| **ヒンディー語、ベンガル語、タミル語、テルグ語** | インド系フォント、1.8行間 | ヘッドストローク（シロレーカ）には縦の余白が必要 |
| **タイ語** | `word-break: keep-all` | 単語間にスペースなし — ブラウザに明示的な改行ルールが必要 |
| **ビルマ語** | 2.2行間 | 主要文字体系の中で最も高いグリフ |
| **クメール語** | 2.0行間 | 下付き子音クラスターが縦に重なる |

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

Vercelはビルド出力を自動的にキャッシュします。`postbuild` を追加するだけです：

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
使用法: translator-agent [options]

オプション:
  -s, --source <path>      スキャンするソースディレクトリまたはファイル
  -l, --locales <locales>  対象ロケール、カンマ区切りまたは71言語の場合は"all"
  -o, --output <path>      出力ディレクトリ（デフォルト: "./translations"）
  -p, --provider <name>    anthropic | openai（デフォルト: "anthropic"）
  -m, --model <id>         モデルオーバーライド
  -c, --concurrency <n>    最大並列LLM呼び出し数（デフォルト: 10）
  --api-url <url>          ホストされたサービスURL（APIキー未設定時に自動使用）
```

| 拡張子 | 戦略 |
|---|---|
| `.json` | 値を翻訳、キーを保持 |
| `.md` / `.mdx` | テキストを翻訳、構文を保持 |
| `.html` / `.htm` | テキストを翻訳、タグを保持、`lang`/`dir`を注入 |
| その他すべて | 各ロケールディレクトリにコピー |

### 全71ロケール

`-l all` はインターネットユーザーの約95%をカバーします：zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## ライセンス

MIT