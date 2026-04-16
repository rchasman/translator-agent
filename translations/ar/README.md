# translator-agent

مشكلة التوطين الـ $10,000 ، محلولة في 90 ثانية.

تدفع الشركات للوكالات ما بين $0.10-0.25 لكل كلمة لتوطين مواقعها. موقع من 5,000 كلمة إلى 10 لغات يكلف $5,000-12,000 ويستغرق 2-4 أسابيع. كلما غيّرت عنواناً، تبدأ الساعة من الصفر.

تفعل هذه الأداة نفس العمل في أمر واحد، إلى 71 لغة، أثناء مرحلة البناء:

```bash
bunx translator-agent -s ./dist -l all
```

لا وكالة. لا جداول بيانات. لا قيود تقنية. لا تسجيل. مفاتيحك، بناؤك، لغاتك.

> **أنت تقرأ الدليل.** هذا الملف التمهيدي تُرجم بتشغيل `bunx translator-agent -s README.md -l all`. اذهب واقرأ [النسخة اليابانية](./translations/ja/README.md) — لم تترجم فقط "تبدأ الساعة من الصفر"، بل استبدلتها بتعبير أعمال ياباني. [النسخة الألمانية](./translations/de/README.md) أطول بـ 30% لأن الألمانية كذلك دائماً. [النسخة العربية](./translations/ar/README.md) تُقرأ من اليمين إلى اليسار. [نسخة البرتغالية البرازيلية](./translations/pt-BR/README.md) تبدو وكأن برازيلياً كتبها، لأن هذه هي النقطة.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [جميع الـ 71...](./translations/)

---

## لماذا يعمل هذا

الترجمة مشكلة محلولة. التوطين ليس كذلك.

يمكن لـ Google Translate تحويل "همسترنا يعملون عليها" إلى اليابانية. ما لا يستطيع فعله هو إدراك أن النكتة لا تنطبق في اليابان، واستبدالها بشيء مناسب — مثل الإشارة إلى فريق الهندسة الذي يسهر طوال الليل، وهو أمر مناسب ثقافياً ومضحك في السياق.

هذه الأداة لا تترجم. إنها **تعيد الإبداع** — نفس العملية التي تتقاضى عنها وكالات الإعلان $50,000 عند تكييف حملة عبر الأسواق. إلا أن نموذج اللغة الكبير يعرف بالفعل كل ثقافة، كل تعبير، كل قاعدة تنسيق. يعرف أن:

- `$49/month` تصبح `月額6,980円` في اليابان — وليس "$49" مع رمز الين مُلصق عليها
- السخرية تنجح في الإنجليزية وتموت في اليابانية الرسمية
- "يغرق في الأعمال الورقية" يصبح "noyade administrative" بالفرنسية — تعبير فرنسي حقيقي، وليس ترجمة حرفية
- الألمان يحتفظون بنكتة الهامستر لأن Hamsterrad (عجلة الهامستر) تعبير ألماني حقيقي
- البرازيليون يحتاجون أسلوباً غير رسمي وإلا ستبدو وكأن روبوت كتبها

النموذج يصنّف كل نص. عناوين واجهة المستخدم تحصل على ترجمة مباشرة. النصوص التسويقية تُكيّف. الفكاهة تُعاد صياغتها بالكامل للثقافة المستهدفة.

---

## ما يحدث عند تشغيلها

وجّهها نحو مخرجات البناء. تستنسخ شجرة الملفات كاملة لكل لغة — تترجم الملفات النصية، تنسخ الأصول الثابتة، وتولّد كل ما يحتاج للنشر:

```
your-site/                          translations/
  index.html                          middleware.ts        ← كشف اللغة
  about.html             →            _locales.css         ← خط لكل كتابة
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja"، معاد الإبداع
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP، ارتفاع سطر 1.8
                                        css/style.css      ← منسوخ
                                        js/app.js          ← منسوخ
                                        images/logo.png    ← منسوخ
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic، خط 110%
                                        ...
                                      de/
                                        ...
```

كل ملف HTML يحصل على `lang` و `dir="rtl"` مُضافين. كل لغة تحصل على CSS مع مجموعة الخطوط الصحيحة، ارتفاع السطر، واتجاه النص. يُولّد Vercel middleware الذي يقرأ `Accept-Language` ويعيد التوجيه للغة الصحيحة.

انشر على Vercel. مستخدم في طوكيو يرى اليابانية مع Hiragino Sans بارتفاع سطر 1.8. مستخدم في القاهرة يرى العربية من اليمين لليسار مع Noto Naskh بحجم 110%. مستخدم في بانكوك يرى التايلاندية مع `word-break: keep-all` لأن التايلاندية لا تحتوي مسافات. بدون إعدادات.

---

## 90 ثانية، وليس 4 أسابيع

```bash
# ثلاث لغات، ملف JSON واحد
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
تم. 3 ملفات كُتبت في 9.5 ثانية

# موقعك كاملاً، كل لغة على الأرض
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
تم. 142 ملفاً تُرجم، 284 ملفاً ثابتاً نُسخ في 94 ثانية
```

### في خط أنابيب البناء

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

كل نشر يُشحن بـ 71 لغة. الترجمات هي نواتج بناء — مخبئة، تُولّد فقط عند تغيير المصدر.

---

## أحضر مفاتيحك أو لا تفعل

```bash
# لديك مفاتيح — تعمل محلياً، تدفع لمزود نموذج اللغة مباشرة
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# ليس لديك مفاتيح — تعمل مباشرة
# تستخدم تلقائياً الخدمة المستضافة
# ادفع لكل ترجمة بـ USDC عبر x402 — بدون تسجيل، بدون حساب
bunx translator-agent -s ./dist -l all
```

نفس الأمر. إذا كانت مفاتيح API موجودة، تعمل محلياً مع مزودك. إذا لم تكن، تضرب hosted API وتدفع لكل طلب عبر [x402](https://x402.org) — بروتوكول دفع HTTP 402. عميلك يدفع USDC على Base، يحصل على ترجمات. بدون مصادقة، بدون علاقة بائع، بدون فواتير.

يدعم Anthropic و OpenAI. أحضر أي نموذج تريده:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## كل نظام كتابة، مُعالج

الأداة لا تترجم النص فقط — تعرف كيف يُعرض كل نظام كتابة:

| الكتابة | ما يتغير | لماذا |
|---|---|---|
| **العربية، العبرية، الفارسية، الأردية** | `dir="rtl"`، خطوط RTL، حجم 110% | العربية تحتاج نوع أكبر لتكون واضحة؛ التخطيط كاملاً ينعكس |
| **اليابانية، الصينية، الكورية** | مجموعات خطوط CJK، ارتفاع سطر 1.8 | الأحرف مربعات ثابتة العرض؛ تحتاج مساحة تنفس عمودية |
| **الهندية، البنغالية، التاميلية، التيلوغو** | خطوط هندية، ارتفاع سطر 1.8 | الخطوط العلوية (shirorekha) تحتاج مساحة عمودية إضافية |
| **التايلاندية** | `word-break: keep-all` | لا مسافات بين الكلمات — المتصفح يحتاج قواعد كسر سطر صريحة |
| **البورمية** | ارتفاع سطر 2.2 | أطول أحرف في أي كتابة رئيسية |
| **الخمير** | ارتفاع سطر 2.0 | مجموعات الحروف الساكنة المنخفضة تتراكم عمودياً |

CSS مُولّد لكل لغة:

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

## التخزين المؤقت

الترجمات هي نواتج بناء. تُولّد في وقت البناء، تُخبّأ المخرجات، تُتجاهل عندما لا يتغير المصدر.

### Vercel

Vercel يخبّئ مخرجات البناء تلقائياً. أضف `postbuild` وانتهيت:

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

المصدر لم يتغير = إصابة تخزين مؤقت = صفر استدعاءات LLM = صفر تكلفة.

---

## الخيارات

```
الاستخدام: translator-agent [options]

الخيارات:
  -s, --source <path>      دليل أو ملف المصدر للمسح
  -l, --locales <locales>  اللغات المستهدفة، مفصولة بفواصل أو "all" لـ 71 لغة
  -o, --output <path>      دليل المخرجات (افتراضي: "./translations")
  -p, --provider <name>    anthropic | openai (افتراضي: "anthropic")
  -m, --model <id>         تجاوز النموذج
  -c, --concurrency <n>    أقصى استدعاءات LLM متوازية (افتراضي: 10)
  --api-url <url>          رابط الخدمة المستضافة (يُستخدم تلقائياً عند عدم وجود مفاتيح API)
```

| الامتداد | الاستراتيجية |
|---|---|
| `.json` | ترجمة القيم، حفظ المفاتيح |
| `.md` / `.mdx` | ترجمة النص، حفظ التركيب |
| `.html` / `.htm` | ترجمة النص، حفظ العلامات، حقن `lang`/`dir` |
| كل شيء آخر | نسخ إلى دليل كل لغة |

### جميع اللغات الـ 71

`-l all` تغطي ~95% من مستخدمي الإنترنت: zh-CN، zh-TW، ja، ko، vi، th، id، ms، fil، my، hi، bn، ta، te، mr، gu، kn، ml، pa، ur، fa، tr، he، ar، kk، uz، fr، de، es، pt، pt-BR، it، nl، ca، gl، sv، da، no، fi، is، pl، cs، sk، hu، ro، bg، hr، sr، sl، uk، ru، lt، lv، et، el، ga، sw، am، ha، yo، zu، af، km، lo، ne، si، ka، az، mn

---

## الرخصة

MIT