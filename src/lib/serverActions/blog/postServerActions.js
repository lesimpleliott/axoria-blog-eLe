"use server";

import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import { sessionInfos } from "@/lib/serverMethods/session/sessionMethods";
import connectToDB from "@/lib/utils/db/connectToDB";
import AppError from "@/lib/utils/errorHandling/customError";
import crypto from "crypto";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import Prism from "prismjs";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import sharp from "sharp";
import slugify from "slugify";

// Fonction pour nettoyer le HTML généré par le markdown
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Fonction pour ajouter un article
export async function addPost(formData) {
  const { title, markdownArticle, tags, coverImage } =
    Object.fromEntries(formData);

  try {
    // Validation du titre côté serveur
    if (typeof title !== "string" || title.trim().length < 3) {
      throw new AppError("Invalid data");
    }
    // Validation de l'article côté serveur
    if (
      typeof markdownArticle !== "string" ||
      markdownArticle.trim().length === 0
    ) {
      throw new AppError("Invalid data");
    }

    await connectToDB(); // Connexion à la base de données

    // Vérification de la session côté serveur
    const session = await sessionInfos();
    if (!session.success) {
      throw new AppError("Authentification required");
    }

    // GESTION DE L'UPLOAD DE L'IMAGE
    // Vérification de l'existence de l'image
    if (!coverImage || !(coverImage instanceof File)) {
      throw new AppError("Invalid Data"); // On reste flou sur le message d'erreur pour ne pas donner d'indices à l'attaquant
    }
    // Vérification du format de fichier de l'image
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!validImageTypes.includes(coverImage.type)) {
      throw new AppError("Invalid image type");
    }

    // Vérification de la taille de l'image
    const imageBuffer = Buffer.from(await coverImage.arrayBuffer()); // transforme en donnée brute pour lire les données idem coté front : const img = new Image();
    const { width, height } = await sharp(imageBuffer).metadata();
    if (width > 1280 || height > 720) {
      throw new AppError("Image size too large");
    }

    // Génération d'un nom de fichier unique avec Crytpo : bibliothèque native de Node.js
    // crypto.randomUUID() génère un identifiant unique universel (UUID) pour éviter les collisions de noms de fichiers
    const uniqueFileName = `${crypto.randomUUID()}_${coverImage.name.trim()}`;

    // Enregistrement de l'image sur Bunny CDN
    const uploadUrl = `${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_ZONE}/${uniqueFileName}`; // URL de destination
    const publicImageUrl = `https://axoriapullzone.b-cdn.net/${uniqueFileName}`; // URL publique de l'image

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_API_KEY,
        "Content-type": "application/octet-stream",
      },
      body: imageBuffer,
    });

    if (!response.ok) {
      throw new AppError(
        `Error while uploading image : ${response.statusText}`,
      );
    }

    // Gestion des tags
    // Vérification de l'existence des tags
    if (typeof tags !== "string" || tags.trim().length === 0) {
      throw new AppError("Invalid data");
    }
    const tagNamesArray = JSON.parse(tags);
    // Vérification du format des tags
    if (!Array.isArray(tagNamesArray)) {
      throw new AppError("Invalid tags format, must be an array");
    }

    const tagIds = await Promise.all(
      tagNamesArray.map(async (tagName) => {
        const normalizedTagName = tagName.trim().toLowerCase();
        let tag = await Tag.findOne({ name: normalizedTagName });

        if (!tag) {
          tag = await Tag.create({
            name: normalizedTagName,
            slug: slugify(normalizedTagName, { strict: true }),
          });
        }

        return tag._id;
      }),
    );

    // Gestion du markdown
    marked.use(
      markedHighlight({
        highlight: (code, language) => {
          const validLanguage = Prism.languages[language]
            ? language
            : "plaintext";

          return Prism.highlight(
            code,
            Prism.languages[validLanguage],
            validLanguage,
          );
        },
      }),
    );

    let markdownHTMLResult = marked(markdownArticle);

    // Nettoyage du HTML généré par le markdown. DOMPurify est utilisé pour éviter les attaques XSS
    markdownHTMLResult = DOMPurify.sanitize(markdownHTMLResult);

    // Création de l'article
    const newPost = new Post({
      title,
      markdownArticle,
      markdownHTMLResult,
      tags: tagIds,
      coverImageUrl: publicImageUrl,
    });

    const savedPost = await newPost.save();
    console.log("Post successfully saved");

    return { success: true, slug: savedPost.slug };
  } catch (err) {
    console.error("Error while saving post:", err); // côté TErminal/serveur

    // Gestion des erreurs et renvoi d'un message d'erreur 'personnalisé'
    if (err instanceof AppError) {
      throw err;
    }

    throw new Error("Error while saving post"); // côté client
  }
}
