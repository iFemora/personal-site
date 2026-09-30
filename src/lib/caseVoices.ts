import { getWallEntries } from "@/lib/wallOfLove";

export type CaseVoice = {
  /** Wall of Love entry id. */
  id: string;
  /** A verbatim excerpt of that entry's quote. */
  excerpt: string;
};

export type ResolvedVoice = CaseVoice & {
  name: string;
  role?: string;
  company?: string;
};

/** Excerpts must be exact substrings of the wall entry, so a case study
    can never put words in someone's mouth. Pages are prerendered, so a
    mismatch fails the build rather than shipping. */
export function resolveVoices(voices: CaseVoice[]): ResolvedVoice[] {
  const entries = getWallEntries();
  return voices.map((v) => {
    const entry = entries.find((e) => e.id === v.id);
    if (!entry) throw new Error(`Wall of Love entry not found: ${v.id}`);
    if (!entry.quote.includes(v.excerpt))
      throw new Error(`Excerpt is not verbatim from ${v.id}: "${v.excerpt}"`);
    return { ...v, name: entry.name, role: entry.role, company: entry.company };
  });
}
