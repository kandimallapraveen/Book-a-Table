import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../contexts/ThemeContext";

type GuestSelectorProps = {
  guests: number;
  onChange: (guests: number) => void;
  minGuests?: number;
  maxGuests?: number;
};

export default function GuestSelector({
  guests,
  onChange,
  minGuests = 1,
  maxGuests = 20,
}: GuestSelectorProps) {
  const { colors } = useAppTheme();
  const decreaseGuests = () => {
    if (guests > minGuests) {
      onChange(guests - 1);
    }
  };

  const increaseGuests = () => {
    if (guests < maxGuests) {
      onChange(guests + 1);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        padding: 14,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "800",
          color: colors.text,
          marginBottom: 12,
        }}
      >
        Number of Guests
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={decreaseGuests}
          disabled={guests <= minGuests}
          style={{
            width: 32,
            height: 32,
            borderRadius: 18,
            backgroundColor: guests <= minGuests ? colors.border : colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: guests <= minGuests ? colors.secondaryText : "#FFFFFF",
            }}
          >
            −
          </Text>
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.text,
            }}
          >
            {guests}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: colors.secondaryText,
              marginTop: 2,
            }}
          >
            {guests === 1 ? "Guest" : "Guests"}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={increaseGuests}
          disabled={guests >= maxGuests}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: guests >= maxGuests ? colors.border : colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: guests >= maxGuests ? colors.secondaryText : "#FFFFFF",
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 11,
          color: colors.secondaryText,
          textAlign: "center",
          marginTop: 10,
        }}
      >
        Maximum {maxGuests} guests
      </Text>
    </View>
  );
}
