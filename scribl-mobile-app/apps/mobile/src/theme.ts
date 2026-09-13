/**
 * Values read directly from the approved prototype's `:root`
 * (.arc/designs/SCRIBBLE-V2-STORY-001-design.html) -- not
 * `design-system/tokens.css`, whose placeholder palette and
 * `[object Object]` generation bug predate and don't match this story's
 * approved brand colors (see the story's open questions).
 */
export const theme = {
  color: {
    bg: "#FBF7F1",
    surface: "#FFFFFF",
    surfaceSunken: "#F3ECE1",
    border: "#E4D9C8",
    fg: "#2B2420",
    muted: "#786F63",
    brand: "#E0632A",
    brandHover: "#C8531F",
    brandFg: "#FFFFFF",
    accentTeal: "#2F8F86",
    success: "#2F8F5B",
    successBg: "#E8F5EE",
    warning: "#B8781A",
    warningBg: "#FBF0DD",
    danger: "#C63B32",
    dangerBg: "#FBEAE8",
  },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 },
  radius: { sm: 6, md: 10, lg: 16, full: 999 },
  font: {
    display: "Fraunces",
    sans: "Nunito Sans",
  },
} as const;
