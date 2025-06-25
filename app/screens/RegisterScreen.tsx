import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuthStore } from '../stores/useAuthStore';
import uuid from 'react-native-uuid';

export default function RegisterScreen() {
  const register = useAuthStore((s) => s.register);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const id = uuid.v4()
    const success = await register({ username, password, id});
    alert(success ? 'Registered!' : 'Username taken');
  };

  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
