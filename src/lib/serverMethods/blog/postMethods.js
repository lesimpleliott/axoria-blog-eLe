import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import connectToDB from "@/lib/utils/db/connectToDB";
import { notFound } from "next/navigation";
void Tag;

export async function getPost(slug) {
  await connectToDB();

  // Populate permet de récupérer les données des références (auteur et les tags du post)
  const post = await Post.findOne({ slug })
    .populate({
      path: "author",
      select: "userName normalizedUserName",
    })
    .populate({
      path: "tags",
      select: "name slug",
    });

  // Pas besoin de Try/Catch ici
  // On utilise le composant nextjs : app/not-found.jsx
  // Si le post n'existe pas, on renvoie une page 404
  if (!post) return notFound();

  return post;
}

export async function getPosts() {
  // ici le try catch est implicite avec le middleware errorHandler
  // composant de nextjs : app/error.jsx
  await connectToDB();
  const posts = await Post.find();
  return posts;
}
