import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import connectToDB from "@/lib/utils/db/connectToDB";
void Tag;

export async function getPost(slug) {
  try {
    await connectToDB();
    const post = await Post.findOne({ slug }).populate({
      path: "tags",
      select: "name slug",
    });
    return post;
  } catch (err) {
    console.error("Error while fetching post:", err);
    throw new Error("An error occurred while fetching the post");
  }
}

export async function getPosts() {
  try {
    await connectToDB();
    const posts = await Post.find();
    return posts;
  } catch (err) {
    console.error("Error while fetching posts:", err);
    throw new Error("An error occurred while fetching the posts");
  }
}
