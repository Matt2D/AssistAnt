import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PasswordUser, User } from '../Users/userAccount';
import bcrypt from 'react-native-bcrypt';
import { persist } from 'zustand/middleware';
import { EasingNameSymbol } from 'react-native-reanimated/lib/typescript/Easing';

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (user: PasswordUser) => Promise<boolean>;
  logout: () => Promise<void>;
  checkLogin: () => Promise<void>;
  deleteUser: (user: string) => Promise<void>;
  updateUserEmail:(username: string, email: string) => Promise<void>;
  getUser:() => Promise<User | null>;
};

export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => { //UsesMath.random'
      if (err || !hash) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  console.log("Hi")
  console.log(password)
  console.log(hash)
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  getUser: async () => {
    // 1. Read the session info
    const sessionRaw = await SecureStore.getItemAsync('user');
    if (!sessionRaw) return null;

    const session = JSON.parse(sessionRaw) as { username: string; id: string; email?: string };
    const { username } = session;

    // 2. Load the list of all registered users
    const raw = await AsyncStorage.getItem('registeredUsers');
    const allUsers: User[] = raw ? JSON.parse(raw) : [];

    // 3. Find & return the matching record
    const fullUser = allUsers.find((u) => u.username === username);
    return fullUser || null;
  },

  register: async (newUser) => {
    const raw = await AsyncStorage.getItem('registeredUsers');
    const users: PasswordUser[] = raw ? JSON.parse(raw) : [];
    //TODO: Maybe don't get passwords all the time thx <3
    const exists = users.find((u) => u.username === newUser.username);
    if (exists) return false; // username taken
    console.log("Registered Pass")
    users.push(newUser);
    await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
    return true;
  },
  updateUserEmail: async (username: string, email: string) => {
      const raw = await AsyncStorage.getItem('registeredUsers');
    const users: PasswordUser[] = raw ? JSON.parse(raw) : [];

    const updatedUsers = users.map((user) =>
      user.username === username ? { ...user, email } : user
    );

    await AsyncStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    // If it's the current user, update that too
    const storedUser = await SecureStore.getItemAsync('user');
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      if (currentUser.username === username) {
        const updatedUser = { ...currentUser, email };
        await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
    }
  },
  login: async (username, password) => {
    const raw = await AsyncStorage.getItem('registeredUsers');
    const users: PasswordUser[] = raw ? JSON.parse(raw) : [];
    console.log(users);
    const found = users.find((u) => u.username === username);
    if (!found) return false;

    const match = await comparePassword(password, found.password);
    if (!match) return false;

    const sessionUser = { username: found.username, id: found.id }; //Add other stuff later (like email)
    await SecureStore.setItemAsync('user', JSON.stringify(sessionUser));
    set({ user: sessionUser, isLoggedIn: true });
    return true;
  },

  deleteUser: async (username: string) => {
    const raw = await AsyncStorage.getItem('registeredUsers');
    const users: PasswordUser[] = raw ? JSON.parse(raw) : [];
    const filtered = users.filter((u) => u.username !== username);

    await AsyncStorage.setItem('registeredUsers', JSON.stringify(filtered));

    // If the deleted user is logged in, log them out
    const current = await SecureStore.getItemAsync('user');
    if (current) {
      const parsed = JSON.parse(current);
      if (parsed.username === username) {
        await SecureStore.deleteItemAsync('user');
        set({ user: null, isLoggedIn: false });
      }
    }
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
