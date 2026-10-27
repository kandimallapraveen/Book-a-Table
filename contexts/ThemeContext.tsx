import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { appThemes, type ThemeType } from "../constants/appTheme";
type ThemeContextType = {
  theme: ThemeType;
  colors: (typeof appThemes)[ThemeType];
  setTheme: (newTheme: ThemeType) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setCurrentTheme] = useState<ThemeType>("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme");

        if (
          savedTheme === "light" ||
          savedTheme === "dark" ||
          savedTheme === "custom"
        ) {
          setCurrentTheme(savedTheme);
        }
      } catch (error) {
        console.log("Theme loading error:", error);
      } finally {
        setIsThemeLoaded(true);
      }
    }

    loadTheme();
  }, []);

  async function setTheme(newTheme: ThemeType) {
    try {
      await AsyncStorage.setItem("appTheme", newTheme);
      setCurrentTheme(newTheme);
    } catch (error) {
      console.log("Theme saving error:", error);
      throw error;
    }
  }

  if (!isThemeLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: appThemes[theme],
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider");
  }

  return context;
}
