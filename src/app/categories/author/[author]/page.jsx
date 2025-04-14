import BlogCard from "@/components/BlogCard";
import { getPostsByAuthor } from "@/lib/serverMethods/blog/postMethods";

const page = async ({ params }) => {
  const { author } = await params;
  const postsData = await getPostsByAuthor(author);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Posts from {postsData.author.userName}</h1>
      <p className="t-main-subtitle">
        Every posts created by {postsData.author.userName}.
      </p>

      <ul className="u-articles-grid">
        {postsData.posts.length > 0 ? (
          postsData.posts.map((post) => <BlogCard key={post._id} post={post} />)
        ) : (
          <li>There is no article written by this author.</li>
        )}
      </ul>
    </main>
  );
};

export default page;
