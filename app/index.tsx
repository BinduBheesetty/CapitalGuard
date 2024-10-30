// app/index.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Roboto_700Bold, Roboto_400Regular } from '@expo-google-fonts/roboto';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#0f9b8e', '#000']} // Teal to Black Gradient
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('../assets/images/walletlogo.png')} // Adjust the path if needed
          style={styles.logo}
        />

        {/* App Name */}
        <Text style={styles.title}>CapitalGuard</Text>

        {/* Button Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20, // Space between logo and title
  },
  title: {
    fontSize: 36, // Large title font size
    marginBottom: 40,
    color: '#fff', // White color for visibility
    fontFamily: 'Roboto_700Bold', // Bold Roboto font
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    backgroundColor: '#0f9b8e', // Teal button color
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 25, // Rounded corners for buttons
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 18, // Button text size
    fontFamily: 'Roboto_400Regular', // Regular Roboto font
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
