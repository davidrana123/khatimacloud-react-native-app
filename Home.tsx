import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Button } from 'react-native';

const HomePage = () => {
  return (
    <View >
      {/* Background Image */}
      <ImageBackground
        source={require('./khatima.jpeg')}
        style={styles.backgroundImage}
      >
        {/* Text */}
        <Text style={styles.text}>khatimacloud welcomes you to</Text>
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button title="Back" onPress={() => {}} />
          <Button title="Next" onPress={() => {}} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // This ensures the image covers the entire space
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'black',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20, // Adjust the spacing as needed
  },
});

export default HomePage;
