import Link from "next/link";

const NotFound = () => {
  return (
    <div className="pt-44 text-center">
      <h1 className="text-8xl font-bold text-red-800">404</h1>
      <p className="text-2xl font-semibold">
        Could not find requested ressource{" "}
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
