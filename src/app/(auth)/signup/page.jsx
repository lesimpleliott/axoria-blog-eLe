import Link from "next/link";

const page = () => {
  return (
    <main className="mx-auto mt-32 mb-44 max-w-2xl bg-white p-7 px-12">
      <h1 className="mx-auto mb-4 text-4xl">Sign up</h1>

      <form className="mx-auto flex flex-col">
        {/* NAME */}
        <label htmlFor="userName" className="f-label mb-2">
          Name or pseudo
        </label>
        <input
          className="f-input mb-6 placeholder:italic"
          type="text"
          id="userName"
          name="userName"
          placeholder="John Doe"
          required
        />

        {/* EMAIL */}
        <label htmlFor="email" className="f-label mb-2">
          e-mail
        </label>
        <input
          className="f-input mb-6 placeholder:italic"
          type="email"
          id="email"
          name="email"
          placeholder="johndoe@email.com"
        />

        {/* PASSWORD */}
        <label htmlFor="password" className="f-label mb-2">
          Password
        </label>
        <input
          className="f-input mb-6 placeholder:italic"
          type="password"
          id="password"
          name="password"
          placeholder="Your password"
          required
        />

        {/* PASSWORD CONFIRMATION */}
        <label htmlFor="passwordRepeat" className="f-label mb-2">
          Password confirmation
        </label>
        <input
          className="f-input mb-10 placeholder:italic"
          type="password"
          id="passwordRepeat"
          name="passwordRepeat"
          placeholder="Confirm your password"
          required
        />

        {/* SUBMIT */}
        <button className="mt-4 min-w-44 cursor-pointer rounded-md border-none bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-700">
          Submit
        </button>

        <Link
          href={"/signin"}
          className="mt-4 text-center text-sm text-indigo-700 italic hover:text-indigo-500 hover:underline"
        >
          Already have an account? Sign in
        </Link>
      </form>
    </main>
  );
};

export default page;
