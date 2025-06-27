import Silk from '@/components/Silk';
import { Link } from 'react-router-dom';
import ButtonOutline from '@/components/ButtonOutline';

export default function HeroSection() {
    return(
        <>
        <div className="h-full relative overflow-hidden">
            <Silk
              speed={5}
              scale={1}
              color="#3f3f46"
              noiseIntensity={1.5}
              rotation={0.2}
            />
            <div className="absolute inset-0 z-10" />
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-white text-center px-6">
              <h1 className="text-7xl md:text-9xl font-bold mb-4" style={{ fontFamily: 'Cascadia Mono' }}>
                roadmap.in
              </h1>
              <p className="text-lg max-w-xl mb-6">
                Choose a role or skill-based roadmap and track your daily progress.
              </p>
              <Link to="/explore">
                <ButtonOutline size="lg">Explore Roadmaps</ButtonOutline>
              </Link>
            </div>
          </div>
        </>
    )
}