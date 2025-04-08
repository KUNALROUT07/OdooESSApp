//src/screens/tabs/Profile.js 

import React, { useEffect, useState } from "react";
import { 
  View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Image 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProfile } from "../../utils/fetchProfile";
import { logout } from "../../utils/logout";
import ProfileWelcomeView from "../../components/Profile/ProfileWelcomeView";

const Profile = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutPressed, setLogoutPressed] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const storedProfile = await AsyncStorage.getItem("profileData");
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          const data = await fetchProfile();
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
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
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
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileCard}>
        <ProfileWelcomeView />
      </View>
      
      <View style={styles.profileDetailsCard}>
        <ScrollView>
          {renderProfileItem("Name", profile.display_name)}
          {renderProfileItem("Job Title", profile.job_title)}
          {renderProfileItem("Work Phone", profile.work_phone)}
          {renderProfileItem("Work Email", profile.work_email)}
          {renderProfileItem("Department", profile.department_id[1])}
          {renderProfileItem("Job Position", profile.job_id[1])}
          {renderProfileItem("Manager", profile.parent_id)}
          {renderProfileItem("Coach", profile.coach_id)}
        </ScrollView>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.infoButtonsCard}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("WorkInformationScreen")}
        >
          <Text style={styles.buttonText}>Go to Work Information</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PrivateInformationScreen")}
        >
          <Text style={styles.buttonText}>Go to Private Information</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          setLogoutPressed(true);
          logout(navigation);
        }}
      >
        <Image
          source={
            logoutPressed
              ? require("../../images/logout_fill.png")
              : require("../../images/logout.png")
          }
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, width: "100%" },
  scrollContainer: { paddingVertical: 20, paddingBottom: "30%" },
  centeredContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCard: { width: "100%", height: 150, backgroundColor: "#fff", borderRadius: 20, margin: 5, marginTop: 10 },
  profileDetailsCard: { width: "99%", height: 290, backgroundColor: "#fff", borderRadius: 20, margin: 5 },
  infoButtonsCard: { width: "99%", backgroundColor: "#fff", borderRadius: 20, margin: 5, marginTop: 10, padding: 20 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { fontSize: 18, color: "red" },
  profileItem: { borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10, paddingHorizontal: 10 },
  title: { fontSize: 16, fontWeight: "bold", color: "#333" },
  value: { fontSize: 16, color: "#555", marginTop: 5 },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30, paddingVertical: 10, backgroundColor: "#ff4d4d", borderRadius: 8 },
  logoutIcon: { width: 24, height: 24, marginRight: 10 },
  logoutText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default Profile;
