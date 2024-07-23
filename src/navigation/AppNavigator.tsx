import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  LoginScreen,
  NoteScreen,
  ViewNoteScreen,
  ViewCommentScreen,
} from '../screens';
import NewNoteScreen from '../screens/ViewNote/ViewNoteScreen';
import {getData} from '../utils/storage';
import {
  ActivityIndicator,
  Text,
  Touchable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Loading from '../components/Loading/Loading';
import {useMainContext} from '../contexts/MainContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {menuVisible, toggleMenu} = useMainContext();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const authState = await getData('authState');

      if (authState && authState.idToken && authState.expiresAt) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime < parseInt(authState.expiresAt)) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Note' : 'Logih'}
        screenOptions={{
          //   headerStyle: {
          //     backgroundColor: 'transparent'
          //   },
          contentStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Note"
          component={NoteScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="NewNote"
          component={NewNoteScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditNote"
          component={ViewNoteScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditComment"
          component={ViewCommentScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
