import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Link } from "react-router-dom"
import { isAdmin } from "@/auth/isAdmin";
import Profile from "@/assets/people-user.png"
import ButtonOutline from './ButtonOutline';

const FloatingNavbar = ({ parallaxRef }) => {
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

      const offset = parallaxRef.current.current;
      const scrollTop = parallaxRef.current.container.current.scrollTop;
      const pageHeight = window.innerHeight;
      const index = Math.round(scrollTop / pageHeight);
      setActiveIndex(index);
    };

    const scrollContainer = parallaxRef.current?.container?.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", handle);

    return () => {
      scrollContainer.removeEventListener("scroll", handle);
    };
  }, [parallaxRef]);


  return (
    <div className="hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 md:flex">
      {/* Nav Bubble */}
      <div className="bg-white/10 backdrop-blur-xl text-white px-2 py-2 rounded-full shadow-lg flex items-center gap-6 border border-white/20">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={clsx(
              "relative px-4 py-1 text-sm font-medium transition-all duration-300",
              activeIndex === index && "text-white"
            )}
          >
            {item}
            {activeIndex === index && (
              <span className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-md -z-10"></span>
            )}
          </button>
        ))}
      </div>

      {/* Login Bubble */}
      <div className={`bg-white/10 backdrop-blur-xl ${isLoggedIn ? "px-0 py-0" : "px-8 py-2.5"} rounded-full shadow-lg border border-white/20 flex items-center`}>
        <button className="relative text-sm font-medium transition-all duration-300 text-white">
          <Link to={destination}>
            {isLoggedIn ? (
              <img
                src={user?.photoURL || Profile}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Profile;
                }}
                referrerPolicy="no-referrer"
                alt="User"
                className="w-10 h-10 rounded-full border border-zinc-600 hover:scale-105 transition"
              />
            ) : (
              <button className="relative text-sm font-medium transition-all duration-300 text-white">
                Login
              </button>
            )}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default FloatingNavbar;
