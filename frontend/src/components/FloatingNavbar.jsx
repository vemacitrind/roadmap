const FloatingNavbar = ({ parallaxRef }) => {
  const goTo = (index) => parallaxRef.current?.scrollTo(index);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/80 backdrop-blur-md text-white px-6 py-2 rounded-full shadow-xl flex gap-6">
      <button onClick={() => goTo(0)}>Home</button>
      <button onClick={() => goTo(1)}>Role Based</button>
      <button onClick={() => goTo(2)}>Skill Based</button>
      <button onClick={() => goTo(3)}>About</button>
    </div>
  );
};
export default FloatingNavbar;
