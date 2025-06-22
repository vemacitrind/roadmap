import { Link } from "react-router-dom";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import ChromaGrid from "./ChromaGrid";
import {
  Coffee,
  FlaskConical,
  Webhook,
  Atom,
  ArrowRightCircle,
  SquareTerminal,
  Type,
  Cross, 
  Server,
  Database,
  Container,
  GitBranch,MoveRight
} from "lucide-react";

const items = [
  {
    title: "Java",
    subtitle: "Enterprise applications, Android, Spring Boot...",
    icon: <Coffee size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/java",
  },
  {
    title: "Python",
    subtitle: "Web development, Data Science, AI/ML, Django...",
    icon: <FlaskConical size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/python",
  },
  {
    title: "JavaScript",
    subtitle: "Frontend, Backend (Node.js), Full-stack...",
    icon: <Webhook size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/javascript",
  },
  {
    title: "React",
    subtitle: "Frontend UI, Single-Page Applications, JSX...",
    icon: <Atom size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/react",
  },
  {
    title: "Go (Golang)",
    subtitle: "High-performance APIs, Concurrency, Microservices...",
    icon: <ArrowRightCircle size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/go",
  },
  {
    title: "Flutter",
    subtitle: "Cross-platform mobile apps, Dart, UI Toolkit...",
    icon: <SquareTerminal size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/flutter",
  },
  {
    title: "TypeScript",
    subtitle: "Static typing for JS, Scalable applications...",
    icon: <Type size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/typescript",
  },
  {
    title: "C# (.NET)",
    subtitle: "Windows apps, Web APIs, Game Dev (Unity)...",
    icon: <Cross size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/csharp",
  },
  {
    title: "Node.js",
    subtitle: "Backend JavaScript, REST APIs, Event-driven...",
    icon: <Server size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/nodejs",
  },
  {
    title: "SQL",
    subtitle: "Relational Databases, Data querying, MySQL, PostgreSQL...",
    icon: <Database size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/sql",
  },
  {
    title: "Docker",
    subtitle: "Containerization, Microservices, DevOps...",
    icon: <Container size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/docker",
  },
  {
    title: "Git & GitHub",
    subtitle: "Version control, Collaboration, Code management...",
    icon: <GitBranch size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/git",
  },
];

export default function SkillBasedSection() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <h2 className="text-4xl text-white font-semibold mb-4">Skills Based Roadmaps</h2>
            <p className="text-md text-zinc-300 max-w-xl text-center mb-10">
                Follow structured roadmaps for Skills like Python Developer, React Developer, and more.
            </p>
            <div style={{ height: '600px', position: 'relative' }}>
                <ChromaGrid 
                    items={items}
                    radius={300}
                    damping={0.45}
                    fadeOut={0.6}
                    ease="power3.out"
                />
            </div>
            
            <Link to="/explore?type=role-based" className="group">
                <ButtonWithIcon size="md" className="transition-all">
                    View Skill-Based
                    <MoveRight className="hidden group-hover:inline-block transition-all" />
                </ButtonWithIcon>
            </Link>

        </section>
    );
}
