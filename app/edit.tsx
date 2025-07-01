import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEventStore, Event} from './stores/eventStores'; // adjust import
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useEffect} from 'react';
import React, { useState } from 'react';
import { useAuthStore } from './stores/useAuthStore';

export default function EditEventScreen() {
  const router = useRouter();
  const { id, title, date, time, description } = useLocalSearchParams();
  const editEvent = useEventStore((s) => s.editEvent);
  const deleteEvent = useEventStore((s) => s.deleteEvent);
  const user = useAuthStore((s) => s.user);
  if (!user) return false;
  const event = useEventStore((s) => {
    return s.getEventById(user?.username ?? '', id as string)
  })

    const [newTitle, setTitle] = useState('');
    const [newStartTime, setStartTime] = useState('');
    const [newEndTime, setEndTime] = useState('');
    const [newDesc, setDesc] = useState('');
    const [newLoc, setLoc] = useState('');

    useEffect(() => {
        if (event) {
        setTitle(event.title || '');
        setStartTime(event.start_time || '');
        setEndTime(event.end_time || '');
        setDesc(event.description || '');
        setLoc(event.location || '');
        }
    }, [event]);
  

  const onSave = () => {
    editEvent({
      user,
      id: id as string,
      title: newTitle,
      start_time: newStartTime,
      end_time: newEndTime,
      description: newDesc as string,
      date: date as string,
      location: newLoc
    });
    router.back(); // Go back after saving
  };
  const onDelete = () => {
    if (event){
      deleteEvent(event);
    }
    router.back(); // Go back after saving
  };

  return (<View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Event Title"
      value={newTitle}
      onChangeText={setTitle}
    />
    <TextInput
      style={styles.input}
      placeholder="Start Time (e.g., 14:30)"
      value={newStartTime}
      onChangeText={setStartTime}
    />
    <TextInput
      style={styles.input}
      placeholder="End Time (e.g., 14:30)"
      value={newEndTime}
      onChangeText={setEndTime}
    />
    <TextInput
      style={styles.input}
      placeholder="Description"
      value={newDesc}
      onChangeText={setDesc}
    />

    <TextInput
      style={styles.input}
      placeholder="Location"
      value={newLoc}
      onChangeText={setLoc}
    />
    <Button title="Save Changes" onPress={onSave} />
    <Button title="Delete Event" onPress={onDelete} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: { borderBottomWidth: 1, padding: 8, fontSize: 16 },
});


