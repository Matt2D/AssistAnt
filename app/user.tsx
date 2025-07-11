// app/user.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useAuthStore } from './stores/useAuthStore';
import { useRouter } from 'expo-router';
import UsersListScreen from './screens/UsersListScreen';
import { getCurrentUserProfile, User } from './Users/userAccount';
import { useFocusEffect } from '@react-navigation/native';


export default function UserPage() {
  const user = useAuthStore((s) => s.userFull);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const updateEmail = useAuthStore((s) => s.updateUserEmail);
  const updatePhoneNumber = useAuthStore((s) => s.updateUserPhoneNumber);
  const getUser = useAuthStore((s) => s.getUser)
  const getFriends = useAuthStore((s) => s.friendList)
  // const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const profile = await getUser();
      console.log(profile)
      setLoading(false);
    })();
  }, [user?.email, user?.phoneNumber]);

  if (loading) return null;

  const handleEmail = async () => {
    //TODO check if email is valid
    if (user?.username && email) {
      console.log(user);
      await updateEmail(user.username, email);
      alert('Email updated!');
    }
  };

  const handlePhoneNumber = async () => {
    //TODO check if phonenumber is valid
    if (user?.username && phoneNumber) {
      console.log(user);
      await updatePhoneNumber(user.username, phoneNumber);
      alert('Phone number updated!');
    }
  };
  
  const handleLogout = async () => {
    await logout();
    // router.dismissAll(); 
    router.dismissTo('/') // Go back to login screen
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You are not logged in.</Text>
        <Button title="Go to Login" onPress={() => { router.dismissTo('/') }} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 User Info</Text>
      <Text style={styles.text}>Username: {user.username}</Text>
      <Text style={styles.text}>Email: {user.email ?? '—'}</Text>
      <Text style={styles.text}>Phone: {user.phoneNumber ?? '—'}</Text>
      <View style={styles.container}>
        <View style={styles.update}>
          <Text style={styles.label}>Add or Update Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          <Button title="Save Email" onPress={handleEmail}  />
        </View>
        <View style={styles.update}>
          <Text style={styles.label}>Add or Update Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your Phone Number"
          />
          <Button title="Save Phone Number" onPress={handlePhoneNumber} />
        </View>
      </View>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 3, justifyContent: 'center', alignItems: 'center', padding: 16 },
  buttonContainer: {justifyContent: 'flex-start',},
  update: {padding: 8},
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 18, marginBottom: 8 },
  text: { fontSize: 18, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16,
    borderRadius: 4,
  },
});
