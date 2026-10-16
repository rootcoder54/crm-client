export const products = [
  {
    slug: "rhpaie", name: "RHPaie", category: "Paie & congés", image: "/rhpaie.png", color: "blue",
    headline: "La paie avance. Votre équipe aussi.",
    description: "Du calcul des salaires à l’édition des bulletins, retrouvez les outils essentiels de votre paie dans un même logiciel. Gérez aussi les congés, les absences et les déclarations de taxes et cotisations.",
    short: "Calculez les salaires, éditez les bulletins et suivez les congés dans un même outil.",
    audience: "Pour les gestionnaires de paie, les responsables RH et les prestataires qui gèrent une ou plusieurs sociétés.",
    screenshot: "/website/86c439d26f565d2b.png", screenshotAlt: "Exemple de bulletin de paie édité dans RHPaie",
    features: [
      {title:"Préparer et calculer la paie", text:"Salaire de base, heures supplémentaires, primes, avances et retenues : rassemblez les éléments nécessaires au calcul du bulletin."},
      {title:"Éditer vos documents", text:"Imprimez les bulletins et états de paie, exportez vos documents en PDF ou Excel et préparez les déclarations de taxes et cotisations."},
      {title:"Suivre les congés", text:"Retrouvez les absences, les congés payés, leurs soldes et leurs provisions pour suivre la situation de chaque salarié."},
      {title:"Gérer plusieurs sociétés", text:"Travaillez avec plusieurs sociétés et conventions dans une même base, chacune avec ses paramètres et ses employés."},
      {title:"Simuler et analyser", text:"Simulez les salaires individuels ou par groupe et examinez les variations de paie, les heures et les soldes de congés."},
      {title:"Relier paie et comptabilité", text:"Préparez le journal des écritures et utilisez les interfaces comptables décrites dans les fonctionnalités du logiciel."}
    ],
    steps:["Renseignez les employés et les paramètres de paie.","Saisissez les variables du mois et vérifiez les calculs.","Éditez les bulletins, les états et les déclarations."],
    faq:[{question:"RHPaie permet-il de gérer plusieurs sociétés ?",answer:"Oui. La gestion de plusieurs sociétés et conventions dans une même base fait partie des fonctionnalités présentées. Le nombre de postes et la configuration sont à préciser dans votre demande de devis."},{question:"Puis-je exporter mes documents ?",answer:"Les états peuvent être exportés en Excel ou en PDF. Les fonctionnalités d’édition et d’envoi des bulletins sont détaillées dans le catalogue ci-dessous."}]
  },
  {
    slug:"timesheet", name:"TimeSheet",category:"Pointage & heures", image:"/timesheet.png",color:"teal",
    headline:"Chaque heure compte. Gardez le fil.",
    description:"Complément intégré à RHPaie, TimeSheet vous aide à organiser le pointage et les heures travaillées par département. Une base plus claire pour préparer les éléments de salaire.",
    short:"Organisez le pointage, les heures travaillées et les heures supplémentaires.",
    audience:"Pour les entreprises qui suivent les temps de travail de plusieurs équipes ou départements.",
    screenshot:"/website/faf015e86a3d703e.png",screenshotAlt:"Exemple de fiche de pointage du logiciel TimeSheet",
    features:[
      {title:"Centraliser les fiches de pointage",text:"Rassemblez les informations d’heures travaillées dans un outil consacré au suivi du temps."},
      {title:"Suivre les heures supplémentaires",text:"Préparez les éléments de pointage nécessaires à la paie, y compris les heures supplémentaires."},
      {title:"Consulter une vue par département",text:"Donnez aux responsables une lecture synthétique des heures pointées dans leur département."},
      {title:"Préparer les salaires",text:"Utilisez un module intégré à RHPaie pour faciliter le passage du pointage à la préparation de la paie."}
    ],
    steps:["Rassemblez les heures pointées par les équipes.","Contrôlez les temps travaillés par département.","Préparez les éléments d’heures pour la paie."],
    faq:[{question:"Quel est le lien entre TimeSheet et RHPaie ?",answer:"TimeSheet est présenté comme un module intégré à RHPaie. Il complète la gestion des salaires par le suivi du pointage et des heures travaillées."},{question:"Peut-on consulter les heures par département ?",answer:"Oui. La présentation de TimeSheet prévoit une vue synthétique des heures travaillées destinée notamment aux chefs de département."}]
  },
  {
    slug:"rhdata",name:"RHData",category:"Personnel & contrats",image:"/rhdata.png",color:"violet",
    headline:"Vos informations RH, au bon endroit.",
    description:"Organisez le suivi du personnel, des contrats CDD, des formations et des absences. RHData vous aide à retrouver les informations qui comptent dans le parcours de vos employés.",
    short:"Retrouvez les dossiers du personnel, les contrats, les formations et les absences.",
    audience:"Pour les équipes RH qui souhaitent structurer les informations du personnel et disposer de récapitulatifs utiles au suivi des effectifs.",
    screenshot:null,screenshotAlt:null,
    features:[
      {title:"Connaître vos collaborateurs",text:"Renseignez les fonctions, les diplômes, les niveaux d’études et la situation familiale des employés."},
      {title:"Suivre les contrats CDD",text:"Retrouvez la situation des contrats à durée déterminée et suivez les informations associées au personnel."},
      {title:"Organiser le suivi des formations",text:"Conservez les informations relatives aux formations du personnel pour compléter le dossier de chaque employé."},
      {title:"Analyser les absences",text:"Consultez les rapports d’absentéisme mensuels ou trimestriels et les récapitulatifs sur une période."},
      {title:"Retrouver les effectifs",text:"Appuyez-vous sur les récapitulatifs du personnel et les exports de données pour préparer vos suivis RH."},
      {title:"Définir les accès",text:"Le logiciel prévoit des droits d’accès par mot de passe ainsi qu’une journalisation des accès et traitements."}
    ],
    steps:["Renseignez les informations du personnel.","Suivez les contrats, les formations et les absences.","Consultez les récapitulatifs et exportez vos données."],
    faq:[{question:"Quelles informations puis-je suivre dans RHData ?",answer:"La présentation couvre notamment les contrats CDD, les fonctions, les diplômes, les formations, la situation familiale, les effectifs et les absences du personnel."},{question:"Existe-t-il plusieurs modes d’installation ?",answer:"Les options présentées incluent le monoposte, le multiposte et le réseau. Notre équipe vous aide à préciser l’installation en fonction de votre organisation."}]
  },
  {
    slug:"rhfacture",name:"RHFacture",category:"Prestations de paie",image:"/rhfacture.png",color:"amber",
    headline:"De la paie réalisée à la facture préparée.",
    description:"Vous établissez les salaires pour d’autres sociétés ? RHFacture complète RHPaie pour calculer et éditer les factures liées à vos prestations de paie.",
    short:"Préparez les factures des sociétés dont vous gérez les salaires avec RHPaie.",
    audience:"Pour les sociétés de prestation de services qui utilisent RHPaie pour établir les salaires de leurs clients.",
    screenshot:"/website/ee746dc55df61d86.png",screenshotAlt:"Exemple d’édition du module de facturation de paie",
    features:[
      {title:"Calculer une facture de paie",text:"Préparez les factures associées aux salaires réalisés pour les sociétés clientes."},
      {title:"Choisir une édition simplifiée",text:"Imprimez la facture dans un format simplifié selon vos besoins de présentation."},
      {title:"Inclure les provisions",text:"La présentation du module prévoit une édition avec les provisions de congés et de précarité."},
      {title:"Actualiser les montants",text:"Mettez à jour la facture lorsque les éléments de salaire évoluent."}
    ],
    steps:["Préparez les salaires de la société dans RHPaie.","Calculez la facture correspondant à la prestation.","Vérifiez les montants et éditez le document."],
    faq:[{question:"À qui s’adresse RHFacture ?",answer:"Le module est destiné aux sociétés qui réalisent la paie pour d’autres entreprises avec RHPaie. Il est spécialisé dans la facturation de ces prestations."},{question:"La facture peut-elle être actualisée ?",answer:"Oui. La mise à jour de la facture en cas de changement dans les salaires fait partie des fonctionnalités décrites."}]
  }
] as const;
export type Product = typeof products[number];
export const generalFaq = [
 {question:"Quel logiciel choisir pour mon entreprise ?",answer:"RHPaie couvre la paie et les congés. TimeSheet complète le suivi des heures, RHData organise les informations RH et RHFacture s’adresse aux prestataires de paie. Vous pouvez préciser votre besoin dans une demande de devis pour être orienté."},
 {question:"Puis-je installer le logiciel sur plusieurs postes ?",answer:"Le devis permet de préciser le nombre de postes et le mode d’installation : monoposte, réseau local ou client/serveur. Le choix dépend de votre organisation et de votre environnement informatique."},
 {question:"Proposez-vous des formations ?",answer:"Oui. Des tarifs de formation sont présentés pour RHPaie, TimeSheet / RHData et la facturation de paie. Un espace de formation en ligne est également accessible depuis le site."},
 {question:"Comment obtenir une proposition adaptée ?",answer:"Indiquez les logiciels souhaités, le nombre de salariés, les postes utilisateurs et les personnes à former. Ces informations permettent de préparer votre demande de facture proforma."},
 {question:"Où trouver de l’aide après l’installation ?",answer:"Le centre d’aide rassemble les ressources de support, les astuces et les questions fréquentes. Vous pouvez aussi contacter l’équipe Mali System durant les heures de bureau."}
];
