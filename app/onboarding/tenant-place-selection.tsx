import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  MapPin, Search, Ticket, ChevronRight, User, Mail, Phone, ShieldCheck,
  X, ArrowRight, CheckCircle2, Sparkles, Building2, Zap, Compass, Lock,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mockInvitationCodes, SelectedProperty } from '@/data/mockData';

export default function TenantPlaceSelectionScreen() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteError, setInviteError] = useState('');

  const handleInviteSubmit = () => {
    const code = inviteCode.trim().toUpperCase();
    const match = mockInvitationCodes[code];
    if (match) {
      const selected: SelectedProperty = {
        id: match.id,
        name: match.name,
        address: match.address,
        selectedUnit: match.selectedUnit,
        landlordName: match.landlordName,
        propertyManagerName: match.propertyManagerName,
        verificationMethod: match.verificationMethod,
        approvalStatus: match.approvalStatus,
        monthlyRent: match.monthlyRent,
        securityDeposit: match.securityDeposit,
      };
      setInviteModalVisible(false);
      setInviteCode('');
      setInviteError('');
      router.replace({ pathname: '/onboarding/property-confirmation', params: { source: 'invitation' } });
      (globalThis as any).__pendingProperty = selected;
    } else {
      setInviteError('Invalid invitation code. Please check and try again.');
    }
  };

  const options = [
    {
      icon: MapPin,
      badgeIcon: Compass,
      title: 'Use Live Location',
      desc: 'Detect nearby rental properties using your current GPS coordinates',
      color: '#0284C7',
      bg: isDark ? '#082F49' : '#F0F9FF',
      border: isDark ? '#0369A1' : '#BAE6FD',
      tag: 'FASTEST',
      tagBg: isDark ? '#0C4A6E' : '#E0F2FE',
      tagColor: isDark ? '#38BDF8' : '#0369A1',
      onPress: () => router.push('/onboarding/location-based'),
    },
    {
      icon: Search,
      badgeIcon: Zap,
      title: 'Search Property Manually',
      desc: 'Look up by building name, street address, landlord, or flat number',
      color: '#0D9488',
      bg: isDark ? '#042F2E' : '#F0FDFA',
      border: isDark ? '#0F766E' : '#99F6E4',
      tag: 'SEARCH',
      tagBg: isDark ? '#115E59' : '#CCFBF1',
      tagColor: isDark ? '#2DD4BF' : '#0F766E',
      onPress: () => router.push('/onboarding/property-search'),
    },
    {
      icon: Ticket,
      badgeIcon: Lock,
      title: 'Enter Invitation Code',
      desc: 'Enter an invite token provided by your landlord or housing manager',
      color: '#7C3AED',
      bg: isDark ? '#2E1065' : '#FAF5FF',
      border: isDark ? '#6D28D9' : '#DDD6FE',
      tag: 'INSTANT LINK',
      tagBg: isDark ? '#4C1D95' : '#EDE9FE',
      tagColor: isDark ? '#A78BFA' : '#6D28D9',
      onPress: () => { setInviteError(''); setInviteModalVisible(true); },
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 40,
        }}
      >
        {/* Top Hero Gradient with Safe Island Clearance */}
        <LinearGradient
          colors={['#041D1A', '#08332D', '#0D9488']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="relative overflow-hidden rounded-b-[36px] px-6 pb-9"
          style={{
            paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 56 : 32) + 16,
          }}
        >
          {/* Ambient Lighting Orbs */}
          <View className="absolute -top-[50px] -right-[40px] h-[220px] w-[220px] rounded-full bg-teal-300/10 blur-3xl" />
          <View className="absolute top-[20%] -left-[40px] h-[150px] w-[150px] rounded-full bg-emerald-400/10 blur-2xl" />

          <Animated.View entering={FadeInDown.duration(600)} className="items-center">
            {/* Step Counter Badge */}
            <View className="mb-4 flex-row items-center gap-1.5 rounded-full border border-teal-300/30 bg-white/10 px-3.5 py-1.5 shadow-sm">
              <Sparkles size={12} color="#5EEAD4" />
              <Text className="text-[11.5px] tracking-[0.3px] text-teal-100" style={{ fontFamily: 'Inter-SemiBold' }}>
                Step 1 of 3 • Onboarding
              </Text>
            </View>

            {/* Glowing Icon Frame */}
            <View className="relative mb-4 items-center justify-center">
              <View className="absolute -inset-1.5 rounded-[24px] bg-teal-300/30 blur-lg" />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.12)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-[64px] w-[64px] items-center justify-center rounded-[22px] border border-white/40 shadow-md"
              >
                <Building2 size={30} color="#FFFFFF" strokeWidth={2.3} />
              </LinearGradient>
            </View>

            {/* Main Hero Typography */}
            <Text
              className="text-center text-[24px] tracking-[-0.5px] text-white"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              Connect Your Rental Place
            </Text>

            <Text
              className="mt-2.5 mb-3 max-w-[320px] text-center text-[13px] leading-[20px] text-teal-50/85"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              Choose how to locate and bind your tenancy profile so your landlord can verify and approve you.
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Main Content Area */}
        <View className="px-[18px] pt-6">
          {/* Tenant Profile Card */}
          <Animated.View
            entering={FadeInUp.delay(120).duration(500)}
            className="mb-6 overflow-hidden rounded-[22px] border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: isDark ? 0.3 : 0.04,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            {/* Header / Avatar Row */}
            <View className="flex-row items-center p-4">
              <View
                className="mr-3.5 h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px]"
                style={{ backgroundColor: colors.primaryGlow }}
              >
                <User size={22} color={colors.primary} strokeWidth={2.2} />
              </View>

              <View className="min-w-0 flex-1 justify-center pr-2">
                <Text
                  numberOfLines={1}
                  className="text-[16.5px] tracking-[-0.2px]"
                  style={{
                    color: colors.textPrimary,
                    fontFamily: 'Inter-Bold',
                  }}
                >
                  {user?.name || 'Aarav Sharma'}
                </Text>
                <Text
                  className="mt-0.5 text-[12px]"
                  style={{
                    color: colors.textMuted,
                    fontFamily: 'Inter-Medium',
                  }}
                >
                  Tenant Account
                </Text>
              </View>

              <View
                className="shrink-0 flex-row items-center gap-1 rounded-full px-2.5 py-1 border"
                style={{
                  backgroundColor: isDark ? 'rgba(20, 184, 166, 0.15)' : '#F0FDFA',
                  borderColor: isDark ? 'rgba(20, 184, 166, 0.3)' : '#CCFBF1',
                }}
              >
                <ShieldCheck size={12} color={colors.primary} strokeWidth={2.4} />
                <Text
                  className="text-[10.5px]"
                  style={{
                    color: colors.primary,
                    fontFamily: 'Inter-Bold',
                  }}
                >
                  Verified
                </Text>
              </View>
            </View>

            {/* Subtle Divider */}
            <View className="mx-4 h-[1px]" style={{ backgroundColor: colors.borderLight }} />

            {/* Email & Phone Rows */}
            <View className="px-4 py-3 gap-2.5">
              <DetailRow
                icon={<Mail size={13} color={colors.primary} />}
                label="Email"
                value={user?.email || 'tenant@example.com'}
                colors={colors}
                isDark={isDark}
              />
              <DetailRow
                icon={<Phone size={13} color={colors.primary} />}
                label="Phone"
                value={user?.phone || '+91 98765 43210'}
                colors={colors}
                isDark={isDark}
              />
            </View>
          </Animated.View>

          {/* Section Header */}
          <View className="mb-3.5 flex-row items-center justify-between px-1">
            <View className="flex-row items-center gap-1.5">
              <View className="h-2 w-2 rounded-full bg-teal-500" />
              <Text
                className="text-[11.5px] tracking-[0.9px]"
                style={{
                  color: colors.textMuted,
                  fontFamily: 'Inter-Bold',
                }}
              >
                CONNECT VIA METHOD
              </Text>
            </View>
            <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: colors.surfaceSecondary }}>
              <Text
                className="text-[11px]"
                style={{
                  color: colors.textSecondary,
                  fontFamily: 'Inter-Medium',
                }}
              >
                3 Available
              </Text>
            </View>
          </View>

          {/* Premium Method Cards */}
          <View className="w-full">
            {options.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <Animated.View
                  key={opt.title}
                  entering={FadeInUp.delay(180 + i * 80).duration(400)}
                  className="mb-3.5"
                >
                  <Pressable
                    onPress={opt.onPress}
                    className="min-h-[92px] w-full flex-row items-center rounded-[20px] border px-4 py-3.5"
                    style={({ pressed }) => ({
                      backgroundColor: colors.surface,
                      borderColor: pressed ? opt.color : colors.border,
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.985 : 1 }],
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.25 : 0.04,
                      shadowRadius: 8,
                      elevation: 2,
                    })}
                  >
                    {/* Left Icon with Dual Layer Border */}
                    <View
                      className="mr-3.5 h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[15px] border"
                      style={{
                        backgroundColor: opt.bg,
                        borderColor: opt.border,
                      }}
                    >
                      <Icon size={23} color={opt.color} strokeWidth={2.2} />
                    </View>

                    {/* Middle Content */}
                    <View className="mr-2.5 min-w-0 flex-1 justify-center">
                      <View className="mb-1 flex-row flex-wrap items-center gap-1.5">
                        <Text
                          className="shrink text-[15.5px]"
                          style={{
                            color: colors.textPrimary,
                            fontFamily: 'Inter-Bold',
                          }}
                        >
                          {opt.title}
                        </Text>

                        {opt.tag ? (
                          <View
                            className="shrink-0 rounded-md px-1.5 py-0.5"
                            style={{ backgroundColor: opt.tagBg }}
                          >
                            <Text
                              className="text-[9.5px] tracking-[0.4px]"
                              style={{
                                color: opt.tagColor,
                                fontFamily: 'Inter-Bold',
                              }}
                            >
                              {opt.tag}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text
                        className="shrink text-[12.5px] leading-[17px]"
                        style={{
                          color: colors.textSecondary,
                          fontFamily: 'Inter-Regular',
                        }}
                      >
                        {opt.desc}
                      </Text>
                    </View>

                    {/* Right Chevron Button */}
                    <View
                      className="h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[10px]"
                      style={{ backgroundColor: colors.surfaceSecondary }}
                    >
                      <ChevronRight
                        size={17}
                        color={colors.textSecondary}
                        strokeWidth={2.2}
                      />
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* Invitation Code Modal */}
      <Modal visible={inviteModalVisible} animationType="slide" transparent onRequestClose={() => setInviteModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <Pressable className="absolute inset-0 bg-black/60" onPress={() => setInviteModalVisible(false)} />
          <View
            className="rounded-t-[32px] px-6 pt-3.5"
            style={{
              backgroundColor: colors.surface,
              paddingBottom: Math.max(insets.bottom, 20) + 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View className="mb-4 h-1.5 w-10 self-center rounded-full bg-slate-300 dark:bg-slate-700" />
            
            <View className="mb-3.5 flex-row items-center justify-between">
              <View className="h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-purple-500/15 border border-purple-500/25">
                <Ticket size={26} color="#8B5CF6" strokeWidth={2.2} />
              </View>
              <Pressable
                className="h-8.5 w-8.5 items-center justify-center rounded-full bg-black/5 dark:bg-white/10"
                onPress={() => setInviteModalVisible(false)}
                hitSlop={10}
              >
                <X size={18} color={colors.textMuted} />
              </Pressable>
            </View>

            <Text className="text-[20px] tracking-[-0.3px]" style={{ color: colors.textPrimary, fontFamily: 'Inter-Bold' }}>
              Enter Invitation Code
            </Text>
            <Text className="mt-1.5 mb-5 text-[13.5px] leading-[20px]" style={{ color: colors.textSecondary, fontFamily: 'Inter-Regular' }}>
              Enter the unique 8-character token sent by your landlord or building property manager.
            </Text>

            <View
              className="flex-row items-center rounded-[16px] border-[1.5px] px-4 py-1"
              style={{
                backgroundColor: colors.inputBg,
                borderColor: inviteError ? colors.danger : colors.inputBorder,
              }}
            >
              <TextInput
                className="flex-1 py-3 text-base tracking-[2px]"
                style={{ color: colors.textPrimary, fontFamily: 'Inter-Bold' }}
                value={inviteCode}
                onChangeText={(t) => { setInviteCode(t); setInviteError(''); }}
                placeholder="e.g. RR-GREEN-3B"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
            {inviteError ? (
              <Text className="mt-2 text-[12.5px]" style={{ color: colors.danger, fontFamily: 'Inter-Medium' }}>
                {inviteError}
              </Text>
            ) : null}

            <Pressable
              onPress={handleInviteSubmit}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] }]}
            >
              <LinearGradient
                colors={['#0D9488', '#0F766E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="mt-5 flex-row items-center justify-center gap-2 rounded-[16px] py-[15px] shadow-sm"
              >
                <Text className="text-[15.5px] text-white" style={{ fontFamily: 'Inter-SemiBold' }}>
                  Verify & Continue
                </Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </LinearGradient>
            </Pressable>

            <View
              className="mt-4 flex-row items-center gap-2 rounded-xl border p-3"
              style={{ backgroundColor: colors.surfaceSecondary, borderColor: colors.borderLight }}
            >
              <CheckCircle2 size={15} color={colors.primary} />
              <Text className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'Inter-Regular' }}>
                Demo code: <Text style={{ fontFamily: 'Inter-Bold', color: colors.textPrimary }}>RR-GREEN-3B</Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function DetailRow({ icon, label, value, colors, isDark }: { icon: React.ReactNode; label: string; value: string; colors: any; isDark: boolean }) {
  return (
    <View className="flex-row items-center">
      <View
        className="mr-3 h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px]"
        style={{ backgroundColor: isDark ? 'rgba(20, 184, 166, 0.12)' : '#F0FDFA' }}
      >
        {icon}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[11px] leading-[13px]" style={{ color: colors.textMuted, fontFamily: 'Inter-Medium' }}>
          {label}
        </Text>
        <Text
          className="mt-0.5 text-[13.5px] leading-[17px]"
          style={{ color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}




