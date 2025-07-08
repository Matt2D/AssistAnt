import React from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import CustomCalendar from './screens/CustomCalendar'; // adjust path if needed
import LoginScreen from './screens/LoginScreen';
import { useEffect,  useState } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function App() {
  const checkLogin = useAuthStore((s) => s.checkLogin);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [loaded, setLoaded] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  console.log("Got to start")
  useEffect(() => {
    (async () => {
      await checkLogin();
      setLoaded(true);
    })();
  }, []);

  if (!loaded) return <Button title="Logout" onPress={logout} />; // Or show splash screen

  if (isLoggedIn){
    
    return (
      <SafeAreaView style={styles.container}>
        <Button title="Logout" onPress={logout} />
        <Button title="Go to User Page" onPress={() => router.push('/user')} />
        <Button title="See Users" onPress={() => router.push('/users')} />
        <CustomCalendar />
      </SafeAreaView>
    ); 
  }
  else{ 
    return(
      <LoginScreen />
    );
  }
}

// export default function Index() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <CustomCalendar />
//     </SafeAreaView>
//   );
// };

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

