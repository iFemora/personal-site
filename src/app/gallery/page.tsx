import type { Metadata } from "next";
import { getGalleryFrames } from "@/lib/gallery";
import GalleryGrid from "@/components/GalleryGrid";
import Reveal from "@/components/motion/Reveal";
import DrawnRule from "@/components/motion/DrawnRule";
import MaskedLines from "@/components/motion/MaskedLines";
import ProximityType from "@/components/motion/ProximityType";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs by Femi Siji-Kenneth.",
};

export default function GalleryPage() {
  const frames = getGalleryFrames();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: "Gallery", className: "wonk" }]}
        className="font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={["Proof I go outside."]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <section className="mb-14 grid gap-6 sm:mb-20 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12">
        <Reveal immediate delay={0.45}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="text-accent">Contact sheet</span> —{" "}
            {frames.length === 0 ? "in the darkroom" : `${frames.length} frames`}
          </p>
        </Reveal>
        <Reveal immediate delay={0.5}>
          <p className="text-lg leading-relaxed">
            {frames.length === 0 ? (
              <>
                The prints are still drying. Photographs land here soon
                &mdash; the good ones, eventually, once I stop second-guessing
                which are the good ones.
              </>
            ) : (
              <>
                Every frame sits faded until you give it some attention
                &mdash; hover to bring the color back, click to see it full.
              </>
            )}
          </p>
        </Reveal>
      </section>

      {frames.length > 0 && <GalleryGrid frames={frames} />}
    </main>
  );
}
