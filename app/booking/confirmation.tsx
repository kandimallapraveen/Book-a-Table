import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatBookingDate = (dateString: string) => {
  if (!dateString) {
    return "Date not available";
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

export default function ConfirmationScreen() {
  const params = useLocalSearchParams();

  const bookingId = String(params.bookingId || "");
  const restaurantName = String(params.restaurantName || "Restaurant");
  const location = String(params.location || "Location not available");
  const date = String(params.date || "");
  const time = String(params.time || "");
  const guests = String(params.guests || "0");
  const tableName = String(params.tableName || "Table not available");

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(tabs)" as any);
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F7F8F7",
      }}
    >
      <View
        style={{
          backgroundColor: "#FC8019",
          paddingHorizontal: 15,
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 19,
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          Booking Confirmation
        </Text>
      </View>

      <View
        style={{
          alignItems: "center",
          paddingTop: 15,
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            width: 55,
            height: 55,
            borderRadius: 28,
            backgroundColor: "#E7F6EC",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              color: "#FC8019",
              fontWeight: "800",
            }}
          >
            ✓
          </Text>
        </View>

        <Text
          style={{
            fontSize: 21,
            fontWeight: "800",
            color: "#222222",
            textAlign: "center",
          }}
        >
          Booking Confirmed!
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: "#666666",
            textAlign: "center",
            marginTop: 3,
          }}
        >
          Your table has been successfully booked.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          marginHorizontal: 15,
          marginTop: 15,
          borderRadius: 14,
          padding: 14,
          elevation: 3,
          shadowColor: "#000000",
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: {
            width: 0,
            height: 2,
          },
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: "#222222",
            marginBottom: 10,
          }}
        >
          Booking Details
        </Text>

        <View
          style={{
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#777777",
              marginBottom: 2,
            }}
          >
            Restaurant
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#222222",
            }}
            numberOfLines={1}
          >
            {restaurantName}
          </Text>
        </View>

        <View
          style={{
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#777777",
              marginBottom: 2,
            }}
          >
            Location
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "#333333",
            }}
            numberOfLines={1}
          >
            {location}
          </Text>
        </View>

        <View
          style={{
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#777777",
              marginBottom: 2,
            }}
          >
            Date
          </Text>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#222222",
            }}
          >
            {formatBookingDate(date)}
          </Text>
        </View>

        <View
          style={{
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#777777",
              marginBottom: 2,
            }}
          >
            Time
          </Text>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#222222",
            }}
          >
            {time}
          </Text>
        </View>

        <View
          style={{
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#777777",
              marginBottom: 2,
            }}
          >
            Number of Guests
          </Text>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#222222",
            }}
          >
            {guests} {Number(guests) === 1 ? "Guest" : "Guests"}
          </Text>
        </View>

        <View
          style={{
            marginBottom: 8,
            backgroundColor: "#FFF7F2",
            borderRadius: 9,
            padding: 9,
            borderWidth: 1,
            borderColor: "#FFE0CC",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#777777",
              marginBottom: 2,
            }}
          >
            Table
          </Text>

          <Text
            style={{
              fontSize: 17,
              fontWeight: "800",
              color: "#FC8019",
            }}
          >
            {tableName}
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 11,
              color: "#777777",
              marginBottom: 2,
            }}
          >
            Booking ID
          </Text>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#FC8019",
            }}
            numberOfLines={1}
          >
            {bookingId}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 15,
          marginTop: 12,
          backgroundColor: "#E7F6EC",
          borderRadius: 10,
          paddingVertical: 9,
          paddingHorizontal: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FC8019",
            fontSize: 13,
            fontWeight: "800",
          }}
          numberOfLines={1}
        >
          ✓ {tableName} Reserved Successfully
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.replace("/(tabs)/bookings" as any)}
        style={{
          marginHorizontal: 15,
          marginTop: 13,
          backgroundColor: "#FC8019",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "800",
          }}
        >
          View My Bookings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.replace("/(tabs)" as any)}
        style={{
          marginHorizontal: 15,
          marginTop: 8,
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#FC8019",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FC8019",
            fontSize: 14,
            fontWeight: "800",
          }}
        >
          Back to Home
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
