import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EditNoteScreen, LoginScreen, NoteScreen} from '../screens';
import NewNoteScreen from '../screens/ViewNote/ViewNoteScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        //   headerStyle: {
        //     backgroundColor: 'transparent'
        //   },
          contentStyle: { backgroundColor: 'transparent' },
        }}>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Note" component={NoteScreen} />
        <Stack.Screen options={{ headerShown: false }} name="NewNote" component={NewNoteScreen} />
        <Stack.Screen options={{ headerShown: false }} name="EditNote" component={EditNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
