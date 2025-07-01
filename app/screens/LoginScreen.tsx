import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuthStore, hashPassword  } from '../stores/useAuthStore';
import RegisterScreen from "./RegisterScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';


export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    setPassword(await hashPassword(password));
    const success = await login(username, password);
    if (!success) alert('Invalid credentials!');
  };
  const handleRegister = async () => {
    router.push({
      pathname: '../screens/RegisterScreen',
    })
  };

  return (
    <View>
      {isLoggedIn ? (
        <>
          <Text>SOMETHING WENT HORRIBLY WRONG, {user?.username}!</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <>
          <TextInput placeholder="Username" onChangeText={setUsername} />
          <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
          <Button title="Login" onPress={handleLogin} />
          <Button title="Register" onPress={handleRegister} />
        </>
      )}
    </View>
  );
}
