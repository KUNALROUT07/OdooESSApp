// Updated Attendance.js with From/To as buttons for date selection

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, SectionList } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import jsonRpcCall, { DB } from "../../rpc/jsonRpc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchEmployeeId } from "../../utils/fetchProfile";

const Attendance = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [filter, setFilter] = useState("All Days");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async (startDate, endDate) => {
    try {
      let employeeId = await AsyncStorage.getItem("userId") || await fetchEmployeeId();
      if (!employeeId) throw new Error("Employee ID not found");

      const userData = await AsyncStorage.getItem("userData");
      if (!userData) throw new Error("User not logged in");

      const { uid, pass } = JSON.parse(userData);
      let domain = [["employee_id", "=", parseInt(employeeId)]];

      if (startDate && endDate) {
        domain.push(["check_in", ">=", startDate.toISOString()]);
        domain.push(["check_in", "<=", endDate.toISOString()]);
      }

      const result = await jsonRpcCall("call", {
        service: "object",
        method: "execute_kw",
        args: [DB, uid, pass, "hr.attendance", "search_read", [domain], {}],
      });

      if (result && Array.isArray(result)) {
        const groupedData = groupAttendanceByDate(result);
        setAttendanceHistory(groupedData);
      } else {
        Alert.alert("No attendance history found");
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      Alert.alert("Failed to fetch attendance history");
    }
  };

  const groupAttendanceByDate = (data) => {
    const grouped = data.reduce((acc, item) => {
      const date = item.check_in?.split(" ")[0];
      if (date) {
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
      }
      return acc;
    }, {});

    return Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date],
    }));
  };

  const handleDateChange = (event, selectedDate, setDate, setShowPicker) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance View</Text>

      <Picker
        selectedValue={filter}
        onValueChange={(itemValue) => {
          setFilter(itemValue);
          switch (itemValue) {
            case "All Days":
              fetchAttendanceHistory();
              break;
            case "Today":
              fetchAttendanceHistory(new Date(), new Date());
              break;
            case "Last 7 Days":
              fetchAttendanceHistory(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());
              break;
            case "Last 30 Days":
              fetchAttendanceHistory(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
              break;
            case "Choose Custom Days":
              break;
          }
        }}
        style={styles.picker}
      >
        <Picker.Item label="All Days" value="All Days" />
        <Picker.Item label="Today" value="Today" />
        <Picker.Item label="Last 7 Days" value="Last 7 Days" />
        <Picker.Item label="Last 30 Days" value="Last 30 Days" />
        <Picker.Item label="Choose Custom Days" value="Choose Custom Days" />
      </Picker>

      {filter === "Choose Custom Days" && (
        <View style={styles.dateRangeContainer}>
          {/* From Date Button */}
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowFromPicker(true)}>
            <Text style={styles.buttonText}>From: {fromDate.toDateString()}</Text>
          </TouchableOpacity>

          {/* Show From Date Picker */}
          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(event, date) => handleDateChange(event, date, setFromDate, setShowFromPicker)}
            />
          )}

          {/* To Date Button */}
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowToPicker(true)}>
            <Text style={styles.buttonText}>To: {toDate.toDateString()}</Text>
          </TouchableOpacity>

          {/* Show To Date Picker */}
          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(event, date) => handleDateChange(event, date, setToDate, setShowToPicker)}
            />
          )}

          <TouchableOpacity style={styles.fetchButton} onPress={() => fetchAttendanceHistory(fromDate, toDate)}>
            <Text style={styles.buttonText}>Fetch Data</Text>
          </TouchableOpacity>
        </View>
      )}

      <SectionList
      style={{backgroundColor: "#f0f0f0"}}
        sections={attendanceHistory}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer,]}>
            <Text style={[styles.text, { color: "green" }]}>Check-in: {item.check_in.split(" ")[1] || "N/A"}</Text>
            <Text style={[styles.text, { color: "red" }]}>Check-out: {item.check_out?.toString().split(" ")[1] ||  "N/A"}</Text>
            <Text style={[styles.text, { color: "blue" }]}>Total Time: {item.worked_hours || "00:00:00"}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", width: "95%", marginBottom: "17%", },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  sectionHeader: { padding: 10, fontSize: 18, fontWeight: "bold", backgroundColor: "#f0f0f0", },
  dateButton: { padding: 10, backgroundColor: "#007bff", borderRadius: 5, marginBottom: 10 },
  itemContainer: { backgroundColor: "#fff",padding: 15, borderBottomWidth: 3,borderRadius: 15, borderBottomColor: "#ddd"},
  buttonText: { color: "#fff", textAlign: "center" },
});

export default Attendance;
