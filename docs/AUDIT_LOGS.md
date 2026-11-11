# Journal d'activité — CRM MaliSystem

## Périmètre

Le journal `Log` utilise une signature d'acteur issue de NextAuth côté serveur.

- `action` : `CREATE`, `UPDATE`, `DELETE`, `READ`, `CLOSE`, `LOGIN`, `LOGOUT`.
- `entity` : module métier (`Client`, `Facture`, `Requete`, `UserRole`, etc.).
- `entityId` : identifiant technique de l'enregistrement.
- `route` : contexte d'action.
- `details` : résumé bref sans donnée sensible.
- `userId`, `actorUsername`, `timestamp` : auteur et horodatage.
- `actorUsername` est conservé quand un compte est supprimé ; `userId` devient NULL.

Les mutations instrumentées utilisent `auditedMutation` (écriture métier et audit dans **une transaction**). Les consultations de fiches/listes utilisent `auditedRead`, écritures à part après lecture : si l'écriture du log échoue, la réponse échoue elle aussi.

La saisie automatique de brouillons n'est **pas** enregistrée à chaque frappe. La validation en statut `submitted` est enregistrée. Les opérations de masse (import Excel) enregistrent chaque client inséré.

Éviter la collecte de mots de passe, token, données RH, numéros privés, contenus de documents ou paramètres de recherche : l'audit ne doit contenir qu'une référence et un résumé.

## Interface et sécurité

- `/userlog` : journal du compte courant, filtres action/module, pagination.
- `/api/userlog` : filtre `page` (1+), `limit` (1..100), `action`, `entity`, option `all=true` pour administrateurs.
- `/api/userlog/[userId]` : compatibilité ancienne UI, accès personnel ou administrateur uniquement.
- Le droit de voir tous les utilisateurs est lié aux IDs listés dans `CRM_ROLE_ADMIN_USER_IDS`. **La variable doit être définie côté serveur**, ne jamais la préfixer par `NEXT_PUBLIC_`.
- Les anciens appels `createLog` venant du navigateur sont supprimés pour empêcher l'usurpation d'identité et les doublons.

## Déploiement (préproduction avant production)

1. Sauvegarder le fichier SQLite et vérifier `DATABASE_URL`.
2. Mettre en place la branche de permissions `feature/permissions-userrole-crm` (PR #8) avant la branche audit.
3. Définir `CRM_ROLE_ADMIN_USER_IDS` avec au moins un compte administrateur valide.
4. Appliquer les migrations **dans l'ordre** :

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run build
   ```

5. Tester : client créé, modifié, supprimé ; facture ajoutée, requête clôturée ; consultation d'une fiche ; connexion/déconnexion ; import Excel ; changement de permissions. Chaque action doit produire l'entrée attendue.
6. Tester les refus : utilisateur A ne doit pas pouvoir consulter `/api/userlog/[id-de-B]` ni `/api/userlog?all=true`. Un admin autorisé peut.
7. Tester que la suppression d'un utilisateur conserve ses anciennes entrées sans relation cassée.
8. Surveiller la croissance de `Log` : les lectures répétées génèrent de nombreuses lignes. Définir une politique de rétention/archivage et protéger les sauvegardes.

## Limites importantes

- Les opérations directes `prisma.*` en dehors des services/actions instrumentées doivent être auditées individuellement. Cette modification couvre les principaux services CRM et certaines routes directes (recherche, export, import), mais ne constitue pas une garantie de traçabilité absolument exhaustive.
- Les consultations publiques d'articles et vidéos (visiteurs non authentifiés) ne sont pas journalisées par utilisateur.
- Les opérations en cascade SQLite ne produisent qu'un événement pour l'action métier d'origine.
- La journalisation applicative n'est pas inviolable contre un administrateur de la base SQLite. Pour un audit réglementaire, ajouter un stockage séparé append-only / export immuable, des contrôles de rétention et des tests.

## Navigation et libellés lisibles (mise à jour)

- Les services `get*()` et les listes Prisma **ne journalisent plus automatiquement** les consultations : un rafraîchissement React Query ne correspond pas à une nouvelle visite.
- `ActivityPageTracker` déclenche l'enregistrement lors d'une navigation CRM, via `POST /api/activity/page-view`. Le serveur connaît les routes autorisées et retrouve le nom du client, le numéro de la facture ou le sujet de la requête en base.
- `Log.dedupeKey` est unique : une même page visitée par un même utilisateur dans une fenêtre d'environ 30 secondes ne produit qu'un seul événement, y compris en cas d'appels concurrents. Les véritables modifications ne sont **jamais** dédupliquées par cette clé.
- Les créations, éditions, clôtures et suppressions utilisent `auditedMutation()` : le message stocké inclut désormais un intitulé court de l'élément lorsque la valeur renvoyée le permet.
- L'API historique enrichit l'affichage des **anciens** journaux à partir des fiches existantes. Les sujets d'éléments déjà supprimés ne peuvent pas être reconstitués si l'ancien log ne les contenait pas.
- La recherche globale n'enregistre plus de consultation à chaque frappe.
- Ne pas supprimer automatiquement les anciens doublons : ils sont conservés à des fins d'audit. Seules les nouvelles visites sont dédupliquées.

### Vérifications complémentaires

1. Ouvrir `/client` : un seul log « Consultation de la page Clients ».
2. Recharger plusieurs fois la page dans les 30 secondes : pas de nouveau log.
3. Ouvrir `/requete/detail/<id>` : « Consultation de la requête : <sujet> ».
4. Valider une requête avec un sujet : « Création de la requête : <sujet> » (pas de log à chaque sauvegarde du brouillon).
5. Modifier, clôturer, supprimer : un seul événement métier pour chaque action réussie, avec son sujet.
6. Vérifier les autres modules, les filtres et les sessions de plusieurs utilisateurs.
7. Appliquer `npx prisma migrate deploy` et `npx prisma generate` sur une sauvegarde SQLite avant toute production.

