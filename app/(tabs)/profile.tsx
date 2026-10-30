import type { ThemeType } from "@/constants/appTheme";
import { useAppTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const themeOptions: {
  value: ThemeType;
  title: string;
  description: string;
  background: string;
  textColor: string;
  accent: string;
}[] = [
  {
    value: "light",
    title: "☀️ Light Theme",
    description: "White background",
    background: "#FFFFFF",
    textColor: "#222222",
    accent: "#FC8019",
  },
  {
    value: "dark",
    title: "🌙 Dark Theme",
    description: "Dark background",
    background: "#222222",
    textColor: "#FFFFFF",
    accent: "#FC8019",
  },
  {
    value: "custom",
    title: "🎨 Warm Theme",
    description: "Deep orange surfaces",
    background: "#21150F",
    textColor: "#FFF8F2",
    accent: "#FF8A2A",
  },
];

export default function Profile() {
  const { theme, colors, setTheme } = useAppTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [showThemes, setShowThemes] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [storedName, storedEmail] = await AsyncStorage.multiGet([
          "userName",
          "userEmail",
        ]);

        if (isMounted) {
          setName(storedName[1] || "");
          setEmail(storedEmail[1] || "");
        }
      } catch (error) {
        console.log("Profile loading error:", error);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectTheme = async (selectedTheme: ThemeType) => {
    try {
      await setTheme(selectedTheme);
      setShowThemes(false);
    } catch (error) {
      console.log("Theme saving error:", error);
      Alert.alert("Error", "Unable to save theme.");
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
    if (showThemes) {
      setShowThemes(false);
      return;
    }

    if (editMode) {
      handleCancel();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)" as any);
    }
  };

  const screenTitle = showThemes
    ? "Themes"
    : editMode
      ? "Edit Profile"
      : "Profile";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 35,
        }}
        keyboardShouldPersistTaps="handled"
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
              backgroundColor: colors.card,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 30, color: colors.text }}>‹</Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "900",
              color: colors.text,
            }}
          >
            {screenTitle}
          </Text>
        </View>

        {!editMode && !showThemes ? (
          <>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 18,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 33,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 28,
                    fontWeight: "900",
                  }}
                >
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>

              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: colors.text,
                  }}
                >
                  {name || "User"}
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: colors.secondaryText,
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
                color: colors.text,
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Account
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: colors.card,
                borderRadius: 15,
                padding: 15,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={handleEditProfile}
            >
              <View
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: 12,
                  backgroundColor: colors.iconBackground,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>✏️</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 13 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "800",
                    color: colors.text,
                  }}
                >
                  Edit Profile
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    color: colors.secondaryText,
                    marginTop: 4,
                  }}
                >
                  Update your name and email
                </Text>
              </View>

              <Text style={{ fontSize: 28, color: colors.secondaryText }}>
                ›
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: colors.card,
                borderRadius: 15,
                padding: 15,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => router.push("/(tabs)/bookings" as any)}
            >
              <View
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: 12,
                  backgroundColor: colors.iconBackground,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>📖</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 13 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "800",
                    color: colors.text,
                  }}
                >
                  My Bookings
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    color: colors.secondaryText,
                    marginTop: 4,
                  }}
                >
                  View your table bookings
                </Text>
              </View>

              <Text style={{ fontSize: 28, color: colors.secondaryText }}>
                ›
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: colors.card,
                borderRadius: 15,
                padding: 15,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => setShowThemes(true)}
            >
              <View
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: 12,
                  backgroundColor: colors.iconBackground,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>🎨</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 13 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "800",
                    color: colors.text,
                  }}
                >
                  Themes
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    color: colors.secondaryText,
                    marginTop: 4,
                  }}
                >
                  Change your app appearance
                </Text>
              </View>

              <Text style={{ fontSize: 28, color: colors.secondaryText }}>
                ›
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: colors.text,
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
                backgroundColor: colors.card,
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
        ) : editMode ? (
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: colors.text,
                marginBottom: 25,
              }}
            >
              Update your details
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.text,
                marginBottom: 7,
              }}
            >
              Name
            </Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor={colors.secondaryText}
              style={{
                height: 52,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                borderRadius: 12,
                paddingHorizontal: 15,
                fontSize: 14,
                color: colors.text,
                marginBottom: 18,
              }}
            />

            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.text,
                marginBottom: 7,
              }}
            >
              Email
            </Text>

            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                height: 52,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                borderRadius: 12,
                paddingHorizontal: 15,
                fontSize: 14,
                color: colors.text,
                marginBottom: 18,
              }}
            />

            <TouchableOpacity
              style={{
                height: 52,
                backgroundColor: colors.primary,
                borderRadius: 13,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 8,
              }}
              onPress={handleSaveProfile}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 52,
                backgroundColor: colors.card,
                borderRadius: 13,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 12,
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
              onPress={handleCancel}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 15,
                color: colors.secondaryText,
                marginBottom: 20,
              }}
            >
              Choose how your app looks.
            </Text>

            {themeOptions.map((item) => {
              const isSelected = theme === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.8}
                  onPress={() => handleSelectTheme(item.value)}
                  style={{
                    backgroundColor: item.background,
                    padding: 20,
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: isSelected ? item.accent : colors.border,
                    marginBottom: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: item.textColor,
                        fontSize: 17,
                        fontWeight: "800",
                      }}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        color: item.textColor,
                        marginTop: 6,
                        fontSize: 12,
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <Text
                      style={{
                        color: item.accent,
                        fontSize: 22,
                        fontWeight: "900",
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
