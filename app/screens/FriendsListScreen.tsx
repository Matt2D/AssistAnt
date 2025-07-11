import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PasswordUser } from '../Users/userAccount';
import { useAuthStore } from '../stores/useAuthStore';

export default function FriendsListScreen() {
  const deleteUser = useAuthStore((s) => s.deleteUser);
  const friends = useAuthStore((s) => s.friendList)
  const getFriends = useAuthStore((s) => s.getFriendList)

  const loadFriends = async () => {
    getFriends();
  };

  const handleDelete = (username: string) => {
    Alert.alert(
      'Delete Friend',
      `Are you sure you want to delete your best friend "${username}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteUser(username);
            loadFriends(); // refresh list
          },
        },
      ]
    );
  };

   const handleAddFriend = (username: string) => {
    Alert.alert(
      'You can\'t possibly have any friends to add',
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Add Friend" onPress={() => handleAddFriend("friend_name")} />
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
            if (item === null) {
                return <Text style={styles.username}>YOU HAVE NO FRIENDS</Text>;
            }
            return(
                <View style={styles.userItem}>
                    <Text style={styles.username}> {item.username}</Text>
                    <Text style={styles.id}>🆔 {item.id}</Text>
                    <Button title="Delete" onPress={() => handleDelete(item.username)} />
                </View>
          )
          
        }}
        ListEmptyComponent={<Text>No friends registered.</Text>}
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
