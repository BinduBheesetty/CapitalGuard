import React from 'react';
import { Stack } from 'expo-router';
import { AuthContextProvider } from '../context/authContext';
import { TransactionProvider } from '../context/TransactionContext';

const Layout: React.FC = () => {
    return (
        <AuthContextProvider>
            <TransactionProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </TransactionProvider>
        </AuthContextProvider>
    );
};

export default Layout;
