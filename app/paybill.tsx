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
    bank: "Paytm",
    title: "10% OFF",
    subtitle: "Paytm 10% offer",
  },
  {
    bank: "HDFC Bank",
    title: "10% OFF",
    subtitle: "HDFC 10% offer",
  },
  {
    bank: "PhonePe",
    title: "₹5% off",
    subtitle: "PhonePe 5% offer",
  },
];

export default function PayBillPage() {
  const { colors } = useAppTheme();
  const COLORS = {
    primary: colors.primary,
    text: colors.text,
    secondaryText: colors.secondaryText,
    background: colors.background,
    white: colors.card,
    onPrimary: "#FFFFFF",
    border: colors.border,
  };
  const { width } = useWindowDimensions();

  const params = useLocalSearchParams<{
    branchName?: string | string[];
    branchLocation?: string | string[];
  }>();

  const branchName =
    typeof params.branchName === "string"
      ? params.branchName
      : "Paradise Biryani";

  const branchLocation =
    typeof params.branchLocation === "string"
      ? params.branchLocation
      : "Hyderabad";

  const [amount, setAmount] = useState("");
  const [couponIndex, setCouponIndex] = useState(0);
  const carouselRef = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCouponIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % coupons.length;

        carouselRef.current?.scrollTo({
          x: nextIndex * (width - 32),
          animated: true,
        });

        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [width]);

  const handlePayBill = () => {
    const totalAmount = Number(amount);

    if (!amount.trim()) {
      Alert.alert("Enter Amount", "Please enter the total bill amount.");
      return;
    }

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid bill amount.");
      return;
    }

    Alert.alert("Pay Bill", `Payment of ₹${totalAmount} will be processed.`);
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
              paddingTop: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.secondaryText,
                fontWeight: "600",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              PAYING BILL TO
            </Text>

            <Text
              style={{
                fontSize: 25,
                fontWeight: "800",
                color: COLORS.text,
                textAlign: "center",
                lineHeight: 31,
              }}
            >
              {branchName}
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: COLORS.secondaryText,
                marginTop: 8,
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
              marginTop: 28,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: COLORS.secondaryText,
                marginBottom: 8,
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
                  fontSize: 38,
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
                  fontSize: 38,
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
                marginTop: 12,
              }}
            >
              Enter total amount as shown on the bill
            </Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                marginBottom: 14,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: "900",
                    color: COLORS.text,
                  }}
                >
                  Coupons & Offers
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.secondaryText,
                    marginTop: 4,
                  }}
                >
                  Save more on your bill
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: colors.iconBackground,
                  paddingHorizontal: 11,
                  paddingVertical: 7,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: 11,
                    fontWeight: "800",
                  }}
                >
                  SPECIAL OFFERS
                </Text>
              </View>
            </View>

            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={width - 24}
              snapToAlignment="start"
              contentContainerStyle={{ paddingLeft: 12 }}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (width - 24),
                );

                setCouponIndex(
                  Math.max(0, Math.min(index, coupons.length - 1)),
                );
              }}
            >
              {coupons.map((coupon, index) => (
                <View
                  key={coupon.bank}
                  style={{
                    width: width - 24,
                    paddingHorizontal: 4,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      borderRadius: 20,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      elevation: 3,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: 20,
                        paddingVertical: 17,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text
                          style={{
                            color: COLORS.onPrimary,
                            fontSize: 12,
                            fontWeight: "700",
                            letterSpacing: 1,
                          }}
                        >
                          EXCLUSIVE DEAL
                        </Text>

                        <Text
                          style={{
                            color: COLORS.onPrimary,
                            fontSize: 25,
                            fontWeight: "900",
                            marginTop: 5,
                          }}
                        >
                          {coupon.title}
                        </Text>
                      </View>

                      <View
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: 29,
                          backgroundColor: COLORS.white,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 27,
                            fontWeight: "900",
                            color: COLORS.primary,
                          }}
                        >
                          %
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        padding: 18,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text
                          style={{
                            color: COLORS.text,
                            fontSize: 18,
                            fontWeight: "900",
                          }}
                        >
                          {coupon.bank}
                        </Text>

                        <Text
                          style={{
                            color: COLORS.secondaryText,
                            fontSize: 13,
                            marginTop: 6,
                            lineHeight: 19,
                          }}
                        >
                          {coupon.subtitle}
                        </Text>
                      </View>

                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: COLORS.primary,
                          borderStyle: "dashed",
                          borderRadius: 10,
                          paddingHorizontal: 12,
                          paddingVertical: 9,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "800",
                            color: COLORS.primary,
                          }}
                        >
                          OFFER
                        </Text>

                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "900",
                            color: COLORS.text,
                            marginTop: 3,
                          }}
                        >
                          #{index + 1}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              {coupons.map((coupon, index) => (
                <View
                  key={coupon.bank}
                  style={{
                    width: couponIndex === index ? 24 : 7,
                    height: 7,
                    borderRadius: 5,
                    marginHorizontal: 4,
                    backgroundColor:
                      couponIndex === index ? COLORS.primary : COLORS.border,
                  }}
                />
              ))}
            </View>

            <Text
              style={{
                fontSize: 11,
                color: COLORS.secondaryText,
                textAlign: "center",
                marginTop: 7,
              }}
            >
              Offers rotate automatically every 5 seconds
            </Text>
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: COLORS.white,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 12,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePayBill}
            style={{
              height: 54,
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
              Pay Bill
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
