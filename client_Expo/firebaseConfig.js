// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBINjj1xj9mR3Y9WVh-UnbmF4fBQvZ38Jg',
  authDomain: 'neonutrition-c077d.firebaseapp.com',
  projectId: 'neonutrition-c077d',
  storageBucket: 'neonutrition-c077d.firebasestorage.app',
  messagingSenderId: '69565051066',
  appId: '1:69565051066:web:7ba97452f4530557d29283',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth with persistence (Expo-safe)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
export const db = getFirestore(app);
