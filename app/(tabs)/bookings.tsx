import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/contexts/ThemeContext";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingCard from "../../components/BookingCard";

type Booking = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  location: string;
  date: string;
  time: string;
  guests: number;
  tableId?: string;
  tableName?: string;
  status: string;
  cancellationReason?: string;
};

export default function BookingsScreen() {
  const { colors } = useAppTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const loadBookings = async () => {
    try {
      const savedBookings = await AsyncStorage.getItem("bookings");

      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings);

        if (Array.isArray(parsedBookings)) {
          setBookings(parsedBookings);
        } else {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.log("Error loading bookings:", error);
      setBookings([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, []),
  );

  const viewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewModalVisible(true);
  };

  const cancelBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCancelModalVisible(true);
  };

  const confirmCancellation = (bookingId: string, reason: string) => {
    Alert.alert(
      "Confirm Cancellation",
      `Are you sure you want to cancel this booking?\n\nReason: ${reason}`,
      [
        {
          text: "Keep Booking",
          style: "cancel",
        },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress: async () => {
            try {
              const savedBookings = await AsyncStorage.getItem("bookings");

              let currentBookings: Booking[] = [];

              if (savedBookings) {
                const parsedBookings = JSON.parse(savedBookings);

                if (Array.isArray(parsedBookings)) {
                  currentBookings = parsedBookings;
                }
              }

              const updatedBookings = currentBookings.map((booking) =>
                booking.id === bookingId
                  ? {
                      ...booking,
                      status: "Cancelled",
                      cancellationReason: reason,
                    }
                  : booking,
              );

              await AsyncStorage.setItem(
                "bookings",
                JSON.stringify(updatedBookings),
              );

              setBookings(updatedBookings);

              setCancelModalVisible(false);
              setViewModalVisible(false);

              console.log("BOOKING CANCELLED:", bookingId);
              console.log("CANCELLATION REASON:", reason);

              Alert.alert(
                "Booking Cancelled",
                "Your booking has been cancelled successfully.",
                [
                  {
                    text: "OK",
                  },
                ],
              );
            } catch (error) {
              console.log("Cancel error:", error);

              Alert.alert(
                "Error",
                "Unable to cancel booking. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const removeBooking = (bookingId: string) => {
    Alert.alert(
      "Remove Booking",
      "Are you sure you want to remove this booking from My Bookings?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const savedBookings = await AsyncStorage.getItem("bookings");

              let currentBookings: Booking[] = [];

              if (savedBookings) {
                const parsedBookings = JSON.parse(savedBookings);

                if (Array.isArray(parsedBookings)) {
                  currentBookings = parsedBookings;
                }
              }

              const updatedBookings = currentBookings.filter(
                (booking) => booking.id !== bookingId,
              );

              await AsyncStorage.setItem(
                "bookings",
                JSON.stringify(updatedBookings),
              );

              setBookings(updatedBookings);

              console.log("BOOKING REMOVED:", bookingId);
              console.log("REMAINING BOOKINGS:", updatedBookings);

              Alert.alert(
                "Booking Removed",
                "Booking has been removed from My Bookings.",
                [
                  {
                    text: "OK",
                  },
                ],
              );
            } catch (error) {
              console.log("Remove error:", error);

              Alert.alert(
                "Error",
                "Unable to remove booking. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const goToHome = () => {
    router.push("/home" as any);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 10,
          paddingVertical: 6,
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
            width: 28,
            height: 28,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.card,
              fontSize: 21,
              fontWeight: "400",
            }}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "800",
            textAlign: "center",
            marginRight: 28,
          }}
        >
          My Bookings
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 25,
        }}
      >
        {bookings.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 55,
            }}
          >
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: colors.iconBackground,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 34,
                }}
              >
                🍽️
              </Text>
            </View>

            <Text
              style={{
                fontSize: 19,
                fontWeight: "800",
                color: colors.text,
                textAlign: "center",
              }}
            >
              No Bookings Yet
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: colors.secondaryText,
                textAlign: "center",
                marginTop: 6,
                lineHeight: 19,
              }}
            >
              You haven't booked a table yet.
              {"\n"}
              reserve your table.
            </Text>
          </View>
        ) : (
          <>
            <View
              style={{
                paddingHorizontal: 14,
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#333333",
                }}
              >
                {bookings.length}{" "}
                {bookings.length === 1 ? "Booking" : "Bookings"}
              </Text>
            </View>

            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                restaurantName={booking.restaurantName}
                date={booking.date}
                time={booking.time}
                guests={booking.guests}
                status={booking.status}
                location={booking.location}
                onPress={() => viewBooking(booking)}
                onCancel={() => cancelBooking(booking.id)}
                onRemove={() => removeBooking(booking.id)}
              />
            ))}
          </>
        )}
      </ScrollView>

      <Modal
        visible={viewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          {selectedBooking ? (
            <View
              style={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                padding: 22,
                elevation: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: "800",
                  color: "#222222",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Booking Details
              </Text>

              <View
                style={{
                  backgroundColor: "#FFF1E6",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "800",
                    color: "#222222",
                  }}
                >
                  🍽️ {selectedBooking.restaurantName}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 9,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    width: 30,
                  }}
                >
                  📍
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#333333",
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {selectedBooking.location}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 9,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    width: 30,
                  }}
                >
                  📅
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#333333",
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {(() => {
                    const [year, month, day] = selectedBooking.date
                      .split("-")
                      .map(Number);

                    const bookingDate = new Date(year, month - 1, day);

                    return bookingDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    });
                  })()}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 9,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    width: 30,
                  }}
                >
                  🕐
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#333333",
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {selectedBooking.time}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 9,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    width: 30,
                  }}
                >
                  👥
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#333333",
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {selectedBooking.guests}{" "}
                  {selectedBooking.guests === 1 ? "Guest" : "Guests"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 9,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    width: 30,
                  }}
                >
                  🪑
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#333333",
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {selectedBooking.tableName ||
                    selectedBooking.tableId ||
                    "Table not assigned"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor:
                    selectedBooking.status === "Cancelled"
                      ? "#FFE8E8"
                      : "#E8F8EE",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    marginRight: 8,
                  }}
                >
                  {selectedBooking.status === "Cancelled" ? "❌" : "✅"}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "800",
                    color:
                      selectedBooking.status === "Cancelled"
                        ? "#D32F2F"
                        : "#FC8019",
                  }}
                >
                  {selectedBooking.status}
                </Text>
              </View>

              {selectedBooking.status === "Cancelled" &&
              selectedBooking.cancellationReason ? (
                <View
                  style={{
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: "#FFF7F7",
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#888888",
                      fontWeight: "700",
                      marginBottom: 4,
                    }}
                  >
                    CANCELLATION REASON
                  </Text>

                  <Text
                    style={{
                      fontSize: 13,
                      color: "#555555",
                      fontWeight: "600",
                    }}
                  >
                    {selectedBooking.cancellationReason}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setViewModalVisible(false)}
                style={{
                  marginTop: 20,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: "#FC8019",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: "800",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Modal>

      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 20,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 21,
                fontWeight: "800",
                color: "#222222",
                textAlign: "center",
              }}
            >
              Cancel Booking
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#777777",
                textAlign: "center",
                marginTop: 6,
                marginBottom: 18,
              }}
            >
              Why do you want to cancel this booking?
            </Text>

            {[
              "My plans changed",
              "Restaurant is too far",
              "I selected the wrong time",
              "I selected the wrong date",
              "Found another restaurant",
              "Booked by mistake",
              "Other",
            ].map((reason) => (
              <TouchableOpacity
                key={reason}
                activeOpacity={0.8}
                onPress={() => {
                  setCancelModalVisible(false);

                  if (selectedBookingId) {
                    confirmCancellation(selectedBookingId, reason);
                  }
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "#E8E8E8",
                  borderRadius: 12,
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                  marginBottom: 10,
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#333333",
                  }}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setCancelModalVisible(false)}
              style={{
                marginTop: 4,
                paddingVertical: 13,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#FC8019",
                }}
              >
                Keep Booking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
