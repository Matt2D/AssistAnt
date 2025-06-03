import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CustomCalendar from './CustomCalendar'; // adjust path if needed

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <CustomCalendar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'flex-start',
    // justifyContent: 'center',
  },
});



