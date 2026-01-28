import { View, Text, Pressable } from 'react-native';
import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/authContext';
import '../../global.css';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '@/services/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function home() {
  const { logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setUser(await getCurrentUser());
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);
  return (
    <View>
      <View style={{ padding: wp('5%') }}>
        <Text>home</Text>
        <Text>Full Name {user?.full_name}</Text>
        <Text>Email Address {user?.email}</Text>
        <Text>Phone Number {user?.phoneNumber}</Text>
        <Text>Email is verified {user?.emailVerified}</Text>
        <Text onPress={logout}>logout</Text>
        <Text onPress={() => router.push('/')}>Back to landing</Text>
        <Text onPress={() => router.push('/plans')}>Go to plans</Text>
      </View>
    </View>
  );
}
