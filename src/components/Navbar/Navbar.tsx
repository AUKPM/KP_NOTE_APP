import React, {CSSProperties, useState} from 'react';
import {View, StyleSheet, Alert, Image, ViewStyle} from 'react-native';
import {Text, TextInput, Button, TouchableRipple} from 'react-native-paper';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface NavbarProps {
  title?: string;
  description?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  add?: Boolean;
  back?: Boolean;
}

const addImagePath = require('../../assets/image/add.png');

const Navbar: React.FC<NavbarProps> = props => {
  const {title, description, backgroundColor, style, add, back} = props;

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <View style={[styles.container, style]}>
      {back == false ? (
        <TouchableRipple onPress={() => navigation.goBack()}>
          <Text style={styles.button}>Back</Text>
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

      <Text style={styles.title}>{title}</Text>
      {add ? (
        <TouchableRipple onPress={() => navigation.navigate('Home')}>
          <Text style={styles.button}>Home</Text>
        </TouchableRipple>
      ) : (
        <TouchableRipple onPress={() => navigation.navigate('Home')}>
          <Image style={styles.btnAdd} source={addImagePath} />
        </TouchableRipple>
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
  btnAdd: {
    width: 35,
    height: 35,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Navbar;
