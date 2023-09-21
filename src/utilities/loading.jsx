// LoadingScreen.js
import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../Images/logo.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 400, // Adjust the width and height as needed
    height: 400,
  },
});

export default LoadingScreen;
