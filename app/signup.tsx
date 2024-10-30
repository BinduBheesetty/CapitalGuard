// app/signup.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), { email });

      Alert.alert('Signup Successful', 'Welcome to CapitalGuard!');
      router.push('/dashboard'); // Navigate to Dashboard after signup
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Signup Error', 'This email is already in use. Please log in.');
        router.push('/login');
      } else {
        Alert.alert('Signup Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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

      <Button title="Signup" onPress={handleSignup} color="#28A745" />

      <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLink}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
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
    color: '#fff', // White text for better contrast
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
    backgroundColor: '#2c2c2e', // Darker background for inputs
    color: '#fff', // White input text
  },
  loginLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  loginText: {
    color: '#007BFF', // Blue text for the login link
    fontSize: 16,
  },
});

export default SignupScreen;
