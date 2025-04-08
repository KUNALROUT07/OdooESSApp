// src/utils/odooAuth.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import jsonRpcCall, {DB, HOST, PORT} from '../rpc/jsonRpc';
import {fetchEmployeeId} from '../utils/fetchProfile';
import {storeLoginDate} from './logout';

const webAuth = async () => {
  try {
    // Retrieve user credentials
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      throw new Error('User not logged in');
    }
    const {user, pass} = JSON.parse(userData);

    // Authenticate user
    const authData = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        db: DB,
        login: user,
        password: pass,
      },
    });

    const authRes = await fetch(
      `http://${HOST}:${PORT}/web/session/authenticate`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        body: authData,
      },
    );

    if (!authRes.ok) {
      throw new Error('Authentication failed');
    }

    const sessionCookie = authRes.headers.get('set-cookie');
    if (!sessionCookie) {
      throw new Error(
        "Session ID couldn't be used! Unable to find it in headers",
      );
    }
    return sessionCookie;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {webAuth};

export async function authenticate(user, pass, navigation) {
  if (!user || !pass) {
    throw new Error('Please enter both username and password');
  }

  try {
    const uid = await jsonRpcCall('call', {
      service: 'common',
      method: 'login',
      args: [DB, user, pass],
    });

    if (uid) {
      console.log('Logged in with UID:', uid);
      await AsyncStorage.multiSet([
        ['userData', JSON.stringify({uid, user, pass})],
        ['user', user],
        ['pass', pass],
        ['uid', uid.toString()],
      ]);

      // Fetch and store only the Employee ID
      try {
        const employeeId = await fetchEmployeeId();
        const sessionCookie = await webAuth();
        await AsyncStorage.setItem('sessionCookie', sessionCookie);
        await storeLoginDate();
        console.log('Employee ID fetched and stored:', employeeId);
      } catch (idError) {
        console.error('Error fetching Employee ID:', idError);
      }

      navigation.navigate('HomeScreen');
    } else {
      throw new Error('Incorrect username or password');
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw new Error(error.message);
  }
}

export async function checkLoginStatus(navigation) {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      navigation.navigate('HomeScreen');
    }
  } catch (error) {
    console.error('Error checking login status:', error);
  }
}
