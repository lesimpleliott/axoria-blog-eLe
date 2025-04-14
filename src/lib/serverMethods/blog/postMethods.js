import NotFound from "@/app/not-found";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import connectToDB from "@/lib/utils/db/connectToDB";
import { notFound } from "next/navigation";

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

  // On utilise populate pour récupérer les données des références (auteur et les tags du post)
  const posts = await Post.find().populate({
    path: "author",
    select: "userName normalizedUserName",
  });
  // .populate({
  //   path: "tags",
  //   select: "name slug",
  // });
  return posts;
}

export async function getPostsByTag(tagSlug) {
  await connectToDB();
  const tag = await Tag.findOne({ slug: tagSlug }); // On cherche le tag par son slug

  if (!tag) {
    NotFound();
  } // Si le tag n'existe pas, on renvoie une page 404

  const posts = await Post.find({ tags: tag._id }) // On cherche les posts qui ont ce tag
    .populate({
      path: "author",
      select: "userName",
    }) // Populate permet de récupérer les données des références (auteur)
    .select("title coverImageUrl slug createdAt") // Sélectionne uniquement les champs nécessaires
    .sort({ createdAt: -1 }); // Tri par date de création décroissante

  return posts;
}
