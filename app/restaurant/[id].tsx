import { router } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RestaurantDetails() {
  const handleBookTable = () => {
    router.push("/booking/default" as any);
  };

  const handlePayBill = () => {
    Alert.alert("Pay Bill", "Bill payment feature will be available soon.");
  };

  const handleShare = () => {
    Alert.alert("Share", "Share feature will be available soon.");
  };
  const handleMenuPress = () => {
    router.push("/menu" as any);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F7F7F7",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            height: 72,
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            borderBottomWidth: 1,
            borderBottomColor: "#EEEEEE",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/home");
              }
            }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#EEEEEE",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 30,
                color: "#222222",
                marginTop: -3,
              }}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              marginLeft: 12,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 17,
                fontWeight: "900",
                color: "#222222",
              }}
            >
              Table Booking
            </Text>

            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: "#777777",
                marginTop: 3,
              }}
            >
              Book your table easily
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleShare}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#EEEEEE",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 22,
              }}
            >
              ↗
            </Text>
          </TouchableOpacity>
        </View>

        {/* TABLE BOOKING BANNER */}
        <View
          style={{
            height: 235,
            backgroundColor: "#FFF1E6",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 75,
            }}
          >
            🍽️
          </Text>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: "#222222",
              marginTop: 10,
            }}
          >
            Book Your Table
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "#777777",
              marginTop: 5,
            }}
          >
            Skip the queue. Enjoy your meal.
          </Text>
        </View>

        {/* BOOKING DETAILS */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 18,
            paddingTop: 18,
            paddingBottom: 18,
          }}
        >
          <Text
            style={{
              fontSize: 23,
              fontWeight: "900",
              color: "#222222",
            }}
          >
            Table Reservation
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "#777777",
              marginTop: 7,
              lineHeight: 20,
            }}
          >
            Select your preferred date, time and number of guests to reserve
            your table.
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <View
              style={{
                backgroundColor: "#08752F",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: "800",
                }}
              >
                ✓ Easy Booking
              </Text>
            </View>

            <Text
              style={{
                color: "#777777",
                fontSize: 11,
                marginLeft: 8,
              }}
            >
              Quick & convenient
            </Text>
          </View>
        </View>

        {/* DINE CASH */}
        <View
          style={{
            backgroundColor: "#276B4E",
            height: 58,
            borderBottomLeftRadius: 22,
            borderBottomRightRadius: 22,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "900",
            }}
          >
            DineCash 2X
          </Text>

          <View
            style={{
              width: 1,
              height: 22,
              backgroundColor: "#FFFFFF",
              opacity: 0.4,
              marginHorizontal: 14,
            }}
          />

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            Earn & Redeem 2X DineCash
          </Text>

          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: "#A8C8B8",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 7,
            }}
          >
            <Text
              style={{
                color: "#276B4E",
                fontSize: 12,
                fontWeight: "900",
              }}
            >
              i
            </Text>
          </View>
        </View>

        {/* USEFUL BITS */}
        <View
          style={{
            paddingTop: 30,
            paddingBottom: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              letterSpacing: 3,
              color: "#333333",
              fontWeight: "700",
            }}
          >
            ── USEFUL BITS ──
          </Text>
        </View>

        {/* MENU */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 20,
            paddingTop: 15,
            paddingBottom: 25,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "600",
              color: "#222222",
              marginBottom: 20,
            }}
          >
            Menu
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleMenuPress}
            style={{
              width: "100%",
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#EEEEEE",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Image
              source={require("../../assets/images/menu-page-1.png")}
              style={{
                width: "100%",
                height: 450,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text
            style={{
              textAlign: "center",
              color: "#777777",
              fontSize: 13,
              marginTop: 10,
            }}
          >
            Tap to view full menu
          </Text>
        </View>

        {/* POPULAR DISHES */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 28,
            paddingTop: 18,
            paddingBottom: 25,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "500",
              color: "#222222",
              marginBottom: 22,
            }}
          >
            Popular dishes
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "47%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#555555",
                  marginBottom: 22,
                }}
              >
                🍽 Achari Paneer
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "#555555",
                }}
              >
                🍽 Punjabi Tandoori
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "#555555",
                  marginLeft: 35,
                  marginTop: 2,
                }}
              >
                Chicken
              </Text>
            </View>

            <View
              style={{
                width: "47%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#555555",
                  marginBottom: 22,
                }}
              >
                🍽 Ravan Laddoos
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "#555555",
                }}
              >
                🍽 Magic Mushroom
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#DDDDDD",
              marginTop: 25,
            }}
          />
        </View>

        {/* PHOTOS */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 28,
            paddingTop: 5,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#222222",
              marginBottom: 14,
            }}
          >
            Photos
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "48%",
                height: 150,
                borderRadius: 12,
                backgroundColor: "#FFF1E6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 55,
                }}
              >
                🍽️
              </Text>
            </View>

            <View
              style={{
                width: "48%",
                height: 150,
                borderRadius: 12,
                backgroundColor: "#FFF1E6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 55,
                }}
              >
                🪑
              </Text>
            </View>
          </View>
        </View>

        {/* ABOUT */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 28,
            paddingTop: 10,
            paddingBottom: 25,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#222222",
              marginBottom: 8,
            }}
          >
            About
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              color: "#777777",
            }}
          >
            Reserve your table in advance and enjoy a comfortable dining
            experience without waiting in a queue.
          </Text>

          <View
            style={{
              marginTop: 15,
              backgroundColor: "#F8F8F8",
              borderRadius: 12,
              padding: 13,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "800",
                color: "#333333",
              }}
            >
              🍽️ Table Reservation
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#777777",
                marginTop: 5,
              }}
            >
              Select date, time and number of guests while booking.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* BOOK TABLE */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBookTable}
            style={{
              width: "48%",
              height: 58,
              borderRadius: 17,
              backgroundColor: "#FFF0E8",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#E85D16",
                fontSize: 18,
                fontWeight: "900",
              }}
            >
              Book a table
            </Text>
          </TouchableOpacity>

          {/* PAY BILL */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePayBill}
            style={{
              width: "48%",
              height: 58,
              borderRadius: 17,
              backgroundColor: "#FF5A00",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "900",
              }}
            >
              Pay bill now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
