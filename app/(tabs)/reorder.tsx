import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Booking = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  location: string;
  date: string;
  time: string;
  guests: number;
  createdAt?: string;
  tableId?: string;
  tableName?: string;
  status: string;
};

export default function Reorder() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const loadBookings = async () => {
    try {
      setLoading(true);

      const storedBookings = await AsyncStorage.getItem("reorderHistory");

      if (!storedBookings) {
        setBookings([]);
        return;
      }

      const parsedBookings = JSON.parse(storedBookings);

      if (!Array.isArray(parsedBookings)) {
        setBookings([]);
        return;
      }

      setBookings([...parsedBookings].reverse());
    } catch (error) {
      console.log("Load reorder bookings error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, []),
  );

  const handleReorder = (booking: Booking) => {
    router.push({
      pathname: `/booking/${booking.restaurantId}` as any,
      params: {
        reorder: "true",
        date: booking.date,
        time: booking.time,
        guests: String(booking.guests),
      },
    });
  };

  const handleRemove = (bookingId: string) => {
    Alert.alert(
      "Remove Booking",
      "Are you sure you want to remove this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const storedBookings =
                await AsyncStorage.getItem("reorderHistory");

              if (!storedBookings) {
                return;
              }

              const parsedBookings = JSON.parse(storedBookings);

              if (!Array.isArray(parsedBookings)) {
                return;
              }

              const updatedBookings = parsedBookings.filter(
                (booking: Booking) => booking.id !== bookingId,
              );

              await AsyncStorage.setItem(
                "reorderHistory",
                JSON.stringify(updatedBookings),
              );

              setBookings((current) =>
                current.filter((booking) => booking.id !== bookingId),
              );

              console.log("REORDER REMOVED:", bookingId);
            } catch (error) {
              console.log("Remove booking error:", error);
            }
          },
        },
      ],
    );
  };

  const renderBookingCard = (booking: Booking) => {
    return (
      <View
        key={booking.id}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 13,
          marginBottom: 12,
          overflow: "hidden",
          elevation: 2,
          shadowColor: "#000000",
          shadowOpacity: 0.07,
          shadowRadius: 3,
          shadowOffset: {
            width: 0,
            height: 2,
          },
        }}
      >
        <Image
          source={{
            uri: "https://via.placeholder.com/300",
          }}
          style={{
            width: "100%",
            height: 95,
          }}
          resizeMode="cover"
        />

        <View
          style={{
            paddingHorizontal: 11,
            paddingTop: 8,
            paddingBottom: 9,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#171717",
              marginBottom: 2,
            }}
          >
            Table Booking
          </Text>

          <View
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: 9,
              paddingVertical: 5,
              paddingHorizontal: 8,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  width: 25,
                  fontSize: 14,
                }}
              >
                📅
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#333333",
                  fontWeight: "600",
                }}
              >
                {formatDate(booking.date)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  width: 25,
                  fontSize: 14,
                }}
              >
                🕐
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#333333",
                  fontWeight: "600",
                }}
              >
                {booking.time}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: booking.tableName ? 4 : 0,
              }}
            >
              <Text
                style={{
                  width: 25,
                  fontSize: 14,
                }}
              >
                👥
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#333333",
                  fontWeight: "600",
                }}
              >
                {booking.guests} Guests
              </Text>
            </View>

            {booking.tableName && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: 25,
                    fontSize: 14,
                  }}
                >
                  🪑
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: "#333333",
                    fontWeight: "600",
                  }}
                >
                  {booking.tableName}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 7,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleReorder(booking)}
              style={{
                flex: 1,
                height: 38,
                backgroundColor: "#FC8019",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: "800",
                }}
              >
                🔄 Reorder
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleRemove(booking.id)}
              style={{
                width: 90,
                height: 38,
                backgroundColor: "#FFF0F0",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#D32F2F",
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                🗑️ Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F7F8FA",
      }}
    >
      <View
        style={{
          backgroundColor: "#FC8019",
          paddingHorizontal: 12,
          paddingTop: 5,
          paddingBottom: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/home");
            }
          }}
          style={{
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 6,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 30,
              lineHeight: 32,
              fontWeight: "300",
            }}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: "800",
            }}
          >
            Reorder
          </Text>

          <Text
            style={{
              color: "#FFF4EA",
              fontSize: 11,
              marginTop: 0,
            }}
          >
            Book again using your previous booking
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 11,
          paddingTop: 10,
          paddingBottom: 25,
        }}
      >
        {loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#777777",
              }}
            >
              Loading bookings...
            </Text>
          </View>
        ) : bookings.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 65,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 42,
                marginBottom: 9,
              }}
            >
              🍽️
            </Text>

            <Text
              style={{
                fontSize: 17,
                fontWeight: "800",
                color: "#171717",
                marginBottom: 5,
              }}
            >
              No Bookings Yet
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#777777",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Your previous bookings will appear here.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home")}
              style={{
                backgroundColor: "#FC8019",
                paddingHorizontal: 18,
                paddingVertical: 9,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "800",
                  fontSize: 12,
                }}
              >
                Book a Table
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map(renderBookingCard)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
