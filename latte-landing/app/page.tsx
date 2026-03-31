import UbeLatteSequence from '@/components/UbeLatteSequence';
import { AppleGlassNav } from '@/components/GlassNav';
import HeroSection from '@/components/HeroSection';
import StorySection from '@/components/StorySection';
import FeaturesSection from '@/components/FeaturesSection';
import IngredientsSection from '@/components/IngredientsSection';
import HealthBenefitsSection from '@/components/HealthBenefitsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const NAV_LINKS = [
    { name: "Story", href: "#story" },
    { name: "Process", href: "#process" },
    { name: "Ingredients", href: "#ingredients" },
    { name: "Health", href: "#health" },
];

export default function Home() {
  return (
    <main className="relative w-full bg-[#050505]">
      <AppleGlassNav items={NAV_LINKS} />
      
      {/* Decorative Blob Elements behind the canvas and sections */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-[10%] left-1/4 w-96 h-96 bg-ube rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob"></div>
        <div className="absolute top-[50%] right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[20%] left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col">
        {/* 1. Hero Background with 3D elements */}
        <HeroSection />

        {/* 2. Story / Typography focus */}
        <StorySection />

        {/* 3. The Scrolly Canvas anchor */}
        <div id="sequence" className="relative h-[400vh] w-full">
          <UbeLatteSequence />
        </div>

        {/* 4. The glassmorphic tilt process */}
        <FeaturesSection />

        {/* 5. Parallax 3D dimensions ingredients */}
        <IngredientsSection />

        {/* 6. Health wellness hover cards */}
        <HealthBenefitsSection />

        {/* 7. Footer & CTA */}
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
