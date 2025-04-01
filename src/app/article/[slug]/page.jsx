import { getPost } from "@/lib/serverMethods/blog/postMethods";
import Link from "next/link";

const page = async ({ params }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="mb-3 text-4xl">{post.title}</h1>
      <div className="mb-2 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag._id} href={`categories/tags/${tag.slug}`}>
            <li className="inline-block cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-300">
              #{tag.name}
            </li>
          </Link>
        ))}
      </div>
      <p>{post.markdownArticle}</p>
    </main>
  );
};

export default page;
