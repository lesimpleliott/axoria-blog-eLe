"use server";

import { Session } from "@/lib/models/session";
import { User } from "@/lib/models/user";
import connectToDB from "@/lib/utils/db/connectToDB";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import slugify from "slugify";

export async function register(formData) {
  const { userName, email, password, passwordRepeat } =
    Object.fromEntries(formData);

  // Vérifie si le mot de passe est supérieur à 3 caractères
  if (userName.length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }

  // Vérifie si le mot de passe est supérieur à 3 caractères
  // Amélioration possible : ajouter des regEx pour vérifier la force du mot de passe
  if (password.length < 3) {
    throw new Error("Password must be at least 6 characters long");
  }
  // Vérifie si les mots de passe sont identiques
  if (password !== passwordRepeat) {
    throw new Error("Passwords do not match");
  }

  try {
    connectToDB();
    const user = await User.findOne({ userName });

    if (user) {
      throw new Error("Username already exists");
    }

    const normalizedUserName = slugify(userName, { lower: true, strict: true }); // normalize the username

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
    console.error("Error while saving user:", err);
    throw new Error(err.message || "An error occurred while saving the user");
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
