"use client";
import { addPost } from "@/lib/serverActions/blog/postServerActions";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const page = () => {
  const [tags, setTags] = useState([]);

  const router = useRouter();

  const tagInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const serverValidationText = useRef(null);
  const imgUploadValidationText = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    const formData = new FormData(e.target); // Récupération des données du formulaire
    formData.set("tags", JSON.stringify(tags)); // Ajout des tags au FormData

    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    // Reset le message de validation
    serverValidationText.current.textContent = "";
    submitButtonRef.current.textContent = "Saving...";
    submitButtonRef.current.disabled = true; // Désactive le bouton de soumission

    try {
      // Simule une attente de 1 seconde avant d'envoyer la requête
      // ou sans délai, utiliser la ligne suivante :
      // const result = await addPost(formData);
      const [result] = await Promise.all([
        addPost(formData),
        new Promise((res) => setTimeout(res, 1000)), // minimum 1s
      ]);

      if (result.success) {
        submitButtonRef.current.textContent = "Post saved!";

        let countdown = 3;
        serverValidationText.current.textContent = `Post saved! Redirecting in ${countdown} seconds...`;

        const interval = setInterval(() => {
          countdown--;
          serverValidationText.current.textContent = `Post saved! Redirecting in ${countdown} second${countdown > 1 ? "s" : ""}...`;
          if (countdown === 0) {
            clearInterval(interval);
            router.push(`/article/${result.slug}`);
          }
        }, 1000);
      }
    } catch (err) {
      serverValidationText.current.textContent = `${err.message}`;
      submitButtonRef.current.textContent = "Submit";
      submitButtonRef.current.disabled = false;
    }
  }

  function handleAddTag() {
    // Recuperation de la valeur de l'input
    const newTag = tagInputRef.current.value.trim().toLowerCase();

    // Vérifie si la valeur n'est pas vide, n'est pas déjà présente dans le tableau et que le tableau ne dépasse pas 5 éléments
    if (newTag !== "" && !tags.includes(newTag) && tags.length <= 4) {
      setTags([...tags, newTag]);
      tagInputRef.current.value = "";
    }
  }

  function handleRemoveTag(tagToRemove) {
    // Supprime le tag du tableau
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  function handleEnterOnTagInput(e) {
    // Vérifie si la touche pressée est "Enter"
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  const maxTags = 5;
  const tagsRemaining = maxTags - tags.length;
  const tagsRemainingText =
    tagsRemaining > 0
      ? `You can add ${tagsRemaining} more tag${tagsRemaining > 1 ? "s" : ""}.`
      : "You have reached the maximum number of tags.";

  function handleFileChange(e) {
    const file = e.target.files[0];
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!validImageTypes.includes(file.type)) {
      imgUploadValidationText.current.textContent =
        "Please upload a valid image file (JPEG, JPG, PNG, WEBP).";
      e.target.value = "";
      return;
    } else {
      imgUploadValidationText.current.textContent = "";
    }

    const img = new Image();
    img.addEventListener("load", checkImgSizeOnLoad);

    function checkImgSizeOnLoad() {
      if (img.width > 1280 || img.height > 720) {
        imgUploadValidationText.current.textContent =
          "Please upload an image with a maximum size of 1280 x 720 pixels.";
        e.target.value = "";
        URL.revokeObjectURL(img.src); // Libère la mémoire
        return;
      } else {
        imgUploadValidationText.current.textContent = "";
        URL.revokeObjectURL(img.src); // Libère la mémoire car inutilisé après lecture de la taille
      }
    }

    img.src = URL.createObjectURL(file); // Crée une URL temporaire pour l'image
  }

  return (
    <main className="u-main-container mt-32 mb-44 bg-white p-7">
      <h1 className="mb-4 text-4xl">Write an article 📝</h1>

      <form onSubmit={handleSubmit} className="pb-6">
        {/* TITRE */}
        <label htmlFor="title" className="f-label mb-2">
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

        {/* IMAGE */}
        <label htmlFor="coverImage" className="f-label mb-2">
          Cover image{" "}
          <span className="text-sm font-light text-gray-500 italic">
            (1280 x 720 for best quality, or less)
          </span>
        </label>
        <input
          type="file"
          name="coverImage"
          id="coverImage"
          className="f-input mb-0.5 w-full"
          placeholder="Article's cover image"
          required
          onChange={handleFileChange}
        />
        <p
          ref={imgUploadValidationText}
          className="mb-10 ml-2 text-sm text-red-700 italic"
        ></p>

        {/* TAGS */}
        <div className="mb-10">
          <label htmlFor="tag" className="f-label">
            Add a tag(s)
          </label>
          <p className="mb-2 text-sm text-gray-400 italic">
            {tagsRemainingText}
          </p>

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
          Write your article using markdown {""}{" "}
          <span className="text-sm font-light text-gray-500 italic">
            (do not repeat the already given title)
          </span>
        </label>
        <a
          href="https://www.markdownguide.org/cheat-sheet/"
          target="_blank"
          className="mb-2 block text-blue-400 hover:text-blue-600 hover:underline"
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

        <button
          ref={submitButtonRef}
          className="min-w-44 rounded-md border-none bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-700"
        >
          Submit
        </button>
        <p
          ref={serverValidationText}
          className="mt-1 pl-1.5 text-sm font-light text-gray-400 italic"
        ></p>
      </form>
    </main>
  );
};

export default page;
