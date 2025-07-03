import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { isAdmin } from '@/auth/isAdmin';
import Profile from '@/assets/people-user.png';

export default function MobileNavbar({ parallaxRef }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navItems = ["Home", "Role Based", "Skill Based", "About"];

  const user = JSON.parse(localStorage.getItem("authUser"));
  const isLoggedIn = !!user;
  const admin = isLoggedIn && isAdmin(user);
  const destination = isLoggedIn ? (admin ? "/admin" : "/dashboard") : "/login";

  const goTo = (index) => {
    parallaxRef.current?.scrollTo(index);
    setActiveIndex(index);
  };

  useEffect(() => {
    const handle = () => {
      if (!parallaxRef.current) return;
      const scrollTop = parallaxRef.current.container.current.scrollTop;
      const pageHeight = window.innerHeight;
      const index = Math.round(scrollTop / pageHeight);
      setActiveIndex(index);
    };

    const scrollContainer = parallaxRef.current?.container?.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", handle);
    return () => scrollContainer.removeEventListener("scroll", handle);
  }, [parallaxRef]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/10 backdrop-blur-xl border-t border-zinc-700 px-4 py-2 flex items-center justify-between">
      <div className="flex gap-4">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={clsx(
              "text-xs font-medium px-3 py-1 rounded-full transition",
              activeIndex === index
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Profile/Login */}
      <Link to={destination}>
        {isLoggedIn && user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="User"
            className="w-8 h-8 rounded-full border border-zinc-600 hover:scale-105 transition"
          />
        ) : isLoggedIn ? (
          <img
            src={Profile}
            alt="User"
            className="w-8 h-8 rounded-full border border-zinc-600 hover:scale-105 transition"
          />
        ) : (
          <span className="text-sm text-white px-3 py-1 rounded hover:underline">
            Login
          </span>
        )}
      </Link>
    </nav>
  );
}
