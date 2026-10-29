# Direction visuelle

Une liste personnelle d’objets et de vêtements, destinée aux proches d’Antonin.
Le visiteur doit reconnaître un cadeau, connaître les détails utiles et accéder à la bonne référence.

## Palette

- Blanc : #FFFFFF, surfaces des photos et du contenu.
- Gris mat : #EBECEF, fond général.
- Gris moyen : #D3D5DA, repères et surfaces secondaires.
- Noir : #000000, texte et photo des Cloudtilt.
- Bleu nuit : #15233F, accent, boutons et panneau des tailles.
- Ardoise : #565D68, texte secondaire.

## Typographie

URW Gothic Book/Demi, géométrique et ouverte, pour les titres et noms d’objets.
Lato Regular/Bold pour les descriptions, contrôles et informations pratiques.
Polices locales et licences jointes, aucun appel à un service tiers.

## Composition

Textes à gauche, grandes plages de photo, proportions généreuses. Une première rangée asymétrique
fait écho aux pièces fortes : baskets sur fond noir, casque sur fond blanc. Le reste suit une grille
calme. Le bleu nuit rassemble les tailles, pour qu’elles restent faciles à retrouver.

    Antonin                                     Partager la liste
    Ma liste                 [ Pointure 46 | Taille M ]
    d’envies.                [ Noir / gris / bleu nuit ]
    petite introduction
    Filtres par univers
    [ Cloudtilt, photo ample       ][ Casque, photo ]
    [ parfum       ][ vêtements    ][ soins         ]
    ...
    Un cadeau à plusieurs ? / téléphone et carte cadeau

Sur téléphone : titres réduits, tailles visibles, filtres qui reviennent à la ligne et une colonne
pour les objets. Chaque photo ouvre les détails ; les galeries se parcourent avec des boutons.

## Relecture du brief avant construction

La grille de cartes identiques initialement envisagée ferait penser à une boutique générique.
Elle est remplacée par une première rangée asymétrique qui emploie la véritable photo noire
fournie pour les baskets. Pas de faux prix ni de classement de priorité inventé.
La mention « Référence précise » n’est utilisée que pour les références documentées.
Les images de style portent « Inspiration ». Les liens de collection ne prétendent pas être
une correspondance exacte. Aucun bouton de réservation sans stockage partagé.

## Ajustement demandé : shadcn/ui

Le site utilise React, TypeScript, Vite et Tailwind. Les 11 primitives de composants viennent du
registre officiel shadcn/ui (style New York, Radix). Elles sont composées en GiftCard, GiftDialog,
KindBadge, GiftFilters, Overview et ShareDialog. Les coins, états, menus et dialogues suivent ce
langage ; les proportions des photos et le bleu nuit lui donnent l’identité demandée.

## Révision de la lecture des cadeaux

La photo est suivie immédiatement d’un bloc d’intention explicite, avant la marque et le nom.
Ce bloc réutilisable donne une phrase concrète : article précis, choix entre modèles, participation
ou inspiration. Les vêtements deviennent un choix parmi les trois références photographiées,
sans préférence, et non une invitation à acheter un vêtement similaire.
Les prix sont filtrés sur les montants marchands documentés ou les budgets fournis par Antonin.
Les vêtements dépassent 150 €, le sac, la station et les cadres sont à 0–50 €, la chaise à 50–100 €. Les participations à montant libre conviennent à
chaque tranche, ce qui est annoncé au visiteur.
