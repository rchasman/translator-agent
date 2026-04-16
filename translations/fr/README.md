# translator-agent

Le problème de localisation à 10 000 $, résolu en 90 secondes.

Les entreprises paient aux agences 0,10–0,25 € par mot pour localiser leurs sites. Un site de 5 000 mots dans 10 langues coûte 5 000–12 000 € et prend 2 à 4 semaines. À chaque fois que vous changez un titre, le compteur repart à zéro.

Cet outil le fait en une commande, dans 71 langues, pendant votre étape de build :

```bash
bunx translator-agent -s ./dist -l all
```

Pas d'agence. Pas de tableurs. Pas d'enfermement propriétaire. Pas d'inscription. Vos clés, votre build, vos langues.

> **Vous lisez la preuve.** Ce README a été traduit en exécutant `bunx translator-agent -s README.md -l all`. Allez lire la [version japonaise](./translations/ja/README.md) — elle n'a pas juste traduit « le compteur repart », elle l'a remplacé par un idiome commercial japonais. La [version allemande](./translations/de/README.md) fait 30 % de plus parce que l'allemand fait toujours plus. La [version arabe](./translations/ar/README.md) se lit de droite à gauche. La [version portugaise brésilienne](./translations/pt-BR/README.md) sonne comme si un Brésilien l'avait écrite, parce que c'est tout l'intérêt.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [les 71...](./translations/)

---

## Pourquoi ça marche

La traduction est un problème résolu. La localisation ne l'est pas.

Google Translate peut transformer « Nos hamsters bossent dessus » en japonais. Ce qu'il ne peut pas faire, c'est reconnaître que la blague ne marche pas au Japon, et la remplacer par quelque chose qui marche — comme faire référence à l'équipe d'ingénieurs qui tire une nuit blanche, ce qui est à la fois culturellement approprié et drôle dans le contexte.

Cet outil ne traduit pas. Il **transcree** — le même processus que les agences de pub facturent 50 000 € quand elles adaptent une campagne sur différents marchés. Sauf que le LLM connaît déjà chaque culture, chaque idiome, chaque convention de formatage. Il sait que :

- `49 €/mois` devient `月額6 980円` au Japon — pas « 49 € » avec un symbole yen plaqué dessus
- Le sarcasme cartonne en français et meurt en japonais formel
- « Se noyer dans la paperasse » devient « drowning in paperwork » en anglais — une vraie expression anglaise, pas une traduction mot à mot
- Les Allemands gardent la blague des hamsters parce que Hamsterrad (roue de hamster) est un vrai idiome allemand
- Les Brésiliens ont besoin du registre familier ou ça sonne comme si un robot l'avait écrit

Le modèle classe chaque chaîne. Les labels d'interface ont une traduction directe. Le contenu marketing est adapté. L'humour est entièrement recréé pour la culture cible.

---

## Ce qui se passe quand vous l'exécutez

Pointez-le vers votre sortie de build. Il clone tout l'arbre de fichiers par locale — traduisant les fichiers texte, copiant les assets statiques, et générant tout ce qui est nécessaire pour le déploiement :

```
votre-site/                          translations/
  index.html                           middleware.ts        ← détection de locale
  about.html             →             _locales.css         ← typographie par script
  css/style.css                        fr/
  js/app.js                              index.html         ← lang="fr", transcréé
  images/logo.png                        about.html
                                         _locale.css        ← Noto Sans, hauteur de ligne 1,8
                                         css/style.css      ← copié
                                         js/app.js          ← copié
                                         images/logo.png    ← copié
                                       ar/
                                         index.html         ← lang="ar" dir="rtl"
                                         _locale.css        ← Noto Naskh Arabic, police 110 %
                                         ...
                                       de/
                                         ...
```

Chaque fichier HTML reçoit `lang` et `dir="rtl"` injectés. Chaque locale reçoit du CSS avec la bonne pile de polices, hauteur de ligne et direction du texte. Un middleware Vercel est généré qui lit `Accept-Language` et redirige vers la bonne locale.

Déployez sur Vercel. Un utilisateur à Tokyo voit du japonais avec Hiragino Sans à 1,8 de hauteur de ligne. Un utilisateur au Caire voit de l'arabe RTL avec Noto Naskh à 110 % de taille. Un utilisateur à Bangkok voit du thaï avec `word-break: keep-all` parce que le thaï n'a pas d'espaces. Aucune config.

---

## 90 secondes, pas 4 semaines

```bash
# Trois langues, un fichier JSON
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Terminé. 3 fichiers écrits en 9,5s

# Tout votre site, chaque langue sur terre
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

Chaque déploiement livre dans 71 langues. Les traductions sont des artefacts de build — mis en cache, regénérés seulement quand la source change.

---

## Apportez vos clés ou pas

```bash
# Vous avez des clés — s'exécute en local, vous payez votre fournisseur LLM directement
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# Vous n'avez pas de clés — ça marche tout simplement
# Utilise automatiquement le service hébergé
# Payez par traduction avec USDC via x402 — pas d'inscription, pas de compte
bunx translator-agent -s ./dist -l all
```

Même commande. Si les clés API sont présentes, ça s'exécute en local avec votre fournisseur. Sinon, ça touche l'API hébergée et paie par requête via [x402](https://x402.org) — le protocole de paiement HTTP 402. Votre client paie en USDC sur Base, récupère les traductions en retour. Pas d'auth, pas de relation fournisseur, pas de factures.

Supporte Anthropic et OpenAI. Apportez le modèle que vous voulez :

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Chaque système d'écriture, géré

L'outil ne se contente pas de traduire le texte — il sait comment chaque système d'écriture s'affiche :

| Script | Ce qui change | Pourquoi |
|---|---|---|
| **Arabe, hébreu, farsi, ourdou** | `dir="rtl"`, polices RTL, taille 110 % | L'arabe a besoin d'un type plus grand pour être lisible ; toute la mise en page se reflète |
| **Japonais, chinois, coréen** | Piles de polices CJK, hauteur de ligne 1,8 | Les caractères sont des carrés de largeur fixe ; ont besoin d'espace de respiration vertical |
| **Hindi, bengali, tamoul, télougou** | Polices indiques, hauteur de ligne 1,8 | Les traits de tête (shirorekha) ont besoin d'espace vertical supplémentaire |
| **Thaï** | `word-break: keep-all` | Pas d'espaces entre les mots — le navigateur a besoin de règles explicites de retour à la ligne |
| **Birman** | Hauteur de ligne 2,2 | Les glyphes les plus hauts de tout script majeur |
| **Khmer** | Hauteur de ligne 2,0 | Les groupes de consonnes en indice s'empilent verticalement |

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

Vercel met en cache la sortie de build automatiquement. Ajoutez `postbuild` et c'est bon :

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

Source inchangée = succès de cache = zéro appel LLM = zéro coût.

---

## Options

```
Usage : translator-agent [options]

Options :
  -s, --source <path>      répertoire ou fichier source à scanner
  -l, --locales <locales>  locales cibles, séparées par des virgules ou "all" pour 71 langues
  -o, --output <path>      répertoire de sortie (par défaut : "./translations")
  -p, --provider <name>    anthropic | openai (par défaut : "anthropic")
  -m, --model <id>         override de modèle
  -c, --concurrency <n>    max d'appels LLM parallèles (par défaut : 10)
  --api-url <url>          URL du service hébergé (auto-utilisée quand aucune clé API n'est définie)
```

| Extension | Stratégie |
|---|---|
| `.json` | Traduire les valeurs, préserver les clés |
| `.md` / `.mdx` | Traduire le texte, préserver la syntaxe |
| `.html` / `.htm` | Traduire le texte, préserver les balises, injecter `lang`/`dir` |
| Tout le reste | Copier dans chaque répertoire de locale |

### Toutes les 71 locales

`-l all` couvre ~95 % des utilisateurs d'internet : zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## Licence

MIT