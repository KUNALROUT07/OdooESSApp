import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchProfile, fetchAttendanceHistory } from '../../utils/fetchProfile';
import ProfilePicture from '../Profile/ProfilePicture';

const ProfileWelcomeView = () => {
    const [userName, setUserName] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const profile = await fetchProfile();
                setUserName(profile.display_name.toString().split(" ")[0] || 'User');
                setJobTitle(profile.job_title)
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        loadUserProfile()
    }, []);


  return (
    
        <View style={styles.container}>

            <ProfilePicture style={{ width: 40, height: 40, borderRadius: 40 }}/>
        <View style={styles.textContainer}>
            <Text style={styles.greeting}>Hii,</Text>
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{userName}!</Text>
            <Text style={styles.startTime}>{jobTitle} .</Text>
        </View>
        
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "98%",
        flexDirection: "row", // Arrange items in a row
        justifyContent: "space-between", // Push text and profile pic apart
        alignItems: "center", // Vertically align items
        padding: 20,
    },
    textContainer: {
        flex: 1, // Take up remaining space
        marginLeft: 20, // Add space between text and profile picture
      },
    greeting: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: "left",
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    startTime: {
        fontSize: 16,
        fontWeight: "400",
        fontWeight: 'left',
    },
});


export default ProfileWelcomeView;

// In Home.js, import and place this above the CheckInOutButton
// import HomeWelcomeView from '../../components/HomeWelcomeView';
// 
// <HomeWelcomeView />
// <CheckInOutButton />



// // src/components/HomeWelcomeView.js

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { fetchProfile, fetchAttendanceHistory } from '../../utils/fetchProfile';
// import ProfilePicture from '../Profile/ProfilePicture';

// // Function to determine greeting based on time
// const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour >= 4 && hour < 12) return "Good Morning";
//     if (hour >= 12 && hour < 17) return "Good Afternoon";
//     if (hour >= 17 && hour < 21) return "Good Evening";
//     return "Good Night";
// };

// const HomeWelcomeView = () => {
//     const [userName, setUserName] = useState('');
//     const [firstCheckIn, setFirstCheckIn] = useState('');

//     useEffect(() => {
//         const loadUserProfile = async () => {
//             try {
//                 const profile = await fetchProfile();
//                 setUserName(profile.display_name || 'User');
//             } catch (error) {
//                 console.error('Error fetching profile:', error);
//             }
//         };

//         const loadFirstCheckIn = async () => {
//             try {
//                 const today = new Date();
//                 const history = await fetchAttendanceHistory(today, today);
//                 if (history && history.length > 0) {
//                     const todayRecords = history[0]?.data || [];
//                     if (todayRecords.length > 0) {
//                         const firstCheckInTime = todayRecords[0]?.check_in?.split(' ')[1] || '';
//                         setFirstCheckIn(firstCheckInTime);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching attendance history:', error);
//             }
//         };

//         loadUserProfile();
//         loadFirstCheckIn();
//     }, []);

//     return (
//         <View style={styles.container}>
//         <View style={styles.textContainer}>
//             <Text style={styles.greeting}>{getGreeting()},</Text>
//             <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{userName}!</Text>
//             <Text style={styles.startTime}>
//                 You started your day at {firstCheckIn ? firstCheckIn : ''}.
//             </Text>
//         </View>

//         <ProfilePicture style={{ width: 40, height: 40, borderRadius: 40 }}/>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         width: "98%",
//         flexDirection: "row", // Arrange items in a row
//         justifyContent: "space-between", // Push text and profile pic apart
//         alignItems: "center", // Vertically align items
//         padding: 20,
//     },
//     textContainer: {
//         flex: 1, // Take up remaining space
//         marginRight: 20, // Add space between text and profile picture
//       },
//     greeting: {
//         fontSize: 20,
//         fontWeight: '500',
//         textAlign: "left",
//     },
//     userName: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         textAlign: 'left',
//     },
//     startTime: {
//         fontSize: 16,
//         fontWeight: "400",
//         fontWeight: 'left',
//     },
// });

// export default HomeWelcomeView;

// // In Home.js, import and place this above the CheckInOutButton
// // import HomeWelcomeView from '../../components/HomeWelcomeView';
// // 
// // <HomeWelcomeView />
// // <CheckInOutButton />
