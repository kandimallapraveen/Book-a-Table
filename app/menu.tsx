import { router } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuPage() {
  const { width } = useWindowDimensions();

  const menuWidth = (width - 48) / 2;
  const menuHeight = menuWidth * 1.35;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F7F8FA",
      }}
    >
      <View
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E8E8E8",
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
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              color: "#171717",
              lineHeight: 34,
            }}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#171717",
            marginLeft: 8,
          }}
        >
          Menu
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              width: menuWidth,
              height: menuHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#E8E8E8",
              elevation: 3,
            }}
          >
            <Image
              source={require("../assets/images/menu-page-1.png")}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              width: menuWidth,
              height: menuHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#E8E8E8",
              elevation: 3,
            }}
          >
            <Image
              source={require("../assets/images/menu-page-2.png")}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
