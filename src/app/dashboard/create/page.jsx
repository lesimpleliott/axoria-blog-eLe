"use client";
import { addPost } from "@/lib/serverActions/blog/postServerActions";
import { useRef, useState } from "react";

const page = () => {
  const [tags, setTags] = useState(["CSS", "Javascript"]);
  const tagInputRef = useRef(null);

  function handleSubmit(e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Create a FormData object from the form
    const formData = new FormData(e.target);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    const result = addPost(formData);
  }

  function handleAddTag() {
    // Add a new tag to the tags array
    const newTag = tagInputRef.current.value.trim().toLowerCase();

    // Check if the new tag is not empty, not already in the tags array, and the length of tags is less than or equal to 4
    if (newTag !== "" && !tags.includes(newTag) && tags.length <= 4) {
      setTags([...tags, newTag]);
      tagInputRef.current.value = "";
    }
  }

  function handleRemoveTag(tagToRemove) {
    // Remove the tag from the tags array
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  function handleEnterOnTagInput(e) {
    // Check if the pressed key is "Enter"
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  return (
    <main className="u-main-container mt-32 mb-44 bg-white p-7">
      <h1 className="mb-4 text-4xl">Write an article 📝</h1>

      <form onSubmit={handleSubmit} className="pb-6">
        {/* TITRE */}
        <label htmlFor="title" className="f-label">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="f-input mb-10 w-full"
          placeholder="Enter the title of your article"
          required
        />

        {/* TAGS */}
        <div className="mb-10">
          <label htmlFor="tag" className="f-label">
            Add a tag(s) (optional, max 5)
          </label>
          <div className="flex">
            <input
              type="text"
              className="f-input"
              id="tag"
              placeholder="Add a tag"
              ref={tagInputRef}
              onKeyDown={handleEnterOnTagInput}
            />
            <button
              className="mx-4 rounded-md border-none bg-indigo-500 p-3 font-bold text-white hover:bg-indigo-700"
              onClick={handleAddTag}
              type="button"
            >
              Add
            </button>
            <div className="flex grow items-center gap-2 overflow-y-auto rounded-md border border-gray-300 px-3 whitespace-nowrap shadow">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 cursor-pointer text-red-300 hover:text-red-400"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ARTICLE */}
        <label htmlFor="markdownArticle" className="f-label">
          Write your article using markdown - do not repeat the already given
          title
        </label>
        <a
          href="https://www.markdownguide.org/cheat-sheet/"
          target="_blank"
          className="mb-4 block text-blue-400 hover:text-blue-600 hover:underline"
        >
          How to use Markdown syntax?
        </a>
        <textarea
          name="markdownArticle"
          id="markdownArticle"
          rows={8}
          className="f-input mb-10 w-full"
          placeholder="Write your article here..."
          required
        ></textarea>

        <button className="min-w-44 rounded-md border-none bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-700">
          Submit
        </button>
      </form>
    </main>
  );
};

export default page;
