-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accessLevel" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Log" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "nomClient" TEXT NOT NULL,
    "sigle" TEXT,
    "adresse" TEXT,
    "telephone" TEXT,
    "activite" TEXT,
    "numero" TEXT,
    "dateInscription" TIMESTAMP(3),
    "dateLastVisite" TIMESTAMP(3),
    "dateNewVisite" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "poste" TEXT,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contrat" (
    "id" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "type" TEXT,
    "reconduction" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contrat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Intervention" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "intervenant" TEXT NOT NULL,
    "nature" TEXT,
    "observations" TEXT,
    "creePar" TEXT,
    "afacturee" BOOLEAN NOT NULL DEFAULT false,
    "dateCloture" TIMESTAMP(3) NOT NULL,
    "requeteId" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemIntervention" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "debut" TEXT NOT NULL,
    "fin" TEXT NOT NULL,
    "description" TEXT,
    "interventionId" TEXT,

    CONSTRAINT "ItemIntervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "fichier" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Base" (
    "id" TEXT NOT NULL,
    "societe" TEXT NOT NULL,
    "chemin" TEXT NOT NULL,
    "convention" TEXT NOT NULL,
    "poste" INTEGER NOT NULL,
    "employe" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "commentaire" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Logiciel" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "versionInterne" TEXT NOT NULL,
    "societe" BOOLEAN NOT NULL,
    "poste" INTEGER NOT NULL,
    "employe" INTEGER NOT NULL,
    "clientServeur" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "dateAchat" TIMESTAMP(3) NOT NULL,
    "dossier" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logiciel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Requete" (
    "id" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "observation" TEXT,
    "logiciel" TEXT,
    "demandeur" TEXT,
    "technicien" TEXT,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateCloture" TIMESTAMP(3),
    "etat" TEXT,
    "isTacheClient" BOOLEAN NOT NULL DEFAULT true,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Facture" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT,
    "acquittee" BOOLEAN DEFAULT false,
    "numeroOrdre" INTEGER,
    "modeReglement" TEXT,
    "devise" TEXT,
    "observation" TEXT,
    "totalHT" DOUBLE PRECISION,
    "remise" DOUBLE PRECISION,
    "totalTTC" DOUBLE PRECISION,
    "totalTVA" DOUBLE PRECISION,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemFacture" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "remise" DOUBLE PRECISION,
    "tva" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "factureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemFacture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_DocumentToIntervention" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToIntervention_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_name_key" ON "public"."UserRole"("name");

-- CreateIndex
CREATE INDEX "_DocumentToIntervention_B_index" ON "public"."_DocumentToIntervention"("B");

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contrat" ADD CONSTRAINT "Contrat_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Intervention" ADD CONSTRAINT "Intervention_requeteId_fkey" FOREIGN KEY ("requeteId") REFERENCES "public"."Requete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Intervention" ADD CONSTRAINT "Intervention_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemIntervention" ADD CONSTRAINT "ItemIntervention_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "public"."Intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Base" ADD CONSTRAINT "Base_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Logiciel" ADD CONSTRAINT "Logiciel_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Requete" ADD CONSTRAINT "Requete_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Facture" ADD CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemFacture" ADD CONSTRAINT "ItemFacture_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "public"."Facture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DocumentToIntervention" ADD CONSTRAINT "_DocumentToIntervention_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DocumentToIntervention" ADD CONSTRAINT "_DocumentToIntervention_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;
