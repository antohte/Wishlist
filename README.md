# Wishlist d’Antonin

Site React + TypeScript + Vite, composants shadcn/ui, adapté au mobile.

- Liste publique : `/`
- Administration : `/admin`
- Articles, catégories, budgets, prix, liens et galeries modifiables sans retoucher le code.

## Utiliser l’admin localement

Prérequis : Node.js 24 et npm.

```bash
npm ci
python3 scripts/setup-admin.py
npm run build
npm start
```

Le script demande le mot de passe sans l’afficher. Il crée `.env.local` et `.env.vercel`,
deux fichiers privés ignorés par Git. S’ils existent déjà, ne pas relancer la configuration.
Les identifiants sont vérifiés côté serveur. Le mot de passe est conservé sous forme de
hachage scrypt, jamais en clair. L’adresse de connexion est `antonin.hotte@gmail.com`.

Ouvrir http://127.0.0.1:8088/admin. Les données locales sont stockées dans `.data/`.
La liste initiale de `src/data/wishlist.ts` est utilisée tant qu’aucune modification n’a été publiée.

Pour développer avec rechargement automatique :

```bash
npm run dev
```

## Activer l’admin sur Vercel

Projet : https://vercel.com/antohtes-projects/wishlist
Adresse stable : https://wishlist-antohtes-projects.vercel.app/

1. Dans l’onglet **Storage** du projet, créer ou connecter un store **Vercel Blob privé**.
   Les données du catalogue et les photos sont stockées dans ce store.
2. Connecter le store à l’environnement **Production** et aux environnements Preview
   souhaités. Vercel fournit la variable serveur `BLOB_READ_WRITE_TOKEN`.
3. Ajouter les trois variables du fichier local privé `.env.vercel` au projet :
   `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`.
4. Ne pas préfixer ces variables par `VITE_`. Ne pas mettre `STORAGE_MODE=local` sur Vercel.
5. Redéployer le projet après l’ajout des variables.
6. Ouvrir https://wishlist-antohtes-projects.vercel.app/admin et se connecter.

Sans configuration, la liste publique reste consultable, mais les opérations d’administration
sont refusées. Il n’existe pas de connexion de secours codée dans l’application.

Les liens vers les déploiements datés restent associés à leur déploiement. Utiliser l’adresse
stable pour partager la wishlist et ouvrir la version courante de l’administration.

### Avertissement npm « Unknown env config cache-dir »

Le projet n’utilise aucune option `cache-dir`. Si cet avertissement apparaît dans Vercel,
vérifier les variables du projet et supprimer une éventuelle variable `npm_config_cache_dir`
ou `NPM_CONFIG_CACHE_DIR`. L’option reconnue par npm est `cache` (`npm_config_cache`).
L’avertissement seul n’indique pas un échec du build ; vérifier la dernière erreur éventuelle
et le statut du déploiement. La configuration du compte n’a pas pu être inspectée ici.

## Ce qui est modifiable

- Nom, marque, résumé et trois phrases de détail.
- Type : article précis, choix entre plusieurs modèles, inspiration ou participation.
- Message de type de cadeau personnalisé, si souhaité.
- Catégorie existante ou nouvelle.
- Budget 0–50 €, 50–100 €, 100–150 €, plus de 150 €, ou prix précis.
- Plusieurs prix, par exemple pour plusieurs contenances.
- Libellé de prix personnalisé.
- Un ou plusieurs liens HTTPS, avec le texte des boutons.
- Jusqu’à 12 photos JPEG, PNG ou WebP, description de chaque photo et ordre de galerie.
- La première photo est la couverture.
- Ordre des articles, suppression avec confirmation.
- Ajout, renommage et suppression des catégories vides.

Les photos sont réduites à 1 800 pixels maximum avant l’import. Une photo source peut peser
jusqu’à 20 Mo ; le fichier préparé pour le serveur doit rester sous 3 Mo.
Retirer une photo d’un article ne supprime pas immédiatement le fichier du stockage.

Le bouton **Enregistrer et publier** met à jour le catalogue : aucun redéploiement n’est
nécessaire pour les modifications de contenu. Une vérification de version évite d’écraser
silencieusement des modifications faites depuis un autre onglet.

## Sécurité

- Toutes les modifications et tous les imports vérifient la session côté serveur.
- Cookie de session signé, HttpOnly, SameSite Strict et Secure sur Vercel ; expiration à 8 h.
- Contrôle d’origine des requêtes qui modifient les données.
- Limite persistante de 10 tentatives de connexion par période de 15 minutes.
- Validation des champs, des liens HTTPS et du contenu des images côté serveur.
- Identifiants, secrets et données locales exclus de Git et du contexte Docker.
- Le store Blob est privé ; les photos sont servies par l’API publique à partir de leur identifiant.
- La wishlist reste accessible à toute personne ayant son adresse. Le réglage noindex n’est
  pas un contrôle d’accès à la liste publique.

Pour changer le mot de passe, générer un nouveau hachage et mettre à jour les variables serveur.
Les sessions existantes deviennent invalides quand le hachage change.

## Docker

Créer `.env.local` comme indiqué ci-dessus, puis :

```bash
docker compose up -d --build
```

Le serveur Node sert le site et l’API sur http://127.0.0.1:8088.
Le volume `wishlist-data` conserve les articles et les photos après redémarrage ou reconstruction.
Éviter `docker compose down -v`, qui supprime ce volume.

## Vérifications

```bash
npm test
npm run build
```

Les tests couvrent les budgets, l’authentification, le refus d’accès sans session,
le contrôle d’origine, les liens non HTTPS, les images invalides, la sauvegarde,
les conflits de modification, les photos servies et la limite de connexion.
Le stockage Blob en ligne et le rendu navigateur de l’admin nécessitent encore une
vérification après autorisation d’accès au projet et configuration de ses variables.

## Fichiers utiles

- `src/Admin.tsx`, `src/components/admin-editor.tsx` : interface d’administration.
- `server/` : authentification, validation, stockage et API.
- `api/manage.ts` : point d’entrée Vercel Functions.
- `src/data/wishlist.ts` : données initiales.
- `src/index.css`, `src/admin.css` : présentation.
- `public/assets/` : photos et polices initiales, avec leurs licences.
- `scripts/setup-admin.py` : initialisation des secrets locaux.
- `vercel.json` : Vite, route `/admin` et en-têtes.

Documentation : [Vercel Blob](https://vercel.com/docs/vercel-blob/using-blob-sdk),
[Vercel Functions](https://vercel.com/docs/functions/runtimes/node-js),
[shadcn/ui](https://ui.shadcn.com/docs).
