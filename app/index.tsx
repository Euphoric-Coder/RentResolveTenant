import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { Shield } from 'lucide-react-native';

export default function SplashScreen() {
  const { isAuthenticated, isLoading, onboardingCompleted } = useAuth();

  if (isLoading) {
    return (
      <LinearGradient colors={['#134E4A', '#1E6B5A', '#0F766E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
        <View style={styles.bgOrb1} />
        <View style={styles.bgOrb2} />
        <Animated.View entering={FadeInDown.duration(800)} style={styles.logoWrap}>
          <View style={styles.glow}>
            <View style={styles.iconCircle}>
              <Shield size={38} color="#FFFFFF" />
            </View>
          </View>
          <Text style={[styles.title, { fontFamily: 'Inter-ExtraBold' }]}>Rent Resolve</Text>
          <Text style={[styles.subtitle, { fontFamily: 'Inter-Regular' }]}>Smart rental issue management</Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(600).duration(600)}>
          <ActivityIndicator size="large" color="rgba(255,255,255,0.6)" style={styles.spinner} />
        </Animated.View>
      </LinearGradient>
    );
  }

  if (!isAuthenticated) return <Redirect href="/login" />;
  if (!onboardingCompleted) return <Redirect href="/onboarding/tenant-place-selection" />;
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bgOrb1: { position: 'absolute', top: '10%', right: '-10%', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.04)' },
  bgOrb2: { position: 'absolute', bottom: '15%', left: '-10%', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.03)' },
  logoWrap: { alignItems: 'center' },
  glow: { width: 96, height: 96, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  iconCircle: { width: 76, height: 76, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  title: { fontSize: 34, color: '#FFFFFF', letterSpacing: -0.8 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 8 },
  spinner: { marginTop: 64 },
});
