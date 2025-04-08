// src/CheckInOut/CheckInOutButton.js

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkInOutSystem} from './utils/checkInOutSystem';
import {useFocusEffect} from '@react-navigation/native';
import {fetchAttendanceState} from '../utils/fetchProfile';
import moment from 'moment-timezone';
import Geolocation from 'react-native-geolocation-service';
import BackgroundGeolocation from 'react-native-background-geolocation';

const CheckInOutButton = props => {
  const refreshing = props.refreshAttendanceStatus ?? false;
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkInDuration, setCheckInDuration] = useState('00:00:00');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [workedHours, setWorkedHours] = useState(null);
  const [hoursToday, setHoursToday] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationInterval, setLocationInterval] = useState(null);

  useEffect(() => {
    async function toRefresh() {
      await checkAttendanceState();
      props.onRefreshDoneFn && props.onRefreshDoneFn();
    }
    if (refreshing) {
      toRefresh();
    }
  }, [refreshing]);

  // ScrollDown refresh
  const checkAttendanceState = React.useCallback(async () => {
    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const employeeAttendanceState = await fetchAttendanceState();
      console.log('employeeAttendanceState:', employeeAttendanceState);

      if (employeeAttendanceState === 'checked_in') {
        setIsCheckedIn(true);
        await AsyncStorage.setItem('checkInOutStatus', 'checked_in');
      } else {
        setIsCheckedIn(false);
        await AsyncStorage.setItem('checkInOutStatus', 'checked_out');
      }

      // setRefreshing(false);

      setIsButtonDisabled(false);
      setLoading(false);
    } catch (error) {
      console.log('onRefresh:', error);

      // button disable code if necessary
      setIsButtonDisabled(false);
      setLoading(false);
    }
  }, []);

  // convert Universal Time Zone(UTC) to India time Zone(IST).
  const convertUTCtoIST = utcDateString => {
    return moment
      .utc(utcDateString)
      .tz('Asia/Kolkata')
      .format('DD/MM/YYYY, hh:mm:ss A');
  };

  // Make a Timer for checkInDuration
  useEffect(() => {
    if (isCheckedIn) {
      const interval = setInterval(() => {
        setCheckInDuration(prev => {
          const [h, m, s] = prev.split(':').map(Number);
          const totalSeconds = h * 3600 + m * 60 + s + 1;
          const newH = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
          const newM = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
            2,
            '0',
          );
          const newS = String(totalSeconds % 60).padStart(2, '0');
          return `${newH}:${newM}:${newS}`;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCheckInDuration('00:00:00');
    }
  }, [isCheckedIn]);

  //When we Navigate to The Screen Where the "CheckInOutButton" compoonent is mounted
  //This will update your Attendance satate automatically.

  useFocusEffect(
    React.useCallback(() => {
      async function updateHS() {
        try {
          setLoading(true);
          setIsButtonDisabled(true);
          const employeeAttendanceState = await fetchAttendanceState();
          console.log('employeeAttendanceState:', employeeAttendanceState);

          if (employeeAttendanceState === 'checked_in') {
            setIsCheckedIn(true);
            await AsyncStorage.setItem('checkInOutStatus', 'checked_in');
          } else {
            setIsCheckedIn(false);
            await AsyncStorage.setItem('checkInOutStatus', 'checked_out');
          }

          setLoading(false);
          setIsButtonDisabled(false);
        } catch (error) {
          console.log(error);

          setLoading(false);
        }
      }

      console.log("Here the 'CheckInOutButton' is mounted");

      updateHS();
      return () => {
        console.log('Not mount!');
      };
    }, []),
  );

  // {/* Update longitude and latitude every 15s time frame if user is Checked in */}

  // const startLocationUpdates = () => {
  //   const interval = setInterval(() => {
  //     Geolocation.getCurrentPosition(
  //       async position => {
  //         let Latitude = position.coords.latitude;
  //         let Longitude = position.coords.longitude;
  //         console.log(
  //           'Location Fetched',
  //           `Latitude: ${Latitude}, Longitude: ${Longitude}`,
  //         );

  //         console.log('Updating Location:', Latitude, Longitude);
  //         await checkInOutSystem(Latitude, Longitude, true); // Send location update
  //       },
  //       error => {
  //         console.log('Location update error:', error.message);
  //       },
  //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
  //     );
  //   }, 15000);
  //   setLocationInterval(interval);
  // };

  // const stopLocationUpdates = () => {
  //   if (locationInterval) {
  //     clearInterval(locationInterval);
  //     setLocationInterval(null);
  //   }
  // };

  //Handle CheckInOut

  const handleCheckInOut = async () => {
    setLoading(true);
    setIsButtonDisabled(true);

    console.log('No hello!!!!!!!!!!!!!');
    try {
      setIsButtonDisabled(true);

      // fetch User attendance state from  "fetchProfile.js" file.
      const employeeAttendanceState = await fetchAttendanceState();
      console.log('employeeAttendanceState:', employeeAttendanceState);
      console.log('checkInOutStatus', isCheckedIn);

      // check user is "Check In / Check Out" in surver.
      // while / if employee attendance state in server and app is equal
      if (
        (employeeAttendanceState === 'checked_in' && isCheckedIn) ||
        (employeeAttendanceState === 'checked_out' && !isCheckedIn)
      ) {
        // do (while / if employee attendance state in server and app is equal)
        //Get Current Location
        console.log('hello!!!!!!!!!');
        Geolocation.getCurrentPosition(
          async position => {
            try {
              let Latitude = position.coords.latitude;
              let Longitude = position.coords.longitude;
              console.log(
                'Location Fetched',
                `Latitude: ${Latitude}, Longitude: ${Longitude}`,
              );

              //send Current locations "Latitude, Longitude"  to checkInOutSystem
              const response = await checkInOutSystem(Latitude, Longitude);
              console.log('Response:', response);

              // fetch and set "CheckIn , CheckOut , HoursToday ,WorkedHours" value to state.
              setCheckIn(convertUTCtoIST(response.result.attendance.check_in));
              setCheckOut(
                convertUTCtoIST(response.result.attendance.check_out),
              );
              setHoursToday(response.result.hours_today);
              setWorkedHours(response.result.last_attendance_worked_hours);

              // fetch user "Check In / Check Out" status in server and use in App for CheckInOut operetion
              if (response.result.attendance_state === 'checked_in') {
                setIsCheckedIn(true);
                // startLocationUpdates();    // Sart Updating Live location when user checked out.
                await AsyncStorage.setItem('checkInOutStatus', 'checked_in');
              } else {
                setIsCheckedIn(false);
                // stopLocationUpdates();    //Stop Updating Live location when user checked out.
                await AsyncStorage.setItem('checkInOutStatus', 'checked_out');
              }

              setModalVisible(false);

              setLoading(false);
              setIsButtonDisabled(false);
            } catch (error) {
              console.log('try catch error of geolocation', error);
              setLoading(false); /* set loding off if any error occeer */
              setIsButtonDisabled(false);
            }
          },
          error => {
            /* show error when GeoLocation not found */
            setLoading(false);
            Alert.alert('Error', error.message);
            console.log(error.message);
          },
          {enableHighAccuracy: true, timeout: 30000, maximumAge: 10000},
        );
      } else {
        // this is when the user odoo server and app "atttendance  state is unequal" with surver state.

        /*check what the attendance status of user in serve, if not same then update user as his state of user in app*/
        // Check the user attendance state in server. and alert user his state in server.
        if (employeeAttendanceState === 'checked_in') {
          Alert.alert('You are already Checked In.');
        } else {
          Alert.alert('You are already Checked Out.');
        }

        console.log(
          'user is currently ',
          employeeAttendanceState,
          ' in surver.',
        );

        // update user attendance state in App, as the attendance state in  server.
        if (employeeAttendanceState === 'checked_in') {
          setIsCheckedIn(true);
          await AsyncStorage.setItem('checkInOutStatus', 'checked_in');
        } else {
          setIsCheckedIn(false);
          await AsyncStorage.setItem('checkInOutStatus', 'checked_out');
        }
        setLoading(false); /* set loding diable after it update */
      }
      setIsButtonDisabled(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log('try catch error of handleCheckInOut', error.message);
      setLoading(false);
      // setRefreshing(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <View style={{alignItems: 'center', marginTop: 20}}>
      {isCheckedIn ? (
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            padding: 15,
            borderRadius: 10,
            width: 200,
            alignItems: 'center',
          }}
          onPress={() => setModalVisible(true)}>
          <Text style={{color: 'white', fontSize: 18}}>Check Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 15,
            borderRadius: 10,
            width: 200,
            alignItems: 'center',
          }}
          onPress={() => setModalVisible(true)}>
          <Text style={{color: 'white', fontSize: 18}}>Check In</Text>
        </TouchableOpacity>
      )}

      <Text style={{marginTop: 10, fontSize: 16}}>
        Worked Hours: {workedHours}{' '}
        {/* you can also use here   "checkInDuration"  if you want it in format "hh.mm.ss" */}
      </Text>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <Text>Check-in: {checkIn || 'N/A'}</Text>
            <Text>Check-out: {isCheckedIn ? 'N/A' : checkOut || 'N/A'}</Text>
            <Text>Hours Today: {hoursToday || 'N/A'}</Text>

            <Text style={{marginTop: 10, fontSize: 16}}>
              Worked Hours: {workedHours}{' '}
              {/* you can also use here   "checkInDuration"  if you want it in format "hh.mm.ss" */}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: isCheckedIn ? 'red' : 'green',
                padding: 10,
                marginTop: 20,
                borderRadius: 5,
              }}
              onPress={() => {
                handleCheckInOut();
              }}
              disabled={loading}>
              {!loading ? (
                <Text style={{color: 'white', textAlign: 'center'}}>
                  {isCheckedIn ? 'Check Out' : 'Check In'}
                </Text>
              ) : (
                <ActivityIndicator size="small" color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{marginTop: 10}}>
              <Text style={{textAlign: 'center', color: 'blue'}}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckInOutButton;
