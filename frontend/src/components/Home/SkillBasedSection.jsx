import { Link } from "react-router-dom";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import ChromaGrid from "@/components/ReactBit/ChromaGrid";
import { JavaIcon,PythonIcon,JavascriptIcon,ReactIcon,FlutterIcon,CSharpIcon,NodejsIcon,TypeScriptIcon, DockerIcon,GitIcon,GoIcon } from "@/components/Icon";
import {Database,MoveRight} from "lucide-react";
import { Icon } from "@iconify/react";

const IconWrapper = ({ name, className = "" }) => (
  <div className="w-[42px] h-[42px] flex items-center justify-center">
    <Icon
      icon={name}
      className={`scale-125 ${className}`}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        color: "white"
      }}
    />
  </div>
);

const items = [
  {
    title: "Java",
    subtitle: "Enterprise applications, Android, Spring Boot...",
    icon: <IconWrapper name="logos:java" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/java-tutorial",
  },
  {
    title: "Python",
    subtitle: "Web development, Data Science, AI/ML, Django...",
    icon: <IconWrapper name="logos:python" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/python-tutorial",
  },
  {
    title: "JavaScript",
    subtitle: "Frontend, Backend (Node.js), Full-stack...",
    icon: <IconWrapper name="logos:javascript" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/javascript",
  },
  {
    title: "React",
    subtitle: "Frontend UI, Single-Page Applications, JSX...",
    icon: <IconWrapper name="logos:react" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/react",
  },
  {
    title: "Go (Golang)",
    subtitle: "High-performance APIs, Concurrency, Microservices...",
    icon: <IconWrapper name="logos:go" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/go",
  },
  {
    title: "Flutter",
    subtitle: "Cross-platform mobile apps, Dart, UI Toolkit...",
    icon: <IconWrapper name="logos:flutter" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/flutter",
    new: true,
  },
  {
    title: "TypeScript",
    subtitle: "Static typing for JS, Scalable applications...",
    icon: <IconWrapper name="logos:typescript-icon" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/typescript",
  },
  {
    title: "C# (.NET)",
    subtitle: "Windows apps, Web APIs, Game Dev (Unity)...",
    icon: <IconWrapper name="devicon:csharp" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/csharp",
  },
  {
    title: "Node.js",
    subtitle: "Backend JavaScript, REST APIs, Event-driven...",
    icon: <IconWrapper name="logos:nodejs" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/nodejs",
  },
  {
    title: "SQL",
    subtitle: "Relational Databases, Data querying, MySQL, PostgreSQL...",
    icon: <IconWrapper name="vscode-icons:file-type-sql" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/sql",
  },
  {
    title: "Docker",
    subtitle: "Containerization, Microservices, DevOps...",
    icon: <IconWrapper name="logos:docker-icon" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/docker",
    new: true,
  },
  {
    title: "Git & GitHub",
    subtitle: "Version control, Collaboration, Code management...",
    icon: <IconWrapper name="logos:git-icon" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/skill-based/git",
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

