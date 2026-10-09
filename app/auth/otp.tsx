import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OTPPage() {
  const params = useLocalSearchParams();

  const email = Array.isArray(params.email) ? params.email[0] : params.email;

  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit OTP.");
      return;
    }

    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>

        <Text style={styles.subtitle}>Enter the 6-digit OTP sent to</Text>

        <Text style={styles.email}>{email || "your email"}</Text>

        <TextInput
          value={otp}
          onChangeText={(text) =>
            setOtp(text.replace(/[^0-9]/g, "").slice(0, 6))
          }
          placeholder="Enter OTP"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#171717",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 12,
  },

  email: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FC8019",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 28,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 5,
  },

  button: {
    height: 52,
    backgroundColor: "#FC8019",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  backButton: {
    alignItems: "center",
    marginTop: 20,
  },

  backText: {
    color: "#FC8019",
    fontSize: 14,
    fontWeight: "700",
  },
});
