import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function PlanDetails() {
  const { id } = useLocalSearchParams();
  const plan = useAppSelector((state) =>
    state.plans.plans.find((p) => p.id === (id))
  );

  if (!plan) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>Plan not found</Text>
      </View>
    );
  }

  // Theme colors & icons
  const colorMap: Record<string, string> = {
    bronze: '#68D391',
    platinum: '#63B3ED',
    diamond: '#9F7AEA',
    gold: '#F6E05E',
  };

  const iconMap: Record<string, string> = {
    bronze: 'stats-chart',
    platinum: 'diamond',
    diamond: 'diamond-outline',
    gold: 'trophy',
  };

  const key = plan.slug?.split('-')[0];
  const themeColor = colorMap[key] || '#68D391';
  const icon = iconMap[key] || 'stats-chart';

  // Payment Handlers
  const handlePayment = (method: string) =>
    Alert.alert(`${method} Payment`, `Pay ${plan.currency} ${plan.price} via ${method}`);

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      {/* Scrollable Features */}
      <ScrollView
        contentContainerStyle={{ padding: hp(2),paddingTop: hp(6), paddingBottom: hp(12) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Ionicons name={icon} size={36} color="white" />
        </View>

        {/* Price */}
        <Text style={styles.price}>
          {plan.currency} {plan.price} / {plan.billing_period}
        </Text>

        {/* Features */}
        <View style={{ marginTop: hp(2) }}>
          <Text style={styles.featuresHeader}>Features:</Text>
          {Object.values(plan.features).map((feature) => (
            <Text key={feature} style={styles.featureItem}>
              • {feature.replace(/_/g, ' ')}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Checkout */}
      <View style={styles.stickyCheckout}>
        <Text style={styles.checkoutTitle}>Choose Payment Method</Text>
        <Text style={styles.checkoutSubtitle}>
          {plan.currency} {plan.price} / {plan.billing_period}
        </Text>

        <View style={{ marginTop: hp(1) }}>
          {['Card', 'Stripe', 'PayPal', 'M-Pesa'].map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.paymentButton}
              activeOpacity={0.85}
              onPress={() => handlePayment(method)}
            >
              <Text style={styles.paymentButtonText}>Pay with {method}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  planName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: hp(2),
  },
  featuresHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: hp(1),
  },
  featureItem: {
    color: 'white',
    fontSize: 16,
    marginBottom: hp(0.5),
  },
  stickyCheckout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: wp(100),
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937', // dark gray
  },
  checkoutSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: hp(1.5),
  },
  paymentButton: {
    backgroundColor: '#10B981', // teal
    paddingVertical: hp(1.5),
    borderRadius: 12,
    marginBottom: hp(1),
  },
  paymentButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
