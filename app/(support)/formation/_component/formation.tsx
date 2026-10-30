import { formations } from "@/constante/formation";

export const ListFormation = () => {
  return (
    <div className="ms-container ms-section" id="programme">
      {formations.map((formation, index) => (
        <Chapitre
          key={index}
          id={index + 1}
          titre={formation.chapitre}
          lesson={formation.lessons}
        />
      ))}
    </div>
  );
};

const Chapitre = ({
  id,
  titre,
  lesson,
}: {
  id: number;
  titre: string;
  lesson: {
    titre: string;
    time: string;
    image: string | null;
    video: string | null;
  }[];
}) => {
  return (
    <div className="ms-chapter">
      <h2 className="ms-chapter-title">
        Chapitre {id} : {titre}
      </h2>
      {lesson.map((value, index) => (
        <div key={index} className="ms-lesson hover:underline hover:cursor-pointer">
          <div className="flex items-center gap-x-2">
            <span>{index + 1}</span>
            <span>-</span>
            <span>{value.titre}</span>
          </div>
          <span>{value.time}</span>
        </div>
      ))}
    </div>
  );
};
