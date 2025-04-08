//src/CheckInOut/CheckInOutButtonNew.js


/* eslint-disable react-hooks/exhaustive-deps */
// src/CheckInOut/CheckInOutButton.js

import React, {useEffect, useRef, useState} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Alert,
	Modal,
	ActivityIndicator,
	StyleSheet,
	NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkInOutSystem} from './utils/checkInOutSystem';
import {useFocusEffect} from '@react-navigation/native';
import {fetchAttendanceState} from '../utils/fetchProfile';
import moment from 'moment-timezone';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';



const {ForegroundHeadlessModule} = NativeModules;




// convert Universal Time Zone(UTC) to India time Zone(IST).
function convertUTCtoIST(utcDateString) {
	// console.log(typeof utcDateString);
	if (typeof utcDateString === 'boolean') {
		return '';
	}
	return moment
		.utc(utcDateString)
		.tz('Asia/Kolkata')
		.format('DD/MM/YYYY, hh:mm:ss A');
}

function CheckInOutButtonNew(props) {
	const refreshing = props.refreshAttendanceStatus ?? false;
	const [isCheckedIn, setIsCheckedIn] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [checkIn, setCheckIn] = useState(null);
	const [checkOut, setCheckOut] = useState(null);
	const [workedHours, setWorkedHours] = useState(0);
	const [hoursToday, setHoursToday] = useState(0);
	const [loading, setLoading] = useState(false);
	const [locationData, setLocData] = useState([]);
	const locWatchId = useRef(null);



	const GEOFENCE = {
		latitude: 20.34295, // Replace with your fixed location
		longitude: 85.80943,
		radius: 1000, // Radius in meters
	};



	


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

			setLoading(false);
		} catch (error) {
			console.log('onRefresh:', error);

			setLoading(false);
		}
	}, []);


	//When we Navigate to The Screen Where the "CheckInOutButton" compoonent is mounted
  //This will update your Attendance satate automatically.

  useFocusEffect(
    React.useCallback(() => {
      async function updateHS() {
        try {
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

          setLoading(false);
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



	function onCheckInSuccess() {
			ForegroundHeadlessModule.startService();
			console.log('Did it run?');
	}
		  





		// locWatchId.current = Geolocation.watchPosition(
		// 	position => {
		// 		const obj = {
		// 			lat: position.coords.latitude,
		// 			long: position.coords.longitude,
		// 			timestamp: position.timestamp,
		// 		};
		// 		console.log('Location:', obj);
		// 		setLocData(prev => {
		// 			return [...prev, obj];
		// 		});


		// 			//geo fence

		// 			// Extract latitude and longitude from position
		// 	const { latitude, longitude } = position.coords;

		// 		// Auto Check-Out if the user moves outside the geofence
		// 	if (!isInsideGeofence(latitude, longitude)) {
		// 		Alert.alert('Auto Check-Out', 'You have moved out of the designated area.');
		// 		handleCheckInOut(); // Automatically Check-Out
		// 	};
		// 	//
		// 	},
		// 	err => {
		// 		console.log('Error occured while trying to get location data');
		// 		console.log(err);
		// 	},
		// 	{
		// 		interval: 6000,
		// 		enableHighAccuracy: true,
		// 		timeout: 6000,
		// 		maximumAge: 10000,
		// 		useSignificantChanges: false,
		// 		distanceFilter: 0.4,
		// 	},
		// );




	function onCheckOutSuccess() {
		//Geolocation.clearWatch(locWatchId);

		ForegroundHeadlessModule.stopService();
	}


	// geo fence
	const isInsideGeofence = (lat, long) => {
		const distance = getDistance(
			{ latitude: lat, longitude: long },
			{ latitude: GEOFENCE.latitude, longitude: GEOFENCE.longitude }
		);
		return distance <= GEOFENCE.radius;
	};
	// 


	



	const handleCheckInOut = async () => {
		setLoading(true);

		try {
			// fetch User attendance state from  "fetchProfile.js" file.
			const employeeAttendanceState = await fetchAttendanceState();
			console.log('employeeAttendanceState:', employeeAttendanceState);
			console.log('checkInOutStatus hhhhhh', isCheckedIn);

			// check user is "Check In / Check Out" in surver.
			// while / if employee attendance state in server and app is equal
			if (
				(employeeAttendanceState === 'checked_in' && isCheckedIn) ||
				(employeeAttendanceState === 'checked_out' && !isCheckedIn)
			) {
				// do (while / if employee attendance state in server and app is equal)

				//Get Current Location
			
				Geolocation.setRNConfiguration({
					locationProvider:"auto"
				})
				Geolocation.getCurrentPosition(
					async info => {
						 console.log('Location!!! :');
						console.log(info);

						try {
							let latitude = info.coords.latitude;
							let longitude = info.coords.longitude;
							console.log(
								'Location Fetched',
								`Latitude: ${latitude}, Longitude: ${longitude}`,
							);


							// gro fence
							// Check if inside geofence
							if (!isInsideGeofence(latitude, longitude)) {
							Alert.alert('Error', 'You must be within 100m of the designated location to check in.');
							console.log('Error', 'You must be within 100m of the designated location to check in.');
							setLoading(false);
							return;
							}
							//


							//send Current locations "Latitude, Longitude"  to checkInOutSystem
							const response = await checkInOutSystem(
								latitude,
								longitude,
							);
							// console.log('Response:', response);

							// fetch and set "CheckIn , CheckOut , HoursToday ,WorkedHours" value to state.
							setCheckIn(
								convertUTCtoIST(
									response.result.attendance.check_in,
								),
							);
							setCheckOut(
								convertUTCtoIST(
									response.result.attendance.check_out,
								),
							);
							setHoursToday(response.result.hours_today);
							setWorkedHours(
								response.result.last_attendance_worked_hours,
							);

							// fetch user "Check In / Check Out" status in server and use in App for CheckInOut operetion
							if (
								response.result.attendance_state ===
								'checked_in'
							) {
								setIsCheckedIn(true);
								onCheckInSuccess();
								await AsyncStorage.setItem(
									'checkInOutStatus',
									'checked_in',
								);
							} else {
								setIsCheckedIn(false);
								onCheckOutSuccess(); 
								await AsyncStorage.setItem(
									'checkInOutStatus',
									'checked_out',
								);

								console.log(locationData);
							}

							setModalVisible(false);
							setLoading(false);
						} catch (error) {
							console.log(
								'try catch error of geolocation',
								error,
							);
							setLoading(
								false,
							); /* set loding off if any error occurs */
						}

					},
					err => {
						console.log(err);
						setLoading(false);
					},
					{
						timeout: 5000,
						enableHighAccuracy: true,
						maximumAge: 5000,
					},
				);
			} else {
				// this is when the user odoo server and app "atttendance state is unequal" with server state.

				/*check what the attendance status of user in server, if not same then update user as his state of user in app*/
				// Check the user attendance state in server. and alert user his state in server.
				if (employeeAttendanceState === 'checked_in') {
					Alert.alert('You are already Checked In.');
				} else {
					Alert.alert('You are already Checked Out.');
				}

				console.log(
					'user is currently ',
					employeeAttendanceState,
					' in server.',
				);

				// update user attendance state in App, as the attendance state in  server.
				if (employeeAttendanceState === 'checked_in') {
					setIsCheckedIn(true);
					await AsyncStorage.setItem(
						'checkInOutStatus',
						'checked_in',
					);
				} else {
					setIsCheckedIn(false);
					await AsyncStorage.setItem(
						'checkInOutStatus',
						'checked_out',
					);
				}
				setLoading(false);
			}
		} catch (error) {
			Alert.alert('Error', error.message);
			console.log('try catch error of handleCheckInOut', error.message);
			setLoading(false);
		}
	};

	return (
		<View style={{alignItems: 'center', marginTop: 20}}>
			{isCheckedIn ? (
				<TouchableOpacity
					style={styles.checkOutBtn}
					onPress={() => {
						handleCheckInOut();
					}}
					disabled={loading}>
					{!loading ? (
						<Text
							style={{
								color: 'white',
								textAlign: 'center',
							}}>
							Check Out
						</Text>
					) : (
						<ActivityIndicator size="small" color="#fff" />
					)}
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={styles.checkInBtn}
					onPress={() => {
						handleCheckInOut();
					}}
					disabled={loading}>
					{!loading ? (
						<Text
							style={{
								color: 'white',
								textAlign: 'center',
							}}>
							Check In
						</Text>
					) : (
						<ActivityIndicator size="small" color="#fff" />
					)}
				</TouchableOpacity>
			)}

			<Text style={styles.workedHourSpacing}>
				Worked Hours: {workedHours}{' '}
			</Text>
		</View>
	);
}

export default CheckInOutButtonNew;

const styles = StyleSheet.create({
	workedHourSpacing: {marginTop: 10, fontSize: 16},
	checkOutBtn: {
		backgroundColor: 'green',
		padding: 15,
		borderRadius: 10,
		width: 200,
		alignItems: 'center',
	},
	checkInBtn: {
		backgroundColor: 'red',
		padding: 15,
		borderRadius: 10,
		width: 200,
		alignItems: 'center',
	},
	checkInOutBtnText: {
		color: 'white',
		fontSize: 18,
	},
	modalStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalView: {
		width: 300,
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 10,
	},
});
