import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';

const { width } = Dimensions.get('window');

const BalanceTrendChart: React.FC = () => {
    const { transactions } = useTransactions();
    const [trendData, setTrendData] = useState<{ date: string; balance: number }[]>([]);

    useEffect(() => {
        calculateTrendData();
    }, [transactions]);

    const calculateTrendData = () => {
        let cumulativeBalance = 0;

        // Process transactions to calculate cumulative balance over time, sorted by transaction date
        const sortedTransactions = transactions
            .filter((transaction) => transaction.date) // Ensure transactions have a date
            .map((transaction) => ({
                date: new Date(transaction.date.seconds * 1000),
                amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort by transaction date (ascending)
            .slice(-5); // Use only the last 5 transactions

        const formattedTrend: { date: string; balance: number }[] = [];

        sortedTransactions.forEach((transaction) => {
            cumulativeBalance += transaction.amount; // Add income or subtract expense
            formattedTrend.push({
                date: transaction.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                balance: cumulativeBalance,
            });
        });

        setTrendData(formattedTrend);
    };

    // Prepare chart data
    const dates = trendData.map((data) => data.date.slice(5)); // MM-DD format
    const balances = trendData.map((data) => data.balance);

    const chartData = {
        labels: dates.length > 0 ? dates : ['No Data'],
        datasets: [{ data: balances.length > 0 ? balances : [0] }],
    };

    // Dynamically calculate the y-axis range
    const minBalance = Math.min(...balances, 0); // Minimum balance (include 0 for safety)
    const maxBalance = Math.max(...balances, 100); // Maximum balance (default to 100 if empty)

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Balance Trend</Text>
            <LineChart
                data={chartData}
                width={width - 50}
                height={260} // Slightly increased height for more space
                yAxisSuffix=" USD"
                yAxisInterval={1} // Ensure consistent increments
                chartConfig={{
                    backgroundColor: '#1c1c1e',
                    backgroundGradientFrom: '#1f1f22',
                    backgroundGradientTo: '#2c2c2e',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
                    style: { borderRadius: 12 },
                    propsForDots: { r: '6', strokeWidth: '2', stroke: '#228BE6' },
                    paddingTop: 15, // Add padding for better label alignment
                    // paddingLeft: 25, // Space for left labels
                }}
                bezier
                style={styles.chartStyle}
                withInnerLines={true}
                withOuterLines={false}
                formatYLabel={(y) => parseInt(y).toLocaleString()} // Properly format y-axis labels
                formatXLabel={(label) => label} // Keep MM-DD format for x-axis
                fromZero={true} // Ensure y-axis starts at 0
                verticalLabelRotation={30} // Avoid label overlap
                horizontalLabelRotation={-40}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        backgroundColor: '#2c2c2e',
        padding: 20,
        borderRadius: 15,
        marginVertical: 15,
        marginHorizontal: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    chartTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
        // textAlign: 'center',
        // textTransform: 'uppercase',
    },
    chartStyle: {
        borderRadius: 15,
        marginVertical: 10,
        paddingLeft: 10,
        alignSelf: 'center',
    },
});

export default BalanceTrendChart;
