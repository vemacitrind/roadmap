import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { ButtonOutline } from '@/components/ButtonOutline';
import { Link } from 'react-router-dom';
import Silk from "@/components/Silk";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Parallax pages={3}>

        <ParallaxLayer offset={0} speed={0.5}>
          <div className="relative h-screen overflow-hidden">
            <Silk
              speed={5}
              scale={1}
              color="#3f3f46"
              noiseIntensity={1.5}
              rotation={0.2}
            />
            <div className="absolute inset-0  z-10" />

            <div className="relative z-20 h-full flex flex-col justify-center items-center text-white text-center px-6">
              <h1 className="text-9xl font-bold mb-4" style={{fontFamily:"Cascadia Mono"}}>roadmap.in</h1>
              <p className="text-lg max-w-xl mb-6">
                Choose a role or skill-based roadmap and track your daily progress.
              </p>
              <Link to="/explore">
                <ButtonOutline size="lg">
                  Explore Roadmaps
                </ButtonOutline>
              </Link>
            </div>
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.5}>
          <section className="h-screen text-gray-800 flex flex-col items-center justify-center px-4">
            <h2 className="text-4xl text-white font-semibold mb-6">Role-Based Roadmaps</h2>
            <p className="text-md text-white max-w-xl mb-4">Follow structured roadmaps for career roles like Frontend Developer, Backend Developer, and more.</p>
            {/* You can map roadmap cards here later */}
            <Link to="/explore?type=role-based">
              <ButtonOutline>View Role-Based</ButtonOutline>
            </Link>
          </section>
        </ParallaxLayer>

        <ParallaxLayer offset={2} speed={0.5}>
          <section className="h-screen text-gray-800 flex flex-col items-center justify-center px-4">
            <h2 className="text-4xl text-white font-semibold mb-6">Skill-Based Roadmaps</h2>
            <p className="text-md text-white max-w-xl mb-4">Master individual skills like Python, React, SQL, and more with focused learning paths.</p>
            <Link to="/explore?type=skill-based">
              <ButtonOutline>View Skill-Based</ButtonOutline>
            </Link>
          </section>
        </ParallaxLayer>

        {/* Optional Footer - can use separate layer or absolute div */}
      </Parallax>
    </div>
  );
}
