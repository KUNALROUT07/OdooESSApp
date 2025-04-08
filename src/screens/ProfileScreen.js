// src/screens/ProfileScreen.js

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProfile } from "../utils/fetchProfile";
import ProfilePicture from "../components/Profile/ProfilePicture";

const ProfileScreen = () => {
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ProfilePicture />
      <Text>Name: {profile.display_name}</Text>
      <Text>Job Title: {profile.job_title}</Text>
      <Text>Work Email: {profile.work_email}</Text>
      <Text>Work Phone: {profile.work_phone}</Text>
      <Text>Private Email: {profile.private_email}</Text>
      <Text>Private Phone: {profile.private_phone}</Text>
    </View>
  );
};

export default ProfileScreen;
