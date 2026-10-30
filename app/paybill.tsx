import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewInstance,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../contexts/ThemeContext";

const coupons = [
  {
    id: "WELCOME10",
    provider: "Welcome Offer",
    discount: "10% OFF",
    description: "10% off for first-time eligible customers.",
    type: "welcome",
  },
  {
    id: "DINE15",
    provider: "Dine-In Special",
    discount: "15% OFF",
    description: "15% off bills of ₹1,500 or more. Max discount ₹200.",
    type: "dinein",
  },
  {
    id: "WEEKEND20",
    provider: "Weekend Special",
    discount: "20% OFF",
    description: "20% off for eligible Saturday and Sunday dining.",
    type: "weekend",
  },
] as const;

export default function PayBillPage() {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();

  const COLORS = {
    primary: colors.primary,
    text: colors.text,
    secondaryText: colors.secondaryText,
    background: colors.background,
    white: colors.card,
    onPrimary: "#FFFFFF",
    border: colors.border,
  };

  const slideWidth = Math.max(280, width - 56);

  const params = useLocalSearchParams<{
    branchName?: string | string[];
    branchLocation?: string | string[];
    diningDate?: string | string[];
  }>();

  const branchName =
    typeof params.branchName === "string"
      ? params.branchName
      : "Paradise Biryani";

  const branchLocation =
    typeof params.branchLocation === "string"
      ? params.branchLocation
      : "Hyderabad";

  const diningDateString =
    typeof params.diningDate === "string" ? params.diningDate : "";

  const diningDate = diningDateString
    ? new Date(`${diningDateString}T12:00:00`)
    : new Date();

  const isValidDiningDate = !Number.isNaN(diningDate.getTime());

  const isWeekend =
    isValidDiningDate &&
    (diningDate.getDay() === 0 || diningDate.getDay() === 6);

  const [amount, setAmount] = useState("");
  const [couponIndex, setCouponIndex] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

  const [isFirstTimeCustomer] = useState(false);

  const carouselRef = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    if (selectedCoupon) {
      return;
    }

    const timer = setInterval(() => {
      setCouponIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % coupons.length;

        carouselRef.current?.scrollTo({
          x: nextIndex * slideWidth,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [selectedCoupon, slideWidth]);

  const totalAmount = Number(amount) || 0;

  const selectedOffer = coupons.find((coupon) => coupon.id === selectedCoupon);

  let discount = 0;
  let offerMessage = "";

  if (selectedOffer) {
    if (totalAmount <= 0) {
      offerMessage = "Enter your bill amount to check this offer.";
    } else if (selectedOffer.type === "welcome") {
      if (isFirstTimeCustomer) {
        discount = totalAmount * 0.1;
      } else {
        offerMessage = "";
      }
    } else if (selectedOffer.type === "dinein") {
      if (totalAmount >= 1500) {
        discount = Math.min(totalAmount * 0.15, 200);
      } else {
        offerMessage = "Dine-In Special requires a minimum bill of ₹1,500.";
      }
    } else if (selectedOffer.type === "weekend") {
      if (!isValidDiningDate) {
        offerMessage = "Please check your booking's dining date.";
      } else if (isWeekend) {
        discount = totalAmount * 0.2;
      } else {
        offerMessage =
          "Weekend Special is available only for Saturday and Sunday dining.";
      }
    }
  }

  const finalAmount = Math.max(0, totalAmount - discount);

  const handleSelectCoupon = (couponId: string) => {
    const couponIndexToSelect = coupons.findIndex(
      (coupon) => coupon.id === couponId,
    );

    if (selectedCoupon === couponId) {
      setSelectedCoupon(null);
      return;
    }

    if (couponIndexToSelect >= 0) {
      setCouponIndex(couponIndexToSelect);
      carouselRef.current?.scrollTo({
        x: couponIndexToSelect * slideWidth,
        animated: true,
      });
    }

    setSelectedCoupon(couponId);
  };

  const handlePayBill = () => {
    if (!amount.trim()) {
      Alert.alert("Enter Amount", "Please enter the total bill amount.");
      return;
    }

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid bill amount.");
      return;
    }

    if (selectedCoupon && offerMessage) {
      Alert.alert("Offer Not Available", offerMessage);
      return;
    }

    Alert.alert(
      "Pay Bill",
      `Bill Amount: ₹${totalAmount.toFixed(2)}\n` +
        `Discount: ₹${discount.toFixed(2)}\n` +
        `Final Amount: ₹${finalAmount.toFixed(2)}\n\n` +
        "Connect a payment gateway to process the actual payment.",
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            height: 58,
            backgroundColor: COLORS.white,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 34,
                color: COLORS.text,
                lineHeight: 36,
              }}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 21,
              fontWeight: "800",
              color: COLORS.text,
              marginLeft: 8,
            }}
          >
            Pay Bill
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 14,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.secondaryText,
                fontWeight: "600",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              PAYING BILL TO
            </Text>

            <Text
              style={{
                fontSize: 21,
                fontWeight: "800",
                color: COLORS.text,
                textAlign: "center",
                lineHeight: 26,
              }}
            >
              {branchName}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: COLORS.secondaryText,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              {branchLocation}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 25,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: COLORS.secondaryText,
                marginBottom: 4,
              }}
            >
              Enter total amount
            </Text>

            <View
              style={{
                width: width * 0.75,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 2,
                borderBottomColor: "#D5D5D5",
                paddingBottom: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  color: COLORS.text,
                }}
              >
                ₹
              </Text>

              <TextInput
                value={amount}
                onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
                placeholder="0"
                placeholderTextColor={COLORS.secondaryText}
                keyboardType="number-pad"
                textAlign="center"
                style={{
                  flex: 1,
                  fontSize: 32,
                  fontWeight: "800",
                  color: COLORS.text,
                  paddingVertical: 0,
                }}
              />
            </View>

            <Text
              style={{
                fontSize: 13,
                color: COLORS.secondaryText,
                marginTop: 6,
              }}
            >
              Enter total amount as shown on the bill
            </Text>
          </View>

          <View
            style={{
              marginTop: 18,
              paddingHorizontal: 16,
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "900",
                  color: COLORS.text,
                }}
              >
                Coupons & Offers
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.secondaryText,
                  marginTop: 3,
                }}
              >
                Choose an offer and save on your bill.
              </Text>
            </View>

            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
                padding: 8,
                overflow: "hidden",
                elevation: 4,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 8,
              }}
            >
              <ScrollView
                ref={carouselRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={slideWidth}
                snapToAlignment="start"
                disableIntervalMomentum
                contentContainerStyle={{ alignItems: "stretch" }}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / slideWidth,
                  );

                  setCouponIndex(
                    Math.max(0, Math.min(index, coupons.length - 1)),
                  );
                }}
              >
                {coupons.map((coupon, index) => {
                  const isSelected = selectedCoupon === coupon.id;

                  return (
                    <View
                      key={coupon.id}
                      style={{
                        width: slideWidth,
                        paddingRight: index === coupons.length - 1 ? 0 : 12,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => handleSelectCoupon(coupon.id)}
                        style={{
                          backgroundColor: colors.iconBackground,
                          borderRadius: 16,
                          borderWidth: isSelected ? 2 : 1,
                          borderColor: isSelected
                            ? COLORS.primary
                            : COLORS.border,
                          minHeight: 110,
                          padding: 8,
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View style={{ flex: 1, paddingRight: 8 }}>
                            <Text
                              style={{
                                color: COLORS.secondaryText,
                                fontSize: 12,
                                fontWeight: "800",
                                letterSpacing: 1,
                              }}
                            >
                              {coupon.provider.toUpperCase()}
                            </Text>

                            <Text
                              style={{
                                color: COLORS.text,
                                fontSize: 16,
                                fontWeight: "900",
                                marginTop: 4,
                              }}
                            >
                              {coupon.description}
                            </Text>
                          </View>

                          <View
                            style={{
                              minWidth: 64,
                              height: 64,
                              borderRadius: 32,
                              backgroundColor: COLORS.primary,
                              alignItems: "center",
                              justifyContent: "center",
                              paddingHorizontal: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                color: COLORS.onPrimary,
                                fontWeight: "700",
                              }}
                            >
                              SAVE
                            </Text>

                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "900",
                                color: COLORS.onPrimary,
                                marginTop: 1,
                              }}
                            >
                              {coupon.discount}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            borderTopWidth: 1,
                            borderTopColor: COLORS.border,
                            paddingTop: 8,
                            marginTop: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.secondaryText,
                              fontSize: 11,
                              fontWeight: "600",
                            }}
                          >
                            {isSelected ? "Offer selected" : "Tap to select"}
                          </Text>

                          <View
                            style={{
                              backgroundColor: COLORS.white,
                              borderRadius: 8,
                              paddingHorizontal: 7,
                              paddingVertical: 4,
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.primary,
                                fontSize: 10,
                                fontWeight: "800",
                              }}
                            >
                              {isSelected ? "SELECTED ✓" : "APPLY OFFER"}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 10,
                  paddingBottom: 2,
                }}
              >
                {coupons.map((coupon, index) => (
                  <View
                    key={coupon.id}
                    style={{
                      width: couponIndex === index ? 23 : 8,
                      height: 8,
                      borderRadius: 10,
                      backgroundColor:
                        couponIndex === index ? COLORS.primary : COLORS.border,
                      marginHorizontal: 4,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 16,
              marginTop: 12,
              padding: 12,
              backgroundColor: COLORS.white,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "900",
                color: COLORS.text,
                marginBottom: 8,
              }}
            >
              Bill Summary
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ color: COLORS.secondaryText }}>Bill Amount</Text>
              <Text style={{ color: COLORS.text, fontWeight: "700" }}>
                ₹{totalAmount.toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ color: COLORS.secondaryText }}>Discount</Text>
              <Text style={{ color: COLORS.primary, fontWeight: "800" }}>
                - ₹{discount.toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: COLORS.border,
                marginVertical: 6,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 16,
                  fontWeight: "900",
                }}
              >
                Final Amount
              </Text>

              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                ₹{finalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: COLORS.white,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 6,
            paddingBottom: 8,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.secondaryText,
                fontWeight: "600",
                marginBottom: 5,
              }}
            >
              💵 PAY USING ▲
            </Text>

            <Text
              style={{
                fontSize: 13,
                fontWeight: "800",
                color: COLORS.text,
              }}
            >
              Pay on (Cash/UPI)
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: COLORS.secondaryText,
                marginTop: 4,
              }}
            >
              Pay cash or ask for QR code
            </Text>
          </View>

          {/* Right side: Pay button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePayBill}
            style={{
              flex: 0.9,
              height: 60,
              borderRadius: 14,
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.onPrimary,
                fontSize: 17,
                fontWeight: "900",
              }}
            >
              Pay ₹{finalAmount.toFixed(0)}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
