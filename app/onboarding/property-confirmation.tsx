import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Building2,
  MapPin,
  User,
  Users,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Wallet,
  Shield,
  FileText,
  Tag,
  Check,
  Sparkles,
  ChevronLeft,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mockNearbyProperties, SelectedProperty } from '@/data/mockData';

const VERIFICATION_LABELS: Record<string, string> = {
  'Live Location': 'Live Location GPS',
  'Manual Search': 'Manual Search',
  'Invitation Code': 'Direct Landlord Invite',
  'Manual Verification': 'Manual Verification',
};

export default function PropertyConfirmationScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSelectedProperty } = useAuth();

  const [property, setProperty] = useState<SelectedProperty | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [leaseStart, setLeaseStart] = useState('2026-01-01');
  const [monthlyRent, setMonthlyRent] = useState('18000');
  const [securityDeposit, setSecurityDeposit] = useState('36000');
  const [tenantNote, setTenantNote] = useState(
    'Hello, I am requesting access to connect with this rental unit.',
  );
  const [confirmStay, setConfirmStay] = useState(false);
  const [confirmVerify, setConfirmVerify] = useState(false);

  useEffect(() => {
    const pending = (globalThis as any).__pendingProperty as
      | SelectedProperty
      | undefined;
    if (pending) {
      setProperty(pending);
      if (pending.selectedUnit) setSelectedUnit(pending.selectedUnit);
      if (pending.monthlyRent) setMonthlyRent(String(pending.monthlyRent));
      if (pending.securityDeposit)
        setSecurityDeposit(String(pending.securityDeposit));
    }
  }, []);

  const availableUnits: string[] = property
    ? property.id.startsWith('manual')
      ? []
      : mockNearbyProperties.find((p) => p.id === property.id)
          ?.unitsAvailable ||
        (property.selectedUnit ? [property.selectedUnit] : [])
    : [];

  const canSubmit =
    !!property &&
    (selectedUnit !== '' || availableUnits.length === 0) &&
    confirmStay &&
    confirmVerify;

  const handleSubmit = async () => {
    if (!property || !canSubmit) return;
    const finalProperty: SelectedProperty = {
      ...property,
      selectedUnit: selectedUnit || property.selectedUnit || 'N/A',
      leaseStart,
      monthlyRent: Number(monthlyRent) || 0,
      securityDeposit: Number(securityDeposit) || 0,
      tenantNote,
      approvalStatus: 'pending',
    };
    await setSelectedProperty(finalProperty);
    (globalThis as any).__pendingProperty = finalProperty;
    router.replace('/onboarding/landlord-approval-waiting');
  };

  if (!property) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950">
        <View className="flex-1 items-center justify-center p-8">
          <View className="h-16 w-16 items-center justify-center rounded-2xl mb-4 bg-slate-100 dark:bg-slate-800">
            <Building2 size={32} color={isDark ? '#64748B' : '#94A3B8'} />
          </View>
          <Text
            className="text-[16px] text-center mb-2 text-slate-900 dark:text-white"
            style={{ fontFamily: 'Inter-Bold' }}
          >
            No Property Selected
          </Text>
          <Text
            className="text-[13px] text-center mb-6 leading-5 text-slate-500 dark:text-slate-400"
            style={{ fontFamily: 'Inter-Regular' }}
          >
            Please go back and pick a property to continue confirmation.
          </Text>
          <Pressable
            onPress={() => router.replace('/onboarding/tenant-place-selection')}
            className="rounded-[16px] px-6 py-3.5 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 shadow-sm"
          >
            <Text
              className="text-[14px] text-teal-700 dark:text-teal-300"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              Back to Selection
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 120,
        }}
      >
        {/* Top Hero Gradient with Dynamic Island Safe Insets */}
        <LinearGradient
          colors={
            isDark
              ? ['#021F1C', '#042F2A', '#0F766E']
              : ['#041D1A', '#08332D', '#0D9488']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="relative overflow-hidden rounded-b-[36px] px-6 pb-8"
          style={{
            paddingTop:
              Math.max(insets.top, Platform.OS === 'ios' ? 52 : 28) + 10,
          }}
        >
          {/* Ambient Glow */}
          <View className="absolute -top-[40px] -right-[40px] h-[200px] w-[200px] rounded-full bg-teal-300/10 blur-3xl" />
          <View className="absolute top-[30%] -left-[40px] h-[140px] w-[140px] rounded-full bg-emerald-400/10 blur-2xl" />

          {/* Top Bar with Back Button */}
          <View className="flex-row items-center justify-between mb-3.5">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              className="h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10"
            >
              <ChevronLeft size={20} color="#FFFFFF" />
            </Pressable>

            <View className="flex-row items-center gap-1.5 rounded-full border border-teal-300/25 bg-white/10 px-3 py-1 shadow-sm">
              <Sparkles size={11.5} color="#5EEAD4" />
              <Text
                className="text-[11px] tracking-[0.4px] text-teal-100"
                style={{ fontFamily: 'Inter-SemiBold' }}
              >
                Step 2 of 3 • Review
              </Text>
            </View>

            <View className="w-9" />
          </View>

          {/* Hero Titles */}
          <Animated.View
            entering={FadeInDown.duration(500)}
            className="items-center"
          >
            <Text
              className="text-center text-[23px] tracking-[-0.4px] text-white"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              Confirm Tenancy Details
            </Text>
            <Text
              className="mt-1 max-w-[310px] text-center text-[12.5px] leading-[18px] text-teal-50/85"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              Verify your rental premises and lease terms before submitting to
              your landlord.
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Content Section */}
        <View className="px-[18px] pt-6">
          {/* Property Identity Card */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            className="rounded-[22px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 mb-6 overflow-hidden shadow-sm"
          >
            {/* Header / Building Avatar */}
            <View className="flex-row items-center p-4">
              <View className="mr-3.5 h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800">
                <Building2
                  size={23}
                  color={isDark ? '#2DD4BF' : '#0D9488'}
                  strokeWidth={2.2}
                />
              </View>
              <View className="min-w-0 flex-1 justify-center pr-1">
                <Text
                  numberOfLines={1}
                  className="text-[16.5px] tracking-[-0.3px] text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  {property.name}
                </Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <MapPin size={11} color={isDark ? '#94A3B8' : '#64748B'} />
                  <Text
                    numberOfLines={1}
                    className="text-[12px] flex-1 text-slate-500 dark:text-slate-400"
                    style={{ fontFamily: 'Inter-Regular' }}
                  >
                    {property.address}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mx-4 h-[1px] bg-slate-100 dark:bg-slate-800" />

            {/* Structured Detail Key-Values */}
            <View className="p-4 pt-3.5 gap-3">
              <DetailField
                icon={<User size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />}
                label="Landlord / Owner"
                value={property.landlordName}
              />
              <DetailField
                icon={
                  <Users size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />
                }
                label="Property Manager"
                value={property.propertyManagerName}
              />
              <DetailField
                icon={<Tag size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />}
                label="Verification Method"
                value={
                  VERIFICATION_LABELS[property.verificationMethod] ||
                  property.verificationMethod
                }
              />
              {property.distance ? (
                <DetailField
                  icon={
                    <MapPin size={13} color={isDark ? '#2DD4BF' : '#0D9488'} />
                  }
                  label="Distance Detected"
                  value={property.distance}
                />
              ) : null}
              {property.matchConfidence ? (
                <DetailField
                  icon={
                    <CheckCircle2
                      size={13}
                      color={isDark ? '#2DD4BF' : '#0D9488'}
                    />
                  }
                  label="Match Confidence"
                  value={property.matchConfidence}
                />
              ) : null}
            </View>
          </Animated.View>

          {/* Unit Selection Strip */}
          {availableUnits.length > 0 && (
            <Animated.View
              entering={FadeInUp.delay(150).duration(400)}
              className="mb-6"
            >
              <View className="flex-row items-center justify-between mb-3 px-1">
                <View className="flex-row items-center gap-1.5">
                  <View className="h-2 w-2 rounded-full bg-teal-500" />
                  <Text
                    className="text-[11.5px] tracking-[0.9px] text-slate-500 dark:text-slate-400"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    SELECT UNIT / FLAT
                  </Text>
                </View>
                <View className="rounded-full px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                  <Text
                    className="text-[10.5px] text-teal-700 dark:text-teal-300"
                    style={{ fontFamily: 'Inter-SemiBold' }}
                  >
                    Required
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {availableUnits.map((unit) => {
                  const active = selectedUnit === unit;
                  return (
                    <Pressable
                      key={unit}
                      onPress={() => setSelectedUnit(unit)}
                      className={`flex-row items-center rounded-[14px] border px-4 py-2.5 shadow-sm ${
                        active
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/80'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                      style={({ pressed }) => ({
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      })}
                    >
                      {active ? (
                        <Check
                          size={14}
                          color={isDark ? '#2DD4BF' : '#0D9488'}
                          strokeWidth={2.6}
                          style={{ marginRight: 6 }}
                        />
                      ) : null}
                      <Text
                        className={`text-[13.5px] ${
                          active
                            ? 'text-teal-700 dark:text-teal-300 font-bold'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                        style={{
                          fontFamily: active ? 'Inter-Bold' : 'Inter-Medium',
                        }}
                      >
                        {unit}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {/* Tenancy & Financial Details Card */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(400)}
            className="mb-6"
          >
            <View className="flex-row items-center gap-1.5 mb-3 px-1">
              <View className="h-2 w-2 rounded-full bg-teal-500" />
              <Text
                className="text-[11.5px] tracking-[0.9px] text-slate-500 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                TENANCY & LEASE TERMS
              </Text>
            </View>

            {/* Lease Start Date */}
            <View className="mb-3.5">
              <Text
                className="text-[12.5px] mb-1.5 px-0.5 text-slate-600 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Medium' }}
              >
                Lease Start Date
              </Text>
              <View className="flex-row items-center rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1 gap-2.5">
                <Calendar size={16} color={isDark ? '#2DD4BF' : '#0D9488'} />
                <TextInput
                  className="flex-1 text-[14px] py-2.5 text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Inter-Medium' }}
                  value={leaseStart}
                  onChangeText={setLeaseStart}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>
            </View>

            {/* Rent & Deposit Row */}
            <View className="flex-row gap-3 mb-3.5">
              <View className="flex-1">
                <Text
                  className="text-[12.5px] mb-1.5 px-0.5 text-slate-600 dark:text-slate-400"
                  style={{ fontFamily: 'Inter-Medium' }}
                >
                  Monthly Rent (₹)
                </Text>
                <View className="flex-row items-center rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 gap-2">
                  <Wallet size={15} color={isDark ? '#2DD4BF' : '#0D9488'} />
                  <TextInput
                    className="flex-1 text-[14px] py-2.5 text-slate-900 dark:text-white"
                    style={{ fontFamily: 'Inter-SemiBold' }}
                    value={monthlyRent}
                    onChangeText={setMonthlyRent}
                    placeholder="18000"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text
                  className="text-[12.5px] mb-1.5 px-0.5 text-slate-600 dark:text-slate-400"
                  style={{ fontFamily: 'Inter-Medium' }}
                >
                  Security Deposit (₹)
                </Text>
                <View className="flex-row items-center rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 gap-2">
                  <Shield size={15} color={isDark ? '#2DD4BF' : '#0D9488'} />
                  <TextInput
                    className="flex-1 text-[14px] py-2.5 text-slate-900 dark:text-white"
                    style={{ fontFamily: 'Inter-SemiBold' }}
                    value={securityDeposit}
                    onChangeText={setSecurityDeposit}
                    placeholder="36000"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Note to Landlord */}
            <View className="mb-1">
              <Text
                className="text-[12.5px] mb-1.5 px-0.5 text-slate-600 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Medium' }}
              >
                Note to Landlord
              </Text>
              <View className="flex-row items-start rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 gap-2.5">
                <FileText
                  size={16}
                  color={isDark ? '#2DD4BF' : '#0D9488'}
                  style={{ marginTop: 2 }}
                />
                <TextInput
                  className="flex-1 text-[13px] leading-[18px] min-h-[65px] text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Inter-Regular' }}
                  value={tenantNote}
                  onChangeText={setTenantNote}
                  placeholder="Add a note or message for your landlord..."
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </Animated.View>

          {/* Verification Agreements Checklist */}
          <Animated.View
            entering={FadeInUp.delay(250).duration(400)}
            className="mb-4"
          >
            <View className="flex-row items-center gap-1.5 mb-3 px-1">
              <View className="h-2 w-2 rounded-full bg-teal-500" />
              <Text
                className="text-[11.5px] tracking-[0.9px] text-slate-500 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                CONFIRMATION CHECKS
              </Text>
            </View>

            <Pressable
              className={`flex-row items-start gap-3 p-4 rounded-[18px] border mb-3 ${
                confirmStay
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
              onPress={() => setConfirmStay(!confirmStay)}
            >
              <View
                className={`h-[22px] w-[22px] rounded-[7px] border items-center justify-center shrink-0 mt-0.5 ${
                  confirmStay
                    ? 'border-teal-600 bg-teal-600'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {confirmStay ? (
                  <Check size={14} color="#FFFFFF" strokeWidth={2.6} />
                ) : null}
              </View>
              <Text
                className="flex-1 text-[12.5px] leading-[18px] text-slate-800 dark:text-slate-200"
                style={{ fontFamily: 'Inter-Regular' }}
              >
                I confirm that I am currently staying at this rental
                unit/property.
              </Text>
            </Pressable>

            <Pressable
              className={`flex-row items-start gap-3 p-4 rounded-[18px] border ${
                confirmVerify
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
              onPress={() => setConfirmVerify(!confirmVerify)}
            >
              <View
                className={`h-[22px] w-[22px] rounded-[7px] border items-center justify-center shrink-0 mt-0.5 ${
                  confirmVerify
                    ? 'border-teal-600 bg-teal-600'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {confirmVerify ? (
                  <Check size={14} color="#FFFFFF" strokeWidth={2.6} />
                ) : null}
              </View>
              <Text
                className="flex-1 text-[12.5px] leading-[18px] text-slate-800 dark:text-slate-200"
                style={{ fontFamily: 'Inter-Regular' }}
              >
                I understand that the landlord will verify my request before
                dashboard activation.
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Floating Sticky CTA Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 pt-3.5 shadow-2xl"
        style={{
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        }}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="w-full rounded-[16px] overflow-hidden"
          style={({ pressed }) => ({
            opacity: !canSubmit ? 0.45 : pressed ? 0.92 : 1,
            transform: [
              {
                scale: pressed && canSubmit ? 0.985 : 1,
              },
            ],
          })}
        >
          <LinearGradient
            colors={canSubmit ? ['#0F766E', '#0D9488'] : ['#94A3B8', '#64748B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <View className="flex-1 flex-row items-center justify-center gap-2 px-4">
              <Text
                className="text-[15px] text-white"
                style={{
                  fontFamily: 'Inter-Bold',
                  lineHeight: 20,
                }}
              >
                Send Request to Landlord
              </Text>

              <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.4} />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function DetailField({
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
      <View className="h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px] mr-2.5 bg-slate-100 dark:bg-slate-800">
        {icon}
      </View>
      <View className="min-w-0 flex-1 flex-row items-center justify-between">
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
