// src/components/Profile/ProfilePicture.js
import React, { useState, useEffect } from "react";
import { View, Image, Text, Button, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jsonRpcCall, { DB } from "../../rpc/jsonRpc";

const ProfilePicture = () => {
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null); // Temporarily hold the fetched image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRendered, setIsRendered] = useState(false); // Track successful rendering

  useEffect(() => {
    loadProfilePicture();
  }, []);

  async function loadProfilePicture() {
    try {
      setLoading(true);
      setError(null);

      // Fetch stored image first
      const storedImage = await AsyncStorage.getItem("profileImage");
      if (storedImage) {
        console.log("Profile Picture loaded from AsyncStorage.");
        setImage(storedImage);
      }

      // Fetch profile picture from Odoo server
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) throw new Error("User not logged in");

      const { uid, pass } = JSON.parse(userData);
      const domain = [["user_id", "=", uid]];

      const result = await jsonRpcCall("call", {
        service: "object",
        method: "execute",
        args: [DB, uid, pass, "hr.employee", "search_read", domain, ["image_128"]],
      });

      if (result.length > 0 && result[0].image_128) {
        const fetchedImage = `data:image/png;base64,${result[0].image_128}`;

        // Temporarily store the new image but do not set it as permanent yet
        setTempImage(fetchedImage);
      } else {
        throw new Error("No profile picture available");
      }
    } catch (err) {
      console.error("Error fetching profile picture:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleImageLoadSuccess = async () => {
    if (tempImage) {
      console.log("Profile picture displayed successfully on screen.");
      setImage(tempImage); // Now officially update the image in state
      await AsyncStorage.setItem("profileImage", tempImage); // Store in AsyncStorage
      setTempImage(null); // Clear temporary storage
    }
    setIsRendered(true); // Mark as successfully rendered
  };

  const handleImageLoadError = () => {
    console.warn("Image failed to load, using stored profile picture.");
    setTempImage(null); // Discard failed image
    setIsRendered(false);
  };

  async function refreshProfilePicture() {
    try {
      console.log("Refreshing profile picture...");
      await AsyncStorage.removeItem("profileImage"); // Clear stored image
      setImage(null); // Reset image in state
      setIsRendered(false);
      loadProfilePicture(); // Refetch profile picture
    } catch (error) {
      console.error("Error refreshing profile picture:", error);
    }
  }

  return (
    <View style={{ alignItems: "center", marginBottom: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : error && !image ? ( // Only show error if there's no stored image
        <View>
          <Text style={{ color: "red" }}>{error}</Text>
          <Button title="Retry" onPress={loadProfilePicture} />
        </View>
      ) : (
        <Image
          source={{ uri: tempImage || image }} // Prioritize new image, fallback to stored image
          style={{ width: 120, height: 120, borderRadius: 60 }}
          onLoad={handleImageLoadSuccess}
          onError={handleImageLoadError}
        />
      )}
    </View>
  );
};

export default ProfilePicture;
