import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppTheme } from "@/contexts/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,

        tabBarStyle: {
          height: 70,
          marginBottom: 10,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <IconSymbol
              size={26}
              name="house.fill"
              color={colors.primary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: () => (
            <MaterialIcons
              name="calendar-month"
              size={28}
              color={colors.primary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reorder"
        options={{
          title: "Reorder",
          tabBarIcon: () => (
            <MaterialIcons name="sync" size={30} color={colors.primary} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <IconSymbol
              size={26}
              name="person.fill"
              color={colors.primary}
            />
          ),
        }}
      />
    </Tabs>
  );
}
