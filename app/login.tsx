// app/login.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      router.push('/dashboard'); // Navigate to Dashboard after login
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#b0b0b0"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#b0b0b0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} color="#28A745" />

      <TouchableOpacity onPress={() => router.push('/signup')} style={styles.signupLink}>
        <Text style={styles.signupText}>Don't have an account? Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e', // Dark background
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // White text for visibility
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Roboto_700Bold',
  },
  input: {
    height: 50,
    borderColor: '#3a3a3c', // Subtle border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 16,
    backgroundColor: '#2c2c2e', // Darker input background
    color: '#fff', // White text in inputs
  },
  signupLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  signupText: {
    color: '#007BFF', // Blue text for signup link
    fontSize: 16,
  },
});

export default LoginScreen;
