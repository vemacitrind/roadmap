import FuzzyText from "@/components/FuzzyText";
import { Link } from "react-router-dom";
import BasicHeader from '@/components/BasicHeader';
import { Cog } from 'lucide-react';

export default function PageNotFound(props) {
    const type = props.type


    return (
        <>
            <BasicHeader />
            <div className='w-screen grid place-items-center'>
                {type !== "roadmap-error" ? (
                    <>
                        {/* Fuzzy “404” headline */}
                        <FuzzyText baseIntensity={0.28} hoverIntensity={0.68}>
                            404
                        </FuzzyText>

                        <h2 className="mt-5 text-xl font-medium">Page Not Found</h2>
                        <p className="text-zinc-500">
                            The page you're looking for doesn't exist.
                        </p>
                    </>
                ) : (
                    <>
                        {/* Spinning cog for generic roadmap error */}
                        <Cog className="w-32 h-32 text-zinc-600 animate-[spin_3s_linear_infinite]" />
                        <h2 className="mt-5 text-xl font-medium">Roadmap Not Found</h2>
                        <p className="text-zinc-500">
                            The Roadmap you're looking for doesn't exist.
                        </p>
                    </>
                )}
                {/* Example of adding a link back to home */}
                <Link to="/" style={{ color: 'lightblue', textDecoration: 'none', marginTop: '10px' }}>
                    Go to Home
                </Link>
            </div>
        </>
    );
}