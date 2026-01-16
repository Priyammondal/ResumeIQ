import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { auth } = usePuterStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar flex items-center justify-between px-4 sm:px-6 py-4 bg-white shadow-md relative z-50">
      {/* Logo */}
      <Link to="/">
        <p className="text-xl sm:text-2xl font-bold text-gradient cursor-pointer">
          RESUMIND
        </p>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Upload Button */}
        <Link
          to="/upload"
          className="hidden sm:inline-flex items-center justify-center gap-2
            rounded-full
            bg-gradient-to-r from-purple-500 to-cyan-400
            px-5 py-2.5
            sm:px-8 sm:py-3
            text-sm sm:text-lg
            font-semibold
            text-white
            shadow-md sm:shadow-lg
            transition-all
            hover:scale-105 hover:shadow-xl
          "
        >
          Upload Resume
        </Link>

        {/* User Icon */}
        {auth.isAuthenticated && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FaUserCircle className="w-8 h-8 text-purple-500 hover:text-purple-600 transition-colors duration-300" />
            </button>

            {/* Modern Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in scale-in origin-top-right duration-200">
                {/* Arrow */}
                <div className="absolute -top-2 right-4 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-200" />

                <button
                  onClick={() => auth.signOut()}
                  className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors duration-200 font-medium text-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
