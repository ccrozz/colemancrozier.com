import EcosystemTimeline from "@/components/EcosystemTimeline";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MultitudesBento from "@/components/MultitudesBento";
import Nav from "@/components/Nav";
import ParallaxLayer from "@/components/ParallaxLayer";
import Workshop from "@/components/Workshop";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <ParallaxLayer />
      <Nav />
      <main>
        <Hero />
        <EcosystemTimeline />
        <MultitudesBento />
        <Workshop />
      </main>
      <Footer />
    </div>
  );
}
