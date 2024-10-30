// app/dashboard.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AddRecordPanel from '../components/AddRecordPanel';
import { auth } from '../firebaseConfig'; // Import Firebase auth

const { height } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Handle Logout
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase sign out
      router.push('/'); // Navigate to home (index.tsx)
    } catch (error) {
      Alert.alert('Logout Failed', 'There was an error logging out. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const openPanel = () => {
    setIsPanelVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closePanel = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsPanelVisible(false));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cash</Text>
          <Text style={styles.amount}>700.00 USD</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balance Trend</Text>
          <Text style={styles.placeholder}>[Chart Placeholder]</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Expenses</Text>
          <Text style={styles.record}>Rent - $300</Text>
          <Text style={styles.record}>Groceries - $100</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last Records</Text>
          <Text style={styles.record}>Rent - $300 | Oct 3, 2024</Text>
          <Text style={styles.record}>Groceries - $100 | Oct 3, 2024</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="home-outline" size={30} color="#007BFF" />
          <Text style={styles.footerButtonText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={openPanel}>
          <Ionicons name="add-circle" size={60} color="#28A745" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {isPanelVisible && (
        <AddRecordPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          closePanel={closePanel}
          slideAnim={slideAnim}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  section: {
    backgroundColor: '#2c2c2e',
    padding: 40,
    marginVertical: 15,
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28A745',
  },
  placeholder: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  record: {
    fontSize: 18,
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#2c2c2e',
    borderTopWidth: 1,
    borderColor: '#3a3a3c',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#007BFF',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DashboardScreen;
