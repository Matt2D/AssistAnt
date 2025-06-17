import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CustomCalendar from './screens/CustomCalendar'; // adjust path if needed

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

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import CalendarScreen from './screens/CustomCalendar';
// import DayViewScreen from './screens/[date]';

// export type RootStackParamList = {
//   Calendar: undefined;
//   DayView: { date: string };
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Calendar">
//         <Stack.Screen name="Calendar" component={CalendarScreen} />
//         <Stack.Screen name="DayView" component={DayViewScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

