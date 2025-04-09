import { getPost } from "@/lib/serverMethods/blog/postMethods";
import Link from "next/link";
import "prism-themes/themes/prism-dracula.css";
import "./article-styles.css";
import Image from "next/image";

const page = async ({ params }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="mb-3 text-4xl">{post.title}</h1>
      <div className="mb-2 flex flex-wrap gap-2">
        <p>
          By&nbsp;
          <Link
            href={`/categories/author/${post.author.normalizedUserName}`}
            className="mr-4 underline hover:text-sky-500"
          >
            {post.author.userName}
          </Link>
        </p>

        {post.tags.map((tag) => (
          <Link key={tag._id} href={`categories/tags/${tag.slug}`}>
            <li className="inline-block cursor-pointer rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-900 hover:bg-sky-300">
              #{tag.name}
            </li>
          </Link>
        ))}
      </div>

      <Image src={post.coverImageUrl} alt={post.title} width={1280} height={720} className="mb-10"/>


      <section
        className="article-styles"
        dangerouslySetInnerHTML={{ __html: post.markdownHTMLResult }}
      />
    </main>
  );
};

export default page;
