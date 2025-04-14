import { Tag } from "@/lib/models/tag";
import connectToDB from "@/lib/utils/db/connectToDB";

export async function getTags() {
  await connectToDB();

  const tags = await Tag.aggregate([
    // On va chercher tous les tags
    {
      $lookup: {
        from: "posts",
        foreignField: "tags",
        localField: "_id",
        as: "postsWithTag",
      },
    },

    // On compte le nombre d'articles par tag : On ajoute un champ postCount qui contient le nombre d'articles
    {
      $addFields: {
        postCount: { $size: "$postsWithTag" },
      },
    },

    // On conserve uniquement les tags qui ont au moins un article (gt : greater than)
    {
      $match: { postCount: { $gt: 0 } },
    },

    // On trie les tags par le nombre d'articles -1 : dans l'ordre décroissant
    {
      $sort: { postCount: -1 },
    },

    // On efface le champ postsWithTag qui n'est plus nécessaire /  On le supprime pour ne pas alourdir la réponse
    // Nous avons besoin de ce champ que pour recupérer le nombre d'articles par tag
    {
      $project: { postsWithTag: 0 },
    },
  ]);

  return tags;
}
