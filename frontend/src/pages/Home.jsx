import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useRef, useState, useEffect } from 'react';
import FloatingNavbar from "@/components/FloatingNavbar";
import RoleBasedSection from '@/components/RoleBasedSection';
import SkillBasedSection from '@/components/SkillBasedSection';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MobileNavbar from '@/components/MobileNavbar';
import FloatingChat from '@/components/FloatingChat';

export default function Home() {
  const parallaxRef = useRef();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollTop = parallaxRef.current.container.current.scrollTop;
      const pageHeight = window.innerHeight;
      const offset = scrollTop / pageHeight;

      setShowChat(offset >= 1); 
    };

    const container = parallaxRef.current?.container?.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className="relative w-screen h-screen">
      
      <FloatingNavbar parallaxRef={parallaxRef} />
      <MobileNavbar parallaxRef={parallaxRef} />
      {showChat && <FloatingChat/>}

      <Parallax pages={4} ref={parallaxRef}>

        <ParallaxLayer offset={0} speed={0.1}>
          <HeroSection />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.5}>
          <RoleBasedSection />
        </ParallaxLayer>

        <ParallaxLayer offset={2} speed={0.4}>
          <SkillBasedSection />
        </ParallaxLayer>

        <ParallaxLayer offset={3} speed={1}>
            <AboutSection />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

