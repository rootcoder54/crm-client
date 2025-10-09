export type Formation = {
  id: string;
  chapitre: string;
  image: string | null;
  lessons: {
    titre: string;
    time: string;
    image: string | null;
    video: string | null;
  }[];
};

export const formations: Formation[] = [
  {
    id: "1",
    chapitre: "Prise en main",
    image: null,
    lessons: [
      {
        titre: "Demarrage du logiciel",
        time: "02 : 14",
        image: null,
        video: null
      },
      {
        titre: "Espace d'accueil du logiciel",
        time: "05 : 44",
        image: null,
        video: null
      },
      {
        titre: "Recherche des données des employés",
        time: "04 : 11",
        image: null,
        video: null
      }
    ]
  },
  {
    id: "2",
    chapitre: "Manipulation des données des employés",
    image: null,
    lessons: [
      {
        titre: "Ajouter un employé dans le logiciel",
        time: "04 : 05",
        image: null,
        video: null
      },
      {
        titre: "Rechercher et modifier un employé",
        time: "05 : 44",
        image: null,
        video: null
      },
      {
        titre: "Ajouter une prime fixe à un employé",
        time: "04 : 11",
        image: null,
        video: null
      },
      {
        titre: "Ajouter une avance sur salaire à un employé",
        time: "04 : 11",
        image: null,
        video: null
      }
    ]
  }
];
