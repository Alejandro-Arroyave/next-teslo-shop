"use client";

import { logout } from "@/actions";
import { useUiStore } from "@/store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

export const Sidebar = () => {
  const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen);
  const closeSideMenu = useUiStore((state) => state.closeSideMenu);
  const router = useRouter();

  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeSideMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        ></div>
      )}

      {/* Sidemenu */}
      <nav
        // todo: slide effect
        className={clsx(
          "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          { "translate-x-full": !isSideMenuOpen }
        )}
      >
        <IoCloseOutline
          className="absolute top-5 right-5 cursor-pointer"
          size={50}
          onClick={closeSideMenu}
        />

        {/* Input */}
        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 rounded pl-10 pr-10 py-1 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Menu */}
        {isAuthenticated ? (
          <>
            <Link
              href="/profile"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
              onClick={closeSideMenu}
            >
              <IoPersonOutline scale={30} />
              <span className="ml-3 text-xl">Profile</span>
            </Link>

            <Link
              href="/"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
            >
              <IoTicketOutline scale={30} />
              <span className="ml-3 text-xl">Orders</span>
            </Link>

            <button
              onClick={async () => {
                await logout();
                window.location.reload();
              }}
              className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
            >
              <IoLogOutOutline scale={30} />
              <span className="ml-3 text-xl">Log Out</span>
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
            onClick={closeSideMenu}
          >
            <IoLogInOutline scale={30} />
            <span className="ml-3 text-xl">Log In</span>
          </Link>
        )}

        {isAdmin ? (
          <>
            {/* Line separator */}
            <div className="w-full h-px bg-gray-200 my-10" />

            <Link
              href="/"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
            >
              <IoShirtOutline scale={30} />
              <span className="ml-3 text-xl">Products</span>
            </Link>

            <Link
              href="/"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
            >
              <IoTicketOutline scale={30} />
              <span className="ml-3 text-xl">Orders</span>
            </Link>

            <Link
              href="/"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
            >
              <IoPeopleOutline scale={30} />
              <span className="ml-3 text-xl">Users</span>
            </Link>
          </>
        ) : null}
      </nav>
    </div>
  );
};
