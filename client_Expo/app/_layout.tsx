import '../global.css';
import { useAuth, AuthContextProvider } from '../context/authContext';
import { useSegments, Slot, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
const Layout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (typeof isAuthenticated == 'undefined') return;
    const inApp = segments[0] =='(app)';
    if (isAuthenticated && !inApp) {
      router.replace('home');
    } else if (isAuthenticated == false) {
      router.replace('signin');
    }
  }, [isAuthenticated]);
  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Layout />
    </AuthContextProvider>
  );
}
