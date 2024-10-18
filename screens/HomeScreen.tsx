// screens/HomeScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <LinearGradient colors={['#007BFF', '#28A745']} style={styles.container}>
      {/* Load and display the image */}
      <Image
        source={require('../assets/images/logo.png')} // Adjust the path as necessary
        style={styles.logo}
      />
      <Text style={styles.title}>CapitalGuard</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Create an Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20, // Space between logo and title
  },
  title: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 50,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#007BFF',
  },
});

export default HomeScreen;
