import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Search,
  Building2,
  User,
  Users,
  MapPin,
  ArrowRight,
  HelpCircle,
  FileEdit,
  X,
  Home,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import {
  mockNearbyProperties,
  NearbyProperty,
  SelectedProperty,
} from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function PropertySearchScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const results = q
    ? mockNearbyProperties.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.landlordName.toLowerCase().includes(q) ||
          p.propertyManagerName.toLowerCase().includes(q) ||
          p.unitsAvailable.some((u) => u.toLowerCase().includes(q)),
      )
    : mockNearbyProperties;

  const handleSelect = (prop: NearbyProperty) => {
    const selected: SelectedProperty = {
      id: prop.id,
      name: prop.name,
      address: prop.address,
      landlordName: prop.landlordName,
      propertyManagerName: prop.propertyManagerName,
      verificationMethod: 'Manual Search',
      monthlyRent: prop.monthlyRent,
      securityDeposit: prop.securityDeposit,
    };
    (globalThis as any).__pendingProperty = selected;
    router.push({
      pathname: '/onboarding/property-confirmation',
      params: { source: 'search' },
    });
  };

  const handleManualVerification = () => {
    const selected: SelectedProperty = {
      id: 'manual_prop',
      name: 'Manual Verification Request',
      address: 'To be verified by landlord',
      landlordName: 'To be assigned',
      propertyManagerName: 'To be assigned',
      verificationMethod: 'Manual Verification',
      approvalStatus: 'manual_verification_required',
    };
    (globalThis as any).__pendingProperty = selected;
    router.push({
      pathname: '/onboarding/property-confirmation',
      params: { source: 'manual' },
    });
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScreenHeader title="Search Property" />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 36,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-[18px] pt-3">
          {/* Modern Search Bar */}
          <Animated.View entering={FadeInDown.duration(300)}>
            <View
              className={`flex-row items-center rounded-[18px] border px-3.5 mb-4 shadow-sm ${
                query
                  ? 'border-teal-500 bg-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <Search
                size={18}
                color={
                  query
                    ? isDark
                      ? '#2DD4BF'
                      : '#0D9488'
                    : isDark
                      ? '#64748B'
                      : '#94A3B8'
                }
                strokeWidth={2.2}
              />
              <TextInput
                className="flex-1 text-[14.5px] py-3.5 px-2.5 text-slate-900 dark:text-white"
                style={{ fontFamily: 'Inter-Medium' }}
                value={query}
                onChangeText={setQuery}
                placeholder="Search building, landlord, street or unit..."
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                autoCorrect={false}
                returnKeyType="search"
              />
              {query ? (
                <Pressable
                  onPress={() => setQuery('')}
                  hitSlop={8}
                  className="h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <X
                    size={13}
                    color={isDark ? '#94A3B8' : '#64748B'}
                    strokeWidth={2.4}
                  />
                </Pressable>
              ) : null}
            </View>
          </Animated.View>

          {/* Results State */}
          {results.length === 0 ? (
            <View className="items-center rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 mb-4 shadow-sm">
              <View className="h-14 w-14 items-center justify-center rounded-2xl mb-3 bg-slate-100 dark:bg-slate-800">
                <HelpCircle size={28} color={isDark ? '#64748B' : '#94A3B8'} />
              </View>
              <Text
                className="text-[16px] mb-1.5 text-slate-900 dark:text-white"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                No Properties Found
              </Text>
              <Text
                className="text-[13px] text-center leading-[19px] text-slate-500 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Regular' }}
              >
                We couldn't find any property matching "{query}". You can
                request manual verification below.
              </Text>
            </View>
          ) : (
            <>
              {/* Results Header Counter */}
              <View className="flex-row items-center justify-between mb-3 px-1">
                <View className="flex-row items-center gap-1.5">
                  <View className="h-2 w-2 rounded-full bg-teal-500" />
                  <Text
                    className="text-[11.5px] tracking-[0.8px] text-slate-500 dark:text-slate-400"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    {results.length}{' '}
                    {results.length === 1
                      ? 'PROPERTY FOUND'
                      : 'PROPERTIES FOUND'}
                  </Text>
                </View>
                <View className="rounded-full px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Text
                    className="text-[11px] text-slate-600 dark:text-slate-400"
                    style={{ fontFamily: 'Inter-Medium' }}
                  >
                    Verified Database
                  </Text>
                </View>
              </View>

              {/* Property Cards */}
              {results.map((prop, i) => (
                <Animated.View
                  key={prop.id}
                  entering={FadeInUp.delay(i * 70).duration(350)}
                  className="mb-3.5"
                >
                  <View className="rounded-[20px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                    {/* Header Row: Icon + Building Name & Address */}
                    <View className="flex-row items-center mb-3">
                      <View className="mr-3 h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800">
                        <Building2
                          size={21}
                          color={isDark ? '#2DD4BF' : '#0D9488'}
                          strokeWidth={2.2}
                        />
                      </View>

                      <View className="min-w-0 flex-1 justify-center">
                        <Text
                          numberOfLines={1}
                          className="text-[15.5px] tracking-[-0.2px] text-slate-900 dark:text-white"
                          style={{ fontFamily: 'Inter-Bold' }}
                        >
                          {prop.name}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <MapPin
                            size={11}
                            color={isDark ? '#94A3B8' : '#64748B'}
                          />
                          <Text
                            numberOfLines={1}
                            className="text-[12px] flex-1 text-slate-500 dark:text-slate-400"
                            style={{ fontFamily: 'Inter-Regular' }}
                          >
                            {prop.address}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Metadata Box: Owner & Property Manager */}
                    <View className="flex-row items-center justify-between rounded-[12px] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 mb-3">
                      <View className="flex-row items-center gap-1.5 min-w-0 flex-1">
                        <User
                          size={12}
                          color={isDark ? '#94A3B8' : '#64748B'}
                        />
                        <Text
                          numberOfLines={1}
                          className="text-[11.5px] text-slate-600 dark:text-slate-400"
                          style={{ fontFamily: 'Inter-Medium' }}
                        >
                          Owner: {prop.landlordName}
                        </Text>
                      </View>

                      <View className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />

                      <View className="flex-row items-center gap-1.5 min-w-0 flex-1 justify-end">
                        <Users
                          size={12}
                          color={isDark ? '#94A3B8' : '#64748B'}
                        />
                        <Text
                          numberOfLines={1}
                          className="text-[11.5px] text-slate-600 dark:text-slate-400"
                          style={{ fontFamily: 'Inter-Medium' }}
                        >
                          Manager: {prop.propertyManagerName}
                        </Text>
                      </View>
                    </View>

                    {/* Available Units Strip */}
                    <View className="mb-3">
                      <View className="flex-row items-center gap-1 mb-1.5">
                        <Home
                          size={11}
                          color={isDark ? '#94A3B8' : '#64748B'}
                        />
                        <Text
                          className="text-[11px] text-slate-500 dark:text-slate-400"
                          style={{ fontFamily: 'Inter-Medium' }}
                        >
                          Available Units:
                        </Text>
                      </View>
                      <View className="flex-row flex-wrap gap-1.5">
                        {prop.unitsAvailable.map((unit) => (
                          <View
                            key={unit}
                            className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-2 py-0.5"
                          >
                            <Text
                              className="text-[11px] text-slate-800 dark:text-slate-200"
                              style={{ fontFamily: 'Inter-SemiBold' }}
                            >
                              {unit}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* CTA Button */}
                    <Pressable
                      onPress={() => handleSelect(prop)}
                      className="flex-row items-center justify-center gap-1.5 rounded-[12px] py-2.5 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60"
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.85 : 1,
                        transform: [{ scale: pressed ? 0.985 : 1 }],
                      })}
                    >
                      <Text
                        className="text-[13px] text-teal-700 dark:text-teal-300"
                        style={{ fontFamily: 'Inter-Bold' }}
                      >
                        Select This Property
                      </Text>
                      <ArrowRight
                        size={14}
                        color={isDark ? '#2DD4BF' : '#0D9488'}
                        strokeWidth={2.4}
                      />
                    </Pressable>
                  </View>
                </Animated.View>
              ))}
            </>
          )}

          {/* Manual Verification Fallback Box */}
          <View className="flex-row items-center gap-3 rounded-[20px] border border-amber-200/80 dark:border-amber-900/60 bg-white dark:bg-slate-900 p-4 mt-2 mb-3 shadow-sm">
            <View className="h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800">
              <FileEdit
                size={21}
                color={isDark ? '#FBBF24' : '#D97706'}
                strokeWidth={2.2}
              />
            </View>
            <View className="min-w-0 flex-1">
              <Text
                className="text-[14.5px] mb-0.5 text-slate-900 dark:text-white"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                Cannot find your property?
              </Text>
              <Text
                className="text-[12px] leading-[17px] text-slate-500 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Regular' }}
              >
                Submit your landlord or unit details manually and we'll route
                verification to them.
              </Text>
            </View>
          </View>

          {/* Manual Verification Action Button */}
          <Pressable
            onPress={handleManualVerification}
            className="w-full mb-4"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}
          >
            <View className="h-[50px] w-full flex-row items-center justify-center gap-2 rounded-[16px] border border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/60 px-4">
              <Text
                className="text-[14px] text-teal-700 dark:text-teal-300"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                Request Manual Verification
              </Text>
              <ArrowRight
                size={16}
                color={isDark ? '#2DD4BF' : '#0D9488'}
                strokeWidth={2.2}
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
