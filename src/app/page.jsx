import BlogCard from "@/components/BlogCard";
import { getPosts } from "@/lib/serverMethods/blog/postMethods";

const Home = async () => {
  const posts = await getPosts();

  return (
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Stay up to date with AXORIA</h1>
      <p className="t-main-subtitle">Tech news and useful knowledge</p>

      <p className="text-md text-zinc-900">Latest articles</p>
      <ul className="u-articles-grid">
        {posts.map((post) => (
          <BlogCard post={post} key={post._id} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
