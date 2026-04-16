# translator-agent

הבעיה של ₪38,000 בלוקליזציה, נפתרת תוך 90 שניות.

חברות משלמות לסוכנויות ₪0.35–0.87 למילה כדי ללקלז את האתרים שלהן. אתר של 5,000 מילים ל-10 שפות עולה ₪19,000–45,000 ולוקח 2–4 שבועות. בכל פעם שמשנים כותרת, המד״ מתחיל מחדש.

הכלי הזה עושה את זה בפקודה אחת, ל-71 שפות, בשלב הבנייה:

```bash
bunx translator-agent -s ./dist -l all
```

בלי סוכנויות. בלי גיליונות אלקטרוניים. בלי שבי״ספק. בלי הרשמה. המפתחות שלך, הבנייה שלך, השפות שלך.

> **אתה קורא את ההוכחה.** קובץ README זה תורגם על ידי הרצת `bunx translator-agent -s README.md -l all`. לכו לקרוא את [הגרסה היפנית](./translations/ja/README.md) — זה לא רק תרגם את "המד״ מתחיל מחדש", זה החליף את זה בביטוי עסקי יפני. [הגרסה הגרמנית](./translations/de/README.md) ארוכה ב-30% כי גרמנית תמיד כזאת. [הגרסה הערבית](./translations/ar/README.md) נקראת מימין לשמאל. [הגרסה הפורטוגזית הברזילאית](./translations/pt-BR/README.md) נשמעת כמו שברזילאי כתב אותה, כי זו בדיוק הנקודה.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [כל 71...](./translations/)

---

## למה זה עובד

תרגום זו בעיה פתורה. לוקליזציה לא.

גוגל תרגום יכול להפוך "החומדנים שלנו עובדים על זה" ליפנית. מה שהוא לא יכול לעשות זה לזהות שהבדיחה לא פוגעת ביפן, ולהחליף את זה במשהו שכן — כמו לרמוז לצוות הפיתוח שמושך לילה לבן, שזה גם הולם תרבותית וגם מצחיק בהקשר.

הכלי הזה לא מתרגם. הוא **יוצר מחדש** — אותו תהליך שסוכנויות פרסום גובות עליו ₪190,000 כשהן מתאימות קמפיין לשווקים שונים. רק שה-LLM כבר מכיר כל תרבות, כל ביטוי, כל מוסכמת עיצוב. הוא יודע ש:

- `$49/month` הופך ל`₪179/חודש` בישראל — לא "$49" עם סמל שקל מוצמד
- סרקזם הורג באנגלית ומת ביפנית רשמית
- "טובע בניירת" הופך ל"noyade administrative" בצרפתית — ביטוי צרפתי אמיתי, לא תרגום מילה במילה
- גרמנים משאירים את בדיחת החומד כי Hamsterrad (גלגל חומדנים) זה ביטוי גרמני אמיתי
- ברזילאים צריכים את הרגיסטר הרגיל או שזה נשמע כמו רובוט כתב את זה

המודל מסווג כל מחרוזת. תוויות ממשק משתמש מקבלות תרגום ישיר. תוכן שיווקי מתואם. הומור נוצר מחדש לגמרי עבור התרבות היעד.

---

## מה קורה כשמפעילים את זה

מכוונים את זה לפלט הבנייה. זה משכפל את כל עץ הקבצים לכל לוקיאל — מתרגם קבצי טקסט, מעתיק נכסים סטטיים, ומייצר כל מה שצריך לפריסה:

```
your-site/                          translations/
  index.html                          middleware.ts        ← זיהוי לוקיאל
  about.html             →            _locales.css         ← טיפוגרפיה לכל כתב
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", מותאם
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, גובה שורה 1.8
                                        css/style.css      ← מועתק
                                        js/app.js          ← מועתק
                                        images/logo.png    ← מועתק
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% פונט
                                        ...
                                      de/
                                        ...
```

כל קובץ HTML מקבל `lang` ו-`dir="rtl"` מוזרק. כל לוקיאל מקבל CSS עם מחסנית הפונטים הנכונה, גובה שורה וכיוון טקסט. נוצר middleware של Vercel שקורא `Accept-Language` וכותב מחדש ללוקיאל הנכון.

פורסים לVercel. משתמש בטוקיו רואה יפנית עם Hiragino Sans בגובה שורה 1.8. משתמש בקהיר רואה ערבית RTL עם Noto Naskh בגודל 110%. משתמש בבנגקוק רואה תאילנדית עם `word-break: keep-all` כי בתאילנדית אין רווחים. בלי הגדרות.

---

## 90 שניות, לא 4 שבועות

```bash
# שלוש שפות, קובץ JSON אחד
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
בוצע. 3 קבצים נכתבו תוך 9.5 שניות

# כל האתר שלכם, כל שפה על כדור הארץ
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
בוצע. 142 קבצים תורגמו, 284 קבצים סטטיים הועתקו תוך 94 שניות
```

### בצינור הבנייה שלכם

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

כל פריסה נשלחת ב-71 שפות. תרגומים הם חפצי בנייה — נשמרים במטמון, נוצרים מחדש רק כשהמקור משתנה.

---

## להביא את המפתחות שלכם או לא

```bash
# יש לכם מפתחות — רץ מקומית, אתם משלמים לספק ה-LLM ישירות
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# אין לכם מפתחות — פשוט עובד
# אוטומטית משתמש בשירות המתארח
# משלמים לכל תרגום עם USDC דרך x402 — בלי הרשמה, בלי חשבון
bunx translator-agent -s ./dist -l all
```

אותה פקודה. אם מפתחות API קיימים, זה רץ מקומית עם הספק שלכם. אם לא, זה מגיע ל-API המתארח ומשלם לכל בקשה דרך [x402](https://x402.org) — פרוטוקול התשלום HTTP 402. הלקוח שלכם משלם USDC על Base, מקבל תרגומים בחזרה. בלי אימות, בלי מערכת יחסים עם ספק, בלי חשבוניות.

תומך ב-Anthropic ו-OpenAI. תביאו איזה מודל שאתם רוצים:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## כל מערכת כתב, מטופלת

הכלי לא רק מתרגם טקסט — הוא יודע איך כל מערכת כתיבה מתרנדרת:

| כתב | מה משתנה | למה |
|---|---|---|
| **ערבית, עברית, פרסית, אורדו** | `dir="rtl"`, פונטים RTL, גודל 110% | ערבית צריכה טייפ גדול יותר כדי להיות קריאה; כל הפריסה מתהפכת |
| **יפנית, סינית, קוריאנית** | מחסניות פונט CJK, גובה שורה 1.8 | תווים הם ריבועים ברוחב קבוע; צריכים מרווח נשימה אנכי |
| **הינדי, בנגלית, טמילית, טלוגו** | פונטים הודיים, גובה שורה 1.8 | קוי ראש (shirorekha) צריכים מקום אנכי נוסף |
| **תאילנדית** | `word-break: keep-all` | אין רווחים בין מילים — הדפדפן צריך כללי שבירת שורה מפורשים |
| **בורמזית** | גובה שורה 2.2 | הגליפים הגבוהים ביותר של כל כתב מרכזי |
| **חמר** | גובה שורה 2.0 | צבירי עיצורים תת־כתוביים מסתדרים אנכית |

CSS נוצר לכל לוקיאל:

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

## מטמון

תרגומים הם חפצי בנייה. יוצרים בזמן בנייה, שומרים את הפלט במטמון, מדלגים כשהמקור לא השתנה.

### Vercel

Vercel שומר פלט בנייה במטמון אוטומטית. מוסיפים `postbuild` וזהו:

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

מקור לא השתנה = פגיעה במטמון = אפס קריאות LLM = אפס עלות.

---

## אפשרויות

```
שימוש: translator-agent [אפשרויות]

אפשרויות:
  -s, --source <path>      ספריית מקור או קובץ לסריקה
  -l, --locales <locales>  לוקיאלים יעד, מופרדים בפסיק או "all" ל-71 שפות
  -o, --output <path>      ספריית פלט (ברירת מחדל: "./translations")
  -p, --provider <name>    anthropic | openai (ברירת מחדל: "anthropic")
  -m, --model <id>         דריסת מודל
  -c, --concurrency <n>    מקסימום קריאות LLM במקביל (ברירת מחדל: 10)
  --api-url <url>          URL שירות מתארח (משמש אוטומטית כשאין מפתחות API)
```

| סיומת | אסטרטגיה |
|---|---|
| `.json` | תרגם ערכים, שמור מפתחות |
| `.md` / `.mdx` | תרגם טקסט, שמור תחביר |
| `.html` / `.htm` | תרגם טקסט, שמור תגים, הזרק `lang`/`dir` |
| כל השאר | העתק לכל ספריית לוקיאל |

### כל 71 הלוקיאלים

`-l all` מכסה ~95% ממשתמשי האינטרנט: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## רישיון

MIT