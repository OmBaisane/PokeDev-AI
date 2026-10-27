import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";

export default function Home() {
  return (
    <main
      id="top"
      className="relative min-h-screen overflow-hidden bg-[#0B0A14]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-linear(ellipse_at_50%_0%,rgba(124,58,237,0.19),transparent_55%)]"
      />

      <SiteHeader />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <SiteFooter />
    </main>
  );
}
