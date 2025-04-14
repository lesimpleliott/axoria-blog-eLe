import BlogCard from "@/components/BlogCard";
import { getPostsByTag } from "@/lib/serverMethods/blog/postMethods";

const page = async ({ params }) => {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">
        All posts from the{" "}
        <span className="font-black text-blue-800 italic">#{tag}</span> tag.
      </h1>
      <p className="t-main-subtitle">
        All of the posts created that use this tag.
      </p>

      <ul className="u-articles-grid">
        {posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post._id} post={post} />)
        ) : (
          <li>No article found for that tag.</li>
        )}
      </ul>
    </main>
  );
};

export default page;
