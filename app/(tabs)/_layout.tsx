import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useAppTheme } from "../../contexts/ThemeContext";

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginBottom: 2,
        },

        tabBarStyle: {
          height: 76,
          marginHorizontal: 12,
          marginBottom: 12,
          paddingTop: 8,
          paddingBottom: 10,
          borderRadius: 22,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderWidth: 1,
          borderColor: colors.border,
          elevation: 8,
          shadowColor: "#000000",
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home"
              size={26}
              color={focused ? colors.primary : colors.secondaryText}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="calendar-month"
              size={28}
              color={focused ? colors.primary : colors.secondaryText}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reorder"
        options={{
          title: "Reorder",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="sync"
              size={30}
              color={focused ? colors.primary : colors.secondaryText}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="person"
              size={26}
              color={focused ? colors.primary : colors.secondaryText}
            />
          ),
        }}
      />
    </Tabs>
  );
}
