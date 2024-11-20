import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './authContext';

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: { seconds: number };
}

interface TransactionContextType {
    transactions: Transaction[];
    userBalance: number | null;
    fetchTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

interface TransactionProviderProps {
    children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
    const { user, isAuthenticated } = useAuth(); // Listen for authentication changes
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userBalance, setUserBalance] = useState<number | 0>(0);

    const fetchTransactions = async () => {
        if (!user) return;

        try {
            // Fetch transactions for the current user
            const transactionsQuery = query(
                collection(db, 'transactions'),
                where('userId', '==', user.userId) // Filter by userId
            );
            const querySnapshot = await getDocs(transactionsQuery);
            const fetchedTransactions = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Transaction[];

            setTransactions(fetchedTransactions);

            // Fetch user balance directly from the `cashBalance` field
            const userDocRef = doc(db, 'users', user.userId);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                setUserBalance(userData.cashBalance || 0);
            }
        } catch (error) {
            console.error('Error fetching transactions or balance:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchTransactions(); // Fetch transactions and balance when user logs in
        } else {
            setTransactions([]);
            setUserBalance(0);
        }
    }, [isAuthenticated]);

    return (
        <TransactionContext.Provider value={{ transactions, userBalance, fetchTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = (): TransactionContextType => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
