import { sessionInfos } from "@/lib/serverMethods/session/sessionMethods";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  // Ce layout pour les pages de dashboard
  // Vérifie si l'utilisateur est connecté
  // Si non connecté, redirige vers la page de connexion

  const session = await sessionInfos();

  if (!session.success) {
    redirect("/signin");
  }

  return <>{children}</>;
};

export default layout;
