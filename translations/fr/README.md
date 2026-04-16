# translator-agent

Le problème de localisation à 10 000 $, résolu en 90 secondes.

Les entreprises paient aux agences 0,10–0,25 € par mot pour localiser leurs sites. Un site de 5 000 mots en 10 langues coûte 4 500–11 000 € et prend 2 à 4 semaines. Chaque fois que vous changez un titre, le compteur repart à zéro.

Cet outil le fait en une commande, en 71 langues, pendant votre étape de build :

```bash
bunx translator-agent -s ./dist -l all
```

Pas d'agence. Pas de tableurs. Pas d'enfermement propriétaire. Pas d'inscription. Vos clés, votre build, vos langues.

> **Vous en lisez la preuve.** Ce README a été traduit en lançant `bunx translator-agent -s README.md -l all`. Allez lire la [version japonaise](./translations/ja/README.md) — elle n'a pas juste traduit "le compteur repart à zéro", elle l'a remplacé par une expression commerciale japonaise. La [version allemande](./translations/de/README.md) est 30 % plus longue parce que c'est toujours le cas en allemand. La [version arabe](./translations/ar/README.md) se lit de droite à gauche. La [version portugaise du Brésil](./translations/pt-BR/README.md) sonne comme si un Brésilien l'avait écrite, et c'est exactement le but.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [toutes les 71...](./translations/)

---

## Pourquoi ça marche

La traduction est un problème résolu. Pas la localisation.

Google Translate peut transformer "Nos hamsters bossent dessus" en japonais. Ce qu'il ne peut pas faire, c'est reconnaître que la blague ne fonctionne pas au Japon, et la remplacer par quelque chose qui marche — comme faire référence à l'équipe technique qui fait une nuit blanche, ce qui est à la fois culturellement approprié et drôle dans ce contexte.

Cet outil ne traduit pas. Il **transcréé** — le même processus pour lequel les agences de pub facturent 50 000 € quand elles adaptent une campagne sur différents marchés. Sauf que l'IA connaît déjà toutes les cultures, toutes les expressions, toutes les conventions de formatage. Elle sait que :

- `49 $/mois` devient `月額6 980円` au Japon — pas "49 $" avec un symbole yen collé dessus
- Le sarcasme cartonne en anglais et meurt en japonais formel
- "Se noyer dans la paperasse" devient "noyade administrative" en français — une vraie expression française, pas une traduction mot à mot
- Les Allemands gardent la blague des hamsters parce que Hamsterrad (roue de hamster) est une vraie expression allemande
- Les Brésiliens ont besoin du registre décontracté sinon on dirait qu'un robot l'a écrit

Le modèle classe chaque chaîne. Les libellés d'interface obtiennent une traduction directe. Le contenu marketing est adapté. L'humour est entièrement recréé pour la culture cible.

---

## Ce qui se passe quand vous le lancez

Pointez-le vers votre sortie de build. Il clone toute l'arborescence de fichiers par locale — traduisant les fichiers texte, copiant les ressources statiques, et générant tout le nécessaire pour le déploiement :

```
votre-site/                         translations/
  index.html                          middleware.ts        ← détection de locale
  about.html             →            _locales.css         ← typographie par script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcréé
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, interligne 1.8
                                        css/style.css      ← copié
                                        js/app.js          ← copié
                                        images/logo.png    ← copié
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, police 110%
                                        ...
                                      de/
                                        ...
```

Chaque fichier HTML reçoit `lang` et `dir="rtl"` injectés. Chaque locale obtient du CSS avec la bonne pile de polices, l'interlignage et la direction du texte. Un middleware Vercel est généré qui lit `Accept-Language` et redirige vers la bonne locale.

Déployez sur Vercel. Un utilisateur à Tokyo voit du japonais avec Hiragino Sans à interligne 1.8. Un utilisateur au Caire voit de l'arabe RTL avec Noto Naskh à taille 110 %. Un utilisateur à Bangkok voit du thaï avec `word-break: keep-all` parce que le thaï n'a pas d'espaces. Aucune config.

---

## 90 secondes, pas 4 semaines

```bash
# Trois langues, un fichier JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Terminé. 3 fichiers écrits en 9,5s

# Votre site entier, toutes les langues de la planète
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Terminé. 142 fichiers traduits, 284 fichiers statiques copiés en 94s
```

### Dans votre pipeline de build

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Chaque déploiement se fait en 71 langues. Les traductions sont des artefacts de build — mis en cache, régénérés seulement quand la source change.

---

## Apportez vos clés ou pas

```bash
# Vous avez des clés — exécution locale, vous payez directement votre fournisseur d'IA
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Vous n'avez pas de clés — ça marche juste
# Utilise automatiquement le service hébergé
# Payez par traduction avec USDC via x402 — pas d'inscription, pas de compte
bunx translator-agent -s ./dist -l all
```

Même commande. Si des clés API sont présentes, ça tourne en local avec votre fournisseur. Sinon, ça tape l'API hébergée et paie par requête via [x402](https://x402.org) — le protocole de paiement HTTP 402. Votre client paie en USDC sur Base, récupère les traductions. Pas d'auth, pas de relation fournisseur, pas de factures.

Supporte Anthropic et OpenAI. Apportez le modèle que vous voulez :

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Tous les systèmes d'écriture, gérés

L'outil ne fait pas que traduire le texte — il sait comment chaque système d'écriture s'affiche :

| Script | Ce qui change | Pourquoi |
|---|---|---|
| **Arabe, hébreu, farsi, ourdou** | `dir="rtl"`, polices RTL, taille 110 % | L'arabe nécessite une typo plus grande pour être lisible ; tout le layout se miroir |
| **Japonais, chinois, coréen** | Piles de polices CJK, interligne 1.8 | Les caractères sont des carrés à largeur fixe ; besoin d'espace vertical |
| **Hindi, bengali, tamoul, télougou** | Polices indiques, interligne 1.8 | Les traits de tête (shirorekha) nécessitent un espace vertical supplémentaire |
| **Thaï** | `word-break: keep-all` | Pas d'espaces entre les mots — le navigateur a besoin de règles de saut de ligne explicites |
| **Birman** | Interligne 2.2 | Glyphes les plus hauts de tout script majeur |
| **Khmer** | Interligne 2.0 | Les groupes de consonnes en indice s'empilent verticalement |

CSS généré par locale :

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

## Mise en cache

Les traductions sont des artefacts de build. Générez au moment du build, mettez en cache la sortie, passez quand la source n'a pas changé.

### Vercel

Vercel met automatiquement en cache la sortie de build. Ajoutez `postbuild` et c'est fini :

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

Source inchangée = hit de cache = zéro appel d'IA = coût zéro.

---

## Options

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      répertoire ou fichier source à scanner
  -l, --locales <locales>  locales cibles, séparées par des virgules ou "all" pour 71 langues
  -o, --output <path>      répertoire de sortie (défaut : "./translations")
  -p, --provider <name>    anthropic | openai (défaut : "anthropic")
  -m, --model <id>         surcharge de modèle
  -c, --concurrency <n>    max d'appels IA parallèles (défaut : 10)
  --api-url <url>          URL du service hébergé (auto-utilisé quand pas de clés API)
```

| Extension | Stratégie |
|---|---|
| `.json` | Traduire les valeurs, préserver les clés |
| `.md` / `.mdx` | Traduire le texte, préserver la syntaxe |
| `.html` / `.htm` | Traduire le texte, préserver les balises, injecter `lang`/`dir` |
| Tout le reste | Copier dans chaque répertoire de locale |

### Toutes les 71 locales

`-l all` couvre ~95 % des utilisateurs internet : zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licence

MIT