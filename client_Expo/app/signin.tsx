import React, { useState, useRef, use } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Image } from 'expo-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import Loader from '@/components/loader';
import { useAuth } from '@/context/authContext';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const { login, resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Opps!', 'Please enter email and password');
      return;
    }
    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    if (response.error) {
      let errorResponse = response.error;
      if (errorResponse.includes('(auth/invalid-email)')) {
        errorResponse = 'Invalid email';
      }
      if (errorResponse.includes('(auth/invalid-credential)')) {
        errorResponse = 'Invalid credentials';
      }
      Alert.alert('Opps!', errorResponse);
    }
  };

  const handleNavigatetoResetPassword = () => {
    router.push('resetPassword');
  };
  return (
    <CustomKeyboardView>
      <View style={{ paddingTop: hp(10), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
        <Image
          style={{ height: hp(30) }}
          contentFit="contain"
          source={require('../assets/images/login.png')}
        />
      </View>

      <View style={{ paddingBottom: hp(10), paddingHorizontal: wp(5) }} className="flex-1">
        <Text
          style={{ fontFamily: 'PoppinsSemiBold', fontSize: hp(2.8), color: '#000' }}
          className="text-center">
          Welcome Back
        </Text>
        <View className="gap-4">
          <View
            style={{ height: hp(7) }}
            className=" flex-row items-center gap-4 rounded-xl bg-green-100 px-4">
            <Octicons name="mail" size={hp(2.7)} color="#00B386" />
            <TextInput
              onChangeText={(value) => (emailRef.current = value)}
              placeholder="Email Address"
              placeholderTextColor="gray"
              style={{ fontFamily: 'PoppinsRegular', fontSize: hp(2), flex: 1, color: '#000' }}
              className="font-semibold"
            />
          </View>
          <View>
            <View
              style={{ height: hp(7) }}
              className=" flex-row items-center gap-4 rounded-xl bg-green-100 px-4">
              <Octicons name="lock" size={hp(2.7)} color="#00B386" />
              <TextInput
                onChangeText={(value) => (passwordRef.current = value)}
                placeholder="Password"
                placeholderTextColor="gray"
                style={{ fontFamily: 'PoppinsRegular', fontSize: hp(2), flex: 1, color: '#000' }}
                className="font-semibold"
                secureTextEntry={!showPassword}
                keyboardType="default"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <AntDesign name="eye" size={24} color="black" />
                ) : (
                  <AntDesign name="eye-invisible" size={24} color="black" />
                )}
              </Pressable>
            </View>
            <Text
              onPress={handleNavigatetoResetPassword}
              style={{ height: hp(4), fontFamily: 'PoppinsRegular', fontSize: hp(1.8) }}
              className="items-center justify-center text-green-700 p-2 text-right font-semibold tracking-wider">
              Forgot Password?
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={handleLogin}
              style={{ height: hp(5.5) }}
              className="items-center justify-center rounded-xl bg-green-700">
              {loading ? (
                <Loader />
              ) : (
                <Text
                  style={{ fontFamily: 'PoppinsSemiBold', fontSize: hp(2.1) }}
                  className="text-center tracking-wider text-white">
                  Sign in
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: hp(1.7) }}>
              Don't have an account?{' '}
            </Text>
            <Pressable
              onPress={() => {
                router.push('signup');
              }}>
              <Text style={{ fontSize: hp(1.7) }} className="font-poppins-semibold text-green-700">
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
