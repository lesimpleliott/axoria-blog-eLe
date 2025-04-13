import { getPosts } from "@/lib/serverMethods/blog/postMethods";
import Link from "next/link";
import DeleteButton from "../components/DeleteButton";

const page = async () => {
  const posts = await getPosts();

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title block">
        {`Dashboard - Your article${posts.length > 1 ? "s" : ""}`}
      </h1>

      <ul className="flex flex-col gap-3 rounded-xl bg-slate-50 px-4 py-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li
              key={post._id}
              className="flex items-center gap-2 border-b border-gray-200 pb-3 last:border-0 last:pb-0"
            >
              <Link href={`/article/${post.slug}`} className="flex-grow">
                {post.title}
              </Link>
              <Link
                href={`/dashboard/edit/${post.slug}`}
                className="rounded bg-indigo-500 px-3 py-1 text-xs font-semibold text-white transition ease-in hover:bg-indigo-700"
              >
                Edit
              </Link>
              <DeleteButton id={post._id.toString()} />{" "}
              {/* Important de convertir avec ToString car post._id est un 'object.id' */}
            </li>
          ))
        ) : (
          <li>You haven't created any article yet</li>
        )}
      </ul>
    </main>
  );
};

export default page;
