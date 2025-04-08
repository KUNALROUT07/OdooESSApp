// src/utils/fetchProfile.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import jsonRpcCall, { DB } from "../rpc/jsonRpc";

// Function to fetch only the employee ID
async function fetchEmployeeId() {
  try {
    const storedId = await AsyncStorage.getItem("userId");
    if (storedId) {
      return storedId; // If ID is already stored, return it
    }

    const userData = await AsyncStorage.getItem("userData");
    if (!userData) throw new Error("User not logged in");

    const { uid, pass } = JSON.parse(userData);
    const domain = [["user_id", "=", uid]];

    // Fetch only the "id" field from Odoo
    const result = await jsonRpcCall("call", {
      service: "object",
      method: "execute",
      args: [DB, uid, pass, "hr.employee", "search_read", domain, ["id"]],
    });

    if (result.length === 0 || !result[0].id) throw new Error("Employee ID not found");

    const employeeId = result[0].id;

    // Store employee ID in AsyncStorage
    await AsyncStorage.setItem("userId", employeeId.toString());

    return employeeId;
  } catch (error) {
    console.error("Fetch Employee ID Error:", error);
    throw error;
  }
}

// Function to fetch full profile data
async function fetchProfile() {
  try {
    // Check if profile data is already stored
    const storedProfile = await AsyncStorage.getItem("profileData");
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }

    const userData = await AsyncStorage.getItem("userData");
    if (!userData) throw new Error("User not logged in");

    const { uid, pass } = JSON.parse(userData);
    const domain = [["user_id", "=", uid]];

    console.log(uid, pass);

    // Fetch all profile data except "id"
    const result = await jsonRpcCall("call", {
      service: "object",
      method: "execute",
      args: [DB, uid, pass, "hr.employee", "search_read", domain, [
        "display_name", "job_title", "work_phone","work_email","department_id","job_id","parent_id",     // Profile Main
        "address_id","work_location_id","attendance_manager_id","resource_calendar_id",    // Work information
         "private_street", "private_email", "private_phone","bank_account_id","lang","km_home_work","private_car_plate",         // Private Infomation
      ]],
    });
    console.log(result);

    if (result.length === 0) throw new Error("Profile not found");

    const profile = result[0];

    // Check if "id" is already stored
    const storedId = await AsyncStorage.getItem("userId");
    if (!storedId) {
      // If "id" is not stored, fetch and store it first
      const employeeId = await fetchEmployeeId();
      profile.id = employeeId;
    }

    // Store the profile data (excluding "id" if already stored)
    await AsyncStorage.setItem("profileData", JSON.stringify(profile));

    return profile;
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    throw error;
  }
}

async function fetchAttendanceState(){
  try {
    const userData = await AsyncStorage.getItem("userData");
    if (!userData) throw new Error("User not logged in");

    const { uid, pass } = JSON.parse(userData);
    const domain = [["user_id", "=", uid]];

    // Fetch only the "id" field from Odoo
    const result = await jsonRpcCall("call", {
      service: "object",
      method: "execute",
      args: [DB, uid, pass, "hr.employee", "search_read", domain, ["attendance_state"]],
    });

    if (result.length === 0 || !result[0].id) throw new Error("Employee ID not found");

    const employeeAttendanceState = result[0].attendance_state;

    return employeeAttendanceState;
  } catch (error) {
    console.error("Fetch Employee ID Error:", error);
    throw error;
  }
}



export { fetchProfile, fetchEmployeeId, fetchAttendanceState };
