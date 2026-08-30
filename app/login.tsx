import { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { SHADOWS } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) { setError('Please enter both email and password'); return; }
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) { router.replace('/onboarding/tenant-place-selection'); } else { setError(result.error || 'Login failed'); }
  };

  const fillDemo = () => { setEmail('tenant@example.com'); setPassword('password123'); setError(''); };

  return (
    <LinearGradient colors={['#134E4A', '#1E6B5A', '#0F766E', '#115E59']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <View style={styles.bgOrb1} />
      <View style={styles.bgOrb2} />
      <View style={styles.bgOrb3} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(700)} style={styles.logoSection}>
            <View style={styles.logoGlow}>
              <View style={styles.logoCircle}>
                <Shield size={38} color="#FFFFFF" />
              </View>
            </View>
            <Text style={[styles.logoTitle, { fontFamily: 'Inter-ExtraBold' }]}>Rent Resolve</Text>
            <Text style={[styles.logoSubtitle, { fontFamily: 'Inter-Regular' }]}>Smart rental issue management</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={[styles.formCard, { backgroundColor: colors.surface }, SHADOWS.prominent]}>
            <Text style={[styles.formTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Welcome back</Text>
            <Text style={[styles.formSubtitle, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>Sign in to your tenant portal</Text>

            {error ? (
              <Animated.View entering={FadeInDown.duration(300)} style={[styles.errorBanner, { backgroundColor: colors.dangerLight }]}>
                <Text style={[styles.errorText, { color: colors.danger, fontFamily: 'Inter-Medium' }]}>{error}</Text>
              </Animated.View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Email</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <View style={[styles.inputIconWrap, { backgroundColor: colors.primaryGlow }]}><Mail size={16} color={colors.primary} /></View>
                <TextInput style={[styles.input, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]} value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Password</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <View style={[styles.inputIconWrap, { backgroundColor: colors.primaryGlow }]}><Lock size={16} color={colors.primary} /></View>
                <TextInput style={[styles.input, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]} value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor={colors.textMuted} secureTextEntry={!showPassword} autoCapitalize="none" />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8} style={styles.eyeButton}>
                  {showPassword ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
                </Pressable>
              </View>
            </View>

            <Pressable onPress={handleLogin} disabled={loading} style={({ pressed }) => [{ opacity: loading ? 0.7 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
              <LinearGradient colors={['#1E6B5A', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.signInButton}>
                {loading ? (
                  <Text style={[styles.signInText, { fontFamily: 'Inter-SemiBold' }]}>Signing in...</Text>
                ) : (
                  <>
                    <Text style={[styles.signInText, { fontFamily: 'Inter-SemiBold' }]}>Sign In</Text>
                    <ArrowRight size={18} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable onPress={fillDemo} style={styles.demoLink}>
              <Text style={[styles.demoText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>Use demo credentials</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(500)}>
            <Text style={[styles.hintText, { fontFamily: 'Inter-Regular' }]}>tenant@example.com / password123</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgOrb1: { position: 'absolute', top: '8%', right: '-10%', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)' },
  bgOrb2: { position: 'absolute', bottom: '15%', left: '-15%', width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(255,255,255,0.03)' },
  bgOrb3: { position: 'absolute', top: '40%', left: '60%', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.02)' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  logoSection: { alignItems: 'center', marginBottom: 36 },
  logoGlow: { width: 88, height: 88, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  logoCircle: { width: 72, height: 72, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  logoTitle: { fontSize: 30, color: '#FFFFFF', letterSpacing: -0.8 },
  logoSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  formCard: { borderRadius: 28, padding: 28 },
  formTitle: { fontSize: 24, letterSpacing: -0.3 },
  formSubtitle: { fontSize: 14, marginTop: 4, marginBottom: 28 },
  errorBanner: { borderRadius: 14, padding: 14, marginBottom: 16 },
  errorText: { fontSize: 13 },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { fontSize: 13, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, paddingHorizontal: 4, paddingVertical: 4, gap: 0 },
  inputIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 15, paddingHorizontal: 10, paddingVertical: 10 },
  eyeButton: { paddingHorizontal: 12 },
  signInButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, paddingVertical: 17, marginTop: 8 },
  signInText: { color: '#FFFFFF', fontSize: 16 },
  demoLink: { alignItems: 'center', marginTop: 18, paddingVertical: 8 },
  demoText: { fontSize: 14 },
  hintText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 24 },
});
