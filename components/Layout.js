// Layout.js
import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import Image from "next/image";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false); // Track isAdmin separately

  // Use useEffect to check isAdmin based on session and status
  useEffect(() => {
    if (status === "authenticated" && session?.user?.isAdmin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [session, status]);

  // Render login page if there is no active session
  if (!session) {
    return (
      <div className="bg-gradient-to-t from-sky-400 to-indigo-900 min-h-screen flex items-center justify-center">
        <div className="text-center w-full">
          <div className="flex items-center justify-center">
            <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-[32rem] p-6">
              <div className="flex items-center justify-center mb-4">
                <h1 href={'/'} className="flex gap-1">
                  <Image
                    src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg"
                    width={48}
                    height={48}
                    alt="CordeCraftingLab"
                  />
                  <span className="text-3xl text-gray-800	">CodeCraftingLab Admin Panel</span>
                </h1>
              </div>
              <div className="mb-6">
                {/* Additional content or form inputs go here */}
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="inline-flex h-10 w-1/2 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 transition-bg ease-in-out duration-300 hover:bg-gray-100"
                  onClick={() => signIn("google")}
                >
                  <svg
                    className="mr-2 -ml-1 w-8 h-8"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the main layout if there is an active session and the user is an admin
  if (session && isAdmin) {
    return (
      <div className="bg-gradient-to-br from-blue-300 via-blue-400 to-indigo-300 min-h-screen ">
        <div className="block md:hidden flex items-center p-4">
          <button onClick={() => setShowNav(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex grow justify-center mr-6">
            <Logo />
          </div>
        </div>
        <div className="flex">
          <Nav show={showNav} />
          <div className="flex-grow p-4">
            {children}
          </div>
        </div>
      </div>
    );
  } else {
    // Render an error message if the user is not an admin or session is loading/error
    return (
      <div className="bg-red-100 min-h-screen flex items-center justify-center text-center">
        {status === "loading" ? (
          <p className="text-3xl font-bold text-red-500">Loading...</p>
        ) : (
          <h1 className="text-3xl font-bold text-red-500">Unauthorized: Not an admin</h1>
        )}
      </div>
    );
  }
}
