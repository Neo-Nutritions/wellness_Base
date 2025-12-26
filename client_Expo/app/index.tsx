import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/authContext';
export default function Index() {
  const { user } = useAuth();
  const [fontsLoaded] = useFonts({
    PoppinsRegular: Poppins_400Regular,
    PoppinsSemiBold: Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }
  const router = useRouter();
  const handleGetStarted = async () => {
    if (user) {
      router.push('/home');
    } else {
      router.push('/signin');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.logoImage}
        contentFit="contain"
      />

      <Image
        source={require('../assets/images/splash_image.png')}
        style={styles.squareImage}
        contentFit="cover"
      />

      <Text style={styles.title}>Your nutrition wellness journey starts here!</Text>

      <Text style={styles.subtitle}>
        Experience a refined approach to wellness crafted to help you thrive.
      </Text>
      <Pressable
        onPress={handleGetStarted}
        style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] }]}
        className="mt-2 rounded-full bg-green-700 px-16 py-2.5">
        <Text className="font-poppins-semibold text-base text-white">Get Started</Text>
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },

  logoImage: {
    width: '50%',
    aspectRatio: 16 / 9,
  },

  squareImage: {
    width: '80%',
    aspectRatio: 1,
  },

  title: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 26,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  subtitle: {
    fontFamily: 'PoppinsRegular',
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    paddingHorizontal: 20,
  },

  button: {
    marginTop: 10,
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 30,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
