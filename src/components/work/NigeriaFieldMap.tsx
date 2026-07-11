import DecisionArtifact from "./DecisionArtifact";
import { nigeriaStates } from "@/lib/nigeriaStates";

const unvisitedIds = new Set([
  "kebbi",
  "borno",
  "yobe",
  "gombe",
  "zamfara",
  "sokoto",
]);

const routeIds = [
  "lagos",
  "ogun",
  "oyo",
  "osun",
  "ondo",
  "ekiti",
  "kwara",
  "niger",
  "kaduna",
  "katsina",
  "kano",
  "jigawa",
  "bauchi",
  "plateau",
  "nassarawa",
  "kogi",
  "benue",
  "taraba",
  "adamawa",
  "cross-river",
  "akwa-ibom",
  "rivers",
  "bayelsa",
  "delta",
  "edo",
  "anambra",
  "imo",
  "abia",
  "ebonyi",
  "enugu",
];

const statesById = new Map(nigeriaStates.map((state) => [state.id, state]));
const route = routeIds.flatMap((id) => {
  const state = statesById.get(id);
  return state ? [state] : [];
});

export default function NigeriaFieldMap() {
  return (
    <DecisionArtifact
      label="Field research"
      title="The roadmap covered more ground because the research did first."
      caption={
        <>
          Thirty of Nigeria&apos;s 36 states visited. State geometry adapted
          from{" "}
          <a
            href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/nigeria"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 hover:no-underline"
          >
            @svg-maps/nigeria
          </a>{" "}
          (CC BY 4.0); the connecting line shows coverage, not chronology.
        </>
      }
    >
      <div className="grid items-center gap-8 sm:grid-cols-[1fr_190px]">
        <svg
          viewBox="0 0 744 600"
          role="img"
          aria-label="Map of Nigeria showing 30 visited states and six unvisited states"
          className="mx-auto w-full max-w-[460px] overflow-visible"
        >
          <g>
            {nigeriaStates.map((state) => {
              const isFct = state.id === "fct";
              const unvisited = unvisitedIds.has(state.id);
              return (
                <path
                  key={state.id}
                  d={state.path}
                  fill={
                    isFct
                      ? "color-mix(in srgb, var(--foreground) 4%, transparent)"
                      : unvisited
                        ? "color-mix(in srgb, var(--muted) 8%, transparent)"
                        : "color-mix(in srgb, var(--accent) 9%, transparent)"
                  }
                  stroke={unvisited ? "var(--muted)" : "var(--rule)"}
                  strokeWidth={unvisited ? 1.35 : 0.8}
                  strokeDasharray={unvisited ? "3 3" : undefined}
                  vectorEffect="non-scaling-stroke"
                  className="transition-[fill,stroke] duration-300"
                />
              );
            })}
          </g>

          <polyline
            points={route.map((state) => state.cx + "," + state.cy).join(" ")}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.52"
          />

          {route.map((state, i) => (
            <circle
              key={state.id}
              cx={state.cx}
              cy={state.cy}
              r={i === 0 || i === route.length - 1 ? 5.5 : 4.2}
              fill="var(--accent)"
              stroke="var(--background)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              opacity={0.74 + (i % 4) * 0.07}
              className="transition-[r,opacity] duration-300 group-hover:opacity-100"
            />
          ))}
        </svg>

        <div>
          <dl className="border-y border-rule py-4">
            <div className="flex items-end justify-between gap-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Visited
              </dt>
              <dd className="wonk font-serif text-5xl italic leading-none text-accent">
                30
              </dd>
            </div>
            <div className="mt-4 flex items-end justify-between gap-4 border-t border-rule pt-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                States
              </dt>
              <dd className="font-serif text-2xl leading-none text-muted">36</dd>
            </div>
          </dl>
          <div className="mt-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
              Not visited
            </p>
            <p className="mt-2 font-serif text-sm italic leading-relaxed text-muted">
              Kebbi · Borno · Yobe · Gombe · Zamfara · Sokoto
            </p>
          </div>
          <p className="mt-5 text-sm italic leading-relaxed text-muted">
            Farms, technicians, local governments, universities, conferences.
            The field kept correcting the roadmap.
          </p>
        </div>
      </div>
    </DecisionArtifact>
  );
}
