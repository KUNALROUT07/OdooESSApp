//src/screens/OdooAuthScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';
import { authenticate, checkLoginStatus } from '../utils/odooAuth';

const OdooAuthScreen = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    checkLoginStatus(navigation);
  }, []);

  const handleAuthenticate = async () => {
    try {
      await authenticate(user, pass, navigation);
      Alert.alert('Success', 'Login successful');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Username"
        value={user}
        onChangeText={setUser}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200, marginBottom: 10, paddingHorizontal: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200, marginBottom: 10, paddingHorizontal: 10 }}
      />
      <Button title="Authenticate" onPress={handleAuthenticate} />
    </View>
  );
};

export default OdooAuthScreen;
