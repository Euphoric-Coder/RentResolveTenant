import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Clock,
  Send,
  Building2,
  User,
  Users,
  ArrowRight,
  RefreshCw,
  Info,
  Home,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { SelectedProperty } from '@/data/mockData';

const TIMELINE = [
  { id: 's1', label: 'Property selected', icon: Building2 },
  { id: 's2', label: 'Tenant details submitted', icon: User },
  { id: 's3', label: 'Request sent to landlord', icon: Send },
  { id: 's4', label: 'Waiting for approval', icon: Clock },
  { id: 's5', label: 'Dashboard access activated', icon: Home },
];

export default function LandlordApprovalWaitingScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { completeOnboarding, selectedProperty } = useAuth();
  const insets = useSafeAreaInsets();
  const [property, setProperty] = useState<SelectedProperty | null>(null);

  useEffect(() => {
    const pending = (globalThis as any).__pendingProperty as
      | SelectedProperty
      | undefined;
    if (pending) setProperty(pending);
    else if (selectedProperty) setProperty(selectedProperty);
  }, [selectedProperty]);

  const requestId = property
    ? `REQ-${property.id.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${String(Math.floor(1000 + Math.random() * 9000))}`
    : 'REQ-PENDING';
  const submittedTime = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleContinue = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleChangeProperty = () => {
    router.replace('/onboarding/tenant-place-selection');
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header Hero Section */}
        <LinearGradient
          colors={
            isDark
              ? ['#451A03', '#78350F', '#B45309']
              : ['#B45309', '#D97706', '#F59E0B']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="relative overflow-hidden rounded-b-[36px] px-6 pb-9"
          style={{
            paddingTop:
              Math.max(insets.top, Platform.OS === 'ios' ? 52 : 28) + 16,
          }}
        >
          <View className="absolute -top-[30px] -right-[30px] h-[160px] w-[160px] rounded-full bg-white/10 blur-2xl" />
          <View className="absolute -bottom-[20px] -left-[20px] h-[120px] w-[120px] rounded-full bg-white/10 blur-xl" />

          <Animated.View
            entering={FadeInDown.duration(600)}
            className="items-center"
          >
            <View className="h-16 w-16 items-center justify-center rounded-[22px] border border-white/30 bg-white/20 shadow-md mb-3.5">
              <Clock size={32} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <Text
              className="text-[22px] text-white text-center tracking-[-0.3px]"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              Waiting for Landlord Approval
            </Text>
            <Text
              className="mt-2 text-[13.5px] leading-[19px] text-amber-50/90 text-center px-3"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              Your request is queued for verification. Once your landlord
              approves, your dashboard and services will unlock.
            </Text>
          </Animated.View>
        </LinearGradient>

        <View className="px-[18px] pt-5">
          {/* Status Tracker */}
          <Animated.View entering={FadeInUp.delay(120).duration(500)}>
            <View className="flex-row items-center justify-between mb-2.5 px-1">
              <View className="flex-row items-center gap-1.5">
                <View className="h-2 w-2 rounded-full bg-amber-500" />
                <Text
                  className="text-[11.5px] tracking-[0.9px] text-slate-500 dark:text-slate-400"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  STATUS TRACKER
                </Text>
              </View>
              <Text
                className="text-[11.5px] text-amber-600 dark:text-amber-400"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                Step 4 of 5
              </Text>
            </View>

            <View className="rounded-[22px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              {TIMELINE.map((step, i) => {
                const Icon = step.icon;
                const isCurrent = i === 3;
                const isDone = i < 3;
                const isFuture = i > 3;
                return (
                  <View key={step.id} className="flex-row">
                    <View className="items-center mr-3.5">
                      <View
                        className={`h-8 w-8 rounded-[10px] items-center justify-center border-[1.5px] ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600'
                            : isCurrent
                              ? 'bg-amber-600 border-amber-600'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Icon
                          size={14}
                          color={
                            isDone || isCurrent
                              ? '#FFFFFF'
                              : isDark
                                ? '#64748B'
                                : '#94A3B8'
                          }
                          strokeWidth={2.4}
                        />
                      </View>
                      {i < TIMELINE.length - 1 ? (
                        <View
                          className={`w-[2px] flex-1 my-1 min-h-[22px] ${
                            isDone
                              ? 'bg-emerald-600'
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                      ) : null}
                    </View>
                    <View
                      className="flex-1 pt-1"
                      style={{
                        paddingBottom: i < TIMELINE.length - 1 ? 16 : 0,
                      }}
                    >
                      <Text
                        className={`text-[13.5px] leading-[18px] ${
                          isFuture
                            ? 'text-slate-400 dark:text-slate-600'
                            : 'text-slate-900 dark:text-white'
                        }`}
                        style={{
                          fontFamily: isCurrent
                            ? 'Inter-Bold'
                            : isDone
                              ? 'Inter-SemiBold'
                              : 'Inter-Medium',
                        }}
                      >
                        {step.label}
                      </Text>
                      {isCurrent ? (
                        <Text
                          className="text-[11px] mt-0.5 text-amber-600 dark:text-amber-400"
                          style={{ fontFamily: 'Inter-Medium' }}
                        >
                          Verification in progress
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          {/* Property Summary Card */}
          {property && (
            <Animated.View
              entering={FadeInUp.delay(220).duration(500)}
              className="rounded-[22px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 mt-4 mb-3.5 shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="mr-3 h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800">
                  <Building2
                    size={21}
                    color={isDark ? '#2DD4BF' : '#0D9488'}
                    strokeWidth={2.2}
                  />
                </View>
                <View className="flex-1 pr-2">
                  <Text
                    numberOfLines={1}
                    className="text-[15.5px] tracking-[-0.2px] text-slate-900 dark:text-white"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    {property.name}
                  </Text>
                  <Text
                    className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400"
                    style={{ fontFamily: 'Inter-Medium' }}
                  >
                    Unit: {property.selectedUnit || 'N/A'}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 rounded-full px-2.5 py-1 border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/60">
                  <Clock
                    size={11}
                    color={isDark ? '#FBBF24' : '#D97706'}
                    strokeWidth={2.4}
                  />
                  <Text
                    className="text-[10.5px] text-amber-700 dark:text-amber-300"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    Pending
                  </Text>
                </View>
              </View>

              <View className="my-3 h-[1px] bg-slate-100 dark:bg-slate-800" />

              <DetailRow
                icon={<User size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />}
                label="Landlord"
                value={property.landlordName}
              />
              <DetailRow
                icon={
                  <Users size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />
                }
                label="Property Manager"
                value={property.propertyManagerName}
              />
              <DetailRow
                icon={<Send size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />}
                label="Request ID"
                value={requestId}
              />
              <DetailRow
                icon={
                  <Clock size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />
                }
                label="Submitted On"
                value={submittedTime}
              />
            </Animated.View>
          )}

          {/* Prototype Notice Note */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            className="flex-row gap-3 rounded-[18px] border border-amber-200/80 dark:border-amber-900/60 bg-white dark:bg-slate-900 p-4 mb-4 shadow-sm"
          >
            <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800">
              <Info
                size={18}
                color={isDark ? '#FBBF24' : '#D97706'}
                strokeWidth={2.2}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-[13.5px] text-slate-900 dark:text-white"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                Demo Prototype Notice
              </Text>
              <Text
                className="mt-1 text-[12px] leading-[17px] text-slate-500 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Regular' }}
              >
                In production, you'll receive a push notification when your
                landlord confirms. For previewing the app now, you can proceed
                directly.
              </Text>
            </View>
          </Animated.View>

          {/* Action CTAs */}
          <Pressable
            onPress={handleContinue}
            className="w-full rounded-[16px] overflow-hidden shadow-sm"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}
          >
            <LinearGradient
              colors={['#0F766E', '#0D9488']}
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
              <Text
                className="text-[15px] text-white"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                Explore Tenant Dashboard
              </Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.4} />
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={handleChangeProperty}
            className="w-full mt-2.5"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}
          >
            <View className="h-[48px] w-full flex-row items-center justify-center gap-2 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <RefreshCw size={15} color={isDark ? '#94A3B8' : '#64748B'} />
              <Text
                className="text-[13.5px] text-slate-600 dark:text-slate-400"
                style={{ fontFamily: 'Inter-SemiBold' }}
              >
                Change Selected Property
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
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
    <View className="flex-row items-center mb-2.5 last:mb-0">
      <View className="h-7 w-7 items-center justify-center rounded-[8px] mr-2.5 bg-slate-100 dark:bg-slate-800">
        {icon}
      </View>
      <View className="flex-1 flex-row items-center justify-between min-w-0">
        <Text
          className="text-[12px] text-slate-500 dark:text-slate-400"
          style={{ fontFamily: 'Inter-Medium' }}
        >
          {label}
        </Text>
        <Text
          numberOfLines={1}
          className="text-[13px] text-slate-900 dark:text-white"
          style={{ fontFamily: 'Inter-SemiBold' }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
