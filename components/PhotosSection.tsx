import { VideoView, useVideoPlayer } from "expo-video";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ambiencePhotos = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=90",
];

const foodPhotos = [
  "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=90",
];
const restaurantVideo = require("../assets/images/restaurant-video.mp4");

export default function PhotosSection() {
  const [selectedTab, setSelectedTab] = useState<"Ambience" | "Food">(
    "Ambience",
  );

  const [galleryVisible, setGalleryVisible] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const photos = selectedTab === "Ambience" ? ambiencePhotos : foodPhotos;

  const videoPlayer = useVideoPlayer(restaurantVideo, (player) => {
    player.loop = false;
    player.muted = true;
  });

  const openGallery = (index: number = 0) => {
    setSelectedImage(index);
    setGalleryVisible(true);
  };

  return (
    <View
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: "#171717",
          }}
        >
          Photos
        </Text>

        <TouchableOpacity onPress={() => openGallery(0)}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#FC8019",
            }}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          marginBottom: 14,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 18,
            marginRight: 10,
            borderRadius: 20,
            backgroundColor: selectedTab === "Ambience" ? "#FC8019" : "#F1F1F1",
          }}
          onPress={() => setSelectedTab("Ambience")}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: selectedTab === "Ambience" ? "#FFFFFF" : "#666666",
            }}
          >
            Ambience
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 18,
            marginRight: 10,
            borderRadius: 20,
            backgroundColor: selectedTab === "Food" ? "#FC8019" : "#F1F1F1",
          }}
          onPress={() => setSelectedTab("Food")}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: selectedTab === "Food" ? "#FFFFFF" : "#666666",
            }}
          >
            Food
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginHorizontal: 16,
          height: 300,
          borderRadius: 16,
          overflow: "hidden",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <TouchableOpacity
          style={{
            width: "57%",
            height: 196,
            paddingRight: 2,
            paddingBottom: 2,
          }}
          onPress={() => openGallery(0)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: photos[0] }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: "43%",
            height: 196,
            paddingLeft: 2,
            paddingBottom: 2,
          }}
          onPress={() => openGallery(1)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: photos[1] }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View
          style={{
            width: "100%",
            height: 104,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              width: "33.33%",
              height: "100%",
              paddingHorizontal: 2,
            }}
            onPress={() => openGallery(2)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: photos[2] }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "33.33%",
              height: "100%",
              paddingHorizontal: 2,
            }}
            onPress={() => openGallery(3)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: photos[3] }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "33.33%",
              height: "100%",
              paddingHorizontal: 2,
            }}
            onPress={() => openGallery(photos.length)}
            activeOpacity={0.9}
          >
            <VideoView
              player={videoPlayer}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
              }}
              contentFit="cover"
              nativeControls={false}
            />

            <View
              style={{
                position: "absolute",
                top: 2,
                left: 2,
                right: 2,
                bottom: 2,
                borderRadius: 10,
                backgroundColor: "rgba(0,0,0,0.35)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: "rgba(0,0,0,0.65)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 22,
                    fontWeight: "800",
                    marginLeft: 3,
                  }}
                >
                  ▶
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={galleryVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setGalleryVisible(false)}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#000000",
          }}
        >
          <View
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => setGalleryVisible(false)}
              style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 24,
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Photos
            </Text>

            <View
              style={{
                width: 40,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginRight: 10,
                borderRadius: 20,
                backgroundColor:
                  selectedTab === "Ambience" ? "#FC8019" : "#222222",
              }}
              onPress={() => {
                setSelectedTab("Ambience");
                setSelectedImage(0);
              }}
            >
              <Text
                style={{
                  color: selectedTab === "Ambience" ? "#FFFFFF" : "#BBBBBB",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Ambience
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginRight: 10,
                borderRadius: 20,
                backgroundColor: selectedTab === "Food" ? "#FC8019" : "#222222",
              }}
              onPress={() => {
                setSelectedTab("Food");
                setSelectedImage(0);
              }}
            >
              <Text
                style={{
                  color: selectedTab === "Food" ? "#FFFFFF" : "#BBBBBB",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Food
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{
              x: selectedImage * SCREEN_WIDTH,
              y: 0,
            }}
          >
            {photos.map((photo, index) => (
              <View
                key={`${selectedTab}-${index}`}
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_HEIGHT - 110,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: photo }}
                  style={{
                    width: SCREEN_WIDTH,
                    height: "75%",
                  }}
                  resizeMode="contain"
                />

                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    marginTop: 15,
                    fontWeight: "600",
                  }}
                >
                  {index + 1} / {photos.length + 1}
                </Text>
              </View>
            ))}

            <View
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT - 110,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <VideoView
                player={videoPlayer}
                style={{
                  width: SCREEN_WIDTH,
                  height: "75%",
                }}
                contentFit="contain"
                nativeControls
              />

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  marginTop: 15,
                  fontWeight: "600",
                }}
              >
                {photos.length + 1} / {photos.length + 1}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
