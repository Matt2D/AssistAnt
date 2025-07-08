// app/user.tsx
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from './stores/useAuthStore';
import { useRouter } from 'expo-router';
import UsersListScreen from './screens/MultipleUsersScreen';

export default function UserPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    // router.dismissAll(); 
    router.dismissTo('/') // Go back to login screen
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You are not logged in.</Text>
        <Button title="Go to Login" onPress={() => {router.dismissTo('/') }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <UsersListScreen />
      <Text style={styles.header}>👤 User Info</Text>
      <Text style={styles.text}>Username: {user.username}</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 18, marginBottom: 8 },
});
