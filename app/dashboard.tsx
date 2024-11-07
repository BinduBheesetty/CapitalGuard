// app/dashboard.tsx

import React, { useState, useRef, useEffect } from 'react';
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
import { auth, db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import BalanceTrendChart from "../components/BalanceTrendChart";

const { height } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [topExpenses, setTopExpenses] = useState<any[]>([]);

  const formatDate = (timestamp: { toDate: () => any; }) => {
    const date = timestamp.toDate();
    return date.toDateString();
  };

  const fetchTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'transactions'));
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedTransactions);
      calculateTopExpenses(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateTopExpenses = (transactions: any[]) => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const expenseTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const sortedExpenses = Object.entries(expenseTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

    setTopExpenses(sortedExpenses);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
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

  const getCategoryIcon = (category: any) => {
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

  const getBarColor = (category: any) => {
    switch (category) {
      case 'Rent': return '#FFA726';
      case 'Groceries': return '#EF5350';
      case 'Transport': return '#29B6F6';
      default: return '#AB47BC';
    }
  };

  return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cash</Text>
            <Text style={styles.amount}>700.00 USD</Text>
          </View>

          <BalanceTrendChart />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Expenses</Text>
            {topExpenses.map((expense, index) => (
                <View key={index} style={styles.expenseContainer}>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                  <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                  <View style={styles.barBackground}>
                    <View
                        style={[
                          styles.barFill,
                          { width: `${(expense.amount / topExpenses[0].amount) * 100}%`, backgroundColor: getBarColor(expense.category) },
                        ]}
                    />
                  </View>
                </View>
            ))}
            <TouchableOpacity style={styles.showMoreButton}>
              <Text style={styles.showMoreText}>Show more</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Records</Text>
            {transactions.slice(0, 3).map((transaction) => (
                <View key={transaction.id} style={styles.transactionContainer}>
                  <View style={styles.iconContainer}>{getCategoryIcon(transaction.category)}</View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.category}>{transaction.category}</Text>
                    <Text style={styles.date}>{formatDate(transaction.date)}</Text>
                  </View>
                  <Text
                      style={[
                        styles.amount,
                        { color: transaction.type === 'expense' ? '#FF6347' : '#28A745' },
                      ]}
                  >
                    {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                  </Text>
                </View>
            ))}
            <TouchableOpacity style={styles.showMoreButton} onPress={() => router.push('/transactions')}>
              <Text style={styles.showMoreText}>Show more</Text>
            </TouchableOpacity>
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

        <TouchableOpacity style={styles.logoutIconButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#FF6347" />
        </TouchableOpacity>

        {isPanelVisible && (
            <AddRecordPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                closePanel={closePanel}
                slideAnim={slideAnim}
                fetchTransactions={fetchTransactions}
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
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseContainer: {
    marginVertical: 10,
  },
  expenseCategory: {
    fontSize: 16,
    color: '#fff',
  },
  expenseAmount: {
    fontSize: 14,
    color: '#b0b0b0',
    alignSelf: 'flex-end',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 5,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  date: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 2,
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
  logoutIconButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 50,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3c',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3c3c3e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  showMoreButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
});

export default DashboardScreen;
