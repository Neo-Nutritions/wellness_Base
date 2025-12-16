import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: Poppins_400Regular,
    PoppinsSemiBold: Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }
  const router = useRouter();
  const handleGetStarted = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/logo.jpg")}
        style={styles.logoImage}
        contentFit="contain"
      />

      <Image
        source={require("../../assets/images/splash_image.png")}
        style={styles.squareImage}
        contentFit="cover"
      />

      <Text style={styles.title}>
        Your nutrition wellness journey starts here!
      </Text>

      <Text style={styles.subtitle}>
        Experience a refined approach to wellness crafted to help you thrive.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  logoImage: {
    width: "40%",
    aspectRatio: 16 / 9,
  },

  squareImage: {
    width: "80%",
    aspectRatio: 1,
  },

  title: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 26,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  subtitle: {
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    paddingHorizontal: 20,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 30,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
