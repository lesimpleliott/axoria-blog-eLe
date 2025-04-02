import Link from "next/link";

function Navbar() {
  return (
    <nav className="fixed z-10 w-full border-b border-b-zinc-300 bg-slate-50">
      <div className="u-main-container flex gap-x-4 py-4">
        <Link className="font-bold text-zinc-900" href="/">
          AXORIA
        </Link>
        <Link className="mr-auto text-zinc-900" href="/categories">
          Categories
        </Link>
        <Link className="text-zinc-900" href="/dashboard/create">
          Add an article
        </Link>
        <Link className="text-zinc-900" href="/signin">
          Sign in
        </Link>
        <Link className="text-zinc-900" href="/signup">
          Sign up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
