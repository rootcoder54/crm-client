-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "accessLevel" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomClient" TEXT NOT NULL,
    "sigle" TEXT,
    "adresse" TEXT,
    "telephone" TEXT,
    "activite" TEXT,
    "numero" TEXT,
    "dateInscription" DATETIME,
    "dateLastVisite" DATETIME,
    "dateNewVisite" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "poste" TEXT,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Contact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contrat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL,
    "type" TEXT,
    "reconduction" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contrat_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Intervention" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "intervenant" TEXT NOT NULL,
    "nature" TEXT,
    "observations" TEXT,
    "creePar" TEXT,
    "afacturee" BOOLEAN NOT NULL DEFAULT false,
    "dateCloture" DATETIME NOT NULL,
    "requeteId" TEXT,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Intervention_requeteId_fkey" FOREIGN KEY ("requeteId") REFERENCES "Requete" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Intervention_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemIntervention" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "debut" TEXT NOT NULL,
    "fin" TEXT NOT NULL,
    "description" TEXT,
    "interventionId" TEXT,
    CONSTRAINT "ItemIntervention_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "Intervention" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "fichier" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Base" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "societe" TEXT NOT NULL,
    "chemin" TEXT NOT NULL,
    "convention" TEXT NOT NULL,
    "poste" INTEGER NOT NULL,
    "employe" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "commentaire" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Base_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Logiciel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "versionInterne" TEXT NOT NULL,
    "societe" BOOLEAN NOT NULL,
    "poste" INTEGER NOT NULL,
    "employe" INTEGER NOT NULL,
    "clientServeur" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "dateAchat" DATETIME NOT NULL,
    "dossier" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Logiciel_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Requete" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sujet" TEXT,
    "description" TEXT,
    "type" TEXT,
    "observation" TEXT,
    "logiciel" TEXT,
    "demandeur" TEXT,
    "technicien" TEXT,
    "dateDebut" DATETIME,
    "dateCloture" DATETIME,
    "etat" TEXT,
    "isTacheClient" BOOLEAN NOT NULL DEFAULT true,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    CONSTRAINT "Requete_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT,
    "acquittee" BOOLEAN DEFAULT false,
    "numeroOrdre" INTEGER,
    "modeReglement" TEXT,
    "devise" TEXT,
    "observation" TEXT,
    "totalHT" REAL,
    "remise" REAL,
    "totalTTC" REAL,
    "totalTVA" REAL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemFacture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "remise" REAL,
    "tva" REAL,
    "total" REAL NOT NULL,
    "factureId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ItemFacture_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detail" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contenu" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentToIntervention" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DocumentToIntervention_A_fkey" FOREIGN KEY ("A") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DocumentToIntervention_B_fkey" FOREIGN KEY ("B") REFERENCES "Intervention" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_name_key" ON "UserRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentToIntervention_AB_unique" ON "_DocumentToIntervention"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentToIntervention_B_index" ON "_DocumentToIntervention"("B");
