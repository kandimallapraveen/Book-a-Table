import { Image, Text, TouchableOpacity, View } from "react-native";
type RestaurantCardProps = {
  id: string;
  name: string;
  image: string;
  rating?: string | number;
  cuisine?: string;
  location?: string;
  distance?: string;
  price?: string;
  onPress: () => void;
};

export default function RestaurantCard({
  name,
  image,
  rating,
  cuisine,
  location,
  distance,
  price,
  onPress,
}: RestaurantCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      }}
    >
      <Image
        source={{ uri: image }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: 180,
        }}
      />

      <View
        style={{
          padding: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: "800",
              color: "#222222",
              marginRight: 10,
            }}
          >
            {name}
          </Text>

          {rating !== undefined && (
            <View
              style={{
                backgroundColor: "#08752F",
                borderRadius: 7,
                paddingHorizontal: 8,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                ★ {rating}
              </Text>
            </View>
          )}
        </View>

        {cuisine && (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 13,
              color: "#666666",
              marginTop: 6,
            }}
          >
            {cuisine}
          </Text>
        )}

        {location && (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 13,
              color: "#777777",
              marginTop: 6,
            }}
          >
            📍 {location}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {distance ? (
            <Text
              style={{
                fontSize: 13,
                color: "#555555",
                fontWeight: "600",
              }}
            >
              📏 {distance}
            </Text>
          ) : (
            <View />
          )}

          {price && (
            <Text
              style={{
                fontSize: 13,
                color: "#555555",
                fontWeight: "600",
              }}
            >
              {price}
            </Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={{
            backgroundColor: "#08752F",
            borderRadius: 10,
            marginTop: 12,
            paddingVertical: 11,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: "800",
            }}
          >
            View Restaurant
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
