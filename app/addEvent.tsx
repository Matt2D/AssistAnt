import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useEventStore } from './stores/eventStores';
import { useAuthStore } from './stores/useAuthStore';
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid'; // install uuid

import uuid from 'react-native-uuid';



export default function AddEvent() {
    const userStored = useAuthStore((s) => s.user);
    const { date } = useLocalSearchParams();
    const addEvent = useEventStore((s) => s.addEvent);
    const router = useRouter();
    if (!userStored) {
      return; //PUT ERROR LATER
    };
    const [user, setUser] = useState(userStored);
    const [title, setTitle] = useState('');
    const [start_time, setStartTime] = useState('');
    const [end_time, setEndTime] = useState('');
    const [description, setDesc] = useState('');
    const [location, setLoc] = useState('');
    const handleAdd = () => { 
      const id = uuid.v4()

      addEvent({
        user,
        id,
        title,
        start_time,
        end_time,
        description,
        date: date as string,
        location
      });
      router.back();
    };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Start Time (e.g., 14:30)"
        value={start_time}
        onChangeText={setStartTime}
      />
      <TextInput
        style={styles.input}
        placeholder="End Time (e.g., 14:30)"
        value={end_time}
        onChangeText={setEndTime}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDesc}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLoc}
      />
      <Button title="Save Event" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: { borderBottomWidth: 1, padding: 8, fontSize: 16 },
});
