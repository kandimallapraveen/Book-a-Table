import { Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  primary: "#FC8019",
  primaryLight: "#FFF4EC",
  white: "#FFFFFF",
  text: "#171717",
  secondaryText: "#777777",
  border: "#EEEEEE",
};

type Branch = {
  id: string;
  name: string;
  location: string;
};

type BranchSelectorProps = {
  branches: Branch[];
  onSelect: (branch: Branch) => void;
  onClose: () => void;
};

export default function BranchSelector({
  branches,
  onSelect,
  onClose,
}: BranchSelectorProps) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: "rgba(0,0,0,0.30)",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          paddingHorizontal: 18,
          paddingTop: 12,
          paddingBottom: 24,
          elevation: 15,
        }}
      >
        <View
          style={{
            width: 38,
            height: 4,
            borderRadius: 4,
            backgroundColor: "#D9D9D9",
            alignSelf: "center",
            marginBottom: 16,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: COLORS.text,
              }}
            >
              Select your branch
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: COLORS.secondaryText,
                marginTop: 3,
              }}
            >
              Choose your dining location
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 23,
                color: "#333333",
                lineHeight: 25,
              }}
            >
              ×
            </Text>
          </TouchableOpacity>
        </View>

        {branches.map((branch, index) => (
          <TouchableOpacity
            key={branch.id}
            activeOpacity={0.8}
            onPress={() => onSelect(branch)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 11,
              marginBottom: index === branches.length - 1 ? 0 : 9,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: COLORS.primaryLight,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 19 }}>📍</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.secondaryText,
                  fontWeight: "600",
                }}
              >
                {branch.name}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.text,
                  fontWeight: "800",
                  marginTop: 2,
                }}
              >
                {branch.location}
              </Text>
            </View>

            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: COLORS.primaryLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.primary,
                  fontWeight: "700",
                }}
              >
                ›
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
