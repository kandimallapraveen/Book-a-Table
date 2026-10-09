import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#FC8019",
  text: "#171717",
  secondaryText: "#6B6B6B",
  background: "#F7F8FA",
  white: "#FFFFFF",
  border: "#E8E8E8",
  green: "#0B8F55",
};

const coupons = [
  {
    bank: "Paytm",
    title: "10% OFF",
    subtitle: "Paytm tho pay chesthe 10% offer",
  },
  {
    bank: "HDFC Bank",
    title: "10% OFF",
    subtitle: "HDFC Bank tho pay chesthe 10% offer",
  },
  {
    bank: "PhonePe",
    title: "₹150 CASHBACK",
    subtitle: "PhonePe tho pay chesthe cashback",
  },
];

export default function PayBillPage() {
  const { width } = useWindowDimensions();

  const params = useLocalSearchParams<{
    branchName?: string;
    branchLocation?: string;
  }>();

  const branchName = params.branchName?.toString() || "Paradise Biryani";

  const branchLocation = params.branchLocation?.toString() || "Hyderabad";

  const [amount, setAmount] = useState("");
  const [couponIndex, setCouponIndex] = useState(0);

  const handlePayBill = () => {
    if (!amount.trim()) {
      Alert.alert("Enter Amount", "Please enter the total bill amount.");
      return;
    }

    if (Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid bill amount.");
      return;
    }

    Alert.alert("Pay Bill", `Payment of ₹${amount} will be processed.`);
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
          contentContainerStyle={{
            paddingBottom: 130,
          }}
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
                placeholderTextColor="#BDBDBD"
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

          <View
            style={{
              marginTop: 30,
            }}
          >
            <Text
              style={{
                fontSize: 19,
                fontWeight: "800",
                color: COLORS.text,
                paddingHorizontal: 16,
                marginBottom: 12,
              }}
            >
              Coupons & Offers
            </Text>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (width - 32),
                );

                setCouponIndex(index);
              }}
            >
              {coupons.map((coupon, index) => (
                <View
                  key={index}
                  style={{
                    width: width - 32,
                    minHeight: 155,
                    marginLeft: index === 0 ? 16 : 0,
                    marginRight: index === coupons.length - 1 ? 16 : 0,
                    backgroundColor: COLORS.white,
                    borderRadius: 18,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "#FFE0CC",
                    elevation: 3,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        backgroundColor: COLORS.primary,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 22,
                          color: COLORS.white,
                          fontWeight: "900",
                        }}
                      >
                        %
                      </Text>
                    </View>

                    <View
                      style={{
                        marginLeft: 14,
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "800",
                          color: COLORS.text,
                        }}
                      >
                        {coupon.bank}
                      </Text>

                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "900",
                          color: COLORS.primary,
                          marginTop: 4,
                        }}
                      >
                        {coupon.title}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          color: COLORS.secondaryText,
                          marginTop: 5,
                        }}
                      >
                        {coupon.subtitle}
                      </Text>
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
                marginTop: 10,
              }}
            >
              {coupons.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: couponIndex === index ? 9 : 7,
                    height: couponIndex === index ? 9 : 7,
                    borderRadius: 10,
                    backgroundColor:
                      couponIndex === index ? COLORS.primary : "#D0D0D0",
                    marginHorizontal: 4,
                  }}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
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
                color: COLORS.white,
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
