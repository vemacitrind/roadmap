import BasicHeader from "@/components/BasicHeader";
import AboutSection from "@/components/AboutSection";

export default function BasicTemplate1({ children }) {
    return (
        <>
            <BasicHeader />
            <div className="mt-24 w-full px-0 relative">
                {children}
            </div>
            <AboutSection />
        </>
    );
}