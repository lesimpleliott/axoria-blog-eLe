import { Session } from "@/lib/models/session";
import { User } from "@/lib/models/user";
import connectToDB from "@/lib/utils/db/connectToDB";
import { cookies } from "next/headers";

export async function sessionInfos() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  // Vérifie si le cookie de session existe
  if (!sessionId) {
    return { success: false };
  }

  await connectToDB();

  // Vérifie si la session existe et si elle n'est pas expirée
  const session = await Session.findById(sessionId);
  if (!session || session.expiredAt < new Date()) {
    return { success: false };
  }

  // Vérifie si l'utilisateur associé à la session existe
  const user = await User.findById(session.userId);
  if (!user) {
    return { success: false };
  }

  // Si tout est valide, retourne les informations de la session
  return {
    success: true,
    userId: user._id.toString(),
  };
}
