//src/screens/tabs/Home.js

import {StyleSheet, Text, View, Button, ScrollView, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
// import CheckInOutButton from '../../CheckInOut/CheckInOutButton';
import CheckInOutButtonNew from '../../CheckInOut/CheckInOutButtonNew';
import {RefreshControl} from 'react-native-gesture-handler';
import HomeWelcomeView from '../../components/Home/HomeWelcomeView';

const Home = ({navigation}) => {
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = () => {
		console.log('ting ting');
		setRefreshing(true);
	};

	function onRefreshDone() {
		console.log('Refresh Done');
		setRefreshing(false);
	}

	const requestLocPermission = async () => {
		try {
		  const grantedFineLocation = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
			  title: 'Get Location',
			  message: 'Haha',
			  buttonNeutral: 'Ask Me Later',
			  buttonNegative: 'Cancel',
			  buttonPositive: 'OK',
			}
		  );
	  
		  const grantedBackgroundLocation = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
			{
			  title: 'Get Location',
			  message: 'Haha',
			  buttonNeutral: 'Ask Me Later',
			  buttonNegative: 'Cancel',
			  buttonPositive: 'OK',
			}
		  );
	  
		  console.log('Location permission jjjjj',grantedFineLocation,grantedBackgroundLocation);
	  
		  if (
			grantedFineLocation === PermissionsAndroid.RESULTS.GRANTED &&
			grantedBackgroundLocation === PermissionsAndroid.RESULTS.GRANTED
		  ) {
			console.log('You can use the location');
		  } else {
			console.log('Location permission denied');
		  }
		} catch (err) {
		  console.error(err);
		}
	  };
	
	  useEffect(()=> {
		console.log("hhhhhhhhhhhhhhsdsdsdsd");
		
		requestLocPermission();
	  }, []);
	

	return (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={styles.scrollContainer}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}>
			<View style={[styles.container]}>
				<HomeWelcomeView />
				{/* <CheckInOutButton
					refreshAttendanceStatus={refreshing}
					onRefreshDoneFn={onRefreshDone}
				/> */}
				<CheckInOutButtonNew
					refreshAttendanceStatus={refreshing}
					onRefreshDoneFn={onRefreshDone}
				/>
			</View>

			<View style={[styles.container, {marginTop: 20}]}>
				<Text style={styles.text}>Welcome to Home Screen</Text>

				{/* Adding more content to test scrolling */}
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
				<Text style={styles.text}>
					More content to test scrolling...
				</Text>
			</View>
		</ScrollView>
	);
};

export default Home;

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		width: '99%',
	},
	scrollContainer: {
		padding: 20,
		paddingBottom: '30%', // Add some padding at the bottom for space
	},
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		margin: 2,
		width: '100%',
		borderRadius: 10,
	},
	text: {
		fontSize: 18,
		marginVertical: 20,
	},
});
