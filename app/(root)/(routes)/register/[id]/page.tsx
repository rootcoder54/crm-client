import { getUserById } from "@/action/user/user";
import HeaderPage from "@/components/features/header-page";
import { User } from "lucide-react";

interface pageProps {
  params: Promise<{ id: string }>;
}

const UserIdPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const user = await getUserById(id);
  return (
    <div>
      <HeaderPage
        chemins={[
          { title: "User", url: "#" },
          { title: user?.name ?? "", url: "#" }
        ]}
      ></HeaderPage>
      <div className="my-4 p-5 rounded-lg border-2 space-y-2">
        <h1 className="text-2xl font-bold">User ID</h1>
        <User className="h-28" />
        {user?.name && (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold dark:text-white">Nom Complet</span>{" "}
              : {user.name}
            </p>
            <hr />
          </>
        )}
        <>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold dark:text-white">Username</span> :{" "}
            {user?.username}
          </p>
          <hr />
        </>
        <>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold dark:text-white">Password</span> :{" "}
            {user?.password}
          </p>
          <hr />
        </>
      </div>
    </div>
  );
};

export default UserIdPage;
