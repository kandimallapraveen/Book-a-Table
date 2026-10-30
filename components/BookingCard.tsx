import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../contexts/ThemeContext";

type BookingCardProps = {
  id: string;
  restaurantName: string;
  image?: string;
  date: string;
  time: string;
  guests: number;
  status?: string;
  location?: string;
  onPress?: () => void;
  onCancel?: () => void;
  onRemove?: () => void;
};

export default function BookingCard({
  restaurantName,
  image,
  date,
  time,
  guests,
  status = "Confirmed",
  location,
  onPress,
  onCancel,
  onRemove,
}: BookingCardProps) {
  const { colors } = useAppTheme();
  const isCancelled = status === "Cancelled";

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 20,
        marginHorizontal: 16,
        marginVertical: 7,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 11,
              backgroundColor: "#EEEEEE",
            }}
          />
        ) : (
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 11,
              backgroundColor: colors.iconBackground,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 28,
              }}
            >
              🍽️
            </Text>
          </View>
        )}

        <View
          style={{
            flex: 1,
            marginLeft: 11,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: colors.text,
            }}
          >
            {restaurantName}
          </Text>

          {location ? (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
                color: colors.secondaryText,
                marginTop: 3,
              }}
            >
              📍 {location}
            </Text>
          ) : null}

          <View
            style={{
              alignSelf: "flex-start",
              marginTop: 6,
              backgroundColor: isCancelled
                ? colors.border
                : colors.iconBackground,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 7,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "800",
                color: isCancelled ? colors.secondaryText : colors.primary,
              }}
            >
              {status}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 11,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 9,
              color: colors.secondaryText,
              marginBottom: 3,
              fontWeight: "700",
            }}
          >
            DATE
          </Text>

          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            📅{" "}
            {(() => {
              const [year, month, day] = date.split("-").map(Number);

              const bookingDate = new Date(year, month - 1, day);

              return bookingDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              });
            })()}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 9,
              color: colors.secondaryText,
              marginBottom: 3,
              fontWeight: "700",
            }}
          >
            TIME
          </Text>

          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            🕐 {time}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 9,
              color: colors.secondaryText,
              marginBottom: 3,
              fontWeight: "700",
            }}
          >
            GUESTS
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            👥 {guests}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 12,
          gap: 8,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={{
            flex: 1,
            height: 38,
            borderRadius: 9,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: "800",
            }}
          >
            View Booking
          </Text>
        </TouchableOpacity>

        {!isCancelled && onCancel ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onCancel}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 9,
              borderWidth: 1,
              borderColor: "#DD3333",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFF7F7",
            }}
          >
            <Text
              style={{
                color: "#DD3333",
                fontSize: 12,
                fontWeight: "800",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        ) : null}

        {isCancelled && onRemove ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onRemove}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 9,
              borderWidth: 1,
              borderColor: "#777777",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F5F5F5",
            }}
          >
            <Text
              style={{
                color: "#555555",
                fontSize: 12,
                fontWeight: "800",
              }}
            >
              Remove
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
