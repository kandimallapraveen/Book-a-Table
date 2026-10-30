export type ThemeType = "light" | "dark" | "custom";

export const appThemes = {
  light: {
    background: "#FFF9F5",
    card: "#FFFFFF",
    text: "#211A17",
    secondaryText: "#766B66",
    border: "#F0E2D9",
    iconBackground: "#FFF0E6",
    inputBorder: "#E7D7CE",
    primary: "#FC8019",
  },

  dark: {
    background: "#15110F",
    card: "#241C18",
    text: "#FFFFFF",
    secondaryText: "#D7C8C0",
    border: "#49372E",
    iconBackground: "#3A261B",
    inputBorder: "#61493B",
    primary: "#FC8019",
  },

  custom: {
    background: "#21150F",
    card: "#332119",
    text: "#FFF8F2",
    secondaryText: "#E3C9B8",
    border: "#674435",
    iconBackground: "#4A2B1D",
    inputBorder: "#85563E",
    primary: "#FF8A2A",
  },
};
