import { IconSymbol } from "@/components/ui/icon-symbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

const ORANGE = "#FC8019";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: "#888888",

        tabBarStyle: {
          height: 70,
          marginBottom: 5,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <IconSymbol size={26} name="house.fill" color={ORANGE} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: () => (
            <MaterialIcons name="calendar-month" size={28} color={ORANGE} />
          ),
        }}
      />

      <Tabs.Screen
        name="reorder"
        options={{
          title: "Reorder",
          tabBarIcon: () => (
            <MaterialIcons name="sync" size={30} color={ORANGE} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <IconSymbol size={26} name="person.fill" color={ORANGE} />
          ),
        }}
      />
    </Tabs>
  );
}
