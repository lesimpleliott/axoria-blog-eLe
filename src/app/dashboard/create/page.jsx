"use client";

const page = () => {
  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
  }

  return (
    <main className="u-main-container mt-32 mb-44 bg-white p-7">
      <h1 className="mb-4 text-4xl">Write an article 📝</h1>

      <form onSubmit={handleSubmit} className="pb-6">
        <label htmlFor="title" className="f-label">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="f-input w-full"
          placeholder="Enter the title of your article"
          required
        />

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
          className="f-input w-full"
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
