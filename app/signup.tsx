import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const { register } = useAuth(); // Access the `register` method from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match.');
      return;
    }

    if (!firstName || !lastName) {
      Alert.alert('Signup Error', 'First name and last name are required.');
      return;
    }

    try {
      const response = await register(email, password, firstName, lastName, ''); // Call register from context
      if (response.success) {
        Alert.alert('Signup Successful', 'Welcome to CapitalGuard!');
        router.push('/dashboard'); // Navigate to Dashboard after signup
      } else {
        Alert.alert('Signup Error', response.msg || 'Failed to register.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Signup Error', 'Something went wrong. Please try again.');
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#b0b0b0"
            value={firstName}
            onChangeText={setFirstName}
        />

        <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#b0b0b0"
            value={lastName}
            onChangeText={setLastName}
        />

        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#b0b0b0"
            value={email}
            onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
              style={styles.inputPassword}
              placeholder="Password"
              placeholderTextColor="#b0b0b0"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#b0b0b0"
                style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
              style={styles.inputPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#b0b0b0"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#b0b0b0"
                style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#3a3a3c', // Subtle border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 16,
    backgroundColor: '#2c2c2e', // Darker background for inputs
  },
  inputPassword: {
    flex: 1,
    color: '#fff',
    height: 50,
  },
  passwordIcon: {
    marginRight: 12,
  },
  signupButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
