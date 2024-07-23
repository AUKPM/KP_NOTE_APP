import React, {useState} from 'react';
import {View, StyleSheet, Alert, Image, TouchableOpacity} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {useAuth0} from 'react-native-auth0';
import {
  CommonActions,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getData, setData} from '../../utils/storage';
import {login} from '../../services/api/auth/auth';
import Loading from '../../components/Loading/Loading';
import {
  AUTH0_AUDIENCE,
  AUTH0_DOMAIN,
  AUTH0_REDIRECT_URL,
  AUTH0_SCOPE,
} from '@env';

interface LoginScreenProps {
  title?: string;
  description?: string;
  background?: React.CSSProperties;
}

const coverImagePath = require('../../assets/image/start_cover.png');

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [idToken, setIdToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {authorize, user, isLoading, error} = useAuth0();

  const handleLogin = async () => {
    try {
      const authState = await authorize({
        scope: AUTH0_SCOPE,
        audience: AUTH0_AUDIENCE,
        redirectUrl: AUTH0_REDIRECT_URL,
      });

      if (authState) {
        await setData('authState', authState);
        await setData('idToken', authState?.idToken);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Note'}],
          }),
        );
      } else {
        Alert.alert('Login failed', 'No authentication data received.');
      }
    } catch (error) {
      console.error('Login error: ', error);
    }
  };

  const loginAsGuest = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Note'}],
      }),
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.getStartContainer}>
      <View style={styles.coverImageContainer}>
        <Image source={coverImagePath} style={styles.coverImage} />
      </View>

      <View style={styles.coverTextContainer}>
        <View style={styles.coverTitleContainer}>
          <Text style={styles.coverTitleText}>Welcome to Notee</Text>
        </View>
        <View style={styles.coverBodyContainer}>
          <Text style={styles.coverBodyText}>
            Notee makes creating tasks and notes easy. With Notee, you can rest
            assured that your reminders and tasks are well-managed, helping you
            stay on top of your day.
          </Text>
        </View>
      </View>

      <Button
        style={styles.btnGetStart}
        mode="contained"
        onPress={() => {
          handleLogin();
        }}>
        <Text style={styles.btnGetStartText}>Get Stated</Text>
      </Button>

      <View style={styles.loginGuest}>
        <Text style={styles.loginGuestText}>Or login as </Text>
        <TouchableOpacity
          onPress={() => {
            loginAsGuest();
          }}>
          <Text style={styles.loginGuestHighlightText}>Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  getStartContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 18,
  },
  coverImageContainer: {},
  coverImage: {
    marginBottom: 31,
  },
  coverTextContainer: {
    width: '100%',
  },
  coverTitleContainer: {
    width: '100%',
    marginBottom: 31,
  },
  coverTitleText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },

  coverBodyContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 31,
  },
  coverBodyText: {
    flexWrap: 'wrap',
    width: '75%',
    textAlign: 'center',
    fontSize: 12,
    color: '#898989',
  },

  btnGetStart: {
    width: '90%',
    backgroundColor: '#2F4397',
    paddingVertical: 5,
    borderRadius: 50,
  },

  btnGetStartText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  description: {
    fontSize: 14,
    color: '#666',
  },
  loginGuest: {
    marginTop: 16,
    flexDirection: 'row',
  },
  loginGuestText: {},
  loginGuestHighlightText: {
    color: '#2F4397',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
