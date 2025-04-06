import { getPosts } from "@/lib/serverMethods/blog/postMethods";
import Link from "next/link";

const Home = async () => {
  const posts = await getPosts();

  return (
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Stay up to date with AXORIA</h1>
      <p className="t-main-subtitle">Tech news and useful knowledge</p>

      <p className="text-md text-zinc-900">Latest articles</p>
      <ul className="u-articles-grid">
        {posts.map((post, index) => (
          <li
            key={index}
            className="rounded-md shadow-md transition hover:shadow-xl"
          >
            <section className="px-5 pt-5 pb-7">
              <div className="flex items-baseline gap-x-4 text-xs">
                <time
                  dateTime={new Date().toISOString()}
                  className="text-sm text-gray-500"
                >
                  {new Date().toLocaleDateString("en-EN", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}
                </time>
                <Link
                  href={`/categories/author/johnDoe`}
                  className="ml-auto truncate text-base whitespace-nowrap text-gray-700 hover:text-gray-600"
                >
                  John Doe
                </Link>
              </div>
              <Link
                href={`/article/${post.slug}`}
                className="mt-6 inline-block text-xl font-semibold text-zinc-800 hover:text-zinc-600"
              >
                {post.title}
              </Link>
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
