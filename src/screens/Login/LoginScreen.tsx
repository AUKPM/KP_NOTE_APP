// Import necessary libraries
import React, {useState} from 'react';
import {View, StyleSheet, Alert, Image, ScrollView} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {login, logout} from '../../services/api/auth';
import {useAuth0} from 'react-native-auth0';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

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

  const handleChangeUsername = (value: string) => {
    setUsername(value);
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
  };

  const handleLogin = async () => {
    try {
      await authorize({
        scope: 'openid profile email offline_access',
        // audience: 'https://dev-yg.us.auth0.com/api/v2/',
        redirectUrl: 'localhost://callback',
      }); // ใช้ไคลเอนต์ OktaAuth สำหรับการล็อกอิน
    } catch (error) {
      console.error('Login error: ', error);
    }
  };

  if (isLoading) {
    return (
      <View>
        <Text>SDK is Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.getStartContainer}>
      {/* <View>
        {!user && <Button onPress={handleLogin} title="Log in" />}
        {user && <Text>Logged in as {user.name}</Text>}
        {error && <Text>{error.message}</Text>}
      </View>
      {<Button onPress={logout} title="Log Out" />} */}
      <View style={styles.coverImageContainer}>
        <Image
          source={coverImagePath} // เปลี่ยน path ตามไฟล์ของคุณ
          style={styles.coverImage}
        />
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
          navigation.navigate('Note');
          console.log('Pressed');
        }}>
        <Text style={styles.btnGetStartText}>Get Stated</Text>
      </Button>
    </View>
  );
};

// Define the styles
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
});

// Export the component
export default LoginScreen;
