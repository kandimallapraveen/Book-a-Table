import { useState } from "react";
import { useAppTheme } from "../contexts/ThemeContext";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const biryaniImages = [
  require("../assets/images/menu-page-1.png"),
  require("../assets/images/menu-page-5.jpg"),
  require("../assets/images/menu-page-2.png"),
];

const tiffinImages = [
  require("../assets/images/menu-page-3.jpg"),
  require("../assets/images/menu-page-4.jpg"),
  require("../assets/images/menu-page-6.jpg"),
];

const MenuSection = () => {
  const { colors } = useAppTheme();
  const { width, height } = useWindowDimensions();

  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [biryaniIndex, setBiryaniIndex] = useState(0);
  const [tiffinIndex, setTiffinIndex] = useState(0);

  const cardWidth = (width - 44) / 2;
  const cardHeight = cardWidth * 1.15;
  const renderMenuCard = (
    images: any[],
    currentIndex: number,
    setCurrentIndex: (index: number) => void,
  ) => {
    return (
      <View
        style={{
          width: cardWidth,
        }}
      >
        <View
          style={{
            width: cardWidth,
            height: cardHeight,

            backgroundColor: colors.card,

            borderRadius: 18,

            overflow: "hidden",

            borderWidth: 1,
            borderColor: colors.border,

            elevation: 5,

            shadowColor: "#000",
            shadowOpacity: 0.14,
            shadowRadius: 6,
            shadowOffset: {
              width: 0,
              height: 3,
            },
          }}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / cardWidth,
              );

              setCurrentIndex(index);
            }}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.95}
                onPress={() => {
                  setSelectedImages(images);
                  setSelectedIndex(index);
                }}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                }}
              >
                <Image
                  source={image}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View
            style={{
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,

              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {images.map((_, index) => (
              <View
                key={index}
                style={{
                  width: currentIndex === index ? 9 : 7,
                  height: currentIndex === index ? 9 : 7,

                  borderRadius: 10,

                  backgroundColor:
                    currentIndex === index ? colors.primary : colors.border,

                  marginHorizontal: 3,

                  borderWidth: 1,
                  borderColor: colors.card,
                }}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        marginTop: 22,
        marginBottom: 28,
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 18,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "800",
            color: colors.text,
          }}
        >
          Menu
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: colors.secondaryText,
            marginTop: 4,
          }}
        >
          Explore our delicious menu
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          justifyContent: "space-between",
        }}
      >
        {renderMenuCard(biryaniImages, biryaniIndex, setBiryaniIndex)}

        {renderMenuCard(tiffinImages, tiffinIndex, setTiffinIndex)}
      </View>

      <Modal
        visible={selectedImages.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSelectedImages([]);
          setSelectedIndex(0);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.95)",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setSelectedImages([]);
              setSelectedIndex(0);
            }}
            activeOpacity={0.8}
            style={{
              position: "absolute",
              top: 45,
              right: 20,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "rgba(255,255,255,0.9)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                color: "#171717",
                fontWeight: "600",
              }}
            >
              ×
            </Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{
              x: selectedIndex * width,
              y: 0,
            }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );

              setSelectedIndex(index);
            }}
          >
            {selectedImages.map((image, index) => (
              <View
                key={index}
                style={{
                  width: width,
                  height: height,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={image}
                  style={{
                    width: width * 0.95,
                    height: height * 0.85,
                  }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              position: "absolute",
              bottom: 35,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedImages.map((_, index) => (
              <View
                key={index}
                style={{
                  width: selectedIndex === index ? 10 : 8,
                  height: selectedIndex === index ? 10 : 8,
                  borderRadius: 10,
                  backgroundColor:
                    selectedIndex === index ? colors.primary : colors.border,
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MenuSection;
