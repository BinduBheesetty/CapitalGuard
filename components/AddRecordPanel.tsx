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
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const { height } = Dimensions.get('window');

interface AddRecordPanelProps {
  activeTab: 'expense' | 'income';
  setActiveTab: (tab: 'expense' | 'income') => void;
  closePanel: () => void;
  slideAnim: Animated.Value;
  fetchTransactions: () => void;
}

const AddRecordPanel: React.FC<AddRecordPanelProps> = ({
                                                         activeTab,
                                                         setActiveTab,
                                                         closePanel,
                                                         slideAnim,
                                                         fetchTransactions,
                                                       }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Other'];
  const incomeCategories = ['Salary', 'Business', 'Investment', 'Freelancing', 'Other'];

  const saveTransaction = async () => {
    try {
      if (!amount || !category) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
      }

      await addDoc(collection(db, 'transactions'), {
        type: activeTab,
        amount: parseFloat(amount),
        category,
        date: Timestamp.fromDate(date),
      });

      Alert.alert('Success', `${activeTab} added successfully.`);
      closePanel();
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'Failed to save the transaction.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const getCategories = () => (activeTab === 'expense' ? expenseCategories : incomeCategories);

  const headerStyle = {
    backgroundColor: activeTab === 'expense' ? '#FF4B4B' : '#28A745',
  };

  // Determine Save button color based on form completion
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
                activeTab === 'expense' ? styles.expenseTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab('expense')}
          >
            <Text style={styles.tabText}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'income' ? styles.incomeTab : styles.inactiveTab,
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

        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
            <Picker.Item label={`Select ${activeTab} Category`} value="" />
            {getCategories().map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
            <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
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
  expenseTab: { backgroundColor: '#FF4B4B' },
  incomeTab: { backgroundColor: '#28A745' },
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
});

export default AddRecordPanel;
