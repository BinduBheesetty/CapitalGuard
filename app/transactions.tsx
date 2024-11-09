import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const TransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date');
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'transactions'));
        const fetchedTransactions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(fetchedTransactions);
        setFilteredTransactions(fetchedTransactions); // Initial display of all transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [selectedCategory, sortBy, transactions]);

  const handleFilter = () => {
    let filtered = [...transactions];

    // Only filter by category if a specific category is selected
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Sort by date or amount
    if (sortBy === 'date') {
      filtered.sort((a, b) => b.date.toDate() - a.date.toDate());
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    setFilteredTransactions(filtered);
  };

  return (
      <View style={styles.container}>
        {/* Back to Dashboard Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#007BFF" />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.filterContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.filterLabel}>Category:</Text>
            <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.picker}
                dropdownIconColor="#fff"
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Transport" value="Transport" />
              <Picker.Item label="Shopping" value="Shopping" />
              <Picker.Item label="Health" value="Health" />
              <Picker.Item label="Utilities" value="Utilities" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <View style={styles.pickerWrapper}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <Picker
                selectedValue={sortBy}
                onValueChange={(itemValue) => setSortBy(itemValue)}
                style={styles.picker}
                dropdownIconColor="#fff"
            >
              <Picker.Item label="Date" value="date" />
              <Picker.Item label="Amount" value="amount" />
            </Picker>
          </View>
        </View>

        <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.transactionContainer}>
                  <Ionicons name="wallet-outline" size={24} color="#007BFF" />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.category}>{item.category}</Text>
                    <Text style={styles.date}>{new Date(item.date.toDate()).toDateString()}</Text>
                  </View>
                  <Text
                      style={[
                        styles.amount,
                        { color: item.type === 'expense' ? '#FF6347' : '#28A745' },
                      ]}
                  >
                    {item.type === 'expense' ? '-' : '+'}${item.amount.toFixed(2)}
                  </Text>
                </View>
            )}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1c1c1e',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2c2c2e',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 5,
  },
  picker: {
    width: Platform.OS === 'ios' ? 150 : '100%',
    height: 40,
    color: '#fff',
    backgroundColor: '#3a3a3c',
    borderRadius: 8,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3c',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionsScreen;
