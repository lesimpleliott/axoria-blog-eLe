import connectToDB from "@/lib/utils/db/connectToDB";
import bcrypt from "bcryptjs/dist/bcrypt";
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
  if (password.length < 6) {
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
    console.log("newUser saved to DB", newUser);

    return { success: true };
  } catch (err) {
    console.error("Error while saving user:", err);
    throw new Error(err.message || "An error occurred while saving the user");
  }
}
