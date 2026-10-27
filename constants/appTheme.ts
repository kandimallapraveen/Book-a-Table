export type ThemeType = "light" | "dark" | "custom";

export const appThemes = {
  light: {
    background: "#F7F8F7",
    card: "#FFFFFF",
    text: "#222222",
    secondaryText: "#777777",
    border: "#EEEEEE",
    iconBackground: "#FFF0E6",
    inputBorder: "#DDDDDD",
    primary: "#FC8019",
  },

  dark: {
    background: "#121212",
    card: "#222222",
    text: "#FFFFFF",
    secondaryText: "#CCCCCC",
    border: "#444444",
    iconBackground: "#3A2A20",
    inputBorder: "#555555",
    primary: "#FC8019",
  },

  custom: {
    background: "#211A2B",
    card: "#30243D",
    text: "#FFF7FF",
    secondaryText: "#D8C7E8",
    border: "#604B75",
    iconBackground: "#49325C",
    inputBorder: "#765D8D",
    primary: "#7C3AED",
  },
};
