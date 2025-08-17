import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { isAdmin } from '@/auth/isAdmin';
import Profile from '@/assets/people-user.png';

export default function MobileNavbar({ parallaxRef }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const navItems = [
    { title: "Home", path: null },
    { title: "Role Based", path: null },
    { title: "About", path: null },
    { title: "Community", path: "/community" },
    { title: "Projects", path: "/projects" }
  ];

  const user = JSON.parse(localStorage.getItem("authUser"));
  const isLoggedIn = !!user;
  const admin = isLoggedIn && isAdmin(user);
  const destination = isLoggedIn ? (admin ? "/admin" : "/dashboard") : "/login";

  const handleClick = (item, index) => {
    setActiveIndex(index);
    if (item.path) {
      navigate(item.path);
    } else {
      parallaxRef.current?.scrollTo(index);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollTop = parallaxRef.current.container.current.scrollTop;
      const pageHeight = window.innerHeight;
      const index = Math.round(scrollTop / pageHeight);
      setActiveIndex(index);
    };

    const scrollContainer = parallaxRef.current?.container?.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [parallaxRef]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/10 backdrop-blur-xl border-t border-zinc-700 px-4 py-2 flex items-center justify-between">
      <div className="flex gap-2 overflow-x-auto">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(item, index)}
            className={clsx(
              "text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap transition",
               "text-zinc-400 hover:text-white"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>

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
