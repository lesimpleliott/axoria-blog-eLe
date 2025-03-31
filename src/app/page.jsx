import Link from "next/link";

const posts = [
  {
    author: "John Doe",
    title: "How to build a website",
  },
  {
    author: "Jane Smith",
    title: "Understanding React",
  },
  {
    author: "Alice Johnson",
    title: "CSS Flexbox Guide",
  },
];

export default function Home() {
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
                  href={`/categories/author/${post.author}`}
                  className="ml-auto truncate text-base whitespace-nowrap text-gray-700 hover:text-gray-600"
                >
                  {post.author}
                </Link>
              </div>
              <Link
                href={`/articles/${post.title}`}
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
}
