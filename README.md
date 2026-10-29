# La liste d’envies d’Antonin

Un site personnel pour partager des idées cadeaux avec les proches d’Antonin.
Palette gris mat, blanc, noir et bleu nuit. Pointure 46, vêtements M.

## Ouvrir le site localement

Prérequis : Node.js 24 et npm.

```bash
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:8088. Pour vérifier la version optimisée :

```bash
npm run build
npm run preview
```

## Mettre en ligne sur Vercel

Le projet est déjà configuré dans `vercel.json`. Il est entièrement statique :
aucune base de données, clé API ou variable d’environnement n’est nécessaire.

### Depuis un dépôt Git

1. Mettre ce dossier dans un dépôt Git de ton choix.
2. Dans Vercel, choisir **Add New → Project**, puis importer le dépôt.
3. Si le dépôt contient le dossier parent, sélectionner **wishlist-site** comme Root Directory.
   Si le dépôt contient directement ce projet, conserver la racine.
4. Conserver **Vite**, la commande **npm run build** et le dossier de sortie **dist**.
5. Déployer, puis copier l’URL HTTPS attribuée par Vercel.

### Depuis le terminal

Dans ce dossier :

```bash
npx vercel
```

Se connecter à son compte Vercel et suivre les indications. Cette commande crée
un aperçu. Après vérification, publier en production avec :

```bash
npx vercel --prod
```

Le bouton **Partager la liste** emploie automatiquement le domaine sur lequel
le site est ouvert. Ne pas envoyer l’adresse locale 127.0.0.1 aux proches.
Les liens vers une seule idée, par exemple `#casque`, ouvrent directement sa fiche.

Le site demande aux moteurs de recherche de ne pas l’indexer. Ce réglage n’est
pas un contrôle d’accès : toute personne qui connaît l’adresse peut ouvrir le site.

## Autre option : Docker

```bash
docker compose up -d --build
```

Le site est alors accessible sur http://127.0.0.1:8088. Le port est lié à la boucle
locale. Aucun port n’est publié sur toutes les interfaces de la machine.
Choisir soit l’aperçu npm, soit Docker sur ce port.

Le Dockerfile construit le site avec Node 24, puis sert uniquement `dist` avec Caddy.

Pour l’arrêter :

```bash
docker compose down
```

### Partager Docker avec Tailscale

Tailscale doit être installé et connecté sur l’hôte Docker.
`tailscale serve` réserve l’accès au réseau Tailscale ; `tailscale funnel` permet
un accès Internet sans application à installer pour les proches.

Avant tout changement, regarder la configuration existante :

```bash
tailscale funnel status
```

Sur la machine inspectée pendant la création, un Funnel existe déjà sur le port
HTTPS 443 et pointe vers un autre service local en 8090. Conserver cette configuration.
Si le port HTTPS 8443 est libre dans la configuration de l’hôte choisi, une option
séparée pour la wishlist est :

```bash
tailscale funnel --bg --https=8443 http://127.0.0.1:8088
```

Tailscale peut demander d’activer Funnel dans le navigateur et dans les règles
d’accès du réseau. Envoyer l’URL HTTPS exacte affichée par la commande.
Funnel est public : toute personne qui obtient cette URL peut consulter le site.
L’ordinateur ou le serveur doit rester allumé et connecté.

Pour arrêter uniquement ce partage :

```bash
tailscale funnel --https=8443 off
```

Aucun partage Tailscale n’a été activé ou modifié lors de la création du projet.

## Modifier les idées

- `src/data/wishlist.ts` contient les noms, descriptions, catégories, détails,
  photos et liens. Modifier ce fichier puis reconstruire et redéployer.
- `kind: 'exact'` : une référence précise, avec ses éventuels détails de version.
- `kind: 'choice'` : un choix entre les modèles photographiés, une saveur ou un modèle compatible.
- `kind: 'inspiration'` : un exemple de style ou de type d’objet.
- `kind: 'contribution'` : une participation ou une carte cadeau.
- Les images sont dans `public/assets`. Ajouter le nom du fichier dans `images`.
- Les polices sont locales. Leurs licences sont jointes dans `public/assets/fonts`.

Les 15 images fournies sont intégrées : trois servent à la galerie vêtements,
les autres aux douze autres idées. Le sac est le modèle précis ASOS DESIGN, référence 209017778, avec le lien fourni par Antonin.
Les prix marchands repérés et les budgets indicatifs d’Antonin sont affichés séparément.
Les infobulles de prix donnent la source et la date du repère. Les stocks restent ceux des marchands.
Le filtre de budget propose 0–50 €, 50–100 €, 100–150 € et plus de 150 €.
Pour les prix exacts, 50 € appartient à la première tranche, 100 € à la deuxième, et 150 € à la troisième.
Les participations à montant libre restent visibles dans chaque tranche.
Les trois vêtements photographiés sont tous souhaités, sans préférence entre eux.
La carte Zara se trouve dans la catégorie Vêtements.

La liste propose des catégories, un filtre de budget, des galeries,
des fiches accessibles au clavier, un partage par lien et la préparation d’un e-mail.
Elle ne comporte pas de paiement ni de réservation partagée.

## Composants et technologie

React, TypeScript, Vite et Tailwind CSS. Composants officiels shadcn/ui, style New York,
avec Radix et Lucide : Button, Badge, Card, Tabs, Dialog, Dropdown Menu, Tooltip,
Accordion, Separator, Input et Sonner. Les libellés ont été adaptés en français.

Ces primitives se composent en `GiftCard`, `KindBadge`, `GiftDialog`, `GiftFilters`,
`Overview` et `ShareDialog`. La direction visuelle est détaillée dans `docs/design.md`.

## Sources des références

Liens fournis par Antonin, consultés le 29 octobre 2026 :

- [Cloudtilt chez JD Sports](https://www.jdsports.fr/product/blanc-on-running-cloudtilt/19615454_jdsportsfr/)
- [DT 770 PRO Black Edition 80 ohms chez Darty](https://www.darty.com/nav/achat/ref/MC351380692.html)
- [Pistolet Essentielb HyperB chez Boulanger](https://www.boulanger.com/ref/8009700)

Liens complémentaires vérifiés :

- [Le Parfum chez YSL Beauté](https://www.yslbeauty.fr/parfums/parfum-homme/la-nuit-de-l-homme/la-nuit-de-l-homme-le-parfum/522YSL.html)
- [Collection Homme Rituals](https://www.rituals.com/fr-fr/collection/homme)
- [Carte cadeau Zara France](https://www.zara.com/fr/fr/carte-cadeau-pT9234152152.html)
- [Vestes Alo](https://www.aloyoga.com/collections/mens-jackets)
- [Sweats Drôle de Monsieur](https://droledemonsieur.com/fr/collections/hoodies-and-sweatshirts)
- [Sweats à capuche Acne Studios](https://www.acnestudios.com/fr/fr/man/sweatshirts/hoodies/)

Les liens de vêtements et Rituals mènent à des collections, pas à des modèles exacts.

Documentation technique : [Vite sur Vercel](https://vercel.com/docs/frameworks/frontend/vite),
[shadcn/ui](https://ui.shadcn.com/docs/installation/vite),
[Tailscale Funnel](https://tailscale.com/docs/reference/tailscale-cli/funnel).

## Vérifier les filtres de prix

```bash
npm test
```

Les tests couvrent les limites des tranches, les budgets personnels, les différents prix
du parfum et les participations à montant libre.
