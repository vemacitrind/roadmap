import { useState, useEffect } from 'react';
import clsx from 'clsx';

const FloatingNavbar = ({ parallaxRef }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = ["Home", "Role Based", "Skill Based", "About"];

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

    // Cleanup
    return () => {
      scrollContainer.removeEventListener("scroll", handle);
    };
  }, [parallaxRef]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl text-white px-8 py-3 rounded-full shadow-lg flex gap-6 border border-white/20">
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
  );
};

export default FloatingNavbar;
