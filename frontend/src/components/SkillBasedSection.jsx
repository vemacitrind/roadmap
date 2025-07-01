import { Link } from "react-router-dom";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import ChromaGrid from "./ChromaGrid";
import { JavaIcon,PythonIcon,JavaScriptIcon,ReactIcon,FlutterIcon,CSharpIcon,NodejsIcon,TypeScriptIcon, DockerIcon,GitIcon,GoIcon } from "./Icon";
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
  GitBranch,MoveRight,
  GiftIcon
} from "lucide-react";

const items = [
  {
    title: "Java",
    subtitle: "Enterprise applications, Android, Spring Boot...",
    icon: <JavaIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/java",
  },
  {
    title: "Python",
    subtitle: "Web development, Data Science, AI/ML, Django...",
    icon: <PythonIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/python",
  },
  {
    title: "JavaScript",
    subtitle: "Frontend, Backend (Node.js), Full-stack...",
    icon: <JavaScriptIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/javascript",
  },
  {
    title: "React",
    subtitle: "Frontend UI, Single-Page Applications, JSX...",
    icon: <ReactIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/react",
  },
  {
    title: "Go (Golang)",
    subtitle: "High-performance APIs, Concurrency, Microservices...",
    icon: <GoIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/go",
  },
  {
    title: "Flutter",
    subtitle: "Cross-platform mobile apps, Dart, UI Toolkit...",
    icon: <FlutterIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/flutter",
    new:true
  },
  {
    title: "TypeScript",
    subtitle: "Static typing for JS, Scalable applications...",
    icon: <TypeScriptIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/typescript",
  },
  {
    title: "C# (.NET)",
    subtitle: "Windows apps, Web APIs, Game Dev (Unity)...",
    icon: <CSharpIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/csharp",
  },
  {
    title: "Node.js",
    subtitle: "Backend JavaScript, REST APIs, Event-driven...",
    icon: <NodejsIcon size={42} />,
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
    icon: <DockerIcon size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/skill/docker",
    new:true
  },
  {
    title: "Git & GitHub",
    subtitle: "Version control, Collaboration, Code management...",
    icon: <GitIcon size={42} />,
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
            <div
        className="w-full max-w-7xl h-[600px] overflow-y-auto flex justify-center items-start px-2 mb-10"
      >
            <div style={{ height: '600px', position: 'relative' }}>
                <ChromaGrid 
                    items={items}
                    radius={300}
                    damping={0.45}
                    fadeOut={0.6}
                    ease="power3.out"
                />
            </div>
            </div>
            
            <Link to="/explore?type=skill" className="group">
                <ButtonWithIcon size="md" className="transition-all">
                    View Skill-Based
                    <MoveRight className="hidden group-hover:inline-block transition-all" />
                </ButtonWithIcon>
            </Link>

        </section>
    );
}

