import React, { useState, useRef } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useAuth } from '@/context/authContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Loader from '@/components/loader';
import CustomKeyboardView from '@/components/CustomKeyboardView';
export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const fullNameRef = useRef('');
  const phoneRef = useRef('');
  const { register } = useAuth();

  const handleSignup = async () => {
    if (!emailRef.current || !passwordRef.current || !fullNameRef.current || !phoneRef.current) {
      Alert.alert('Opps!', 'Please enter all fields');
      return;
    }
    setLoading(true);
    let response = await register(
      fullNameRef.current,
      emailRef.current,
      phoneRef.current,
      passwordRef.current
    );
    setLoading(false);

    if (response.error) {
      let errorResponse = response.error;
      if (errorResponse.includes('(auth/email-already-in-use)')) {
        errorResponse = 'This user already exists';
      }
      if (errorResponse.includes('auth/invalid-email')) {
        errorResponse = 'Invalid email';
      }
      Alert.alert('Opps!', errorResponse);
    } else {
      router.replace('home');
    }
  };
  return (
    <CustomKeyboardView>
      <View style={{ paddingTop: hp(10), paddingHorizontal: wp(5) }} className="gap-12">
        <Image
          style={{ height: hp(30) }}
          contentFit="contain"
          source={require('../assets/images/signup.png')}
        />
      </View>

      <View style={{ paddingBottom: hp(10), paddingHorizontal: wp(5) }} className="flex-1">
        <Text
          style={{ fontFamily: 'PoppinsSemiBold', fontSize: hp(3), color: '#000' }}
          className="text-center">
          Register
        </Text>
        <View className="gap-4">
          <View
            style={{ height: hp(7) }}
            className=" flex-row items-center gap-4 rounded-xl bg-green-100 px-4">
            <Octicons name="people" size={hp(2.7)} color="#00B386" />
            <TextInput
              onChangeText={(value) => (fullNameRef.current = value)}
              placeholder="Full Name"
              placeholderTextColor="gray"
              style={{ fontFamily: 'PoppinsRegular', fontSize: hp(2), flex: 1, color: '#000' }}
              className="font-semibold"
            />
          </View>
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
              keyboardType="email-address"
            />
          </View>
          <View
            style={{ height: hp(7) }}
            className=" flex-row items-center gap-4 rounded-xl bg-green-100 px-4">
            <Feather name="phone" size={hp(2.7)} color="#00B386" />
            <TextInput
              onChangeText={(value) => (phoneRef.current = value)}
              placeholder="Phone Number"
              placeholderTextColor="gray"
              style={{ fontFamily: 'PoppinsRegular', fontSize: hp(2), flex: 1, color: '#000' }}
              className="font-semibold"
              keyboardType="numeric"
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
                secureTextEntry={showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <AntDesign name="eye" size={24} color="black" />
                ) : (
                  <AntDesign name="eye-invisible" size={24} color="black" />
                )}
              </Pressable>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{ height: hp(5.5) }}
              className="items-center justify-center rounded-xl bg-green-700"
              onPress={handleSignup}>
              {loading ? (
                <Loader />
              ) : (
                <Text
                  style={{ fontFamily: 'PoppinsSemiBold', fontSize: hp(2.0) }}
                  className="text-center tracking-wider text-white">
                  Register
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: hp(1.8) }}>
              Already have an account?{' '}
            </Text>
            <Pressable
              onPress={() => {
                router.push('signin');
              }}>
              <Text style={{ fontSize: hp(1.8) }} className="font-poppins-semibold text-green-700">
                Sign in
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
