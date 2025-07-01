import { useRouter, useLocalSearchParams, RouteParams } from 'expo-router';
import DayViewScreen from './screens/DayViewScreen'; // adjust path if needed
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useEventStore, Event } from './stores/eventStores';
import { useAuthStore } from './stores/useAuthStore';
import React, { useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function DayViewRoute() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  // const events = useEventStore((s) => s.getEventsByDate(date as string));
  // const getEventsByDate = useEventStore((s) => s.getEventsByDate);
  // const events = getEventsByDate(date as string);
  const user = useAuthStore((s) => s.user);
  // const events = useEventStore((s) => s.getEventsByDate(user?.username ?? '', date.toISOString()));
  // const events = useEventStore((s) =>
  //   s.getEventsByDate(user?.username ?? '', date)
  // );
  
  const getEventsByDate = useEventStore((s) => s.getEventsByDate);
  const [events, setEvents] = useState<Event[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.username && date) {
        const result = getEventsByDate(user.username, date);
        setEvents(result);
      }
    }, [user?.username, date])
  );
  
  const handleEventClick = (event: Event) => {
    router.push({
      pathname: '/edit',
      params: {
        id: event.id,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        description: event.description,
        date: event.date,
      }, // or just the id if you're fetching it
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events on {date}</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.event}>
            <Text>{item.start_time} - {item.title}</Text>
            <Button
                title="Edit Event"
                onPress={() =>
                  handleEventClick(item)
                }
              />
          </View>
        )}
        ListEmptyComponent={<Text>No events yet.</Text>}
      />

      <Button
        title="Add Event"
        onPress={() =>
          router.push({
            pathname: '/addEvent',
            params: { date: date as string},
          })
        }
      />
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Day View</Text>
  //     <Text style={styles.date}>{new Date(date).toDateString()}</Text>
  //     <DayViewScreen />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  event: { padding: 8, borderBottomWidth: 1, borderColor: '#ccc' },
});
