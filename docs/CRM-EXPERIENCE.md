# Refonte de l’espace CRM Malisystem

Cette évolution conserve Next.js, Prisma, les routes et les formulaires existants. Aucune migration de base de données n’est nécessaire.

## Accueil

- Indicateurs calculés depuis les API existantes : clients, requêtes en cours, requêtes clôturées, factures non acquittées.
- Les cinq demandes ouvertes les plus anciennes, avec accès direct à leur fiche.
- Suivi des demandes ouvertes sans technicien et des montants non acquittés, séparés par devise.
- Quatre factures récentes et raccourcis de création.
- États de chargement, d’erreur avec nouvelle tentative et de liste vide.

## Pages métier

- Clients : indicateurs, filtre « Sans téléphone », recherche transversale.
- Requêtes : filtres toutes/en cours/clôturées/à attribuer. Les raccourcis de l’accueil ouvrent la vue correspondante.
- Factures : montants TTC, badges de règlement, filtres acquittées/non acquittées et recherche par numéro ou client.
- Export Excel de tous les résultats filtrés, sur les colonnes visibles, au lieu de la seule page courante.
- Clic simple sur les liens et double-clic sur une ligne pour accéder à sa fiche.
- Présentation adaptative, navigation Malisystem et styles sombres.

## Règles de lecture

Une requête est clôturée lorsqu’elle possède une date de clôture. Les brouillons restent dans leur espace existant. Une demande ouverte sans technicien (valeur vide ou liste sérialisée vide) est à attribuer.

Une facture est acquittée selon son champ `acquittee`. L’application ne déduit ni retard de paiement ni échéance, ces informations n’étant pas disponibles dans le modèle actuel. Les montants manquants sont indiqués et exclus des totaux. CFA/FCFA/XOF sont regroupés, EURO/EUR sont regroupés ; les devises distinctes ne sont jamais additionnées. Une devise absente reprend la devise CFA par défaut du formulaire existant.

## Vérifications

```sh
npx prisma generate
npx tsc --noEmit
node --import tsx --test tests/crm-metrics.test.ts tests/routing.test.ts
npx next build
```

La compilation de production a réussi. Les neuf tests couvrent notamment la séparation des devises, les dates absentes et les routes protégées. Le navigateur Chromium de test n’a pas pu être installé dans l’environnement de travail ; le contrôle visuel et les interactions de bout en bout restent à valider.

Avant déploiement, vérifier sur votre environnement : les quatre pages sur ordinateur et mobile, le changement de thème, les filtres et leur remise à zéro, la navigation depuis les lignes et l’export de plus de dix résultats.
