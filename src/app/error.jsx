"use client";

import Link from "next/link";

const error = () => {
  return (
    <div className="pt-44 text-center">
      <h1 className="text-5xl font-bold text-red-800">Page not found</h1>
      <p className="mt-2 text-base text-gray-500">A server error has occured</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default error;
