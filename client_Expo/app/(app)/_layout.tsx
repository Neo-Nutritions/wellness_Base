import { View, Text } from 'react-native';
import React from 'react';
import { Slot } from 'expo-router';
import '../../global.css';
import { StatusBar } from 'expo-status-bar';

export default function _layout() {
  return (
    <>
      <StatusBar style="dark" translucent={false} />
      <Slot />
    </>
  );
}