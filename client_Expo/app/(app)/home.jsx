import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/authContext';
import '../../global.css';
import { useRouter } from 'expo-router';
export default function home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <View>
      <Text>home</Text>
      <Text>Full Name {user?.fullname}</Text>
      <Text>Email Address {user?.email}</Text>
      <Text>Phone Number {user?.phoneNumber}</Text>
      <Text>Email is verified {user?.emailVerified}</Text>
      <Text onPress={logout}>logout</Text>
      <Text onPress={() => router.push('/')}>Back to landing</Text>
    </View>
  );
}
