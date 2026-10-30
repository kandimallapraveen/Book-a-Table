import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../contexts/ThemeContext";

import * as Location from "expo-location";
import BranchSelector from "../components/BranchSelector";
import MenuSection from "../components/MenuSection";
import PhotosSection from "../components/PhotosSection";
import { branches } from "../constants/branches";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Branch = (typeof branches)[number];

const COLORS = {
  primary: "#FC8019",
  primaryDark: "#E86F0A",
  primaryLight: "#FFF1E6",

  background: "#F7F8FA",
  white: "#FFFFFF",

  text: "#171717",
  secondaryText: "#6B6B6B",
  lightText: "#888888",

  border: "#E8E8E8",

  gold: "#F5A623",
};

function openBooking(branch?: Branch) {
  if (branch) {
    router.push({
      pathname: "/booking/[restaurantId]",
      params: {
        restaurantId: "default",
        branchId: branch.id,
        branchName: branch.name,
        branchLocation: branch.location,
      },
    });
  } else {
    router.push({
      pathname: "/booking/[restaurantId]",
      params: {
        restaurantId: "default",
      },
    });
  }
}

function Header({
  onProfilePress,
  selectedBranch,
  userLocation,
  hasSelectedBranch,
}: {
  onProfilePress: () => void;
  selectedBranch: Branch | null;
  userLocation: string;
  hasSelectedBranch: boolean;
}) {
  const [showRestaurantInfo, setShowRestaurantInfo] = useState(true);
  const { colors } = useAppTheme();

  return (
    <View style={[headerStyles.container, { backgroundColor: colors.primary }]}>
      <View style={headerStyles.left}>
        <View style={headerStyles.restaurantInfo}>
          <View style={headerStyles.restaurantTitleRow}>
            <TouchableOpacity
              style={headerStyles.smallButton}
              onPress={() => {
                setShowRestaurantInfo(!showRestaurantInfo);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[headerStyles.smallButtonText, { color: "#FFFFFF" }]}
              >
                {showRestaurantInfo ? "▼" : "▲"}
              </Text>
            </TouchableOpacity>

            <Text style={[headerStyles.restaurantName, { color: "#FFFFFF" }]}>
              Paradise Biryani
            </Text>
          </View>

          {showRestaurantInfo && (
            <Text style={[headerStyles.location, { color: colors.card }]}>
              📍{" "}
              {hasSelectedBranch && selectedBranch
                ? selectedBranch.location
                : userLocation}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[headerStyles.profile, { backgroundColor: colors.card }]}
        onPress={onProfilePress}
        activeOpacity={0.8}
      >
        <Text style={headerStyles.profileEmoji}>👤</Text>
      </TouchableOpacity>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  left: {
    flex: 1,
  },

  restaurantInfo: {
    marginLeft: 0,
    marginTop: 1,
  },

  restaurantTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  smallButton: {
    width: 20,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  smallButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
  },

  restaurantName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },

  location: {
    color: "#FFE8D5",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
    marginLeft: 24,
  },

  profile: {
    width: 44,
    height: 44,
    borderRadius: 22,

    backgroundColor: COLORS.white,

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 10,
  },

  profileEmoji: {
    fontSize: 22,
  },
});

const tableImages = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=70",
  },
];

function HeroBanner({ onBookTable }: { onBookTable: () => void }) {
  const [activeImage, setActiveImage] = useState(0);
  const { colors } = useAppTheme();

  const carouselRef = useRef<ScrollViewInstance>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / (SCREEN_WIDTH - 32));

    if (index >= 0 && index < tableImages.length) {
      setActiveImage(index);
    }
  };

  const goToImage = (index: number) => {
    setActiveImage(index);

    carouselRef.current?.scrollTo({
      x: index * (SCREEN_WIDTH - 32),
      animated: true,
    });
  };

  return (
    <View style={[heroStyles.card, { backgroundColor: colors.card }]}>
      <View style={heroStyles.imageContainer}>
        <ScrollView
          ref={carouselRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
        >
          {tableImages.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={heroStyles.slide}
              activeOpacity={0.95}
              delayPressIn={0}
              onPress={() => {
                if (index === 0) {
                  onBookTable();
                }
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={heroStyles.bigImage}
                resizeMode="cover"
              />

              {index === 0 && (
                <>
                  <View style={heroStyles.overlay} />

                  <View style={heroStyles.imageContent}>
                    <View style={heroStyles.badge}>
                      <Text style={heroStyles.badgeText}>
                        🍽️ TABLE RESERVATION
                      </Text>
                    </View>

                    <Text style={heroStyles.title}>Book Your Table</Text>

                    <Text style={heroStyles.subtitle}>
                      Skip the queue. Enjoy your meal.
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={heroStyles.dotsContainer}>
          {tableImages.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={heroStyles.dotButton}
              activeOpacity={0.8}
              onPress={() => goToImage(index)}
            >
              <View
                style={
                  index === activeImage ? heroStyles.activeDot : heroStyles.dot
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 10,

    borderRadius: 20,
    overflow: "hidden",

    backgroundColor: COLORS.white,

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  imageContainer: {
    width: "100%",
    height: 250,
    position: "relative",
  },

  slide: {
    width: SCREEN_WIDTH - 32,
    height: 250,
    position: "relative",
  },

  bigImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(0,0,0,0.38)",
  },

  imageContent: {
    position: "absolute",

    left: 18,
    right: 18,
    top: 20,
  },

  badge: {
    alignSelf: "flex-start",

    backgroundColor: "rgba(255,255,255,0.95)",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,

    marginBottom: 10,
  },

  badgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "800",
  },

  title: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "900",
  },

  subtitle: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 5,
    fontWeight: "500",
  },

  dotsContainer: {
    position: "absolute",

    bottom: 12,
    left: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  dotButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: "rgba(255,255,255,0.85)",
  },

  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,

    backgroundColor: COLORS.primary,
  },
});

function SectionHeader({
  title,
  subtitle,
  rightText,
  onRightPress,
}: {
  title: string;
  subtitle?: string;
  rightText?: string;
  onRightPress?: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={sectionStyles.container}>
      <View>
        <Text style={[sectionStyles.title, { color: colors.text }]}>
          {title}
        </Text>

        {subtitle && (
          <Text
            style={[sectionStyles.subtitle, { color: colors.secondaryText }]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {rightText && onRightPress && (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={[sectionStyles.rightText, { color: colors.primary }]}>
            {rightText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 3,
  },

  rightText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
});

function QuickActions({
  onBookings,
  onReorder,
}: {
  onBookings: () => void;
  onReorder: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={quickStyles.row}>
      <TouchableOpacity
        style={[
          quickStyles.card,
          {
            marginRight: 6,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onBookings}
        activeOpacity={0.85}
      >
        <View
          style={[
            quickStyles.iconBox,
            { backgroundColor: colors.iconBackground },
          ]}
        >
          <Text style={quickStyles.icon}>📅</Text>
        </View>

        <Text style={[quickStyles.title, { color: colors.text }]}>
          My Bookings
        </Text>

        <Text style={[quickStyles.subtitle, { color: colors.secondaryText }]}>
          View reservations
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          quickStyles.card,
          {
            marginLeft: 6,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onReorder}
        activeOpacity={0.85}
      >
        <View
          style={[
            quickStyles.iconBox,
            { backgroundColor: colors.iconBackground },
          ]}
        >
          <Text style={quickStyles.icon}>🔄</Text>
        </View>

        <Text style={[quickStyles.title, { color: colors.text }]}>Reorder</Text>

        <Text style={[quickStyles.subtitle, { color: colors.secondaryText }]}>
          Book again
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const quickStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },

  card: {
    flex: 1,

    backgroundColor: COLORS.white,

    borderRadius: 16,
    padding: 14,

    borderWidth: 1,
    borderColor: "#F0F0F0",

    elevation: 2,
  },

  iconBox: {
    width: 43,
    height: 43,

    borderRadius: 13,

    backgroundColor: COLORS.primaryLight,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 10,
  },

  icon: {
    fontSize: 23,
  },

  title: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 10,
    color: COLORS.lightText,
    marginTop: 4,
  },
});

function WhyBookWithUs() {
  return (
    <View style={benefitStyles.row}>
      <TouchableOpacity
        style={[benefitStyles.card, { marginRight: 4 }]}
        onPress={() => {}}
        activeOpacity={1}
      >
        <Text style={benefitStyles.icon}>⚡</Text>
        <Text style={benefitStyles.title}>Quick Booking</Text>
        <Text style={benefitStyles.subtitle}>Book instantly</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[benefitStyles.card, { marginHorizontal: 4 }]}
        onPress={() => {}}
        activeOpacity={1}
      >
        <Text style={benefitStyles.icon}>🚫</Text>
        <Text style={benefitStyles.title}>No Waiting</Text>
        <Text style={benefitStyles.subtitle}>Skip queues</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[benefitStyles.card, { marginLeft: 4 }]}
        onPress={() => {}}
        activeOpacity={1}
      >
        <Text style={benefitStyles.icon}>🔒</Text>
        <Text style={benefitStyles.title}>Secure</Text>
        <Text style={benefitStyles.subtitle}>Safe booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const benefitStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 2,
  },
  icon: {
    fontSize: 23,
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 9,
    color: COLORS.lightText,
    marginTop: 4,
  },
});

function BottomActionButtons({
  selectedBranch,
  onBookTable,
}: {
  selectedBranch: Branch | null;
  onBookTable: () => void;
}) {
  const handlePayBill = () => {
    if (selectedBranch) {
      router.push({
        pathname: "/paybill",
        params: {
          branchName: selectedBranch.name,
          branchLocation: selectedBranch.location,
        },
      });
    } else {
      router.push("/paybill" as any);
    }
  };

  return (
    <View style={actionStyles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        delayPressIn={0}
        onPress={onBookTable}
        style={[actionStyles.button, actionStyles.bookButton]}
      >
        <Text style={actionStyles.buttonIcon}>🍽️</Text>

        <Text style={actionStyles.bookText}>Book a Table</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePayBill}
        style={[actionStyles.button, actionStyles.payButton]}
      >
        <Text style={actionStyles.buttonIcon}>💳</Text>

        <Text style={actionStyles.payText}>Pay Bill</Text>
      </TouchableOpacity>
    </View>
  );
}

const actionStyles = StyleSheet.create({
  container: {
    flexDirection: "row",

    paddingHorizontal: 16,

    marginTop: 18,
    marginBottom: 20,

    gap: 10,
  },

  button: {
    flex: 1,

    height: 52,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  bookButton: {
    backgroundColor: COLORS.primary,
  },

  payButton: {
    backgroundColor: COLORS.primary,
  },

  buttonIcon: {
    fontSize: 18,
    marginRight: 7,
  },

  bookText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },

  payText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },
});

export default function HomeScreen() {
  const { colors } = useAppTheme();

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [hasSelectedBranch, setHasSelectedBranch] = useState(false);

  const [userLocation, setUserLocation] = useState("Getting location...");

  const [showBranchBox, setShowBranchBox] = useState(false);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setUserLocation("Location permission denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address.length > 0) {
          const place = address[0];

          const locationText = [place.district, place.city, place.region]
            .filter(Boolean)
            .join(", ");

          setUserLocation(locationText || "Location unavailable");
        }
      } catch (error) {
        console.log("Location error:", error);

        setUserLocation("Location unavailable");
      }
    };

    getUserLocation();
  }, []);

  const selectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setHasSelectedBranch(true);
    setShowBranchBox(false);
  };

  const goToBooking = () => {
    if (selectedBranch) {
      openBooking(selectedBranch);
    } else {
      openBooking();
    }
  };

  const openBookings = () => {
    router.push("/(tabs)/bookings" as any);
  };

  const openReorder = () => {
    router.push("/(tabs)/reorder" as any);
  };

  const openProfile = () => {
    router.push("/(tabs)/profile" as any);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        <Header
          onProfilePress={openProfile}
          selectedBranch={selectedBranch}
          userLocation={userLocation}
          hasSelectedBranch={hasSelectedBranch}
        />

        <View
          style={{
            paddingHorizontal: 18,
            paddingTop: 12,
            paddingBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: colors.secondaryText,
              fontWeight: "600",
              marginBottom: 7,
            }}
          >
            Where do you want to eat?
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowBranchBox(true)}
            style={{
              height: 48,

              backgroundColor: colors.card,

              borderRadius: 14,

              borderWidth: 1,
              borderColor: colors.border,

              flexDirection: "row",
              alignItems: "center",

              paddingHorizontal: 13,

              elevation: 2,

              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 5,

              shadowOffset: {
                width: 0,
                height: 2,
              },
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,

                borderRadius: 10,

                backgroundColor: colors.iconBackground,

                alignItems: "center",
                justifyContent: "center",

                marginRight: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                }}
              >
                🍽️
              </Text>
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: colors.text,
                }}
              >
                Dine In
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  color: colors.secondaryText,
                  marginTop: 1,
                }}
              >
                {selectedBranch
                  ? selectedBranch.location
                  : "Please select a branch"}
              </Text>
            </View>

            <View
              style={{
                width: 30,
                height: 30,

                borderRadius: 15,

                backgroundColor: colors.iconBackground,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.primary,
                  fontWeight: "800",
                }}
              >
                ▼
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <HeroBanner onBookTable={goToBooking} />

        <SectionHeader title="Quick Actions" />

        <QuickActions onBookings={openBookings} onReorder={openReorder} />

        <SectionHeader title="Why Book With Us?" />

        <WhyBookWithUs />

        <MenuSection />

        <View
          style={{
            backgroundColor: COLORS.white,

            marginTop: 18,
            marginHorizontal: 16,

            borderRadius: 16,

            paddingHorizontal: 15,
            paddingTop: 16,
            paddingBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "900",
              color: COLORS.text,

              marginBottom: 12,
            }}
          >
            Popular Dishes
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",

                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  marginRight: 8,
                }}
              >
                🥄◐
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
                numberOfLines={1}
              >
                Chicken Biryani
              </Text>
            </View>

            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",

                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  marginRight: 8,
                }}
              >
                🥄◐
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
                numberOfLines={1}
              >
                Paneer Tikka
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",

                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  marginRight: 8,
                }}
              >
                🥄◐
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
                numberOfLines={1}
              >
                Masala Dosa
              </Text>
            </View>

            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",

                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  marginRight: 8,
                }}
              >
                🥄◐
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
                numberOfLines={1}
              >
                Chicken 65
              </Text>
            </View>
          </View>
        </View>

        <PhotosSection />

        <View
          style={{
            backgroundColor: COLORS.white,

            marginTop: 18,
            marginHorizontal: 16,

            borderRadius: 16,

            paddingHorizontal: 15,
            paddingTop: 16,
            paddingBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "900",
              color: COLORS.text,

              marginBottom: 14,
            }}
          >
            Amenities
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 14,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push("/parking")}
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,

                  borderRadius: 14,

                  backgroundColor: COLORS.primaryLight,

                  justifyContent: "center",
                  alignItems: "center",

                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                  }}
                >
                  🅿️
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: COLORS.text,
                  }}
                >
                  Parking
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    color: "#555",
                    marginTop: 3,
                  }}
                >
                  View parking location
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,

                  borderRadius: 14,

                  backgroundColor: COLORS.primaryLight,

                  justifyContent: "center",
                  alignItems: "center",

                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                  }}
                >
                  📶
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
              >
                Free Wi-Fi
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,

                  borderRadius: 14,

                  backgroundColor: COLORS.primaryLight,

                  justifyContent: "center",
                  alignItems: "center",

                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                  }}
                >
                  ❄️
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
              >
                AC
              </Text>
            </View>

            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,

                  borderRadius: 14,

                  backgroundColor: COLORS.primaryLight,

                  justifyContent: "center",
                  alignItems: "center",

                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                  }}
                >
                  👨‍👩‍👧
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
              >
                Family Friendly
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: colors.background,
        }}
      >
        <BottomActionButtons
          selectedBranch={selectedBranch}
          onBookTable={goToBooking}
        />
      </View>

      {showBranchBox && (
        <BranchSelector
          branches={branches}
          onSelect={selectBranch}
          onClose={() => setShowBranchBox(false)}
        />
      )}
    </SafeAreaView>
  );
}
