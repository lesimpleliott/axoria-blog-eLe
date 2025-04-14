"use client";

import {
  isPrivatePage,
  logout,
} from "@/lib/serverActions/session/sessionServerActions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NavbarDropdown = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

  function handleDropdown() {
    setIsOpen(!isOpen);
    // console.log("Dropdown clicked", "isOpen:", isOpen);
  }

  async function handleLogout() {
    await logout();

    //
    const currentPath = window.location.pathname;
    if (isPrivatePage(currentPath)) {
      router.push("/signin");
    }
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (!dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    }

    // Ajout de l'écouteur d'événements pour détecter les clics en dehors du dropdown
    document.addEventListener("click", handleClickOutside);

    // Nettoyage l'écouteur d'événements lors du démontage du composant
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button className="flex cursor-pointer" onClick={handleDropdown}>
        <Image src="/icons/user.svg" alt="" width={24} height={24} />
      </button>

      {isOpen && (
        <ul className="absolute top-10 right-0 w-[250px] border-x border-b border-zinc-300">
          <li className="border-b border-zinc-300 bg-slate-50 hover:bg-slate-100">
            <Link
              href={`/dashboard/${userId}`}
              onClick={closeDropdown}
              className="block p-4"
            >
              Dashboard
            </Link>
          </li>
          <li className="bg-slate-50 hover:bg-slate-100">
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer p-4 text-left hover:text-red-600"
            >
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default NavbarDropdown;
