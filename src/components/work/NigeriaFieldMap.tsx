import DecisionArtifact from "./DecisionArtifact";
import { nigeriaStates } from "@/lib/nigeriaStates";

const unvisitedIds = new Set([
  "kebbi",
  "borno",
  "yobe",
  "gombe",
  "zamfara",
  "sokoto",
  "jigawa",
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

function connectedRoutePath() {
  if (route.length === 0) return "";

  let path = `M ${route[0].cx} ${route[0].cy}`;
  for (let i = 1; i < route.length; i++) {
    const previous = route[i - 1];
    const current = route[i];
    const midpointX = (previous.cx + current.cx) / 2;
    const midpointY = (previous.cy + current.cy) / 2;
    path += ` Q ${previous.cx} ${previous.cy} ${midpointX} ${midpointY}`;
  }

  const last = route[route.length - 1];
  return `${path} L ${last.cx} ${last.cy}`;
}

export default function NigeriaFieldMap() {
  return (
    <DecisionArtifact
      label="Field research"
      title="The roadmap covered more ground because the research did first."
      caption={
        <>
          Twenty-nine of Nigeria&apos;s 36 states visited. State geometry adapted
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
      <div>
        <svg
          viewBox="0 0 744 600"
          role="img"
          aria-label="Map of Nigeria showing 29 visited states and seven unvisited states"
          className="mx-auto w-full max-w-[620px] overflow-visible"
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

          <path
            d={connectedRoutePath()}
            fill="none"
            stroke="var(--rule)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.9"
          />

          {route.map((state, i) => (
            <circle
              key={state.id}
              cx={state.cx}
              cy={state.cy}
              r={i === 0 || i === route.length - 1 ? 4 : 3.5}
              fill="var(--muted)"
              stroke="var(--background)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity="0.7"
              className="transition-[fill,opacity] duration-300 group-hover:fill-accent group-hover:opacity-100"
            />
          ))}
        </svg>
      </div>
    </DecisionArtifact>
  );
}
