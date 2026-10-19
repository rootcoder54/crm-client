# Deux projets indépendants : CRM Next.js et vitrine PHP

## Domaines et routes

- `https://admin.malisystem.com/` : CRM Next.js, accueil protégé.
- `/login`, `/logout`, `/client`, `/requete`, `/facture`, `/imprime/intervention/:id` : routes à la racine du sous-domaine, sans préfixe `/admin`.
- `/api/*` : endpoints conservés ; les API métier demandent une session.
- `/support`, `/formation`, `/telechargement` : portail public connecté conservé dans Next.js.
- `https://malisystem.com/` : projet indépendant `malisystem-site-php72`, PHP natif 7.2.0, livré séparément. Le dépôt CRM ne contient plus le site vitrine.

Les anciens liens `/admin/...` redirigent vers les nouvelles routes locales. Les routes marketing de cette application redirigent vers le domaine de la vitrine.

## Déployer le CRM

1. Sauvegarder la base SQLite et le fichier d’environnement existants.
2. Installer les dépendances avec `npm ci`, puis `npx prisma generate` et `npm run build`.
3. Conserver `DATABASE_URL` et le secret d’authentification. Si `AUTH_URL` ou `NEXTAUTH_URL` est défini, utiliser `https://admin.malisystem.com`, sans `/admin`.
4. Faire pointer le sous-domaine `admin.malisystem.com` vers le processus Next.js. Retirer toute ancienne redirection du sous-domaine vers `malisystem.com/admin`.
5. Redémarrer le processus Next.js existant. Aucun changement de schéma Prisma ni migration de données n’est requis.

La commande `npm start` du projet utilise toujours le port 80. Si IIS ou un autre proxy écoute déjà ce port sur la même machine, lancer Next.js sur un port interne libre, par exemple `npx next start -H 127.0.0.1 -p 3000`, puis configurer le proxy du sous-domaine vers ce port.

## Déployer la vitrine PHP

Décompresser le projet séparé, configurer `config.php`, puis faire pointer la racine web de `malisystem.com` vers son dossier `public/`. Les configurations Apache (`.htaccess`) et IIS (`web.config`) et le guide complet sont dans l’archive.

Le site PHP ne dépend d’aucun serveur Next.js pour ses pages marketing. Il renvoie les visiteurs vers le sous-domaine uniquement pour les espaces support, formation et téléchargement gérés par le CRM. Les formulaires de contact/devis valident les champs côté PHP et préparent un email à envoyer par le visiteur, sans envoi automatique.

Conserver les installateurs et manuels de l’ancien hébergement : `download/`, `manual/` et `assets/docs/`. Ces ressources ne proviennent pas du dépôt CRM et doivent être copiées ou servies sur le domaine vitrine après la bascule.

## Vérifications

```bash
node --import tsx --test tests/routing.test.ts
npx tsc --noEmit
npm run build
```

Vérifier après déploiement : connexion/déconnexion, accueil, clients, requêtes, factures, impressions, formation, support et liens de téléchargement. Une session sur la vitrine n’est pas nécessaire ; la connexion CRM reste attachée au sous-domaine.

Les tests contrôlent que `/` et les modules métier sont privés, que les identifiants contenant un point ne contournent pas le middleware et que les ressources publiques restent accessibles. Les anciens styles et composants marketing ont été retirés. La police locale Outfit est conservée pour permettre la compilation sans accès à Google Fonts.
