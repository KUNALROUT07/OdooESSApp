//src/task/watchPosition.js


import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

module.exports = async () => {
  console.log('Background Geolocation task has hopefully started');

  Geolocation.setRNConfiguration({
    skipPermissionRequests: false, 
    locationProvider: 'playServices',
  });

  const watchId = Geolocation.getCurrentPosition(
    pos =>
      console.log(
        '[Background location]',
        pos.coords.latitude,
        '//',
        pos.coords.longitude,
      ),
    err => console.log('Location Error while running in Background', err),
    {
      interval: 180000,
      maximumAge: 0,
      timeout: 20000,
      enableHighAccuracy: false,
    },
  );

  await AsyncStorage.setItem('watchId', `${watchId}`);
};
