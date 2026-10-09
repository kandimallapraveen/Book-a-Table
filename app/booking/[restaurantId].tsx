import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GuestSelector from "../../components/GuestSelector";
import { branches } from "../../constants/branches";
import { tables } from "../../constants/tables";

type Booking = {
  id: string;
  restaurantId: string;
  branchId?: string;
  restaurantName: string;
  location: string;
  date: string;
  time: string;
  guests: number;
  createdAt?: string;
  tableId?: string;
  tableName?: string;
  status: string;
};

type SelectedBranch = {
  id: string;
  name: string;
  location: string;
};

const COLORS = {
  primary: "#FC8019",
  primaryDark: "#E86F0A",
  primaryLight: "#FFF1E6",
  background: "#F7F8FA",
  white: "#FFFFFF",
  text: "#171717",
  secondaryText: "#777777",
  border: "#EAEAEA",
  softOrange: "#FFF7F2",
  disabled: "#CCCCCC",
};

const getParamString = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatBookingDate = (dateString: string) => {
  if (!dateString) {
    return "Not selected";
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

const findAvailableTable = (slotBookings: Booking[]) => {
  const bookedTableIds = new Set(
    slotBookings
      .map((booking) => booking.tableId)
      .filter((id): id is string => Boolean(id)),
  );

  return tables.find((table) => !bookedTableIds.has(table.id)) ?? null;
};

const normalizeTimeSearch = (value: string) => {
  let search = value.trim().toLowerCase();

  search = search.replace(/\./g, ":");
  search = search.replace(/\s+/g, " ");

  const spaceTimeMatch = /^(\d{1,2})\s+(\d{2})(?:\s+(am|pm))?$/.exec(search);

  if (spaceTimeMatch) {
    const hour = spaceTimeMatch[1];
    const minute = spaceTimeMatch[2];
    const period = spaceTimeMatch[3] || "";

    search = `${hour}:${minute}${period ? ` ${period}` : ""}`;
  }

  const compactTimeMatch = /^(\d{1,2})(\d{2})(?:\s+(am|pm))?$/.exec(search);

  if (compactTimeMatch) {
    const hour = compactTimeMatch[1];
    const minute = compactTimeMatch[2];
    const period = compactTimeMatch[3] || "";

    search = `${hour}:${minute}${period ? ` ${period}` : ""}`;
  }

  return search;
};

export default function BookingScreen() {
  const params = useLocalSearchParams();

  const restaurantId = getParamString(params.restaurantId) || "default";

  const reorderParam = getParamString(params.reorder);
  const isReorder = reorderParam === "true";

  const branchIdParam = getParamString(params.branchId);
  const branchNameParam = getParamString(params.branchName);
  const branchLocationParam = getParamString(params.branchLocation);

  const [selectedDate, setSelectedDate] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [showDateResults, setShowDateResults] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [selectedTime, setSelectedTime] = useState("");
  const [timeSearch, setTimeSearch] = useState("");
  const [showTimeResults, setShowTimeResults] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerTime, setPickerTime] = useState(new Date());

  const [guests, setGuests] = useState(0);

  const [assignedTable, setAssignedTable] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [selectedBranch, setSelectedBranch] = useState<SelectedBranch | null>(
    null,
  );

  const [showBranches, setShowBranches] = useState(false);

  useEffect(() => {
    if (branchIdParam && branchNameParam && branchLocationParam) {
      setSelectedBranch({
        id: branchIdParam,
        name: branchNameParam,
        location: branchLocationParam,
      });

      setShowBranches(false);
    } else {
      setSelectedBranch(null);
    }
  }, [branchIdParam, branchNameParam, branchLocationParam]);

  const timeOptions = useMemo(() => {
    const times: string[] = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;

        const period = hour >= 12 ? "PM" : "AM";

        const formattedMinute = String(minute).padStart(2, "0");

        times.push(`${displayHour}:${formattedMinute} ${period}`);
      }
    }

    return times;
  }, []);

  const filteredTimes = useMemo(() => {
    const search = normalizeTimeSearch(timeSearch);

    if (!search) {
      return timeOptions.slice(0, 8);
    }

    return timeOptions.filter((time) => {
      const normalizedTime = normalizeTimeSearch(time);

      if (normalizedTime.includes(search)) {
        return true;
      }

      const hourOnlyMatch = /^([0-9]{1,2})$/.exec(search);

      if (hourOnlyMatch) {
        const hour = Number(hourOnlyMatch[1]);

        const timeHour = Number(normalizedTime.split(":")[0]);

        return timeHour === hour;
      }

      const timeMatch = /^([0-9]{1,2}):([0-9]{1,2})(?:\s+(am|pm))?$/.exec(
        search,
      );

      if (timeMatch) {
        const searchHour = Number(timeMatch[1]);
        const searchMinute = Number(timeMatch[2]);
        const searchPeriod = timeMatch[3];

        const timeParts = normalizedTime.split(" ");

        const clockPart = timeParts[0];
        const periodPart = timeParts[1];

        const [hourPart, minutePart] = clockPart.split(":");

        const actualHour = Number(hourPart);
        const actualMinute = Number(minutePart);

        const hourMatches = actualHour === searchHour;

        const minuteMatches = actualMinute === searchMinute;

        const periodMatches = !searchPeriod || periodPart === searchPeriod;

        return hourMatches && minuteMatches && periodMatches;
      }

      return false;
    });
  }, [timeSearch, timeOptions]);

  const dateOptions = useMemo(() => {
    const dates: {
      value: string;
      label: string;
    }[] = [];

    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      dates.push({
        value: getLocalDateString(date),
        label: date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        }),
      });
    }

    return dates;
  }, []);

  const filteredDates = useMemo(() => {
    const search = dateSearch.trim().toLowerCase();

    if (!search) {
      return dateOptions.slice(0, 10);
    }

    return dateOptions.filter((item) =>
      item.label.toLowerCase().includes(search),
    );
  }, [dateSearch, dateOptions]);

  useEffect(() => {
    const checkTableAvailability = async () => {
      if (!selectedDate || !selectedTime) {
        setAssignedTable(null);
        return;
      }

      try {
        const existingBookings = await AsyncStorage.getItem("bookings");

        let bookings: Booking[] = [];

        if (existingBookings) {
          try {
            const parsedBookings = JSON.parse(existingBookings);

            if (Array.isArray(parsedBookings)) {
              bookings = parsedBookings;
            }
          } catch (error) {
            console.log("Invalid bookings data:", error);

            bookings = [];
          }
        }

        const sameSlotBookings = bookings.filter(
          (booking) =>
            booking.restaurantId === restaurantId &&
            booking.date === selectedDate &&
            booking.time === selectedTime &&
            booking.status === "Confirmed" &&
            (!selectedBranch ||
              !booking.branchId ||
              booking.branchId === selectedBranch.id),
        );

        const availableTable = findAvailableTable(sameSlotBookings);

        if (availableTable) {
          setAssignedTable({
            id: availableTable.id,
            name: availableTable.name,
          });
        } else {
          setAssignedTable(null);
        }
      } catch (error) {
        console.log("Table checking error:", error);

        setAssignedTable(null);
      }
    };

    checkTableAvailability();
  }, [selectedDate, selectedTime, selectedBranch, guests, restaurantId]);

  const confirmBooking = async () => {
    if (!selectedBranch) {
      Alert.alert(
        "Select Branch",
        "Please select a branch before confirming your booking.",
      );

      return;
    }

    if (!selectedDate) {
      Alert.alert(
        "Select Date",
        "Please select a date before confirming your booking.",
      );

      return;
    }

    if (!selectedTime) {
      Alert.alert(
        "Select Time",
        "Please select a time before confirming your booking.",
      );

      return;
    }

    if (guests < 1) {
      Alert.alert(
        "Select Guests",
        "Please select the number of guests before confirming your booking.",
      );

      return;
    }

    try {
      const existingBookings = await AsyncStorage.getItem("bookings");

      let bookings: Booking[] = [];

      if (existingBookings) {
        try {
          const parsedBookings = JSON.parse(existingBookings);

          if (Array.isArray(parsedBookings)) {
            bookings = parsedBookings;
          }
        } catch (error) {
          console.log("Invalid bookings data:", error);

          bookings = [];
        }
      }

      const sameSlotBookings = bookings.filter(
        (booking) =>
          booking.restaurantId === restaurantId &&
          booking.date === selectedDate &&
          booking.time === selectedTime &&
          booking.status === "Confirmed" &&
          (!selectedBranch ||
            !booking.branchId ||
            booking.branchId === selectedBranch.id),
      );

      const selectedTable = findAvailableTable(sameSlotBookings);

      if (!selectedTable) {
        Alert.alert(
          "Tables Not Available",
          "All tables are currently booked for this date and time. Please choose another time.",
        );

        setAssignedTable(null);

        return;
      }

      setAssignedTable({
        id: selectedTable.id,
        name: selectedTable.name,
      });

      const newBooking: Booking = {
        id: Date.now().toString(),
        restaurantId,
        branchId: selectedBranch.id,
        restaurantName: selectedBranch.name,
        location: selectedBranch.location,
        date: selectedDate,
        time: selectedTime,
        guests,
        createdAt: new Date().toISOString(),
        tableId: selectedTable.id,
        tableName: selectedTable.name,
        status: "Confirmed",
      };

      const updatedBookings = [...bookings, newBooking];

      await AsyncStorage.setItem("bookings", JSON.stringify(updatedBookings));

      const savedReorderHistory = await AsyncStorage.getItem("reorderHistory");

      let reorderHistory: Booking[] = [];

      if (savedReorderHistory) {
        try {
          const parsedHistory = JSON.parse(savedReorderHistory);

          if (Array.isArray(parsedHistory)) {
            reorderHistory = parsedHistory;
          }
        } catch (error) {
          console.log("Invalid reorder history:", error);

          reorderHistory = [];
        }
      }

      const updatedReorderHistory = [...reorderHistory, newBooking];

      await AsyncStorage.setItem(
        "reorderHistory",
        JSON.stringify(updatedReorderHistory),
      );

      router.push({
        pathname: "/booking/confirmation",
        params: {
          bookingId: newBooking.id,
          date: newBooking.date,
          time: newBooking.time,
          guests: newBooking.guests.toString(),
          tableId: newBooking.tableId || "",
          tableName: newBooking.tableName || "",
          restaurantName: newBooking.restaurantName,
          location: newBooking.location,
          branchId: newBooking.branchId || "",
          branchName: newBooking.restaurantName,
          branchLocation: newBooking.location,
        },
      } as any);
    } catch (error) {
      console.log("Booking error:", error);

      Alert.alert("Error", "Unable to save your booking. Please try again.");
    }
  };

  const selectBranch = (branch: SelectedBranch) => {
    setSelectedBranch(branch);
    setShowBranches(false);
  };

  const formatPickerTime = (date: Date) => {
    const hour = date.getHours();

    const minute = String(date.getMinutes()).padStart(2, "0");

    const displayHour = hour % 12 || 12;

    const period = hour >= 12 ? "PM" : "AM";

    return `${displayHour}:${minute} ${period}`;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 48,
            backgroundColor: COLORS.primary,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 14,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              router.back();
            }}
            style={{
              width: 38,
              height: 38,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: 28,
              }}
            >
              ←
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: COLORS.white,
              fontSize: 20,
              fontWeight: "800",
            }}
          >
            {isReorder ? "Reorder Table" : "Book a Table"}
          </Text>

          <View style={{ width: 38 }} />
        </View>

        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              marginTop: 5,
              paddingHorizontal: 12,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: COLORS.text,
                marginBottom: 3,
              }}
            >
              1. Select Date
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  maxWidth: "82%",
                  height: 40,
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: dateSearch ? COLORS.primary : COLORS.border,
                  borderRadius: 11,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    marginRight: 4,
                  }}
                >
                  🔍
                </Text>

                <TextInput
                  placeholder={
                    selectedDate
                      ? formatBookingDate(selectedDate)
                      : "Search date..."
                  }
                  placeholderTextColor="#999999"
                  value={dateSearch}
                  onChangeText={(text) => {
                    setDateSearch(text);
                    setShowDateResults(true);
                    setShowCalendar(false);
                  }}
                  style={{
                    flex: 1,
                    height: 38,
                    fontSize: 13,
                    color: COLORS.text,
                  }}
                />

                {dateSearch.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setDateSearch("");
                      setShowDateResults(false);
                    }}
                    style={{
                      paddingHorizontal: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#999999",
                      }}
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setDateSearch("");
                    setShowDateResults(!showDateResults);
                    setShowCalendar(false);
                  }}
                  style={{
                    width: 30,
                    height: 38,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#555555",
                      fontWeight: "600",
                    }}
                  >
                    {showDateResults ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setShowCalendar(!showCalendar);
                  setShowDateResults(false);
                }}
                style={{
                  width: 38,
                  height: 40,
                  marginLeft: 5,
                  borderRadius: 11,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: 17 }}>📅</Text>
              </TouchableOpacity>
            </View>

            {showDateResults && (
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  elevation: 3,
                  maxHeight: 180,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.secondaryText,
                    fontWeight: "700",
                    marginBottom: 2,
                    paddingHorizontal: 4,
                  }}
                >
                  AVAILABLE DATES
                </Text>

                {filteredDates.length > 0 ? (
                  filteredDates.slice(0, 5).map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      activeOpacity={0.75}
                      onPress={() => {
                        setSelectedDate(item.value);
                        setDateSearch(item.label);
                        setShowDateResults(false);
                        setShowCalendar(false);
                      }}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 8,
                        borderRadius: 7,
                        backgroundColor:
                          selectedDate === item.value
                            ? COLORS.primaryLight
                            : COLORS.white,
                        marginBottom: 2,
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
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color:
                              selectedDate === item.value
                                ? COLORS.primary
                                : COLORS.text,
                          }}
                        >
                          📅 {item.label}
                        </Text>

                        {selectedDate === item.value && (
                          <Text
                            style={{
                              color: COLORS.primary,
                              fontWeight: "800",
                            }}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      padding: 8,
                      color: COLORS.secondaryText,
                    }}
                  >
                    No matching dates found
                  </Text>
                )}
              </View>
            )}

            {showCalendar && (
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      const today = new Date();

                      const isCurrentMonth =
                        currentMonth.getFullYear() === today.getFullYear() &&
                        currentMonth.getMonth() === today.getMonth();

                      if (!isCurrentMonth) {
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1,
                          ),
                        );
                      }
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: COLORS.primaryLight,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: COLORS.primary,
                      }}
                    >
                      ‹
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: COLORS.text,
                    }}
                  >
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                          1,
                        ),
                      );
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: COLORS.primaryLight,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: COLORS.primary,
                      }}
                    >
                      ›
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 2,
                  }}
                >
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <View
                      key={index}
                      style={{
                        width: "14.2857%",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "800",
                          color: COLORS.secondaryText,
                        }}
                      >
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {Array.from(
                    {
                      length:
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          1,
                        ).getDay() +
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                          0,
                        ).getDate(),
                    },
                    (_, index) => {
                      const firstDay = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        1,
                      ).getDay();

                      if (index < firstDay) {
                        return (
                          <View
                            key={`empty-${index}`}
                            style={{
                              width: "14.2857%",
                              height: 30,
                            }}
                          />
                        );
                      }

                      const day = index - firstDay + 1;

                      const date = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day,
                      );

                      const dateValue = getLocalDateString(date);

                      const todayValue = getLocalDateString(new Date());

                      const isPast = dateValue < todayValue;

                      const isSelected = selectedDate === dateValue;

                      return (
                        <TouchableOpacity
                          key={day}
                          activeOpacity={0.7}
                          disabled={isPast}
                          onPress={() => {
                            setSelectedDate(dateValue);

                            setDateSearch(formatBookingDate(dateValue));

                            setShowCalendar(false);
                          }}
                          style={{
                            width: "14.2857%",
                            height: 30,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              width: 25,
                              height: 25,
                              borderRadius: 13,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: isSelected
                                ? COLORS.primary
                                : "transparent",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: isSelected ? "800" : "600",
                                color: isPast
                                  ? COLORS.disabled
                                  : isSelected
                                    ? COLORS.white
                                    : "#333333",
                              }}
                            >
                              {day}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>
              </View>
            )}

            {selectedDate && (
              <View
                style={{
                  marginTop: 2,
                  paddingHorizontal: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    color: COLORS.secondaryText,
                  }}
                >
                  Selected date
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: COLORS.primary,
                  }}
                >
                  📅 {formatBookingDate(selectedDate)}
                </Text>
              </View>
            )}
          </View>

          {/* TIME */}
          <View
            style={{
              marginTop: 5,
              paddingHorizontal: 12,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: COLORS.text,
                marginBottom: 3,
              }}
            >
              2. Select Time
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  maxWidth: "82%",
                  height: 40,
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: timeSearch ? COLORS.primary : COLORS.border,
                  borderRadius: 11,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    marginRight: 4,
                  }}
                >
                  🔍
                </Text>

                <TextInput
                  placeholder={selectedTime || "Search time..."}
                  placeholderTextColor="#999999"
                  value={timeSearch}
                  onChangeText={(text) => {
                    setTimeSearch(text);
                    setShowTimeResults(true);
                  }}
                  style={{
                    flex: 1,
                    height: 38,
                    fontSize: 13,
                    color: COLORS.text,
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setTimeSearch("");
                    setShowTimeResults(!showTimeResults);
                    setShowTimePicker(false);
                  }}
                  style={{
                    width: 30,
                    height: 38,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#555555",
                      fontWeight: "600",
                    }}
                  >
                    {showTimeResults ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setShowTimePicker(true);
                  setShowTimeResults(false);
                }}
                style={{
                  width: 38,
                  height: 40,
                  marginLeft: 5,
                  borderRadius: 11,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: 17 }}>🕒</Text>
              </TouchableOpacity>
            </View>

            {showTimeResults && (
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "800",
                    color: COLORS.secondaryText,
                    marginBottom: 4,
                    paddingHorizontal: 3,
                  }}
                >
                  AVAILABLE TIMES
                </Text>

                {filteredTimes.length > 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    {filteredTimes.slice(0, 8).map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <TouchableOpacity
                          key={time}
                          activeOpacity={0.8}
                          onPress={() => {
                            setSelectedTime(time);

                            setTimeSearch(time);

                            setShowTimeResults(false);
                          }}
                          style={{
                            width: "31%",
                            height: 34,
                            borderRadius: 7,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 5,
                            backgroundColor: isSelected
                              ? COLORS.primary
                              : COLORS.softOrange,
                            borderWidth: 1,
                            borderColor: isSelected
                              ? COLORS.primary
                              : "#FFE0CC",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "700",
                              color: isSelected ? COLORS.white : COLORS.text,
                            }}
                          >
                            {time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      color: COLORS.secondaryText,
                      paddingVertical: 8,
                    }}
                  >
                    No matching time found
                  </Text>
                )}
              </View>
            )}

            {showTimePicker && (
              <DateTimePicker
                value={pickerTime}
                mode="time"
                is24Hour={false}
                display="clock"
                onChange={(_event, selectedPickerDate) => {
                  setShowTimePicker(false);

                  if (selectedPickerDate) {
                    setPickerTime(selectedPickerDate);

                    const formattedTime = formatPickerTime(selectedPickerDate);

                    setSelectedTime(formattedTime);

                    setTimeSearch(formattedTime);
                  }
                }}
              />
            )}

            {selectedTime && (
              <View
                style={{
                  marginTop: 2,
                  paddingHorizontal: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    color: COLORS.secondaryText,
                  }}
                >
                  Selected time
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: COLORS.primary,
                  }}
                >
                  🕒 {selectedTime}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              marginTop: 3,
              paddingHorizontal: 12,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: COLORS.text,
                marginBottom: 2,
              }}
            >
              3. Number of Guests
            </Text>

            <GuestSelector
              guests={guests}
              onChange={setGuests}
              minGuests={1}
              maxGuests={20}
            />
          </View>

          <View
            style={{
              marginHorizontal: 8,
              marginTop: 5,
              marginBottom: 6,
              backgroundColor: COLORS.white,
              borderRadius: 12,
              padding: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 17,
                  borderRadius: 3,
                  backgroundColor: COLORS.primary,
                  marginRight: 6,
                }}
              />

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: COLORS.text,
                }}
              >
                Branch
              </Text>
            </View>

            {selectedBranch ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedBranch(null);
                  setShowBranches(true);
                }}
                style={{
                  backgroundColor: COLORS.primaryLight,
                  borderRadius: 9,
                  padding: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "800",
                        color: COLORS.primary,
                      }}
                    >
                      {selectedBranch.name}
                    </Text>

                    <Text
                      style={{
                        fontSize: 11,
                        color: COLORS.secondaryText,
                        marginTop: 1,
                      }}
                    >
                      📍 {selectedBranch.location}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.primary,
                    }}
                  >
                    ▼
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowBranches(!showBranches)}
                  style={{
                    backgroundColor: COLORS.softOrange,
                    borderWidth: 1,
                    borderColor: "#FFE0CC",
                    borderRadius: 9,
                    paddingHorizontal: 10,
                    height: 40,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.secondaryText,
                      fontWeight: "600",
                    }}
                  >
                    Please select a branch
                  </Text>

                  <Text
                    style={{
                      fontSize: 17,
                      color: COLORS.primary,
                      fontWeight: "700",
                    }}
                  >
                    {showBranches ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {showBranches && (
                  <View
                    style={{
                      marginTop: 5,
                    }}
                  >
                    {branches.map((branch) => (
                      <TouchableOpacity
                        key={branch.id}
                        activeOpacity={0.8}
                        onPress={() => selectBranch(branch)}
                        style={{
                          backgroundColor: COLORS.white,
                          borderWidth: 1,
                          borderColor: COLORS.border,
                          borderRadius: 9,
                          padding: 8,
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "800",
                            color: COLORS.text,
                          }}
                        >
                          {branch.name}
                        </Text>

                        <Text
                          style={{
                            fontSize: 10,
                            color: COLORS.secondaryText,
                            marginTop: 1,
                          }}
                        >
                          📍 {branch.location}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          <View
            style={{
              marginHorizontal: 8,
              marginTop: 3,
              backgroundColor: COLORS.white,
              borderRadius: 12,
              padding: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 17,
                  borderRadius: 3,
                  backgroundColor: COLORS.primary,
                  marginRight: 6,
                }}
              />

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: COLORS.text,
                }}
              >
                Booking Summary
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 4,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  color: COLORS.secondaryText,
                  fontSize: 11,
                }}
              >
                Branch
              </Text>

              <Text
                style={{
                  color: selectedBranch ? COLORS.text : "#AAAAAA",
                  fontSize: 11,
                  fontWeight: "700",
                  maxWidth: "65%",
                  textAlign: "right",
                }}
              >
                {selectedBranch
                  ? `${selectedBranch.name} - ${selectedBranch.location}`
                  : "Select Branch"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 4,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  color: COLORS.secondaryText,
                  fontSize: 11,
                }}
              >
                Date
              </Text>

              <Text
                style={{
                  color: selectedDate ? COLORS.text : "#AAAAAA",
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {formatBookingDate(selectedDate)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 4,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  color: COLORS.secondaryText,
                  fontSize: 11,
                }}
              >
                Time
              </Text>

              <Text
                style={{
                  color: selectedTime ? COLORS.text : "#AAAAAA",
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {selectedTime || "Not selected"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 4,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  color: COLORS.secondaryText,
                  fontSize: 11,
                }}
              >
                Guests
              </Text>

              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {guests === 0
                  ? "Not selected"
                  : `${guests} ${guests === 1 ? "Guest" : "Guests"}`}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: COLORS.secondaryText,
                  fontSize: 11,
                }}
              >
                Table
              </Text>

              <Text
                style={{
                  color: assignedTable ? COLORS.primary : "#AAAAAA",
                  fontSize: 12,
                  fontWeight: "800",
                }}
              >
                {assignedTable
                  ? assignedTable.name
                  : selectedDate && selectedTime
                    ? "Tables Not Available"
                    : "Select date & time"}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 8,
              paddingTop: 4,
              paddingBottom: 6,
            }}
          >
            <TouchableOpacity
              onPress={confirmBooking}
              activeOpacity={0.8}
              style={{
                marginHorizontal: 10,
                marginTop: 4,
                backgroundColor: COLORS.primary,
                borderRadius: 14,
                height: 46,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 15,
                  fontWeight: "800",
                }}
              >
                {isReorder ? "Confirm Reorder" : "Confirm Booking"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
