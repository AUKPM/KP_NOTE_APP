import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useMainContext} from '../../contexts/MainContext';
import {
  CommonActions,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {removeData} from '../../utils/storage';
import Auth0, {useAuth0} from 'react-native-auth0';
import {logout} from '../../services/api/auth/auth';

const ProfileMenu = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {menuVisible, toggleMenu} = useMainContext();

  const {clearSession, clearCredentials} = useAuth0();

  const logout = async () => {
    try {
      await clearCredentials();
      // await auth0.webAuth.clearSession({federated: true});
      await removeData('authState');
      await removeData('idToken');
      toggleMenu();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    } catch (error) {
      console.log('Log out cancelled');
    }
  };

  if (!menuVisible) return null;

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={() => logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 50,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C2C2C2',
    borderRadius: 5,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
  },
});

export default ProfileMenu;
