import React, {CSSProperties, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Text, TextInput, Button, TouchableRipple} from 'react-native-paper';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

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
  const {
    title,
    titleStyle,
    description,
    backgroundColor,
    style,
    add,
    back,
    nextPage,
    done,
    contentRight,
  } = props;

  const backImagePath = require('../../assets/image/back.png');

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
 
  return (
    <View style={[styles.container, style]}>
      {back == true ? (
        <TouchableRipple onPress={() => navigation.goBack()}>
          <Image style={styles.btnBack} source={backImagePath}></Image>
        </TouchableRipple>
      ) : (
        <View style={styles.userProfileContainer}>
          <View style={styles.userProfileImage}>
            <Text style={styles.userProfileImageText}>E</Text>
          </View>
          <View style={styles.userProfileDetail}>
            <View style={styles.userProfileGreeting}>
              <Text style={styles.userProfileGreetingText}>Hello</Text>
            </View>
            <View style={styles.userProfileName}>
              <Text style={styles.userProfileNameText}>Elenia Winter</Text>
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
  userProfileImage: {
    width: 35,
    height: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    fontSize: 16,
    color: '#007bff',
  },
  btnBack:{
    width: 35,
    height: 35
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentRightContainer: {},
});

export default Navbar;
