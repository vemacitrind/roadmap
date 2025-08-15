import { Link } from "react-router-dom";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { Code2, BrainCircuit, Smartphone, LineChart, ShieldCheck, Cloud, Gamepad2, BugPlay, FileText, MoveRight } from 'lucide-react';
import ChromaGrid from "@/components/ReactBit/ChromaGrid";
import { Icon } from "@iconify/react";

const IconWrapper = ({ name, className = "" }) => (
  <div className="w-[42px] h-[42px] flex items-center justify-center">
    <Icon
      icon={name}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        color: "inherit", 
      }}
    />
  </div>
);

const items = [
  {
    title: "Frontend Developer",
    subtitle: "HTML, CSS, JS, React...",
    icon: <IconWrapper name="streamline-ultimate-color:modern-tv-curvy-edge" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #1b1818ff, #3f3f46)",
    path: "/role-based/frontend",
  },
  {
    title: "Backend Developer",
    subtitle: "Node, Django, APIs...",
    icon: <IconWrapper name="streamline-sharp-color:database-server-2-flat" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/backend-developer-roadmap",
  },
  {
    title: "DevOps Engineer",
    subtitle: "CI/CD, Docker, AWS...",
    icon: <IconWrapper name="vscode-icons:folder-type-docker-opened" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/devops",
  },
  {
    title: "AI Engineer",
    subtitle: "ML, DL, Python...",
    icon: <IconWrapper name="material-icon-theme:gemini-ai" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/ai-engineer",
    new: true,
  },
  {
    title: "Mobile Developer",
    subtitle: "iOS, Android, React Native, Swift, Kotlin...",
    icon: <IconWrapper name="noto:mobile-phone" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/mobile",
  },
  {
    title: "UI/UX Designer",
    subtitle: "Figma, Sketch, Adobe XD, Wireframing, Prototyping...",
    icon: <IconWrapper name="streamline-sharp-color:graphic-template-website-ui-flat" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/ui-ux",
  },
  {
    title: "Data Scientist",
    subtitle: "Python, R, SQL, Pandas, NumPy, Machine Learning...",
    icon: <IconWrapper name="fluent-color:data-area-32" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/data-scientist",
  },
  {
    title: "Cybersecurity Analyst",
    subtitle: "Network Security, Incident Response, Ethical Hacking...",
    icon: <IconWrapper name="fluent-color:shield-48" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/cybersecurity",
  },
  {
    title: "Cloud Engineer",
    subtitle: "AWS, Azure, GCP, Cloud Architecture, Virtualization...",
    icon: <IconWrapper name="fluent-color:cloud-48" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/cloud",
  },
  {
    title: "Game Developer",
    subtitle: "Unity, Unreal Engine, C++, C#, Game Design...",
    icon: <IconWrapper name="file-icons:unrealscript" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/game-developer",
  },
  {
    title: "QA Engineer",
    subtitle: "Manual Testing, Automation, Selenium, Jest, Cypress...",
    icon: <IconWrapper name="vaadin:automation" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/qa-engineer",
  },
  {
    title: "Technical Writer",
    subtitle: "Documentation, API Docs, User Manuals, Content Creation...",
    icon: <IconWrapper name="flat-color-icons:file" />,
    borderColor: "#71717a",
    gradient: "linear-gradient(145deg, #18181b, #3f3f46)",
    path: "/role-based/technical-writer",
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
