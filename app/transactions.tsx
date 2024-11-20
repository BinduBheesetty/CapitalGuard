import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';

const TransactionsScreen: React.FC = () => {
  const router = useRouter();
  const { transactions, fetchTransactions } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const categories = ['All', 'Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Other'];
  const sortOptions = ['date', 'amount'];

  const handleFilter = () => {
    let filtered = [...transactions];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => b.date.seconds - a.date.seconds);
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [selectedCategory, sortBy, transactions]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food':
        return <Ionicons name="fast-food-outline" size={24} color="#FFA726" />;
      case 'Transport':
        return <Ionicons name="car-outline" size={24} color="#29B6F6" />;
      case 'Shopping':
        return <Ionicons name="cart-outline" size={24} color="#AB47BC" />;
      case 'Health':
        return <Ionicons name="heart-outline" size={24} color="#EF5350" />;
      case 'Utilities':
        return <Ionicons name="flash-outline" size={24} color="#FFCA28" />;
      case 'Other':
        return <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color="#8D6E63" />;
      case 'Salary':
        return <Ionicons name="cash-outline" size={24} color="#66BB6A" />;
      case 'Business':
        return <Ionicons name="briefcase-outline" size={24} color="#5C6BC0" />;
      case 'Investment':
        return <Ionicons name="trending-up-outline" size={24} color="#42A5F5" />;
      case 'Freelancing':
        return <Ionicons name="laptop-outline" size={24} color="#26A69A" />;
      default:
        return <Ionicons name="wallet-outline" size={24} color="#BDBDBD" />;
    }
  };

  return (
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#007BFF" />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
              style={[styles.filterButton, selectedCategory !== 'All' && styles.filterButtonActive]}
              onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={styles.filterLabel}>Category:</Text>
            <Text style={styles.filterValue}>{selectedCategory}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[styles.filterButton, sortBy !== 'date' && styles.filterButtonActive]}
              onPress={() => setSortModalVisible(true)}
          >
            <Text style={styles.filterLabel}>Sort by:</Text>
            <Text style={styles.filterValue}>{sortBy === 'date' ? 'Date' : 'Amount'}</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.transactionContainer}>
                  <View style={styles.iconContainer}>{getCategoryIcon(item.category)}</View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.category}>{item.category}</Text>
                    <Text style={styles.date}>
                      {new Date(item.date.seconds * 1000).toDateString()}
                    </Text>
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

        {/* Category Modal */}
        <Modal
            visible={categoryModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setCategoryModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setCategoryModalVisible(false)}>
            <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
              <View style={styles.modalContent}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedCategory(category);
                          setCategoryModalVisible(false);
                        }}
                    >
                      <Text style={styles.modalItemText}>{category}</Text>
                    </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Sort Modal */}
        <Modal
            visible={sortModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSortModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {sortOptions.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={styles.modalItem}
                        onPress={() => {
                          setSortBy(option);
                          setSortModalVisible(false);
                        }}
                    >
                      <Text style={styles.modalItemText}>
                        {option === 'date' ? 'Date' : 'Amount'}
                      </Text>
                    </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1c1c1e',
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
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
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#3a3a3c',
  },
  filterButtonActive: {
    backgroundColor: '#007BFF',
  },
  filterLabel: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  filterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3c',
    marginBottom: 10,
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3c3c3e',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalItem: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3c',
  },
  modalItemText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default TransactionsScreen;
