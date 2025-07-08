// app/user.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useAuthStore } from './stores/useAuthStore';
import { useRouter } from 'expo-router';
import UsersListScreen from './screens/MultipleUsersScreen';
import { getCurrentUserProfile, User } from './Users/userAccount';
import { useFocusEffect } from '@react-navigation/native';
export default function UserPage() {
//   const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailDraft, setDraftEmail] = useState('');
  const updateEmail = useAuthStore((s) => s.updateUserEmail);
  const getUser = useAuthStore((s) => s.getUser)
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async () => {
      const profile = await getUser();
      console.log(profile)
    //   setEmail(profile?.email ?? "---");
    //   console.log(email)
      setUser(profile);

      console.log(user)
      setLoading(false);
    })();
  }, [user?.email]);

//   useFocusEffect(
//       React.useCallback(() => {
//       (async () => {
//           const profile = await getUser();
//           setUser(profile);
//           setLoading(false);
//       })
//       }, [user, email])
//   );



  if (loading) return null;



  const handleSave = async () => {
    // setEmail(emailDraft);
    if (user?.username && email) {
      user.email = email;
      console.log(user);
      await updateEmail(user.username, email);
      alert('Email updated!');
      router.reload()
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
  console.log(user)
  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 User Info</Text>
      <Text style={styles.text}>Username: {user.username}</Text>
      <Text style={styles.text}>Email: {user.email ?? '—'}</Text>
      <View style={styles.container}>
        <Text style={styles.label}>Add or Update Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <Button title="Save Email" onPress={handleSave} />
      </View>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 18, marginBottom: 8 },
  text: { fontSize: 18, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16,
    borderRadius: 4,
  },
});
