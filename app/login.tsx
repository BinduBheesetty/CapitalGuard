import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext'; // Import the AuthContext

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth(); // Access the `login` method from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(email, password); // Call login from AuthContext
      if (response.success) {
        router.push('/dashboard'); // Navigate to Dashboard after login
      } else {
        Alert.alert('Login Error', response.msg || 'Failed to log in. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
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

        <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

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
  loginButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
