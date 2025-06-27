import { Github, Linkedin, Twitter, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import ShinyText from "./ShinyText";
export default function AboutSection() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <footer className="w-full text-zinc-200 px-6 py-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white">roadmap.in</h1>
                        <p className="text-sm text-zinc-400">by <a href="https://github.com/vemacitrind" target="_blank" className="bg-zinc-900 py-1 px-3 border rounded-md text-zinc-100" ><ShinyText text="@vemacitrind" disabled={false} speed={2} className='custom-class' /></a></p>
                        <p className="text-sm text-zinc-400">   Master your tech journey.</p>
                    </div>

                    <div className="md:col-span-1">
                        <h2 className="text-lg font-semibold text-white mb-2">Our Vision</h2>
                        <p className="text-sm text-zinc-400">
                            We aim to empower learners by offering role & skill-based roadmaps with daily tracking, mentorship, and modern tools.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white mb-2">Quick Roadmaps</h2>
                        <ul className="space-y-1 text-sm text-zinc-400">
                            <li>
                                <Link to="/explore?type=role-based" className="hover:text-white transition">
                                    Role-Based
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore?type=skill-based" className="hover:text-white transition">
                                    Skill-Based
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white mb-2">Follow Us</h2>
                        <div className="flex space-x-4">
                            <a href="https://github.com/vemacitrind" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <Github />
                            </a>
                            <a href="https://linkedin.com/in/vedant-joshi-og" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <Linkedin />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <Twitter />
                            </a>
                            <a href="https://joshivedant-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <Globe />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center text-xs text-zinc-500">
                    © {new Date().getFullYear()} roadmap.in — All rights reserved.
                </div>
            </footer>
        </div>
    );
}
