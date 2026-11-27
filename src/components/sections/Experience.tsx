import AnimatedText from "@/components/ui/AnimatedText";
import TimelineGraph from "@/components/interactive/TimelineGraph";
import { reveal } from "@/components/ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="experience-section wrap">
      <div className="section-head experience-heading">
        <AnimatedText lines={["Experience."]} className="h-section" />
        <p {...reveal(0.1)}>Current work.<br />Back to the foundations.</p>
      </div>
      <TimelineGraph />
    </section>
  );
}
