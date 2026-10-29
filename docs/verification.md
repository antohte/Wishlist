# Vérification du 29 octobre 2026

- `npm run build` : contrôle TypeScript et compilation Vite réussis.
- Audit npm après installation : aucune vulnérabilité signalée.
- Les 13 identifiants sont uniques ; les 15 photos sont présentes ; les 9 liens utilisent HTTPS.
- `docker compose config --quiet` : configuration Compose valide.
- Docker n’a pas été lancé : le contexte Docker Desktop configuré ne disposait pas de socket actif.
- Aucun déploiement Vercel ni changement Tailscale n’a été effectué.

Vérifications dans le navigateur sur la version de production locale :

- Ordinateur : grille, catégories, ouverture de fiche, référence Darty, fermeture et retour à la liste.
- Téléphone 390 × 844 : aucune largeur de page débordante, onglets qui reviennent à la ligne,
  fiche à défilement interne, détails et boutons accessibles.
- Filtre Tech : 3 idées ; filtre « Références précises » : 3 idées.
- Recherche « beyerdynamic » avec le filtre des références : 1 idée.
- Recherche sans résultat : message explicite et bouton qui rétablit les 13 idées.
- Galerie vêtements : changement effectif de photo et compteur 2 / 3.
- Copier une idée : notification en français et lien copié incluant #vetements.
- Partager la liste : URL sans fragment, champ sélectionnable et lien mailto préparé.
- Accès direct #sac après rechargement : fiche ouverte avec la nouvelle photo.
- Aucune erreur ou alerte de console lors des interactions vérifiées.

Les liens marchands ont été identifiés sur les fiches web et les collections officielles ;
leur stock, leurs prix et les tailles disponibles restent ceux affichés chez les vendeurs.

## Révision des types et des budgets

- Les intentions sont visibles directement après chaque photo et avant la marque et le nom.
- Les vêtements, la station et Red Bull partagent le type « Au choix ».
- La fiche vêtements désigne les trois modèles photographiés et l’absence de préférence.
- La catégorie Vêtements comprend la carte Zara.
- Budgets fournis par Antonin : vêtements >150 €, sac/station/cadres 0–50 €,
  chaise romaine d’occasion 50–100 €.
- Repères marchands utilisés : Cloudtilt environ 170 € (gamme JD Sports), casque dès 159 €,
  parfum 60/100 ml à 85,60/117,60 €, exemple Rituals à 69,90 €, massage à 42,99 €,
  exemple de pack Red Bull à 43,99 €. Les prix sont indicatifs et hors livraison.
- Tests des filtres : limites à 50/100/150 €, parfum à plusieurs tarifs,
  budgets personnels et participations dans chaque tranche. `npm test` réussi.
- Vérification navigateur : Vêtements + 0–50 € retourne sac et carte Zara ;
  Vêtements + >150 € + Au choix retourne le groupe des trois vêtements.
- Galerie mobile : nom du modèle visible, passage On vers Drôle de Monsieur,
  intention et budget lisibles après la photo, aucune largeur débordante.

Sources complémentaires :

- https://www.jdsports.fr/campaign/jd-exclusive/marque/on-running/p/baskets/
- https://www.rituals.com/fr-fr/rituals-homme---large-gift-set-2026-1122144.html
- https://www.fitadium.com/5521-red-bull-24x250ml.html
