import { formations } from "@/constante/formation";

export const ListFormation = () => {
  return (
    <div className="flex flex-col">
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
  lesson
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
    <div className="flex flex-col mt-8 space-y-4">
      <h2 className="text-xl text-neutral-700 font-bold underline">
        Chapitre {id} : {titre}
      </h2>
      {lesson.map((value, index) => (
        <div key={index} className="border-b flex justify-between items-center">
          <div className="flex items-center gap-x-1 cursor-pointer">
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
