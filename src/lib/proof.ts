/** The ten-second read: numbers a recruiter can check against the CV
    bullets. One list, two surfaces (home proof strip, CV "In sixty
    seconds"), so a figure changes in one place. */
export type ProofKey = "months" | "volume" | "clients" | "pms" | "states";

export const proof: Record<ProofKey, { value: string; label: string }> = {
  months: {
    value: "Under 5",
    label:
      "months from concept to production: Resolve, Marqeta's cardholder support platform",
  },
  volume: {
    value: "₦70B",
    label:
      "monthly volume on the corporate banking platform, from ₦200M at alpha",
  },
  clients: {
    value: "200,000+",
    label: "SME and enterprise clients served across Nigeria and the UK",
  },
  pms: { value: "5", label: "product managers hired and grown, APM to Lead" },
  states: { value: "29", label: "Nigerian states visited to research in the field" },
};

export const pick = (keys: ProofKey[]) => keys.map((k) => proof[k]);
