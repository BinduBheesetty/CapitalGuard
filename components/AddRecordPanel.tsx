import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import { doc, addDoc, collection, runTransaction, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const { height } = Dimensions.get('window');

interface AddRecordPanelProps {
  activeTab: 'expense' | 'income';
  setActiveTab: (tab: 'expense' | 'income') => void;
  closePanel: () => void;
  slideAnim: Animated.Value;
  fetchTransactions: () => void;
}

const AddRecordPanel: React.FC<AddRecordPanelProps> = ({
                                                         activeTab = 'expense',
                                                         setActiveTab,
                                                         closePanel,
                                                         slideAnim,
                                                         fetchTransactions,
                                                       }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const ExpenseCategories = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Other'];
  const IncomeCategories = ['Salary', 'Business', 'Investment', 'Freelancing', 'Other'];

  const saveTransaction = async () => {
    try {
      if (!amount || !category) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
      }

      const parsedAmount = parseFloat(amount);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'User is not logged in.');
        return;
      }

      // Reference to the user's balance document
      const userDocRef = doc(db, 'users', user.uid);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User document does not exist!');
        }

        const userData = userDoc.data();
        const currentBalance = userData.cashBalance || 0;

        const newBalance =
            activeTab === 'income'
                ? currentBalance + parsedAmount
                : currentBalance - parsedAmount;

        if (newBalance < 0) {
          throw new Error('Insufficient funds for this Expense!');
        }

        transaction.update(userDocRef, { cashBalance: newBalance });

        const transactionRef = collection(db, 'transactions');
        await addDoc(transactionRef, {
          userId: user.uid,
          type: activeTab,
          amount: parsedAmount,
          category,
          date: Timestamp.fromDate(date),
        });
      });

      Alert.alert('Success', `${activeTab} added successfully.`);
      closePanel();
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', error.message || 'Failed to save the transaction.');
    }
  };

  const getCategories = () => (activeTab === 'expense' ? ExpenseCategories : IncomeCategories);

  const headerStyle = {
    backgroundColor: activeTab === 'expense' ? '#FF4B4B' : '#28A745',
  };

  const isFormComplete = amount && category;
  const saveButtonColor = isFormComplete ? '#28A745' : '#D3D3D3';

  return (
      <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
        <View style={[styles.header, headerStyle]}>
          <Text style={styles.headerButton} onPress={closePanel}>
            Cancel
          </Text>
          <Text style={styles.headerTitle}>Add Record</Text>
          <Text style={styles.headerButton}></Text>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'expense' ? styles.ExpenseTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab('expense')}
          >
            <Text style={styles.tabText}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'income' ? styles.IncomeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab('income')}
          >
            <Text style={styles.tabText}>Income</Text>
          </TouchableOpacity>
        </View>

        <TextInput
            style={styles.input}
            placeholder="Amount (USD)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
        />

        {/* Category Dropdown */}
        <TouchableOpacity
            style={[styles.input, styles.categoryInput]}
            onPress={() => setCategoryModalVisible(true)}
        >
          <Text>{category || `Select ${activeTab} Category`}</Text>
        </TouchableOpacity>

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
                {getCategories().map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={styles.modalItem}
                        onPress={() => {
                          setCategory(cat);
                          setCategoryModalVisible(false);
                        }}
                    >
                      <Text style={styles.modalItemText}>{cat}</Text>
                    </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Date Picker */}
        {Platform.OS === 'web' ? (
            <View style={[styles.input, styles.dateInput]}>
              <input
                  type="date"
                  style={{ width: '100%', height: '99%', border: 'none', outline: 'none' }}
                  value={date.toISOString().substr(0, 10)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setDate(newDate); // Set valid date
                    } else {
                      console.warn('Invalid date value entered'); // Log invalid input
                    }
                  }}
              />
            </View>
        ): (
            <TouchableOpacity
                onPress={() => setShowDatePicker((prev) => !prev)} // Toggle the state
                style={[styles.input, styles.dateInput]}
            >
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
        )}

        {showDatePicker && Platform.OS !== 'web' && (
            <DatePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
            />
        )}

        <Button
            title="Save"
            onPress={saveTransaction}
            color={saveButtonColor}
            disabled={!isFormComplete}
        />
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.8,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerButton: { fontSize: 16, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  ExpenseTab: { backgroundColor: '#FF4B4B' },
  IncomeTab: { backgroundColor: '#28A745' },
  inactiveTab: { backgroundColor: '#D3D3D3' },
  tabText: { fontSize: 16, color: '#fff' },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderColor: '#D3D3D3',
    justifyContent: 'center',
  },
  categoryInput: {
    justifyContent: 'center',
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
  dateInput: {
    justifyContent: 'center',
  },
});

export default AddRecordPanel;
