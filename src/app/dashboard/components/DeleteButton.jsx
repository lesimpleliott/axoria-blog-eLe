"use client";

import { deletePost } from "@/lib/serverActions/blog/postServerActions";

const DeleteButton = ({ id }) => {
  return (
    <button
      onClick={() => deletePost(id)}
      className="cursor-pointer rounded bg-red-300 px-3 py-1 text-xs font-medium text-white transition ease-in hover:bg-red-500"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
