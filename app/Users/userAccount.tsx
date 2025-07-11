import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export type PasswordUser = {
  username: string;
  id: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  friends?: Friend[] | [];
};

export type Friend = {
  username: string;
  id: string;
}

export type User = Omit<PasswordUser, 'password'>; 


export async function getCurrentUserProfile(): Promise<User | null> {
  // 1. Read the session info
  const sessionRaw = await SecureStore.getItemAsync('user');
  if (!sessionRaw) return null;

  const session = JSON.parse(sessionRaw) as { username: string; id: string; email?: string, phone_number?: string };
  const { username } = session;

  // 2. Load the list of all registered users
  const raw = await AsyncStorage.getItem('registeredUsers');
  const allUsers: User[] = raw ? JSON.parse(raw) : [];

  // 3. Find & return the matching record
  const fullUser = allUsers.find((u) => u.username === username);
  return fullUser || null;
}