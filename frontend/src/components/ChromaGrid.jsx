import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import ShinyText from "./ShinyText";

const ChromaGrid = ({
    items = [],
    className = "",
    radius = 200,
    damping = 0.45,
    fadeOut = 0.8,
    ease = "power3.out",
}) => {
    const rootRef = useRef(null);
    const fadeRef = useRef(null);
    const setX = useRef(null);
    const setY = useRef(null);
    const pos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        setX.current = gsap.quickSetter(el, "--x", "px");
        setY.current = gsap.quickSetter(el, "--y", "px");
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);
    }, []);

    const moveTo = (x, y) => {
        gsap.to(pos.current, {
            x,
            y,
            duration: damping,
            ease,
            onUpdate: () => {
                setX.current?.(pos.current.x);
                setY.current?.(pos.current.y);
            },
            overwrite: true,
        });
    };

    const handleMove = (e) => {
        const r = rootRef.current.getBoundingClientRect();
        moveTo(e.clientX - r.left, e.clientY - r.top);
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    };

    const handleLeave = () => {
        gsap.to(fadeRef.current, {
            opacity: 1,
            duration: fadeOut,
            overwrite: true,
        });
    };

    const handleCardMove = (e) => {
        const c = e.currentTarget;
        const rect = c.getBoundingClientRect();
        c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    return (
        <div
            ref={rootRef}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className={`relative w-full h-full flex flex-wrap justify-center items-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${className}`}
            style={{
                "--r": `${radius}px`,
                "--x": "50%",
                "--y": "50%",
            }}
        >
            {items.map((item, i) => (
                <Link to={item.path || "#"} key={i} className="no-underline">
                    <article
                        onMouseMove={handleCardMove}
                        className="group relative flex flex-col justify-end w-[300px] h-[130px] rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
                        style={{
                            "--card-border": item.borderColor || "transparent",
                            background: item.gradient,
                            "--spotlight-color": "rgba(255,255,255,0.3)",
                        }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
                            style={{
                                background:
                                    "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
                            }}
                        />

                        {/* Fixed Footer */}
                        <footer className="relative z-10 p-4 text-zinc-100 font-sans flex items-center gap-4 h-full">
                            <div className="w-14 h-14 flex items-center justify-center text-zinc-100 shrink-0">
                                {item.icon}
                            </div>

                            <div className="flex flex-col">
                                <h3 className="text-[1rem] font-semibold m-0">{item.title}</h3>
                                <p className="text-[0.85rem] opacity-80 m-0">{item.subtitle}</p>
                            </div>
                        {item.new ? <div className="absolute text-9xl z-[-1] left-8 font-[Quantico]"><ShinyText text={"NEW"} speed="2" className="opacity-[0.5]"/></div>:<></>}
                        </footer>
                    </article>

                </Link>
            ))}
            <div
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                    backdropFilter: "grayscale(1) brightness(0.78)",
                    WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
                    background: "rgba(0,0,0,0.001)",
                    maskImage:
                        "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
                    WebkitMaskImage:
                        "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
                }}
            />
            <div
                ref={fadeRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
                style={{
                    backdropFilter: "grayscale(1) brightness(0.78)",
                    WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
                    background: "rgba(0,0,0,0.001)",
                    maskImage:
                        "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
                    WebkitMaskImage:
                        "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
                    opacity: 1,
                }}
            />
        </div>
    );
};

export default ChromaGrid;
