import UbeLatteSequence from '@/components/UbeLatteSequence';
import { AppleGlassNav } from '@/components/GlassNav';
import HeroSection from '@/components/HeroSection';
import StorySection from '@/components/StorySection';
import FeaturesSection from '@/components/FeaturesSection';
import IngredientsSection from '@/components/IngredientsSection';
import HealthBenefitsSection from '@/components/HealthBenefitsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

import { createClient } from '@/utils/supabase/server';

const NAV_LINKS = [
    { name: "Story", href: "#story" },
    { name: "Process", href: "#process" },
    { name: "Ingredients", href: "#ingredients" },
    { name: "Health", href: "#health" },
];

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="relative w-full bg-[#050505]">
      <AppleGlassNav items={NAV_LINKS} user={user} />
      
      {/* Static ambient glow — replaces 3 animated GPU-heavy blobs */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 600px 600px at 25% 10%, rgba(147,112,219,0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 600px 600px at 75% 50%, rgba(192,38,211,0.10) 0%, transparent 70%)',
            'radial-gradient(ellipse 600px 600px at 33% 80%, rgba(37,99,235,0.10) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

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
