// src/screens/HomeScreen.js

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, PermissionsAndroid} from 'react-native';
import {logout, setupAutoLogoutCheck} from '../utils/logout';
import {fetchProfile} from '../utils/fetchProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './tabs/Home';
import Attendance from './tabs/Attendance';
import Profile from './tabs/Profile';

const HomeScreen = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState(1);

  

  useEffect(() => {
    async function loadProfileInBackground() {
      try {
        const storedProfile = await AsyncStorage.getItem('profileData');
        console.log(
          'Fetch Profile data from AsyncStore Successfully in HomeScreen',
          storedProfile,
        );
        if (!storedProfile) {
          await fetchProfile(); // Fetch and store if not already fetched
          console.log(
            'Fetch Profile data from Surver Successfully in HomeScreen',
            storedProfile,
          );
        }
      } catch (error) {
        console.error('Error fetching profile in background:', error);
      }
    }

    loadProfileInBackground();
    setupAutoLogoutCheck(navigation); // Check auto logout on app start

    // Auto logout exactly at 12:00 AM
    const checkMidnight = setInterval(async () => {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();

      if (hours === 0 && minutes === 0) {
        console.log('Auto-logout triggered at midnight');
        await logout(navigation);
      }
    }, 60000); // Check every 60 seconds (1 minute)

    return () => clearInterval(checkMidnight); // Clean up timer when component unmounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  return (
    <View style={styles.container}>
      {/* use a logical operetor to select tap in button navigation. */}
      {(selectedTab === 0 && <Attendance navigation={navigation} />) ||
        (selectedTab === 1 && <Home navigation={navigation} />) ||
        (selectedTab === 2 && <Profile navigation={navigation} />)}

      <View style={styles.bottomView}>
        <TouchableOpacity
          style={styles.buttomTab}
          onPress={() => {
            setSelectedTab(0);
          }}>
          <Image
            source={
              selectedTab === 0
                ? require('../images/attendance_fill.png')
                : require('../images/attendance.png')
            }
            style={styles.buttomTabIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttomTab}
          onPress={() => {
            setSelectedTab(1);
          }}>
          <Image
            source={
              selectedTab === 1
                ? require('../images/home_fill.png')
                : require('../images/home.png')
            }
            style={styles.buttomTabIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttomTab}
          onPress={() => {
            setSelectedTab(2);
          }}>
          <Image
            source={
              selectedTab === 2
                ? require('../images/profile_fill.png')
                : require('../images/profile.png')
            }
            style={styles.buttomTabIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 20,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttomTab: {
    width: '20',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttomTabIcon: {
    width: 24,
    height: 24,
  },
});

export default HomeScreen;
