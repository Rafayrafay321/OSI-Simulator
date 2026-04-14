// import { FeaturesSection } from './FeatureSection';
import { JourneySection } from './ScrollyTelling';
import { Footer } from './Footer';
import { HeroSection } from './HeroSection';
import NavbarUI from './NavbarUI';

export default function LandingPage() {
  return (
    <div className="min-h-[100vh] bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-white relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none overflow-hidden"></div>
      <NavbarUI />
      <HeroSection />
      <JourneySection />
      <Footer />

    </div>
  );
}
