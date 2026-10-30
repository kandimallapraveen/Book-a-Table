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
import { useAppTheme } from "../contexts/ThemeContext";

export default function MenuPage() {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();

  const menuWidth = (width - 48) / 2;
  const menuHeight = menuWidth * 1.35;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
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
              color: colors.text,
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
            color: colors.text,
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
              backgroundColor: colors.card,
              borderRadius: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
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
              backgroundColor: colors.card,
              borderRadius: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
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
