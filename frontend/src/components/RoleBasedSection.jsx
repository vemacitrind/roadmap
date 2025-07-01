import { Link } from "react-router-dom";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { Monitor, Database, Code2, BrainCircuit, Smartphone, Palette, LineChart, ShieldCheck, Cloud, Gamepad2, BugPlay, FileText, MoveRight } from 'lucide-react';
import ChromaGrid from "./ChromaGrid";

const items = [
  {
    title: "Frontend Developer",
    subtitle: "HTML, CSS, JS, React...",
    icon: <Monitor size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/frontend",
  },
  {
    title: "Backend Developer",
    subtitle: "Node, Django, APIs...",
    icon: <Database size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/backend",
  },
  {
    title: "DevOps Engineer",
    subtitle: "CI/CD, Docker, AWS...",
    icon: <Code2 size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/devops",
  },
  {
    title: "AI Engineer",
    subtitle: "ML, DL, Python...",
    icon: <BrainCircuit size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/ai-engineer",
    new: true
  },
  {
    title: "Mobile Developer",
    subtitle: "iOS, Android, React Native, Swift, Kotlin...",
    icon: <Smartphone size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/mobile",
  },
  {
    title: "UI/UX Designer",
    subtitle: "Figma, Sketch, Adobe XD, Wireframing, Prototyping...",
    icon: <Palette size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/ui-ux",
  },
  {
    title: "Data Scientist",
    subtitle: "Python, R, SQL, Pandas, NumPy, Machine Learning...",
    icon: <LineChart size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/data-scientist",
  },
  {
    title: "Cybersecurity Analyst",
    subtitle: "Network Security, Incident Response, Ethical Hacking...",
    icon: <ShieldCheck size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/cybersecurity",
  },
  {
    title: "Cloud Engineer",
    subtitle: "AWS, Azure, GCP, Cloud Architecture, Virtualization...",
    icon: <Cloud size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/cloud",
  },
  {
    title: "Game Developer",
    subtitle: "Unity, Unreal Engine, C++, C#, Game Design...",
    icon: <Gamepad2 size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/game-developer",
  },
  {
    title: "QA Engineer",
    subtitle: "Manual Testing, Automation, Selenium, Jest, Cypress...",
    icon: <BugPlay size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/qa-engineer",
  },
  {
    title: "Technical Writer",
    subtitle: "Documentation, API Docs, User Manuals, Content Creation...",
    icon: <FileText size={42} />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/explore/role/technical-writer",
  },
];

export default function RoleBasedSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h2 className="text-4xl text-white font-semibold mb-4">Role Based Roadmaps</h2>
      <p className="text-md text-zinc-300 max-w-xl text-center mb-10">
        Follow structured roadmaps for roles like Frontend Developer, Backend Developer, and more.
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

      <Link to="/explore?type=role" className="group">
        <ButtonWithIcon size="md" className="transition-all">
          View Role-Based
          <MoveRight className="hidden group-hover:inline-block transition-all" />
        </ButtonWithIcon>
      </Link>

    </section>
  );
}
