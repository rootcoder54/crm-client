# Site public et CRM dans une application Next.js

## Organisation

- `/` : accueil public Mali System.
- `/logiciels/rhpaie`, `/logiciels/timesheet`, `/logiciels/rhdata`, `/logiciels/rhfacture` : présentations et fonctionnalités.
- `/tarifs/logiciels`, `/tarifs/formation` : tarifs repris du site existant.
- `/nouveautes/11` à `/nouveautes/15` : nouveautés, explications et captures disponibles.
- `/difference?debut=13&fin=14` : nouveautés des versions comprises dans l’intervalle.
- `/contact`, `/devis`, `/a-propos` : pages publiques.
- `/support`, `/formation`, `/telechargement` : espaces publics conservés du CRM.
- `/admin` : tableau de bord ; tous les écrans auparavant dans `(root)` sont sous ce préfixe.
- `/admin/login`, `/admin/logout` : connexion et déconnexion.
- `/admin/imprime/intervention/:id` : impression protégée.
- `/api/*` : emplacements conservés, afin de préserver les appels existants.

Les anciennes URL PHP et les anciennes routes métier (`/client/...`, `/requete/...`, etc.) redirigent vers les nouvelles URL. `/` affiche désormais le site public. La racine de l’ancien sous-domaine peut être redirigée au niveau du serveur vers `/admin`.

## Déploiement

1. Conserver une sauvegarde de la base SQLite et du fichier d’environnement de production.
2. Installer avec `npm ci`, puis exécuter `npx prisma generate` et `npm run build`.
3. Conserver `DATABASE_URL` et le secret d’authentification de l’application. Si `AUTH_URL` ou `NEXTAUTH_URL` est défini, utiliser l’origine publique `https://malisystem.com`, sans ajouter `/admin` : l’API Auth.js reste `/api/auth`.
4. Faire pointer `malisystem.com` vers cette application et redémarrer le processus Next.js existant. Aucun changement du schéma Prisma n’est requis.
5. Facultatif : rediriger `admin.malisystem.com/` vers `https://malisystem.com/admin`, les anciennes routes métier vers `/admin/...`, et `/support`, `/formation`, `/telechargement` vers leurs équivalents publics. Configurer ces redirections dans le proxy existant.

### Ressources du site existant

Les illustrations et captures des pages migrées sont incluses dans `public/website`. Deux captures de RHPaie 13 étaient déjà introuvables sur le serveur source ; leurs explications textuelles sont conservées.

Les exécutables de téléchargement et les manuels existants ne sont pas présents dans le dépôt d’origine. Conserver les fichiers/répertoires `/download` et `/manual` du serveur actuel ou les servir via le proxy avant de remplacer le site PHP. Les téléchargements du CRM utilisent déjà ces adresses : ils doivent rester disponibles après la migration.

### Contact et devis

Les formulaires préparent un email via `mailto:` avec les données saisies, puis l’utilisateur l’envoie dans sa messagerie. Ils n’enregistrent pas de prospects dans le CRM et n’envoient pas d’email côté serveur. Pour un envoi direct, configurer un transport SMTP ou un service d’email et remplacer ce mode de soumission. Aucun envoi vers un tiers n’est effectué pendant le développement.

### Contenus

Les contenus HTML des présentations, tarifs et nouveautés sont des fichiers statiques dans `content/public-pages.json`, issus des pages publiques de malisystem.com lors de la migration du 16 octobre 2026. Les scripts, styles, formulaires et attributs exécutables hérités ont été retirés. Les fenêtres d’explication sont remplacées par des éléments natifs `details` accessibles au clavier. Les tarifs peuvent être actualisés dans ce fichier.

La police Outfit et sa licence sont incluses dans `app/fonts` pour permettre une compilation sans accès à Google Fonts. Les styles du site public sont préfixés par `ms-` et regroupés dans `styles/marketing.css`.

## Vérification

```bash
node --import tsx --test tests/routing.test.ts
npx tsc --noEmit
npm run build
```

Après déploiement, vérifier la connexion avec un compte existant, les clients/requêtes/factures, les impressions, les vidéos de formation et les téléchargements avec les données de production. Les tests automatisés vérifient notamment que la racine publique n’expose ni `/admin` ni les API métier.
