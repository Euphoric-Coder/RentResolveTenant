import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  MapPin,
  Search,
  Ticket,
  ChevronRight,
  User,
  Mail,
  Phone,
  ShieldCheck,
  X,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2,
  Zap,
  Compass,
  Lock,
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
      router.replace({
        pathname: '/onboarding/property-confirmation',
        params: { source: 'invitation' },
      });
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
      bgClass: 'bg-sky-50 dark:bg-sky-950/80',
      borderClass: 'border-sky-200 dark:border-sky-800/80',
      tag: 'FASTEST',
      tagBgClass: 'bg-sky-100 dark:bg-sky-900/60',
      tagTextClass: 'text-sky-700 dark:text-sky-300',
      onPress: () => router.push('/onboarding/location-based'),
    },
    {
      icon: Search,
      badgeIcon: Zap,
      title: 'Search Property Manually',
      desc: 'Look up by building name, street address, landlord, or flat number',
      color: '#0D9488',
      bgClass: 'bg-teal-50 dark:bg-teal-950/80',
      borderClass: 'border-teal-200 dark:border-teal-800/80',
      tag: 'SEARCH',
      tagBgClass: 'bg-teal-100 dark:bg-teal-900/60',
      tagTextClass: 'text-teal-700 dark:text-teal-300',
      onPress: () => router.push('/onboarding/property-search'),
    },
    {
      icon: Ticket,
      badgeIcon: Lock,
      title: 'Enter Invitation Code',
      desc: 'Enter an invite token provided by your landlord or housing manager',
      color: '#7C3AED',
      bgClass: 'bg-purple-50 dark:bg-purple-950/80',
      borderClass: 'border-purple-200 dark:border-purple-800/80',
      tag: 'INSTANT LINK',
      tagBgClass: 'bg-purple-100 dark:bg-purple-900/60',
      tagTextClass: 'text-purple-700 dark:text-purple-300',
      onPress: () => {
        setInviteError('');
        setInviteModalVisible(true);
      },
    },
  ];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 40,
        }}
      >
        {/* Top Hero Gradient with Safe Island Clearance */}
        <LinearGradient
          colors={
            isDark
              ? ['#021F1C', '#042F2A', '#0F766E']
              : ['#041D1A', '#08332D', '#0D9488']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="relative overflow-hidden rounded-b-[36px] px-6 pb-9"
          style={{
            paddingTop:
              Math.max(insets.top, Platform.OS === 'ios' ? 56 : 32) + 16,
          }}
        >
          {/* Ambient Lighting Orbs */}
          <View className="absolute -top-[50px] -right-[40px] h-[220px] w-[220px] rounded-full bg-teal-300/10 blur-3xl" />
          <View className="absolute top-[20%] -left-[40px] h-[150px] w-[150px] rounded-full bg-emerald-400/10 blur-2xl" />

          <Animated.View
            entering={FadeInDown.duration(600)}
            className="items-center"
          >
            {/* Step Counter Badge */}
            <View className="mb-4 flex-row items-center gap-1.5 rounded-full border border-teal-300/30 bg-white/10 px-3.5 py-1.5 shadow-sm">
              <Sparkles size={12} color="#5EEAD4" />
              <Text
                className="text-[11.5px] tracking-[0.3px] text-teal-100"
                style={{ fontFamily: 'Inter-SemiBold' }}
              >
                Step 1 of 3 • Onboarding
              </Text>
            </View>

            {/* Glowing Icon Frame */}
            <View className="relative mb-4 items-center justify-center">
              <View className="absolute -inset-1.5 rounded-[24px] bg-teal-300/30 blur-lg" />
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.28)',
                  'rgba(255, 255, 255, 0.12)',
                ]}
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
              Choose how to locate and bind your tenancy profile so your
              landlord can verify and approve you.
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Main Content Area */}
        <View className="px-[18px] pt-6">
          {/* Tenant Profile Card */}
          <Animated.View
            entering={FadeInUp.delay(120).duration(500)}
            className="mb-6 overflow-hidden rounded-[22px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          >
            {/* Header / Avatar Row */}
            <View className="flex-row items-center p-4">
              <View className="mr-3.5 h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800">
                <User
                  size={22}
                  color={isDark ? '#2DD4BF' : '#0D9488'}
                  strokeWidth={2.2}
                />
              </View>

              <View className="min-w-0 flex-1 justify-center pr-2">
                <Text
                  numberOfLines={1}
                  className="text-[16.5px] tracking-[-0.2px] text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  {user?.name || 'Aarav Sharma'}
                </Text>
                <Text
                  className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400"
                  style={{ fontFamily: 'Inter-Medium' }}
                >
                  Tenant Account
                </Text>
              </View>

              <View className="shrink-0 flex-row items-center gap-1 rounded-full px-2.5 py-1 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60">
                <ShieldCheck
                  size={12}
                  color={isDark ? '#2DD4BF' : '#0D9488'}
                  strokeWidth={2.4}
                />
                <Text
                  className="text-[10.5px] text-teal-700 dark:text-teal-300"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  Verified
                </Text>
              </View>
            </View>

            {/* Subtle Divider */}
            <View className="mx-4 h-[1px] bg-slate-100 dark:bg-slate-800" />

            {/* Email & Phone Rows */}
            <View className="px-4 py-3 gap-2.5">
              <DetailRow
                icon={<Mail size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />}
                label="Email"
                value={user?.email || 'tenant@example.com'}
              />
              <DetailRow
                icon={
                  <Phone size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />
                }
                label="Phone"
                value={user?.phone || '+91 98765 43210'}
              />
            </View>
          </Animated.View>

          {/* Section Header */}
          <View className="mb-3.5 flex-row items-center justify-between px-1">
            <View className="flex-row items-center gap-1.5">
              <View className="h-2 w-2 rounded-full bg-teal-500" />
              <Text
                className="text-[11.5px] tracking-[0.9px] text-slate-500 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                CONNECT VIA METHOD
              </Text>
            </View>
            <View className="rounded-full px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800">
              <Text
                className="text-[11px] text-slate-600 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Medium' }}
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
                    className="min-h-[92px] w-full flex-row items-center rounded-[20px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 shadow-sm"
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.985 : 1 }],
                    })}
                  >
                    {/* Left Icon with Dual Layer Border */}
                    <View
                      className={`mr-3.5 h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[15px] border ${opt.bgClass} ${opt.borderClass}`}
                    >
                      <Icon size={23} color={opt.color} strokeWidth={2.2} />
                    </View>

                    {/* Middle Content */}
                    <View className="mr-2.5 min-w-0 flex-1 justify-center">
                      <View className="mb-1 flex-row flex-wrap items-center gap-1.5">
                        <Text
                          className="shrink text-[15.5px] text-slate-900 dark:text-white"
                          style={{ fontFamily: 'Inter-Bold' }}
                        >
                          {opt.title}
                        </Text>

                        {opt.tag ? (
                          <View
                            className={`shrink-0 rounded-md px-1.5 py-0.5 ${opt.tagBgClass}`}
                          >
                            <Text
                              className={`text-[9.5px] tracking-[0.4px] ${opt.tagTextClass}`}
                              style={{ fontFamily: 'Inter-Bold' }}
                            >
                              {opt.tag}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text
                        className="shrink text-[12.5px] leading-[17px] text-slate-500 dark:text-slate-400"
                        style={{ fontFamily: 'Inter-Regular' }}
                      >
                        {opt.desc}
                      </Text>
                    </View>

                    {/* Right Chevron Button */}
                    <View className="h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[10px] bg-slate-100 dark:bg-slate-800">
                      <ChevronRight
                        size={17}
                        color={isDark ? '#94A3B8' : '#64748B'}
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
      <Modal
        visible={inviteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end"
        >
          <Pressable
            className="absolute inset-0 bg-black/65"
            onPress={() => setInviteModalVisible(false)}
          />
          <View
            className="rounded-t-[34px] px-6 pt-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
            style={{
              paddingBottom: Math.max(insets.bottom, 20) + 16,
            }}
          >
            {/* Grabber Handle */}
            <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-slate-300 dark:bg-slate-700" />

            {/* Header Row: Icon + Close */}
            <View className="mb-3.5 flex-row items-center justify-between">
              <View className="relative">
                <View className="absolute -inset-1 rounded-[18px] bg-purple-500/20 blur-sm" />
                <View className="h-[50px] w-[50px] items-center justify-center rounded-[16px] border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/80">
                  <Ticket size={24} color="#8B5CF6" strokeWidth={2.2} />
                </View>
              </View>

              <Pressable
                className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                onPress={() => setInviteModalVisible(false)}
                hitSlop={10}
              >
                <X
                  size={17}
                  color={isDark ? '#94A3B8' : '#64748B'}
                  strokeWidth={2.4}
                />
              </Pressable>
            </View>

            {/* Typography Header */}
            <Text
              className="text-[21px] tracking-[-0.3px] text-slate-900 dark:text-white"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              Enter Invitation Code
            </Text>
            <Text
              className="mt-1 mb-5 text-[13px] leading-[19px] text-slate-500 dark:text-slate-400"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              Enter the unique 8-character token provided by your landlord or
              property manager.
            </Text>

            {/* Code Input Box */}
            <View
              className={`flex-row items-center rounded-[18px] border-[1.5px] px-4 py-1.5 shadow-sm ${
                inviteError
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                  : inviteCode
                    ? 'border-teal-500 bg-slate-50 dark:bg-slate-950'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60'
              }`}
            >
              <TextInput
                className="flex-1 py-3 text-[16px] tracking-[2px] text-slate-900 dark:text-white"
                style={{ fontFamily: 'Inter-Bold' }}
                value={inviteCode}
                onChangeText={(t) => {
                  setInviteCode(t);
                  setInviteError('');
                }}
                placeholder="e.g. RR-GREEN-3B"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {inviteCode ? (
                <Pressable
                  onPress={() => setInviteCode('')}
                  hitSlop={8}
                  className="h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800"
                >
                  <X
                    size={12}
                    color={isDark ? '#94A3B8' : '#64748B'}
                    strokeWidth={2.4}
                  />
                </Pressable>
              ) : null}
            </View>

            {inviteError ? (
              <Text
                className="mt-2 text-[12.5px] px-1 text-rose-600 dark:text-rose-400"
                style={{ fontFamily: 'Inter-Medium' }}
              >
                {inviteError}
              </Text>
            ) : null}

            {/* Primary Action Button */}
            <Pressable
              onPress={handleInviteSubmit}
              className="w-full mt-5 rounded-[16px] overflow-hidden"
              style={({ pressed }) => ({
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              })}
            >
              <LinearGradient
                colors={['#0F766E', '#0D9488']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: '100%',
                  height: 52,
                  justifyContent: 'center',
                }}
              >
                <View className="flex-1 flex-row items-center justify-center gap-2 px-4">
                  <Text
                    className="text-[15.5px] text-white"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    Verify & Connect
                  </Text>
                  <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.4} />
                </View>
              </LinearGradient>
            </Pressable>

            {/* Interactive Demo Chip */}
            <Pressable
              onPress={() => {
                setInviteCode('RR-GREEN-3B');
                setInviteError('');
              }}
              className="mt-4 flex-row items-center justify-between rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3"
            >
              <View className="flex-row items-center gap-2 min-w-0 flex-1">
                <CheckCircle2
                  size={16}
                  color={isDark ? '#2DD4BF' : '#0D9488'}
                />
                <Text
                  className="text-[12.5px] text-slate-600 dark:text-slate-400"
                  style={{ fontFamily: 'Inter-Regular' }}
                >
                  Demo Passcode:{' '}
                  <Text
                    className="text-slate-900 dark:text-white"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    RR-GREEN-3B
                  </Text>
                </Text>
              </View>
              <Text
                className="text-[11.5px] pl-2 text-teal-600 dark:text-teal-400"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                Auto-fill
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center">
      <View className="mr-3 h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px] bg-teal-50 dark:bg-teal-950/80">
        {icon}
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="text-[11px] leading-[13px] text-slate-400 dark:text-slate-500"
          style={{ fontFamily: 'Inter-Medium' }}
        >
          {label}
        </Text>
        <Text
          className="mt-0.5 text-[13.5px] leading-[17px] text-slate-900 dark:text-white"
          style={{ fontFamily: 'Inter-SemiBold' }}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
