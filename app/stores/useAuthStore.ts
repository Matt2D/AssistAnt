import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../Users/userAccount';

type AuthState = {
  user: Omit<User, 'password'> | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (user: User) => Promise<boolean>;
  logout: () => Promise<void>;
  checkLogin: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  register: async (newUser) => {
    const raw = await AsyncStorage.getItem('registeredUsers');
    const users: User[] = raw ? JSON.parse(raw) : [];

    const exists = users.find((u) => u.username === newUser.username);
    if (exists) return false; // username taken

    users.push(newUser);
    await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
    return true;
  },

 login: async (username, password) => {
    const raw = await AsyncStorage.getItem('registeredUsers');
    const users: User[] = raw ? JSON.parse(raw) : [];

    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) return false;

    const sessionUser = { username: found.username, id : found.id};
    await SecureStore.setItemAsync('user', JSON.stringify(sessionUser));
    set({ user: sessionUser, isLoggedIn: true });
    return true;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('user');
    set({ user: null, isLoggedIn: false });
  },

  checkLogin: async () => {
    const storedUser = await SecureStore.getItemAsync('user');
    
    if (storedUser) {
      console.log(storedUser)
      const user = JSON.parse(storedUser);
      set({ user, isLoggedIn: true });
    }
  },
}));
