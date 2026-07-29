export type PaletteId =
  | "house"
  | "ink"
  | "ember"
  | "riso"
  | "chalk"
  | "tide"
  | "grove"
  | "orchid"
  | "cobalt"
  | "terminal";

export type Palette = {
  id: PaletteId;
  label: string;
  note: string;
  /* Four representative colors for the picker's swatch dots, per mode.
     Duplicated from palettes.css / tokens.css so the dots can preview a
     palette without activating it. */
  swatches: { light: string[]; dark: string[] };
};

export const PALETTES: Palette[] = [
  {
    id: "house",
    label: "House",
    note: "Earthy, as poured",
    swatches: {
      light: ["#9a3b1e", "#2f5d62", "#5f6e3d", "#a4731f"],
      dark: ["#e8997b", "#8fc1c6", "#b9c98b", "#ddb56e"],
    },
  },
  {
    id: "ink",
    label: "Ink",
    note: "Letterpress mono",
    swatches: {
      light: ["#21201c", "#63635e", "#bcbbb5", "#f1f0ef"],
      dark: ["#eeeeec", "#b5b3ad", "#62605b", "#222221"],
    },
  },
  {
    id: "ember",
    label: "Ember",
    note: "Golden hour",
    swatches: {
      light: ["#d13415", "#cc4e00", "#ab6400", "#ca244d"],
      dark: ["#ff977d", "#ffa057", "#ffca16", "#ff949d"],
    },
  },
  {
    id: "riso",
    label: "Riso",
    note: "Loud print inks",
    swatches: {
      light: ["#cb1d63", "#0d74ce", "#218358", "#6550b9"],
      dark: ["#ff92ad", "#70b8ff", "#3dd68c", "#baa7ff"],
    },
  },
  {
    id: "chalk",
    label: "Chalk",
    note: "Powdery pastel",
    swatches: {
      light: ["#c2298a", "#5753c6", "#2a7e3b", "#ab6400"],
      dark: ["#ff8dcc", "#b1a9ff", "#71d083", "#ffca16"],
    },
  },
  {
    id: "tide",
    label: "Tide",
    note: "Overcast coastal",
    swatches: {
      light: ["#0d74ce", "#008573", "#107d98", "#3a5bc7"],
      dark: ["#70b8ff", "#0bd8b6", "#4ccce6", "#9eb1ff"],
    },
  },
  {
    id: "grove",
    label: "Grove",
    note: "Forest floor",
    swatches: {
      light: ["#218358", "#2a7e3b", "#71624b", "#953ea3"],
      dark: ["#3dd68c", "#71d083", "#cbb99f", "#e796f3"],
    },
  },
  {
    id: "orchid",
    label: "Orchid",
    note: "The violet hour",
    swatches: {
      light: ["#8145b5", "#5753c6", "#c2298a", "#cb1d63"],
      dark: ["#d19dff", "#b1a9ff", "#ff8dcc", "#ff92ad"],
    },
  },
  {
    id: "cobalt",
    label: "Cobalt",
    note: "Swiss and electric",
    swatches: {
      light: ["#0d74ce", "#60646c", "#d9d9e0", "#f9f9fb"],
      dark: ["#70b8ff", "#b0b4ba", "#363a3f", "#18191b"],
    },
  },
  {
    id: "terminal",
    label: "Terminal",
    note: "Phosphor on glass",
    swatches: {
      light: ["#218358", "#5f6563", "#d7dad9", "#f7f9f8"],
      dark: ["#3dd68c", "#adb5b2", "#373b39", "#171918"],
    },
  },
];

export const PALETTE_EVENT = "ifemora:palettechange";

export function isPaletteId(value: string | undefined): value is PaletteId {
  return PALETTES.some((p) => p.id === value);
}

export function currentPalette(): PaletteId {
  const set = document.documentElement.dataset.palette;
  return isPaletteId(set) ? set : "house";
}

export function subscribePalette(onStoreChange: () => void) {
  window.addEventListener(PALETTE_EVENT, onStoreChange);
  return () => window.removeEventListener(PALETTE_EVENT, onStoreChange);
}

/** Applies a palette with the same cross-fade the theme toggle uses,
    and persists it. "house" clears the attribute back to the default. */
export function applyPalette(id: PaletteId) {
  const root = document.documentElement;
  root.setAttribute("data-theme-transitioning", "");
  window.setTimeout(
    () => root.removeAttribute("data-theme-transitioning"),
    500
  );
  if (id === "house") {
    delete root.dataset.palette;
  } else {
    root.dataset.palette = id;
  }
  try {
    if (id === "house") {
      localStorage.removeItem("palette");
    } else {
      localStorage.setItem("palette", id);
    }
  } catch {
    /* private browsing — the swap still works for this visit */
  }
  window.dispatchEvent(new Event(PALETTE_EVENT));
}
