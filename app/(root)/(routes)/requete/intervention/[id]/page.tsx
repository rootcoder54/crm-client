import InterventionRequete from "@/components/requete/intervention-requete";
import { getInterventionById } from "@/services/intervention.service";
import { getRequeteById } from "@/services/requete.service";

interface InterventionRequeteProps {
  params: Promise<{ id: string }>;
}
const InterventionRequetePage = async ({
  params
}: InterventionRequeteProps) => {
  const { id } = await params;
  const requete = await getRequeteById(id);

  if (!requete) {
    return null;
  }

  if (requete.Intervention.length === 0) {
    return (
      <div>
        <InterventionRequete requete={requete} items={[]} />
      </div>
    );
  }

  const intervention = await getInterventionById(requete.Intervention[0].id);

  if (!intervention) {
    return null;
  }
  return (
    <div>
      <InterventionRequete requete={requete} items={intervention.items} />
      <hr className="my-4" />
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4 px-10">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Service
            </p>
            <p className="text-sm text-muted-foreground">
              {intervention.service}
            </p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Technicien
            </p>
            <p className="text-sm text-muted-foreground">
              {intervention.intervenant}
            </p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Observation
            </p>
            <p className="text-sm text-muted-foreground">
              {intervention.observations
                ? intervention.observations
                : "Aucune observation"}
            </p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nature
            </p>
            <p className="text-sm text-muted-foreground">
              {intervention.nature?.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionRequetePage;
