import {gestureHandlerRootHOC, GestureHandlerRootView} from 'react-native-gesture-handler';
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PermissionsAndroid } from "react-native";
import OdooAuthScreen from "./src/screens/OdooAuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import Home from "./src/screens/tabs/Home";
import Profile from "./src/screens/tabs/Profile";
import Attendance from "./src/screens/tabs/Attendance";
import WorkInformation from "./src/screens/Profile/WorkInformation";
import PrivateInformation from "./src/screens/Profile/PrivateInformation";


const Stack = createNativeStackNavigator();

export default function App() {
  const requestLocPermission = async () => {
    try {
      const fineLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location for check-in/check-out features.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
  
      const backgroundLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message: 'This app needs background location access to auto check-out when leaving the area.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
  
      if (
        fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED &&
        backgroundLocationGranted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };



  
  useEffect(()=> {
    requestLocPermission();
  }, []);

  return (
    <GestureHandlerRootView>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OdooAuthScreen">
        <Stack.Screen name="OdooAuthScreen" component={OdooAuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Attendance" component={Attendance} />
        <Stack.Screen name="WorkInformationScreen" component={WorkInformation} />
        <Stack.Screen name="PrivateInformationScreen" component={PrivateInformation} />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}
