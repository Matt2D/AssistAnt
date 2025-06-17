import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEventStore, Event} from './stores/eventStores'; // adjust import
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useEffect} from 'react';
import React, { useState } from 'react';

export default function EditEventScreen() {
  const router = useRouter();
  const { id, title, date, time, description } = useLocalSearchParams();
  const editEvent = useEventStore((s) => s.editEvent);
  const event = useEventStore((s) => {
    return s.getEventById(id as string)
  })

    const [newTitle, setTitle] = useState('');
    const [newStartTime, setStartTime] = useState('');
    const [newEndTime, setEndTime] = useState('');
    const [newDesc, setDesc] = useState('');

    useEffect(() => {
        if (event) {
        setTitle(event.title || '');
        setStartTime(event.start_time || '');
        setEndTime(event.end_time || '');
        setDesc(event.description || '');
        }
    }, [event]);
  

  const onSave = () => {
    editEvent({
      id: id as string,
      title: newTitle,
      start_time: newStartTime,
      end_time: newEndTime,
      description: newDesc as string,
      date: date as string,
    });
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
    <Button title="Save Changes" onPress={onSave} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: { borderBottomWidth: 1, padding: 8, fontSize: 16 },
});


