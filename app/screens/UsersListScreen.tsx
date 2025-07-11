import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PasswordUser } from '../Users/userAccount';
import { useAuthStore } from '../stores/useAuthStore';

export default function UsersListScreen() {
  const [users, setUsers] = useState<PasswordUser[]>([]);
  const deleteUser = useAuthStore((s) => s.deleteUser);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const raw = await AsyncStorage.getItem('registeredUsers');
        const parsed = raw ? JSON.parse(raw) : [];
        
        setUsers(parsed);
        console.log(users)
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
  }, []);

  const loadUsers = async () => {
    const raw = await AsyncStorage.getItem('registeredUsers');
    const parsed = raw ? JSON.parse(raw) : [];
    setUsers(parsed);
  };
  
  const handleDelete = (username: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete user "${username}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteUser(username);
            loadUsers(); // refresh list
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Registered Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.username}> {item.username}</Text>
            <Text style={styles.id}>🆔 {item.id}</Text>
            <Button title="Delete" onPress={() => handleDelete(item.username)} />
          </View>
        )}
        ListEmptyComponent={<Text>No users registered.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  userItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: { fontSize: 18 },
  id: { fontSize: 12, color: 'gray' },
});
