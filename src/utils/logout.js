// src/utils/logout.js

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Manual Logout Function
 */
export const logout = async (navigation) => {
  try {
    await AsyncStorage.multiRemove([
      "userData",
      "user",
      "pass",
      "uid",
      "profileData",
      "profileImage",
      "sessionCookie",
      "lastLoginDate"
    ]);
    navigation.replace("OdooAuthScreen");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

/**
 * Auto Logout Check
 */
export const setupAutoLogoutCheck = async (navigation) => {
  try {
    const lastLoginDate = await AsyncStorage.getItem("lastLoginDate");
    const currentDate = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

    if (lastLoginDate !== currentDate) {
      console.log("Auto-logout triggered due to midnight reset");
      await logout(navigation);
    }
  } catch (error) {
    console.error("Error checking auto-logout:", error);
  }
};

/**
 * Store Login Date
 */
export const storeLoginDate = async () => {
  const currentDate = new Date().toISOString().split("T")[0];
  await AsyncStorage.setItem("lastLoginDate", currentDate);
};
