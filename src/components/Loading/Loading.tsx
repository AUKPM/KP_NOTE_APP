import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

const Loading = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={{marginTop: 16}}>Loading...</Text>
    </View>
  );
};

export default Loading;
