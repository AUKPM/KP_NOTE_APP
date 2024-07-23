import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, ViewStyle, TextStyle} from 'react-native';
import {Text, TouchableRipple, Avatar, Menu} from 'react-native-paper';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {setData} from '../../utils/storage';
import {getUserInfo} from '../../services/api/api/userSerivce';
import {UserInfoType} from '../../types';
import {checkIfAuth} from '../../utils/utils';
import {useMainContext} from '../../contexts/MainContext';
import ProfileMenu from '../ProfileMenu/ProfileMenu';

interface NavbarProps {
  title?: string;
  titleStyle?: TextStyle;
  description?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  add?: Boolean;
  back?: Boolean;
  nextPage?: string;
  done?: Boolean;
  contentRight?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = props => {
  const {title, titleStyle, style, back, contentRight} = props;

  const {toggleMenu} = useMainContext();

  const [visible, setVisible] = React.useState(false);

  const backImagePath = require('../../assets/image/back.png');
  const avatarImagePath = require('../../assets/image/avatar.png');

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  let isUserAuth;

  const fetchUserData = async () => {
    try {
      isUserAuth = await checkIfAuth();
      if (!!isUserAuth === true) {
        const userInfo = await getUserInfo();
        setUserInfo(userInfo);
        await setData('userInfo', userInfo);
      } else {
        setUserInfo({
          id: 1,
          nickname: '',
          name: 'Guest',
          picture: '',
          email: 'string',
        });
      }
    } catch (error) {
      console.error('Error fetch getUserInfo', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      fetchUserData();
    };
    initialize();
  }, []);

  return (
    <View style={[styles.container, style]}>
      {back == true ? (
        <TouchableRipple onPress={() => navigation.goBack()}>
          <Image style={styles.btnBack} source={backImagePath}></Image>
        </TouchableRipple>
      ) : (
        <View style={styles.userProfileContainer}>
          <View style={styles.userProfileImageContainer}>
            <TouchableRipple onPress={() => toggleMenu()}>
              <Avatar.Image
                size={35}
                source={
                  userInfo?.picture ? {uri: userInfo?.picture} : avatarImagePath
                }
              />
            </TouchableRipple>
          </View>
          <ProfileMenu />
          <View style={styles.userProfileDetail}>
            <View style={styles.userProfileGreeting}>
              <Text style={styles.userProfileGreetingText}>Hello,</Text>
            </View>
            <View style={styles.userProfileName}>
              <Text style={styles.userProfileNameText}>
                {userInfo?.name}{' '}
                {userInfo?.nickname ? `(${userInfo.nickname})` : ''}
              </Text>
            </View>
          </View>
        </View>
      )}

      <Text style={[styles.title, titleStyle]}>{title}</Text>

      {contentRight ? (
        <View style={styles.contentRightContainer}>{contentRight}</View>
      ) : (
        <View></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userProfileContainer: {
    flexDirection: 'row',
  },
  userProfileImageContainer: {
    width: 35,
    height: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userProfileImage: {},
  userProfileImageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F4397',
  },
  userProfileDetail: {
    paddingLeft: 16,
  },
  userProfileGreeting: {},
  userProfileGreetingText: {
    fontSize: 12,
    color: '#A4AAFF',
  },
  userProfileName: {},
  userProfileNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    zIndex: 1,
  },
  button: {
    fontSize: 16,
    color: '#007bff',
  },
  btnBack: {
    width: 35,
    height: 35,
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentRightContainer: {},
});

export default Navbar;
