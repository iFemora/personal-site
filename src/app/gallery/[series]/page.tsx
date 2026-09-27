import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeries, getSeriesBySlug } from "@/lib/gallerySeries";
import SeriesSequence from "@/components/SeriesSequence";
import {
  DrawnRule,
  MaskedLines,
  ProximityType,
} from "@femora/design-system";

type Props = {
  params: Promise<{ series: string }>;
};

export function generateStaticParams() {
  return getSeries().map((s) => ({ series: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series: slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return {};
  return {
    title: series.title,
    description: `${series.tagline} A photo series by Femi Siji-Kenneth.`,
    alternates: { canonical: `/gallery/${slug}` },
    openGraph: {
      title: series.title,
      description: series.tagline,
      images: [
        {
          url: series.hero.src,
          width: series.hero.width,
          height: series.hero.height,
          alt: series.hero.alt,
        },
      ],
    },
  };
}

export default async function SeriesPage({ params }: Props) {
  const { series: slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <ProximityType
        lines={[{ text: series.title, className: "wonk" }]}
        className="font-serif text-[clamp(3rem,10vw,7rem)] font-medium leading-[0.95] tracking-tight text-accent"
      />
      <MaskedLines
        as="p"
        lines={[series.tagline]}
        delay={0.18}
        className="mt-6 font-serif text-xl italic text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.35} />

      <SeriesSequence series={series} />
    </main>
  );
}
