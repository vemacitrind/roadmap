import BasicHeader from "@/components/BasicHeader";
import AboutSection from "@/components/AboutSection";

export default function BasicTemplate16({ children }) {
    return (
        <>
            <BasicHeader />
            <div className="mt-16 min-h-screen bg-zinc-950 text-white p-6 md:p-10">
                {children}
            </div>
            <AboutSection />
        </>
    );
}