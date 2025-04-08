"use server";

import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import { sessionInfos } from "@/lib/serverMethods/session/sessionMethods";
import connectToDB from "@/lib/utils/db/connectToDB";
import AppError from "@/lib/utils/errorHandling/customError";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import Prism from "prismjs";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import slugify from "slugify";

// Fonction pour nettoyer le HTML généré par le markdown
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Fonction pour ajouter un article
export async function addPost(formData) {
  const { title, markdownArticle, tags } = Object.fromEntries(formData);

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
