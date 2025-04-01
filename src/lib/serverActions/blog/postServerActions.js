"use server";

import { Post } from "@/lib/models/post";
import connectToDB from "@/lib/utils/db/connectToDB";

export async function addPost(formData) {
  const { title, markdownArticle } = Object.fromEntries(formData);

  try {
    await connectToDB();
    const newPost = new Post({
      title,
      markdownArticle,
    });

    const savedPost = await newPost.save();
    console.log("Post successfully saved");

    return { success: true, slug: savedPost.slug };
  } catch (err) {
    console.error("Error while saving post:", err);
    throw new Error(err.message || "An error occurred while saving the post");
  }
}
