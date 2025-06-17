import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
}

export default function DayViewScreen() {
  const route = useRoute();
  const { date } = route.params as { date: string };
  const slots = generateTimeSlots();

  let parsedDate: Date | null = null;

  if (typeof date === 'string') {
    try {
      const decodedDate = decodeURIComponent(date);
      parsedDate = new Date(decodedDate);
    } catch (error) {
      console.warn('Failed to decode or parse date', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Day View for {parsedDate?.toDateString()}</Text>
      <FlatList
        data={slots}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.slot}>
            <Text style={styles.time}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    padding: 16,
  },
  slot: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  time: {
    fontSize: 16,
  },
});


