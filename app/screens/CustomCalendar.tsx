// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEventStore } from '../stores/eventStores';
import { useAuthStore } from '../stores/useAuthStore';

// const date = new Date();
 
// const user = useAuthStore((s) => s.user);
// const events = useEventStore((s) => s.getEventsByDate(user?.username ?? '', date.toISOString()));

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (month : number, year : number) => { 
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number , year: number) => {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
};



export default function CustomCalendar(){

  const router = useRouter();

  const today = new Date();
 
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const dates = [];
  // Fill leading empty days
  for (let i = 0; i < firstDay; i++) {
    dates.push(null);
  }

  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }
  
  // Fill in calendar
  for (let j = 0; j <= (42-daysInMonth-firstDay-1)%7; j++) {
    dates.push(null);
  }
  
  // const dates = useMemo(() => {
  //   const days = [];
  //   const leadingEmpty = getFirstDayOfMonth(currentMonth, currentYear);
  //   for (let i = 0; i < leadingEmpty; i++) days.push(null);
  //   for (let i = 1; i <= getDaysInMonth(currentMonth, currentYear); i++) days.push(i);
  //   for (let j = 0; j <= (42-daysInMonth-firstDay-1)%7; j++) dates.push(null);
  //   return days;
  // }, [currentMonth, currentYear]);

  const handleDayPress = (day : number) => {
    if (day) {
      const selectedDate = new Date(currentYear, currentMonth, day);
      // const selectedDate = new Date(currentYear, currentMonth, day).toISOString().split('T')[0]; ;
      router.push({
                    pathname: '/[date]',
                    params: { date: encodeURIComponent(selectedDate.toISOString()) },
                    // params: { date: selectedDate }, // formatted like '2025-06-10'
                  });
    }
  };


  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrev}><Text>{'<'}</Text></TouchableOpacity>
        <Text style={styles.headerText}>{monthNames[currentMonth]} {currentYear}</Text>
        <TouchableOpacity onPress={handleNext}><Text>{'>'}</Text></TouchableOpacity>
      </View>

      {/* Days of week */}
      <View style={styles.daysRow}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.dayLabel}>{day}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <FlatList
        data={dates}
        numColumns={7}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => {
          if (item === null) {
            return <View style={styles.dateCell} />;
          }
          return(
            <TouchableOpacity
              // style={[styles.dateCell]}
              style={[
                styles.dateCell,
                item === selectedDate ? styles.selected : null
              ]}
              // onPress={() => item}
              onPress={() => {
                handleDayPress(item);
                setSelectedDate(item) }
              }
                >
              <Text style={styles.dateText}>{item || ''}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  dayLabel: {
    width: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dateCell: {
    flex: 1,
    width: 32,
    height: 32,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  selected: {
    backgroundColor: '#2196F3',
  },
  not_selected: {
    backgroundColor: '#000000',
  },
  dateText: {
    fontSize: 14,
  },
});


