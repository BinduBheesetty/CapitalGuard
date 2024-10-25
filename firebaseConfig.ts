// firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFTaUcm_wWBn4aiO2zlTRKrZFIYq_VtCM",
  authDomain: "capitalguard-6dd23.firebaseapp.com",
  projectId: "capitalguard-6dd23",
  storageBucket: "capitalguard-6dd23.appspot.com",
  messagingSenderId: "271367177404",
  appId: "1:271367177404:web:9d9624fe1eed3ac161fcb9",
  measurementId: "G-V3MHVDT1C2",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage Persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore Database
export const db = getFirestore(app);
