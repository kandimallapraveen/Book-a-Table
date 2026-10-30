import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "../../contexts/ThemeContext";

export default function Login() {
  const { colors } = useAppTheme();
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    setOtpSent(true);

    Alert.alert("OTP Sent", `OTP has been sent to ${email.trim()}`);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    if (otp.trim().length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP");
      return;
    }

    try {
      await AsyncStorage.setItem("isLoggedIn", "true");

      router.replace("/(tabs)" as any);
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "Unable to login");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)" as any);
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 25,
          paddingVertical: 30,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <Image
            source={require("../../assets/images/logo.jpg")}
            style={{
              width: 120,
              height: 120,
              resizeMode: "contain",
            }}
          />

          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: colors.text,
            }}
          >
            Welcome Back!
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: colors.secondaryText,
              marginTop: 7,
            }}
          >
            Login to book a table
          </Text>
        </View>

        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            width: "100%",
            height: 55,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 10,
            paddingHorizontal: 16,
            fontSize: 16,
            marginBottom: 15,
            backgroundColor: colors.card,
          }}
          placeholderTextColor={colors.secondaryText}
        />

        {!otpSent ? (
          <>
            <TouchableOpacity
              onPress={handleSendOTP}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.primary,
                height: 55,
                borderRadius: 10,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                elevation: 2,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                SEND OTP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.7}
              style={{
                marginTop: 18,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  flex: 1,
                }}
              />

              <Text
                style={{
                  color: colors.secondaryText,
                  fontSize: 14,
                  fontWeight: "600",
                  marginHorizontal: 12,
                }}
              >
                Skip for now
              </Text>

              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  flex: 1,
                }}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              style={{
                width: "100%",
                height: 55,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                borderRadius: 10,
                paddingHorizontal: 16,
                fontSize: 18,
                marginBottom: 15,
                backgroundColor: colors.card,
                textAlign: "center",
                letterSpacing: 5,
              }}
              placeholderTextColor={colors.secondaryText}
            />

            <TouchableOpacity
              onPress={handleVerifyOTP}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.primary,
                height: 55,
                borderRadius: 10,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                elevation: 2,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                VERIFY OTP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.7}
              style={{
                marginTop: 18,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  flex: 1,
                }}
              />

              <Text
                style={{
                  color: colors.secondaryText,
                  fontSize: 14,
                  fontWeight: "600",
                  marginHorizontal: 12,
                }}
              >
                Skip for now
              </Text>

              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  flex: 1,
                }}
              />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
