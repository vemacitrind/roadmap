import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useRef, useState, useEffect } from 'react';
import FloatingNavbar from "@/components/FloatingNavbar";
import RoleBasedSection from '@/components/RoleBasedSection';
import SkillBasedSection from '@/components/SkillBasedSection';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
export default function Home() {
  const parallaxRef = useRef();

  return (
    <div className="relative w-screen h-screen">
      
      <FloatingNavbar parallaxRef={parallaxRef} />

      <Parallax pages={4} ref={parallaxRef}>

        {/* <ParallaxLayer sticky={{start:1,end:3}} speed={0.5}>
          <FloatingNavbar parallaxRef={parallaxRef} />
        </ParallaxLayer> */}

        <ParallaxLayer offset={0} speed={0.3}>
          <HeroSection />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.5}>
          <RoleBasedSection />
        </ParallaxLayer>

        <ParallaxLayer offset={2} speed={0.5}>
          <SkillBasedSection />
        </ParallaxLayer>

        <ParallaxLayer offset={3} speed={1}>
            <AboutSection />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}
