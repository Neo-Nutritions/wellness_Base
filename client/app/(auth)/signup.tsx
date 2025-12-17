import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
type InputProps = {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  autoCapitalize?: "none" | "words";
};

const FormInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  returnKeyType = "next",
  onSubmitEditing,
  autoCapitalize = "none",
}: InputProps) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#000"
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    secureTextEntry={secureTextEntry}
    returnKeyType={returnKeyType}
    autoCapitalize={autoCapitalize}
    autoCorrect={false}
    onSubmitEditing={onSubmitEditing}
  />
);

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const router = useRouter();

  const updateField = (key: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSignup = () => {};

  const handleGoogleSignIn = () => {};

  const handleSignInPress = () => {
    router.replace("/(auth)/signin");
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/logo.jpg")}
            style={styles.logoImage}
            contentFit="contain"
          />

          <Text style={styles.title}>Register</Text>

          <FormInput
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(v) => updateField("fullName", v)}
            autoCapitalize="words"
          />

          <FormInput
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(v) => updateField("email", v)}
            keyboardType="email-address"
          />

          <FormInput
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(v) => updateField("phoneNumber", v)}
            keyboardType="phone-pad"
          />

          <FormInput
            placeholder="Password"
            value={formData.password}
            onChangeText={(v) => updateField("password", v)}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <Pressable
            onPress={handleSignup}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>

          <Text style={styles.subtitle}>or</Text>

          <Pressable onPress={handleGoogleSignIn} hitSlop={10}>
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.googleImage}
              contentFit="contain"
            />
          </Pressable>

          <Text style={styles.accountText}>
            Already have an account?
            <Text style={styles.signInLink} onPress={handleSignInPress}>
              {" "}
              Sign In
            </Text>
          </Text>

          <Text style={styles.termsText}>
            By signing up, you agree to our{" "}
            <Text
              style={styles.link}
              onPress={() => openLink("https://example.com/terms")}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={styles.link}
              onPress={() => openLink("https://example.com/privacy")}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  logoImage: {
    width: "40%",
    aspectRatio: 16 / 9,
  },

  title: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 24,
    paddingTop: 10,
  },

  subtitle: {
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    color: "#555",
  },

  input: {
    width: "100%",
    borderBottomWidth: 0.3,
    borderBottomColor: "#999",
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    color: "#000",
    paddingVertical: 8,
  },

  button: {
    marginTop: 12,
    backgroundColor: "#D1F4E8",
    paddingVertical: 12,
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
    color: "#00B386",
  },

  googleImage: {
    width: 40,
    height: 40,
  },

  accountText: {
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    color: "#555",
  },

  signInLink: {
    fontFamily: "PoppinsSemiBold",
    color: "#00B386",
  },

  termsText: {
    fontFamily: "PoppinsRegular",
    fontSize: 10,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  link: {
    color: "#00B386",
    fontFamily: "PoppinsSemiBold",
  },
});
