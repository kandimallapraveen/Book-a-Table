import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParkingScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F7F8FA",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 18,
          paddingVertical: 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#FFF1E6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              color: "#FC8019",
              fontWeight: "700",
            }}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            marginLeft: 12,
            fontSize: 20,
            fontWeight: "800",
            color: "#171717",
          }}
        >
          Restaurant Parking
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          margin: 16,
          borderRadius: 20,
          backgroundColor: "#DDE8D8",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 55,
          }}
        >
          🗺️
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 14,
            marginTop: 15,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#171717",
            }}
          >
            🅿️ Parking Area
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#555555",
            }}
          >
            Parking location
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          padding: 20,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <Text
          style={{
            fontSize: 19,
            fontWeight: "800",
            color: "#171717",
          }}
        >
          🅿️ Parking Available
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#666666",
          }}
        >
          Parking is available near the restaurant entrance.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            marginTop: 18,
            backgroundColor: "#FC8019",
            paddingVertical: 15,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            Get Directions
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
