import { getTags } from "@/lib/serverMethods/blog/tagMethods";
import Link from "next/link";

const page = async () => {
  const tags = await getTags();

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">All categories</h1>
      <p className="t-main-subtitle">Find articles sorted by categorie tag.</p>

      <ul className="u-articles-grid">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <li key={tag._id} className="rounded-md bg-white shadow-md">
              <Link className="flex items-baseline p-4" href={`/categories/tag/${tag.slug}`}>
                <span className="text-lg flex-grow font-semibold underline">
                  #{tag.name}
                </span>
                <span className="text-sm text-gray-500">
                  Articles count: {tag.postCount}
                </span>
              </Link>
            </li>
          ))
        ) : (
          <li>No categorie found.</li>
        )}
      </ul>
    </main>
  );
};

export default page;
