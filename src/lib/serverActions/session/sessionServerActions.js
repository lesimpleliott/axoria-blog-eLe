"use server";

import { Session } from "@/lib/models/session";
import { User } from "@/lib/models/user";
import connectToDB from "@/lib/utils/db/connectToDB";
import AppError from "@/lib/utils/errorHandling/customError";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import slugify from "slugify";

export async function register(formData) {
  const { userName, email, password, passwordRepeat } =
    Object.fromEntries(formData);

  try {
    // Vérifie la longeur du nom d'utilisateur / Côté serveur
    if (typeof userName !== "string" || userName.trim().length < 3) {
      throw new AppError("Username must be at least 3 characters long");
    }

    // Vérifie la longueur du mot de passe (version dev)
    if (typeof password !== "string" || password.trim().length < 6) {
      throw new AppError("Password must be at least 6 characters long");
    }

    // Vérifie que le mot de passe est robuste (version prod)
    // const strongPasswordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    // if (!strongPasswordRegex.test(password)) {
    //   throw new AppError(
    //     "Password must be at least 8 characters and include upper/lowercase, number and special character",
    //   );
    // }

    // Vérifie si les mots de passe sont identiques
    if (password !== passwordRepeat) {
      throw new AppError("Passwords do not match");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Vérifie si l'email est valide / Côté serveur
    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      throw new AppError("Invalid email format");
    }

    connectToDB(); // Connexion à la base de données

    // On vérifie que l'utilisateur n'existe pas (username ou email)
    const user = await User.findOne({
      $or: [{ userName }, { email }],
    }); // si user est null, l'utilisateur n'existe pas, sinon retroune un user
    if (user) {
      throw new AppError(
        user.userName === userName // Vérifie si le nom d'utilisateur existe déjà
          ? "Username already exists" // si le usernam existe déjà
          : "Email already registered", // si l'email existe déjà
      );
    }

    const normalizedUserName = slugify(userName, { lower: true, strict: true }); // Normalisation du nom d'utilisateur

    const salt = await bcrypt.genSalt(10); // Génération d'un salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hashage du mot de passe

    const newUser = new User({
      userName,
      normalizedUserName,
      email,
      password: hashedPassword,
    });
    await newUser.save(); // Enregistrement de l'utilisateur dans la base de données
    console.log("newUser saved to DB", newUser);

    return { success: true };
  } catch (err) {
    console.error("Error while registering user:", err);

    if (err instanceof AppError) {
      throw err; // Si c'est une erreur personnalisée, on la renvoie
    }

    throw new Error("An error occurred while saving the user");
  }
}

export async function login(formData) {
  const { userName, password } = Object.fromEntries(formData);

  try {
    await connectToDB();

    // Trouve l'utilisateur par son userName
    const user = await User.findOne({ userName: userName });
    if (!user) {
      throw new Error("Invalid Credentials"); // on affiche 'Credentials' et non 'userName' pour ne pas donner d'indices à un éventuel hacker
    }

    // Vérifie si le mot de passe est valide
    const isPasswordValid = await bcrypt.compare(password, user.password); // Vérifie si le mot de passe est valide
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials"); // on affiche 'Credentials' et non 'password' pour ne pas donner d'indices à un éventuel hacker
    }

    let session;
    // Vérifie si une session existe déjà pour cet utilisateur
    const existingSession = await Session.findOne({
      userId: user._id,
      expiresAt: { $gt: new Date() },
    });

    // Si une session existe, on la met à jour
    if (existingSession) {
      session = existingSession;
      existingSession.expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ); // 1 semaine en ms (7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    } else {
      // Sinon, on crée une nouvelle session
      session = new Session({
        userId: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 semaine en ms (7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      });
      await session.save();
    }

    // Mise en place du cookie de session
    const cookieStore = await cookies();
    cookieStore.set("sessionId", session._id.toString(), {
      httpOnly: true, // Empêche l'accès via JavaScript côté client
      secure: process.env.NODE_ENV === "production", // Utilise le cookie sécurisé en production
      path: "/", // Chemin du cookie
      maxAge: 60 * 60 * 24 * 7, // 1 semaine en minute (7 days * 24 hours * 60 minutes * 60 seconds)
      sameSite: "lax", // Bloque l'envoi du cookie vers d'autres sites/URL
    });

    console.log("Session created:", session);
    return { success: true };
  } catch (err) {
    console.error("Error while logging in:", err);
    throw new Error(err.message || "An error occurred while logging in");
  }
}

export async function logout() {
  const cookieStore = await cookies(); // Récupère le cookie de session
  const sessionId = cookieStore.get("sessionId")?.value; // Récupère l'ID de la session

  try {
    await Session.findByIdAndDelete(sessionId); // Supprime la session de la base de données
    cookieStore.delete("sessionId"); // Supprime le cookie de session
    // cookieStore.set("sessionId", "", {
    //   httpOnly: true, // Empêche l'accès via JavaScript côté client
    //   secure: process.env.NODE_ENV === "production", // Utilise le cookie sécurisé en production
    //   path: "/", // Chemin du cookie
    //   maxAge: 0, // supprime immédiatement le cookie
    //   sameSite: "strict",
    // });

    return { success: true };
  } catch (err) {
    console.error("Error while logging out:", err);
    throw new Error(err.message || "An error occurred while logging out");
  }
}

export async function isPrivatePage(pathname) {
  const privateSegments = ["/dashboard", "/settings/profile"];

  return privateSegments.some(
    (segment) => pathname === segment || pathname.startsWith(segment + "/"),
  );
}
