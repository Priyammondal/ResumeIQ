import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { FaUserCircle } from "react-icons/fa";

export const meta = () => [
  { title: "RESUMIND | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1] || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-100 via-white to-cyan-100 overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

      {/* Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md">
        <section className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col gap-6 animate-in fade-in duration-700">
          {/* Icon */}
          <div className="flex justify-center">
            <FaUserCircle className="text-purple-500 w-16 h-16 sm:w-20 sm:h-20 animate-pulse" />
          </div>

          {/* Header */}
          <div className="text-center flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Log in to continue your job journey and get AI-powered resume insights.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mt-4">
            {isLoading ? (
              <button className="w-full flex justify-center items-center gap-2 bg-gray-300 text-gray-700 py-3 rounded-full font-semibold animate-pulse">
                Signing you in...
              </button>
            ) : auth.isAuthenticated ? (
              <button
                onClick={auth.signOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold shadow-md transition-all duration-300"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={auth.signIn}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105"
              >
                Log In with Provider
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
