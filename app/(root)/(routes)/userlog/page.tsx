"use client";
import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { fetcher } from "@/lib/fetcher";
import { Log } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const UserLogPage = () => {
  const { data: session } = useSession();
  const userid = session?.user.id ?? "";
  const {
    isError,
    isPending,
    data: logs
  } = useQuery<Log[]>({
    queryKey: ["logs"],
    queryFn: () => fetcher(`/api/userlog/${userid}`)
  });
  if (isPending) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner className="size-8" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="m-4">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle> Erreur de donnée </AlertTitle>
          <AlertDescription>
            <p>Une erreur est survenue lors du chargement des Logs.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  const listes = logs.map((log) => ({
    ...log,
    date: format(log.timestamp, "dd-MM-yyyy"),
    heure: format(log.timestamp, "HH:mm")
  }));
  return (
    <DataTable
      chemins={[
        { title: "user", url: "#" },
        { title: "Logs", url: "#" }
      ]}
      data={listes}
      hideList={["createdAt", "updatedAt", "userId", "timestamp"]}
      searchId="action"
      dateChose="timestamp"
      dateChoseTitle="Filter par date"
      selectAction={[]}
    />
  );
};

export default UserLogPage;
