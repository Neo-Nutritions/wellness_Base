import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { Alert } from 'react-native';
import { View, Text, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Loader from '@/components/loader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const emailRef = useRef('');
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!emailRef.current) return;

    setLoading(true);
    const response = await resetPassword(emailRef.current);
    setLoading(false);

    if (response?.error) {
      let errorResponse = response.error;
      if (errorResponse.includes('(auth/user-not-found)')) {
        errorResponse = 'User not found';
      }
      Alert.alert('Oops!', errorResponse);
      return;
    }
    Alert.alert('Oops!', 'Password reset link sent successfully');
    router.push('/');
  };

  return (
    <View className="flex-1 items-center justify-center bg-green-100 ">
      <Image
        style={{ height: hp(25), width: wp(60) }}
        contentFit="contain"
        source={require('../assets/images/nobg-logo.png')}
      />

      <Text className="mt-6 text-xl font-bold text-green-800">Reset Password</Text>

      <Text
        className="mt-2 text-center text-lg font-semibold text-green-700"
        style={{ width: wp(80) }}>
        Enter your email address. We will send you a link to reset your password
      </Text>

      <View
        style={{ height: hp(7), width: wp(85) }}
        className="mt-6 flex-row items-center gap-4 rounded-xl border border-green-300 bg-green-100 px-4">
        <Octicons name="mail" size={hp(2.7)} color="#00B386" />
        <TextInput
          onChangeText={(value) => (emailRef.current = value)}
          placeholder="Enter your email address"
          placeholderTextColor="gray"
          keyboardType="email-address"
          className="flex-1 font-semibold text-black"
          style={{ fontSize: hp(2) }}
        />
      </View>

      <TouchableOpacity
        style={{ height: hp(5.5), width: wp(85) }}
        className="mt-6 items-center justify-center rounded-xl bg-green-700"
        onPress={handleResetPassword}>
        {loading ? (
          <Loader />
        ) : (
          <Text style={{ fontSize: hp(2) }} className="font-semibold tracking-wider text-white">
            Reset Password
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
