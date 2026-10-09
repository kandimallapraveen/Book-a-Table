import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedName = await AsyncStorage.getItem("userName");
      const storedEmail = await AsyncStorage.getItem("userEmail");

      setName(storedName || "");
      setEmail(storedEmail || "");
    } catch (error) {
      console.log("Profile loading error:", error);
    }
  };

  const handleEditProfile = () => {
    setEditName(name);
    setEditEmail(email);
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    if (!editEmail.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    if (!editEmail.includes("@")) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    try {
      await AsyncStorage.setItem("userName", editName.trim());
      await AsyncStorage.setItem("userEmail", editEmail.trim());

      setName(editName.trim());
      setEmail(editEmail.trim());

      setEditMode(false);

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.log("Profile update error:", error);

      Alert.alert("Error", "Unable to update profile.");
    }
  };

  const handleCancel = () => {
    setEditName(name);
    setEditEmail(email);
    setEditMode(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",

        onPress: async () => {
          try {
            await AsyncStorage.removeItem("isLoggedIn");

            router.replace("/auth/login" as any);
          } catch (error) {
            console.log("Logout error:", error);

            Alert.alert("Error", "Unable to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)" as any);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F7F8F7",
      }}
    >
      <View
        style={{
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 25,
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                color: "#222",
              }}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "900",
              color: "#222",
            }}
          >
            Profile
          </Text>
        </View>

        {!editMode ? (
          <>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 18,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#EEEEEE",
              }}
            >
              <View
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 33,
                  backgroundColor: "#FC8019",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 28,
                    fontWeight: "900",
                  }}
                >
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 16,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: "#222",
                  }}
                >
                  {name || "User"}
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: "#777",
                    marginTop: 5,
                  }}
                >
                  {email || "No email available"}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#333",
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Account
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 15,
                padding: 15,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#EEEEEE",
              }}
              onPress={handleEditProfile}
            >
              <View
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: 12,
                  backgroundColor: "#FFF0E6",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>✏️</Text>
              </View>

              <View
                style={{
                  flex: 1,
                  marginLeft: 13,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "800",
                    color: "#222",
                  }}
                >
                  Edit Profile
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    color: "#888",
                    marginTop: 4,
                  }}
                >
                  Update your name and email
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 28,
                  color: "#999",
                }}
              >
                ›
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 15,
                padding: 15,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#EEEEEE",
              }}
              onPress={() => router.push("/(tabs)/bookings" as any)}
            >
              <View
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: 12,
                  backgroundColor: "#FFF0E6",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>📖</Text>
              </View>

              <View
                style={{
                  flex: 1,
                  marginLeft: 13,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "800",
                    color: "#222",
                  }}
                >
                  My Bookings
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    color: "#888",
                    marginTop: 4,
                  }}
                >
                  View your table bookings
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 28,
                  color: "#999",
                }}
              >
                ›
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#333",
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Account Actions
            </Text>

            <TouchableOpacity
              style={{
                height: 52,
                borderRadius: 13,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#FFD5D5",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleLogout}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#E53935",
                  marginRight: 8,
                }}
              >
                ↪
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: "#E53935",
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#222",
                marginBottom: 25,
              }}
            >
              Edit Profile
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#333",
                marginBottom: 7,
              }}
            >
              Name
            </Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              style={{
                height: 52,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#DDDDDD",
                borderRadius: 12,
                paddingHorizontal: 15,
                fontSize: 14,
                color: "#222",
                marginBottom: 18,
              }}
            />

            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#333",
                marginBottom: 7,
              }}
            >
              Email
            </Text>

            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                height: 52,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#DDDDDD",
                borderRadius: 12,
                paddingHorizontal: 15,
                fontSize: 14,
                color: "#222",
                marginBottom: 18,
              }}
            />

            <TouchableOpacity
              style={{
                height: 52,
                backgroundColor: "#FC8019",
                borderRadius: 13,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 8,
              }}
              onPress={handleSaveProfile}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={{
                height: 52,
                backgroundColor: "white",
                borderRadius: 13,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 12,
                borderWidth: 1,
                borderColor: "#DDDDDD",
              }}
              onPress={handleCancel}
            >
              <Text
                style={{
                  color: "#555",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
