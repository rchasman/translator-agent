# translator-agent

1만 달러짜리 현지화 문제를 90초 만에 해결합니다.

기업들은 웹사이트 현지화를 위해 에이전시에 단어당 0.10~0.25달러를 지불합니다. 5,000단어 사이트를 10개 언어로 번역하는데 5,000~12,000달러의 비용과 2~4주의 시간이 걸립니다. 제목 하나만 바꿔도 요금 측정기가 다시 돌아갑니다.

이 도구는 빌드 단계에서 한 번의 명령으로 71개 언어로 번역해냅니다:

```bash
bunx translator-agent -s ./dist -l all
```

에이전시도, 스프레드시트도, 벤더 종속도, 회원가입도 필요 없습니다. 당신의 키, 당신의 빌드, 당신의 언어.

> **지금 읽고 있는 것이 바로 증거입니다.** 이 README는 `bunx translator-agent -s README.md -l all`을 실행해서 번역되었습니다. [일본어 버전](./translations/ja/README.md)을 읽어보세요 — 단순히 "요금 측정기가 다시 돌아갑니다"를 번역한 것이 아니라, 일본 비즈니스 관용구로 바꿨습니다. [독일어 버전](./translations/de/README.md)은 30% 더 깁니다. 독일어는 원래 그렇거든요. [아랍어 버전](./translations/ar/README.md)은 오른쪽에서 왼쪽으로 읽힙니다. [브라질 포르투갈어 버전](./translations/pt-BR/README.md)은 브라질 사람이 쓴 것처럼 들립니다. 그게 바로 포인트니까요.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [전체 71개...](./translations/)

---

## 이게 왜 통하는가

번역은 이미 해결된 문제입니다. 현지화는 아니죠.

구글 번역은 "저희 햄스터들이 작업 중입니다"를 일본어로 바꿀 수 있습니다. 하지만 그 농담이 일본에서 먹히지 않는다는 걸 인식하고, 대신 엔지니어링 팀이 밤샘 작업한다는 식으로 — 문화적으로도 적절하고 맥락상 재밌는 — 표현으로 바꾸지는 못합니다.

이 도구는 번역하지 않습니다. **트랜스크리에이션**을 합니다 — 광고 에이전시가 캠페인을 여러 시장에 맞게 조정할 때 5만 달러를 받는 바로 그 과정 말이죠. 다만 LLM은 이미 모든 문화, 모든 관용구, 모든 서식 규칙을 알고 있습니다. 이런 것들을요:

- `$49/month`가 일본에서는 `월액6,980원` — 엔 기호만 갖다 붙인 "$49"가 아니라
- 영어에서는 죽이는 빈정거림이 정중한 일본어에서는 죽어버린다는 것
- "서류 더미에 파묻혀 있다"가 프랑스어로는 "noyade administrative" — 단어별 번역이 아닌 진짜 프랑스 표현
- 독일인들은 햄스터 농담을 그대로 쓴다는 것. Hamsterrad(햄스터 쳇바퀴)가 진짜 독일 관용구니까
- 브라질 사람들에게는 캐주얼한 톤이 필요하다는 것. 안 그러면 로봇이 쓴 것 같거든요

모델이 각 문자열을 분류합니다. UI 라벨은 직역하고, 마케팅 카피는 적응시키고, 유머는 목표 문화에 맞게 완전히 재창조합니다.

---

## 실행하면 무슨 일이 일어나는가

빌드 출력물을 가리키면 됩니다. 로케일별로 전체 파일 트리를 복사해서 — 텍스트 파일은 번역하고, 정적 자산은 복사하고, 배포에 필요한 모든 것을 생성합니다:

```
your-site/                          translations/
  index.html                          middleware.ts        ← 로케일 감지
  about.html             →            _locales.css         ← 문자별 타이포그래피
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", 트랜스크리에이션됨
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 줄 간격
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

모든 HTML 파일에 `lang`과 `dir="rtl"`이 삽입됩니다. 모든 로케일이 올바른 폰트 스택, 줄 간격, 텍스트 방향의 CSS를 갖게 됩니다. `Accept-Language`를 읽어서 알맞은 로케일로 리라이트하는 Vercel 미들웨어가 생성됩니다.

Vercel에 배포하세요. 도쿄의 사용자는 Hiragino Sans를 1.8 줄 간격으로 본 일본어를 보고, 카이로의 사용자는 Noto Naskh를 110% 크기로 본 RTL 아랍어를, 방콕의 사용자는 `word-break: keep-all`이 적용된 태국어를 봅니다. 태국어는 띄어쓰기가 없거든요. 설정 필요 없음.

---

## 4주가 아닌 90초

```bash
# 세 개 언어, 하나의 JSON 파일
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
완료. 3개 파일이 9.5초 만에 작성됨

# 당신의 전체 사이트, 지구상 모든 언어
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
완료. 142개 파일 번역, 284개 정적 파일 복사 94초 만에 완료
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

모든 배포가 71개 언어로 출시됩니다. 번역은 빌드 결과물입니다 — 캐시되고, 소스가 변경될 때만 재생성됩니다.

---

## 키를 갖고 오든 말든

```bash
# 키가 있으면 — 로컬에서 실행, LLM 제공업체에 직접 지불
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# 키가 없으면 — 그냥 작동함
# 호스팅 서비스를 자동으로 사용
# x402를 통해 USDC로 번역당 지불 — 가입 없음, 계정 없음
bunx translator-agent -s ./dist -l all
```

같은 명령어입니다. API 키가 있으면 당신의 제공업체로 로컬에서 실행됩니다. 없으면 호스팅 API를 사용해서 [x402](https://x402.org) — HTTP 402 결제 프로토콜을 통해 요청당 지불합니다. 클라이언트가 Base에서 USDC를 지불하고 번역을 받아옵니다. 인증도, 벤더 관계도, 인보이스도 없음.

Anthropic과 OpenAI를 지원합니다. 원하는 모델을 가져오세요:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## 모든 문자 체계 처리

이 도구는 텍스트를 번역하는 것만이 아닙니다 — 각 문자 체계가 어떻게 렌더링되는지 알고 있습니다:

| 문자 체계 | 변화하는 것 | 이유 |
|---|---|---|
| **아랍어, 히브리어, 페르시아어, 우르두어** | `dir="rtl"`, RTL 폰트, 110% 크기 | 아랍어는 읽을 수 있으려면 더 큰 타입이 필요; 전체 레이아웃이 미러됨 |
| **일본어, 중국어, 한국어** | CJK 폰트 스택, 1.8 줄 간격 | 글자가 고정폭 사각형; 세로 여백이 필요 |
| **힌디어, 벵골어, 타밀어, 텔루구어** | 인도계 폰트, 1.8 줄 간격 | 머리획(시로레카)이 추가 세로 공간 필요 |
| **태국어** | `word-break: keep-all` | 단어 사이 띄어쓰기 없음 — 브라우저에 명시적 줄바꿈 규칙 필요 |
| **미얀마어** | 2.2 줄 간격 | 주요 문자 체계 중 가장 높은 글리프 |
| **크메르어** | 2.0 줄 간격 | 서브스크립트 자음 클러스터가 세로로 쌓임 |

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

번역은 빌드 결과물입니다. 빌드 시점에 생성하고, 출력물을 캐시하고, 소스가 바뀌지 않았을 때는 건너뜁니다.

### Vercel

Vercel은 빌드 출력물을 자동으로 캐시합니다. `postbuild`만 추가하면 끝:

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
사용법: translator-agent [옵션]

옵션:
  -s, --source <경로>      스캔할 소스 디렉터리나 파일
  -l, --locales <로케일>   목표 로케일, 쉼표로 구분하거나 "all"로 71개 언어
  -o, --output <경로>      출력 디렉터리 (기본값: "./translations")
  -p, --provider <이름>    anthropic | openai (기본값: "anthropic")
  -m, --model <id>         모델 오버라이드
  -c, --concurrency <n>    최대 병렬 LLM 호출 (기본값: 10)
  --api-url <url>          호스팅 서비스 URL (API 키가 설정되지 않았을 때 자동 사용)
```

| 확장자 | 전략 |
|---|---|
| `.json` | 값 번역, 키 보존 |
| `.md` / `.mdx` | 텍스트 번역, 구문 보존 |
| `.html` / `.htm` | 텍스트 번역, 태그 보존, `lang`/`dir` 삽입 |
| 나머지 | 각 로케일 디렉터리에 복사 |

### 전체 71개 로케일

`-l all`은 인터넷 사용자의 ~95%를 커버합니다: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## 라이선스

MIT