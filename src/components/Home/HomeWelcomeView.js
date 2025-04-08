// src/components/HomeWelcomeView.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchProfile, fetchAttendanceState } from '../../utils/fetchProfile';
import ProfilePicture from '../Profile/ProfilePicture';

// Function to determine greeting based on time
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good Morning 🌄";
    if (hour >= 12 && hour < 17) return "Good Afternoon ☀️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌆";
    return "Good Night ✨";
};

const HomeWelcomeView = () => {
    const [userName, setUserName] = useState('');
    const [firstCheckIn, setFirstCheckIn] = useState('');

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const profile = await fetchProfile();
                setUserName(profile.display_name || 'User');
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        // const loadFirstCheckIn = async () => {
        //     try {
        //         const attendanceState = await fetchAttendanceState();
        //         if (attendanceState && attendanceState.check_in) {
        //             const firstCheckInTime = attendanceState.check_in.split(' ')[1] || '';
        //             setFirstCheckIn(firstCheckInTime);
        //         }
        //     } catch (error) {
        //         console.error('Error fetching attendance state:', error);
        //     }
        // };

        loadUserProfile();
        // loadFirstCheckIn();
    }, []);

    return (
        <View style={styles.container}>
        <View style={styles.textContainer}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{userName}!</Text>
            {/* <Text style={styles.startTime}>
                You started your day at {firstCheckIn ? firstCheckIn : ''}.
            </Text> */}
        </View>

        <ProfilePicture style={{ width: 40, height: 40, borderRadius: 40 }}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    textContainer: {
        flex: 1,
        marginRight: 20,
      },
    greeting: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: "left",
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    startTime: {
        fontSize: 14,
        fontWeight: "400",
        textAlign: 'left',
    },
});

export default HomeWelcomeView;

// In Home.js, import and place this above the CheckInOutButton
// import HomeWelcomeView from '../../components/HomeWelcomeView';
// 
// <HomeWelcomeView />
// <CheckInOutButton />
