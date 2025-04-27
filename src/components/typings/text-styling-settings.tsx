export const fontFamilySettingValues = [
  "Arial",
  "Times New Roman",
  "Courier New",
] as const;
type FontFamilySettingValues = (typeof fontFamilySettingValues)[number];

export interface TextStylingSettings {
  fontSize: "small" | "medium" | "large";
  fontFamily: FontFamilySettingValues;
  textDisplayFormat: "single-word" | "one-line" | "two-lines";
  textDisplayStyle:
    | "normal"
    | "full-color"
    | "one-word-color"
    | "glow"
    | "3d"
    | "3d-glow"
    | "word-background"
    | "one-word-background";
  textDisplayPosition: "bottom" | "top" | "center";
  animations: "bounce" | "fade" | "slide" | "zoom" | "none";
  textScale?: number;
}
