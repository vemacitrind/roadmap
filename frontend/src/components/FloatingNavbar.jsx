import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import clsx from 'clsx';
import { isAdmin } from "@/auth/isAdmin";
import Profile from "@/assets/people-user.png";

const FloatingNavbar = ({ parallaxRef }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const navItems = [
    { title: "Home", path: null },
    { title: "Role Based", path: null },
    { title: "Skill Based", path: null },
    { title: "About", path: null },
    { title: "Community", path: "/community" },
    { title: "Projects", path: "/projects" },
  ];
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("authUser"));
  });
  const isLoggedIn = !!user;
  const admin = isLoggedIn && isAdmin(user);
  const destination = isLoggedIn ? (admin ? "/admin" : "/dashboard") : "/login";

  const goTo = (index) => {
    const item = navItems[index];
    setActiveIndex(index);

    if (item.path) {
      navigate(item.path);
    } else {
      parallaxRef.current?.scrollTo(index);
    }
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
      const localUser = JSON.parse(localStorage.getItem("authUser"));
      setUser(localUser);
    }, 800);
    return () => clearInterval(interval);
  }, []);

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
    <div className="hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 md:flex">
      {/* Nav Buttons */}
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
            {item.title}
            {activeIndex === index && (
              <span className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-md -z-10"></span>
            )}
          </button>
        ))}
      </div>

      {/* Avatar/Login */}
      <div className={`bg-white/10 backdrop-blur-xl rounded-full shadow-lg border border-white/20 flex items-center justify-center md:h-[-webkit-fill-available] }`}>
        <Link to={destination} className="flex items-center justify-center w-full h-full">
          {isLoggedIn ? (
            <img
              src={user?.photoURL || Profile}
              onError={(e) => { e.target.onerror = null; e.target.src = Profile; }}
              referrerPolicy="no-referrer"
              alt="User"
              className="w-10 h-10 rounded-full border border-zinc-600 hover:scale-105 transition"
            />
          ) : (
            <span className="text-sm font-medium text-white flex items-center justify-center w-full h-full px-6">
              Login
            </span>
          )}
        </Link>
      </div>

    </div>

  );
};

export default FloatingNavbar;
