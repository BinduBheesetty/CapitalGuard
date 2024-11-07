import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const BalanceTrendChart: React.FC = () => {
    const [transactions, setTransactions] = useState<{ date: { seconds: number }; amount: number }[]>([]);

    const fetchTransactions = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'transactions'));
            const fetchedTransactions = querySnapshot.docs.map((doc) => doc.data() as { date: { seconds: number }; amount: number });
            setTransactions(fetchedTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const formattedData = transactions
        .filter((transaction) => transaction.date)
        .map((transaction) => ({
            date: new Date(transaction.date.seconds * 1000),
            amount: transaction.amount,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const dates = formattedData.map((transaction) =>
        transaction.date.toISOString().split('T')[0]
    ).slice(-5);
    const amounts = formattedData.map((transaction) => transaction.amount).slice(-5);

    const chartData = {
        labels: dates,
        datasets: [{ data: amounts }],
    };

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Balance Trend</Text>
            <LineChart
                data={chartData}
                width={width - 60} // Adjusted width to fit better within the container
                height={220}
                yAxisSuffix=" USD"
                chartConfig={{
                    backgroundColor: '#1c1c1e',
                    backgroundGradientFrom: '#2c2c2e',
                    backgroundGradientTo: '#2c2c2e',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`, // Light blue for lines
                    labelColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`, // Light gray for labels
                    style: { borderRadius: 12 },
                    propsForDots: { r: '4', strokeWidth: '2', stroke: '#228BE6' },
                }}
                bezier
                style={styles.chartStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        backgroundColor: '#2c2c2e', // Darker background to match the dark theme
        padding: 20,
        borderRadius: 12,
        marginVertical: 15,
        marginHorizontal: 20,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff', // White for readability on dark background
        marginBottom: 10,
        textAlign: 'center',
    },
    chartStyle: {
        borderRadius: 12,
        marginVertical: 8,
        alignSelf: 'center',
    },
});

export default BalanceTrendChart;
