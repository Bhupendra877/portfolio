import Providers from "@/components/layout/Providers";
import Intro from "@/components/sections/Intro";
import TechStack from "@/components/sections/TechStack";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Page() {
  return (
    <Providers>
      <main id="main">
        <Intro />
        <TechStack />
        <FeaturedProjects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </Providers>
  );
}
