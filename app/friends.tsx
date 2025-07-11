// app/user.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useAuthStore } from './stores/useAuthStore';
import { useRouter } from 'expo-router';
import UsersListScreen from './screens/UsersListScreen';
import { getCurrentUserProfile, User } from './Users/userAccount';
import { useFocusEffect } from '@react-navigation/native';
import FriendsListScreen from './screens/FriendsListScreen'

export default function UserPage() {
  const user = useAuthStore((s) => s.userFull);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
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
      <Text style={styles.header}>👤 Friends List</Text>
      <View style={styles.container}>
        <FriendsListScreen />
      </View>
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
