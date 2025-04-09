import Image from "next/image";
import Link from "next/link";

const BlogCard = ({ post }) => {
  return (
    <li className="rounded-md bg-white shadow-md transition hover:shadow-xl">
      {/* IMAGE */}
      <Link href={`/article/${post.slug}`}>
        <Image
          src={post.coverImageUrl}
          width={340}
          height={190}
          alt={`Cover image for the article: ${post.title}`}
          className="w-full rounded-t-md object-cover"
        />
      </Link>

      {/* TEXTS */}
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
            href={`/categories/author/${post.author.normalizedUserName}`}
            className="ml-auto truncate text-base whitespace-nowrap text-gray-700 hover:text-gray-600"
          >
            {post.author.userName}
          </Link>
        </div>
        <Link
          href={`/article/${post.slug}`}
          className="mt-2 inline-block text-xl font-semibold text-zinc-800 hover:text-zinc-600"
        >
          {post.title}
        </Link>
      </section>
    </li>
  );
};

export default BlogCard;
