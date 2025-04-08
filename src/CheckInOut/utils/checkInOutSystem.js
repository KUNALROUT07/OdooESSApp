//src/CheckInOut/utils/checkInOutSystem

import AsyncStorage from '@react-native-async-storage/async-storage';
import {HOST, PORT} from '../../rpc/jsonRpc';
import {webAuth} from '../../utils/odooAuth';

// Check-in or Check-out function
const checkInOutSystem = async (latitude, longitude) => {
  try {
    let sessionCookie = await AsyncStorage.getItem('sessionCookie');

    if (!sessionCookie) {
      sessionCookie = await webAuth(); // Re-authenticate if session is missing
    }

    console.log(
      'Location Fetched',
      `Latitude: ${latitude}, Longitude: ${longitude} in checkInOutSystem`,
    );

    const locData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: {latitude, longitude},
    });

    const attendan_res = await fetch(
      `http://${HOST}:${PORT}/hr_attendance/systray_check_in_out`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: locData,
      },
    );

    if (!attendan_res.ok) {
      throw new Error('Check-in/out request failed');
    }

    const responseJson = await attendan_res.json();
    console.log(responseJson);
    return responseJson;
  } catch (error) {
    console.error('Check-in/out error:', error.message);
    throw error;
  }
};

export {checkInOutSystem};
