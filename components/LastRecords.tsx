import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Record {
    id: string;
    category: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
}

interface LastRecordsProps {
    records: Record[];
}

const LastRecords: React.FC<LastRecordsProps> = ({ records }) => {
    // Render each record item
    const renderItem = ({ item }: { item: Record }) => (
        <View style={styles.recordItem}>
            <Ionicons
                name={item.type === 'income' ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={30}
                color={item.type === 'income' ? '#28A745' : '#FF6347'}
                style={styles.icon}
            />
            <View style={styles.textContainer}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={[styles.amount, { color: item.type === 'income' ? '#28A745' : '#FF6347' }]}>
                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Last Records</Text>
            <FlatList
                data={records.slice(0, 3)} // Show only the last 3 records
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c2c2e',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    recordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    category: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    date: {
        fontSize: 14,
        color: '#b0b0b0',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LastRecords;
