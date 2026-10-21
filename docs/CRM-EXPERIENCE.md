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
- Requêtes : indicateurs conservés ; filtres rapides retirés à la demande de l’utilisateur. Les recherches et filtres sont ceux du tableau, sans deuxième niveau de filtrage.
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

Cette version a passé la compilation de production (`next build`). Les onze tests actuels couvrent les devises, les dates, les calculs de facture, la validation des quantités et les routes protégées.

## Éditeur de facture et formulaires

La page `/facture/add` comporte trois sections : client et informations, lignes de prestations, règlement et observations. Le récapitulatif reste visible sur ordinateur ; les sections s’empilent sur mobile. Les formulaires de création et modification des clients et requêtes reprennent les mêmes cartes et champs espacés. La fiche facture et son aperçu utilisent les montants et la devise enregistrés.

Les brouillons locaux de l’ancien éditeur sont relus. La réinitialisation demande confirmation. Les taux de remise et TVA sont validés entre 0 et 100 ; les quantités doivent être des entiers positifs. La TVA est calculée après remise, avec arrondi à deux décimales par ligne. Le serveur recalcule les totaux et enregistre la facture et ses lignes dans une transaction : un échec conserve le brouillon. Le numéro définitif est attribué côté serveur.

Contrôles navigateur réalisés avec Chromium et une base SQLite de démonstration séparée : recherche, remise à zéro des filtres, téléchargement Excel de 14 résultats, navigation vers les fiches, absence des filtres rapides Requêtes, navigation mobile, restauration du brouillon après rechargement, aperçu EUR et enregistrement complet avec remise. Le cas 2 × 10 000, remise 10 %, TVA 18 % donne 21 240 EUR dans l’aperçu et en base. Aucun changement ni donnée de test n’est appliqué à la base de production.

Le débordement horizontal de l’accueil sur mobile a été corrigé et vérifié à 390 px. Le formulaire de facture a été contrôlé en modes clair et sombre.
