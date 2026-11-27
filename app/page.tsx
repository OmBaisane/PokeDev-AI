import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import CompanionsSection from "@/components/landing/CompanionsSection";

export default function Home() {
  return (
    <div
      id="top"
      className="relative isolate min-h-screen overflow-x-clip bg-[#0B0B0D] text-[#F5F2E9]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-72 left-1/2 h-152 w-260 -translate-x-1/2 rounded-full bg-[#D6A84B]/[0.07] blur-[130px]" />
        <div className="absolute -right-60 top-168 h-120 w-120 rounded-full bg-[#D6A84B]/[0.035] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-size-[72px_72px] mask-[linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <SiteHeader />

      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <CompanionsSection />
        <AboutSection />
      </main>

      <SiteFooter />
    </div>
  );
}
