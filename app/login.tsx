import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, colors } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      router.replace('/onboarding/tenant-place-selection');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const fillDemo = () => {
    setEmail('tenant@example.com');
    setPassword('password123');
    setError('');
  };

  return (
    <LinearGradient
      colors={
        isDark
          ? ['#031A16', '#022C22', '#042F2E', '#020617']
          : ['#134E4A', '#1E6B5A', '#0F766E', '#115E59']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Ambient Lighting Orbs */}
      <View
        style={{
          position: 'absolute',
          top: '6%',
          right: -48,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: isDark ? 'rgba(45, 212, 191, 0.05)' : 'rgba(255, 255, 255, 0.06)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: '15%',
          left: -60,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.04)',
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 48,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <Animated.View
            entering={FadeInDown.duration(700)}
            style={{ alignItems: 'center', marginBottom: 32 }}
          >
            <View
              style={{
                width: 82,
                height: 82,
                borderRadius: 28,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.25)',
                }}
              >
                <Shield size={38} color="#FFFFFF" strokeWidth={2.2} />
              </View>
            </View>

            <Text
              style={{
                fontSize: 30,
                color: '#FFFFFF',
                fontFamily: 'Inter-Bold',
                letterSpacing: -0.8,
                textAlign: 'center',
              }}
            >
              Rent Resolve
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              Smart rental issue management & tenant portal
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            className="overflow-hidden rounded-[28px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8"
            style={{
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
              borderWidth: 1,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isDark ? 0.4 : 0.12,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <Text
              className="text-[22px] tracking-[-0.3px] text-slate-900 dark:text-white"
              style={{
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontFamily: 'Inter-Bold',
              }}
            >
              Welcome back
            </Text>
            <Text
              className="text-[13.5px] text-slate-500 dark:text-slate-400 mt-1 mb-6"
              style={{
                color: isDark ? '#94A3B8' : '#64748B',
                fontFamily: 'Inter-Regular',
              }}
            >
              Sign in to manage requests, rent, and messages
            </Text>

            {error ? (
              <Animated.View
                entering={FadeInDown.duration(300)}
                className="mb-4 rounded-[14px] border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5"
                style={{
                  backgroundColor: isDark ? 'rgba(159, 18, 57, 0.25)' : '#FFF1F2',
                  borderColor: isDark ? 'rgba(244, 63, 94, 0.3)' : '#FECDD3',
                }}
              >
                <Text
                  className="text-[13px] text-rose-600 dark:text-rose-400"
                  style={{
                    color: isDark ? '#FB7185' : '#E11D48',
                    fontFamily: 'Inter-Medium',
                  }}
                >
                  {error}
                </Text>
              </Animated.View>
            ) : null}

            {/* Email Field */}
            <View className="mb-4">
              <Text
                className="text-[12.5px] text-slate-700 dark:text-slate-300 mb-2"
                style={{
                  color: isDark ? '#CBD5E1' : '#334155',
                  fontFamily: 'Inter-SemiBold',
                }}
              >
                Email Address
              </Text>
              <View
                className="flex-row items-center rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-1.5"
                style={{
                  backgroundColor: isDark ? '#020617' : '#F8FAFC',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                  borderWidth: 1,
                }}
              >
                <View
                  className="h-9 w-9 items-center justify-center rounded-[12px]"
                  style={{
                    backgroundColor: isDark ? 'rgba(13, 148, 136, 0.2)' : '#CCFBF1',
                  }}
                >
                  <Mail size={16} color={isDark ? '#2DD4BF' : '#0D9488'} />
                </View>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 px-3 py-2 text-[14.5px]"
                  style={{
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontFamily: 'Inter-Regular',
                  }}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text
                className="text-[12.5px] text-slate-700 dark:text-slate-300 mb-2"
                style={{
                  color: isDark ? '#CBD5E1' : '#334155',
                  fontFamily: 'Inter-SemiBold',
                }}
              >
                Password
              </Text>
              <View
                className="flex-row items-center rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-1.5"
                style={{
                  backgroundColor: isDark ? '#020617' : '#F8FAFC',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                  borderWidth: 1,
                }}
              >
                <View
                  className="h-9 w-9 items-center justify-center rounded-[12px]"
                  style={{
                    backgroundColor: isDark ? 'rgba(13, 148, 136, 0.2)' : '#CCFBF1',
                  }}
                >
                  <Lock size={16} color={isDark ? '#2DD4BF' : '#0D9488'} />
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="flex-1 px-3 py-2 text-[14.5px]"
                  style={{
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontFamily: 'Inter-Regular',
                  }}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                  className="p-2.5"
                >
                  {showPassword ? (
                    <EyeOff size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                  ) : (
                    <Eye size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Sign In CTA */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => ({
                borderRadius: 16,
                overflow: 'hidden',
                marginTop: 6,
                opacity: loading ? 0.7 : pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
                shadowColor: '#0D9488',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.35 : 0.2,
                shadowRadius: 10,
                elevation: 4,
              })}
            >
              <LinearGradient
                colors={['#0F766E', '#0D9488', '#14B8A6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 52,
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontFamily: 'Inter-Bold',
                        letterSpacing: 0.2,
                      }}
                    >
                      Sign In
                    </Text>
                    <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Demo Credentials Chip */}
            <Pressable
              onPress={fillDemo}
              className="mt-5 flex-row items-center justify-center gap-1.5 py-2 rounded-xl"
              style={{
                backgroundColor: isDark ? 'rgba(13, 148, 136, 0.15)' : '#F0FDFA',
                borderColor: isDark ? 'rgba(45, 212, 191, 0.3)' : '#99F6E4',
                borderWidth: 1,
              }}
            >
              <Sparkles size={14} color={isDark ? '#2DD4BF' : '#0D9488'} />
              <Text
                className="text-[13px]"
                style={{
                  color: isDark ? '#5EEAD4' : '#0F766E',
                  fontFamily: 'Inter-SemiBold',
                }}
              >
                Auto-fill demo credentials
              </Text>
            </Pressable>
          </Animated.View>

          {/* Bottom Help Text */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(500)}
            className="mt-6"
          >
            <Text
              className="text-[12px] text-center"
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontFamily: 'Inter-Regular',
              }}
            >
              Demo: tenant@example.com / password123
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
