"use client";

import { register } from "@/lib/serverActions/session/sessionServerActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";


const page = () => {
  const serverInfoRef = useRef(null);
  const submitButtonRef = useRef(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    serverInfoRef.current.textContent = "";
    submitButtonRef.current.disabled = true;
    submitButtonRef.current.textContent = "Saving...";

    try {
      const formData = new FormData(e.target); // Récupération des données du formulaire
      const result = await register(formData);

      if (result.success) {
        submitButtonRef.current.textContent = "User created!";

        let countdown = 3;
        serverInfoRef.current.textContent = `User saved! Redirecting in ${countdown} seconds...`;

        const interval = setInterval(() => {
          countdown--;
          serverInfoRef.current.textContent = `User saved! Redirecting in ${countdown} second${countdown > 1 ? "s" : ""}...`;
          if (countdown === 0) {
            clearInterval(interval);
            router.push("/signin");
          }
        }, 1000);
      }
    } catch (err) {
      serverInfoRef.current.textContent = `${err.message}`;
      submitButtonRef.current.textContent = "Submit";
      submitButtonRef.current.disabled = false;
    }
  }

  return (
    <main className="mx-auto mt-32 mb-44 max-w-2xl bg-white p-7 px-12">
      <h1 className="mx-auto mb-4 text-4xl">Sign up</h1>

      <form className="mx-auto flex flex-col" onSubmit={handleSubmit}>
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
        <button
          ref={submitButtonRef}
          className="mt-4 min-w-44 cursor-pointer rounded-md border-none bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-700"
        >
          Submit
        </button>
        <p
          ref={serverInfoRef}
          className="mt-2 text-center text-sm text-red-600 italic"
        ></p>

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
