//src/sreens/Profile/WorkInformation.js

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProfile } from "../../utils/fetchProfile";


const WorkInformation = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
          try {
            setLoading(true);
    
            // Check if profile data exists in AsyncStorage
            const storedProfile = await AsyncStorage.getItem("profileData");
            if (storedProfile) {
              const parsedProfile = JSON.parse(storedProfile);
              console.log("Profile Data from AsyncStorage:", parsedProfile);
              setProfile(parsedProfile);
            } else {
              // If not found, fetch from Odoo and store it
              const data = await fetchProfile();
              console.log("Fetched Profile Data:", data);
              setProfile(data);
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          } finally {
            setLoading(false);
          }
        }
    
        loadProfile();
      }, []);
    
      if (loading) return <ActivityIndicator size="large" color="blue" />;
    
      if (!profile) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "red" }}>Profile not found</Text>
          </View>
        );
      }


      const renderProfileItem = (title, value) => (
          <View style={styles.profileItem}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value || "N/A"}</Text>
          </View>
        );
      
    
    
  return (
    <View>
        <Text style={styles.sectionTitle}>Work Information</Text>
        {renderProfileItem("Work Address", profile.address_id)}
        {renderProfileItem("Work Location", profile.work_location_id)}
        {renderProfileItem("Attendance", profile.attendance_manager_id)}
        {renderProfileItem("Work Hours", profile.resource_calendar_id)}
      </View>
  )
}

export default WorkInformation;

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    profileItem: { marginBottom: 10 },
    title: { fontWeight: "bold" },
    value: { color: "gray" },
    centeredContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { color: "red" },
});