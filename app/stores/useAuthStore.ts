import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PasswordUser, User } from '../Users/userAccount';
import bcrypt from 'react-native-bcrypt';

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (user: PasswordUser) => Promise<boolean>;
  logout: () => Promise<void>;
  checkLogin: () => Promise<void>;
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

 login: async (username, password) => {
    const raw = await AsyncStorage.getItem('registeredUsers');
    const users: PasswordUser[] = raw ? JSON.parse(raw) : [];
    console.log(users);
    const found = users.find((u) => u.username === username);
    if (!found) return false;

    const match = await comparePassword(password, found.password);
    if (!match) return false;

    const sessionUser = { username: found.username, id : found.id}; //Add other stuff later (like email)
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
