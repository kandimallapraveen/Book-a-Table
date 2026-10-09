import { Text, TouchableOpacity, View } from "react-native";

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
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 4,
        marginVertical: 10,
        elevation: 3,
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
          color: "#222222",
          marginBottom: -10,
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
            backgroundColor: guests <= minGuests ? "#E5E5E5" : "#08752F",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: guests <= minGuests ? "#999999" : "#FFFFFF",
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
              color: "#222222",
            }}
          >
            {guests}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "#777777",
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
            backgroundColor: guests >= maxGuests ? "#E5E5E5" : "#08752F",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: guests >= maxGuests ? "#999999" : "#FFFFFF",
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 11,
          color: "#888888",
          textAlign: "center",
          marginTop: 10,
        }}
      >
        Maximum {maxGuests} guests
      </Text>
    </View>
  );
}
