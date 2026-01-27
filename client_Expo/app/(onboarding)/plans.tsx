import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { getCurrentUser } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPlans, Plan } from '@/store/slices/plansSlice';
import { AppState } from 'react-native';
import { useRouter } from 'expo-router';

export default function Plans() {
  const [user, setUser] = useState<any>(null);
  const [greeting, setGreeting] = useState<string>('');
  const dispatch = useAppDispatch();
  const { plans, loading, error } = useAppSelector((state) => state.plans);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser(await getCurrentUser());
      } catch (error) {
        throw error;
      }
    };
    fetchUser();
  }, []);

  const getGreetingByTime = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  useEffect(() => {
    setGreeting(getGreetingByTime());
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') setGreeting(getGreetingByTime());
    });
    return () => subscription.remove();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-emerald-50">
        <Text className="text-gray-600">Loading plans...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-emerald-50">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-emerald-50"
      style={{ paddingHorizontal: hp(1), paddingTop: hp(1), backgroundColor: '#D1F4E8' }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{ height: hp(20), padding: hp(2) }}
        className="mt-10 flex-row items-center rounded-2xl bg-teal-500"
      >
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-white">
            {greeting} {user?.full_name}!
          </Text>
          <Text className="mt-1 text-xs text-emerald-100">
            Choose a subscription plan that fits your nutrition goals.
          </Text>
          <TouchableOpacity className="mt-4 self-start rounded-lg bg-lime-300 px-4 py-2">
            <Text className="text-sm font-semibold text-teal-800">Explore</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={{ height: hp(15), width: hp(15) }}
          contentFit="contain"
          source={require('../../assets/images/Subscriber-pana.png')}
        />
      </View>

      <View className="mt-6 flex-row flex-wrap justify-between">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </View>

      <TouchableOpacity
        style={{ height: hp(7) }}
        className="mb-8 mt-4 items-center justify-center rounded-full bg-emerald-500"
      >
        <Text className="text-base font-bold text-white">Go Basic</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // --- PlanCard as inner component ---
  function PlanCard({ plan }: { plan: Plan }) {
    const key = plan.slug?.split('-')[0];

    const colorMap: Record<string, string> = {
      bronze: 'bg-emerald-300',
      platinum: 'bg-blue-400',
      diamond: 'bg-purple-400',
      gold: 'bg-yellow-400',
    };

    const iconMap: Record<string, any> = {
      bronze: 'stats-chart',
      platinum: 'diamond',
      diamond: 'diamond-outline',
      gold: 'trophy',
    };

    const bgColor = colorMap[key] || 'bg-emerald-300';
    const icon = iconMap[key] || 'stats-chart';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push({ pathname: '/[id]', params: { id: plan.id } })}
        style={{ width: wp(44), height: hp(28) }}
        className={`${bgColor} mb-4 rounded-2xl p-4`}
      >
        <Ionicons name={icon} size={28} color="white" />
        <Text className="mt-2 text-base font-bold text-white">{plan.name}</Text>
        <Text className="mt-1 text-lg font-bold text-white">
          {plan.currency} {plan.price}
        </Text>
        <Text className="mb-2 text-xs capitalize text-white">{plan.billing_period}</Text>
        <View className="flex-1">
          {Object.values(plan.features)
            .slice(0, 5)
            .map((feature) => (
              <Text key={feature} className="text-xs text-white">
                ◇ {feature.replace(/_/g, ' ')}
              </Text>
            ))}
        </View>
        <View className="mt-2 rounded-full bg-white/30 py-2">
          <Text className="text-center text-sm font-semibold text-white">Choose plan</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
