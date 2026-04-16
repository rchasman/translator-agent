# translator-agent

만 달러짜리 현지화 문제, 90초 만에 해결.

기업들은 사이트 현지화에 단어당 $0.10–0.25를 대행사에 지불합니다. 5,000단어 사이트를 10개 언어로 번역하려면 $5,000–12,000이 들고 2–4주가 걸립니다. 제목 하나만 바꿔도 미터가 다시 돌아갑니다.

이 도구는 빌드 단계에서 하나의 명령어로 71개 언어로 번역합니다:

```bash
bunx translator-agent -s ./dist -l all
```

대행사도, 스프레드시트도, 벤더 종속도, 회원가입도 필요 없습니다. 당신의 키, 당신의 빌드, 당신의 언어.

> **지금 읽고 계시는 것이 바로 증거입니다.** 이 README는 `bunx translator-agent -s README.md -l all`을 실행해서 번역되었습니다. [일본어 버전](./translations/ja/README.md)을 읽어보세요 — 단순히 "the meter restarts"를 번역한 게 아니라 일본 비즈니스 관용어로 바꿨습니다. [독일어 버전](./translations/de/README.md)은 독일어가 항상 그렇듯이 30% 더 깁니다. [아랍어 버전](./translations/ar/README.md)은 오른쪽에서 왼쪽으로 읽힙니다. [브라질 포르투갈어 버전](./translations/pt-BR/README.md)은 브라질 사람이 쓴 것처럼 들립니다. 그게 바로 요점이니까요.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [전체 71개...](./translations/)

---

## 왜 이게 통하는가

번역은 해결된 문제입니다. 현지화는 그렇지 않죠.

구글 번역은 "Our hamsters are working on it"을 일본어로 바꿀 수 있습니다. 하지만 그 농담이 일본에서는 먹히지 않는다는 걸 인식하고, 엔지니어링 팀이 밤새 야근한다는 표현으로 바꾸는 것 — 문화적으로도 적절하고 맥락에서도 재밌는 — 은 할 수 없습니다.

이 도구는 번역하지 않습니다. **초월번역(transcreate)**을 합니다 — 광고 대행사들이 캠페인을 여러 시장에 맞게 적응시킬 때 5만 달러를 받고 하는 바로 그 과정 말이에요. 다만 LLM은 이미 모든 문화, 모든 관용어, 모든 형식 규칙을 알고 있습니다. 이런 것들 말이죠:

- `$49/month`는 일본에서 `월액6,980원`이 됩니다 — 엔화 기호만 붙인 "$49"가 아니라요
- 영어에서는 살리는 아이러니가 격식 있는 일본어에서는 죽어버립니다
- "Drowning in paperwork"는 프랑스어에서 "noyade administrative"가 됩니다 — 실제 프랑스 표현이지, 단어 대 단어 번역이 아니에요
- 독일인들은 햄스터 농담을 그대로 두는데, Hamsterrad(햄스터 쳇바퀴)가 실제 독일 관용어거든요
- 브라질 사람들에게는 캐주얼한 톤이 필요합니다. 안 그러면 로봇이 쓴 것 같거든요

모델이 각 문자열을 분류합니다. UI 라벨은 직접 번역하고, 마케팅 카피는 적응시키고, 유머는 대상 문화에 맞게 완전히 재창조합니다.

---

## 실행했을 때 일어나는 일

빌드 출력물을 가리키면, 로케일별로 전체 파일 트리를 복제합니다 — 텍스트 파일은 번역하고, 정적 자산은 복사하고, 배포에 필요한 모든 걸 생성합니다:

```
your-site/                          translations/
  index.html                          middleware.ts        ← 로케일 감지
  about.html             →            _locales.css         ← 스크립트별 타이포그래피
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", 초월번역됨
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 줄간격
                                        css/style.css      ← 복사됨
                                        js/app.js          ← 복사됨
                                        images/logo.png    ← 복사됨
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% 폰트
                                        ...
                                      de/
                                        ...
```

모든 HTML 파일에 `lang`과 `dir="rtl"`이 주입됩니다. 모든 로케일이 올바른 폰트 스택, 줄간격, 텍스트 방향이 적용된 CSS를 받습니다. `Accept-Language`를 읽고 적절한 로케일로 rewrite하는 Vercel 미들웨어가 생성됩니다.

Vercel에 배포하세요. 도쿄의 사용자는 Hiragino Sans에 1.8 줄간격으로 일본어를 봅니다. 카이로의 사용자는 Noto Naskh에 110% 크기로 RTL 아랍어를 봅니다. 방콕의 사용자는 태국어가 공백이 없어서 `word-break: keep-all`이 적용된 태국어를 봅니다. 설정 없이요.

---

## 4주가 아니라 90초

```bash
# 세 언어, JSON 파일 하나
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
완료. 9.5초만에 3개 파일 작성

# 전체 사이트, 지구상 모든 언어
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
완료. 94초만에 142개 파일 번역, 284개 정적 파일 복사
```

### 빌드 파이프라인에서

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

모든 배포가 71개 언어로 출시됩니다. 번역본은 빌드 아티팩트입니다 — 캐시되고, 소스가 변경될 때만 재생성됩니다.

---

## 키를 가져오거나 말거나

```bash
# 키가 있으면 — 로컬에서 실행, LLM 프로바이더에 직접 지불
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# 키가 없으면 — 그냥 작동
# 호스팅 서비스를 자동으로 사용
# x402로 USDC로 번역당 지불 — 가입도, 계정도 없이
bunx translator-agent -s ./dist -l all
```

같은 명령어입니다. API 키가 있으면 당신의 프로바이더로 로컬에서 실행합니다. 없으면 호스팅 API에 연결해서 [x402](https://x402.org)로 요청당 지불합니다 — HTTP 402 결제 프로토콜이죠. 클라이언트가 Base에서 USDC로 지불하고, 번역을 받습니다. 인증도, 벤더 관계도, 청구서도 없이요.

Anthropic과 OpenAI를 지원합니다. 원하는 모델을 가져오세요:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## 모든 문자 체계, 처리됨

이 도구는 텍스트만 번역하는 게 아니라 각 문자 체계가 어떻게 렌더링되는지 알고 있습니다:

| 문자 체계 | 바뀌는 것 | 이유 |
|---|---|---|
| **아랍어, 히브리어, 페르시아어, 우르두어** | `dir="rtl"`, RTL 폰트, 110% 크기 | 아랍어는 읽기 위해 더 큰 글자가 필요; 전체 레이아웃이 뒤바뀜 |
| **일본어, 중국어, 한국어** | CJK 폰트 스택, 1.8 줄간격 | 글자들이 고정폭 정사각형; 세로 여백이 필요 |
| **힌디어, 벵갈어, 타밀어, 텔루구어** | 인도 폰트, 1.8 줄간격 | 윗선(shirorekha)에 추가 세로 공간 필요 |
| **태국어** | `word-break: keep-all` | 단어 사이 공백 없음 — 브라우저에 명시적 줄바꿈 규칙 필요 |
| **미얀마어** | 2.2 줄간격 | 주요 문자 중 가장 높은 글리프 |
| **크메르어** | 2.0 줄간격 | 아래첨자 자음 클러스터가 세로로 쌓임 |

로케일별 생성 CSS:

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

## 캐싱

번역본은 빌드 아티팩트입니다. 빌드 시간에 생성하고, 출력을 캐시하고, 소스가 바뀌지 않았으면 건너뜁니다.

### Vercel

Vercel은 빌드 출력을 자동으로 캐시합니다. `postbuild`를 추가하면 끝:

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

소스 변경 없음 = 캐시 히트 = LLM 호출 제로 = 비용 제로.

---

## 옵션

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      스캔할 소스 디렉토리 또는 파일
  -l, --locales <locales>  대상 로케일, 쉼표로 구분하거나 71개 언어는 "all"
  -o, --output <path>      출력 디렉토리 (기본값: "./translations")
  -p, --provider <name>    anthropic | openai (기본값: "anthropic")
  -m, --model <id>         모델 오버라이드
  -c, --concurrency <n>    최대 병렬 LLM 호출 (기본값: 10)
  --api-url <url>          호스팅 서비스 URL (API 키가 없으면 자동 사용)
```

| 확장자 | 전략 |
|---|---|
| `.json` | 값 번역, 키 보존 |
| `.md` / `.mdx` | 텍스트 번역, 문법 보존 |
| `.html` / `.htm` | 텍스트 번역, 태그 보존, `lang`/`dir` 주입 |
| 그외 모든 것 | 각 로케일 디렉토리에 복사 |

### 전체 71개 로케일

`-l all`은 인터넷 사용자의 ~95%를 커버합니다: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## 라이선스

MIT