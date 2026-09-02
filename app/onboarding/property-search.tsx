import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Search, Building2, User, Users, MapPin, ArrowRight,
  HelpCircle, FileEdit, X, Sparkles, Home,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockNearbyProperties, NearbyProperty, SelectedProperty } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function PropertySearchScreen() {
  const { colors, isDark } = useTheme();
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
    router.push({ pathname: '/onboarding/property-confirmation', params: { source: 'search' } });
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
    router.push({ pathname: '/onboarding/property-confirmation', params: { source: 'manual' } });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Search Property" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 36 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-[18px] pt-3">
          {/* Modern Search Bar */}
          <Animated.View entering={FadeInDown.duration(300)}>
            <View
              className="flex-row items-center rounded-[18px] border px-3.5 mb-4 shadow-sm"
              style={{
                backgroundColor: colors.surface,
                borderColor: query ? colors.primary : colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.25 : 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Search size={18} color={query ? colors.primary : colors.textMuted} strokeWidth={2.2} />
              <TextInput
                className="flex-1 text-[14.5px] py-3.5 px-2.5"
                style={{ color: colors.textPrimary, fontFamily: 'Inter-Medium' }}
                value={query}
                onChangeText={setQuery}
                placeholder="Search building, landlord, street or unit..."
                placeholderTextColor={colors.textMuted}
                autoCorrect={false}
                returnKeyType="search"
              />
              {query ? (
                <Pressable
                  onPress={() => setQuery('')}
                  hitSlop={8}
                  className="h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.surfaceSecondary }}
                >
                  <X size={13} color={colors.textMuted} strokeWidth={2.4} />
                </Pressable>
              ) : null}
            </View>
          </Animated.View>

          {/* Results State */}
          {results.length === 0 ? (
            <View
              className="items-center rounded-[22px] border p-7 mb-4"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.25 : 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                className="h-14 w-14 items-center justify-center rounded-2xl mb-3"
                style={{ backgroundColor: colors.surfaceSecondary }}
              >
                <HelpCircle size={28} color={colors.textMuted} />
              </View>
              <Text
                className="text-[16px] mb-1.5"
                style={{ color: colors.textPrimary, fontFamily: 'Inter-Bold' }}
              >
                No Properties Found
              </Text>
              <Text
                className="text-[13px] text-center leading-[19px]"
                style={{ color: colors.textSecondary, fontFamily: 'Inter-Regular' }}
              >
                We couldn't find any property matching "{query}". You can request manual verification below.
              </Text>
            </View>
          ) : (
            <>
              {/* Results Header Counter */}
              <View className="flex-row items-center justify-between mb-3 px-1">
                <View className="flex-row items-center gap-1.5">
                  <View className="h-2 w-2 rounded-full bg-teal-500" />
                  <Text
                    className="text-[11.5px] tracking-[0.8px]"
                    style={{ color: colors.textMuted, fontFamily: 'Inter-Bold' }}
                  >
                    {results.length} {results.length === 1 ? 'PROPERTY FOUND' : 'PROPERTIES FOUND'}
                  </Text>
                </View>
                <View
                  className="rounded-full px-2.5 py-0.5"
                  style={{ backgroundColor: colors.surfaceSecondary }}
                >
                  <Text
                    className="text-[11px]"
                    style={{ color: colors.textSecondary, fontFamily: 'Inter-Medium' }}
                  >
                    Verified Database
                  </Text>
                </View>
              </View>

              {/* Property Cards */}
              {results.map((prop, i) => (
                <Animated.View key={prop.id} entering={FadeInUp.delay(i * 70).duration(350)} className="mb-3.5">
                  <View
                    className="rounded-[20px] border p-4"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.25 : 0.04,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    {/* Header Row: Icon + Building Name & Address */}
                    <View className="flex-row items-center mb-3">
                      <View
                        className="mr-3 h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px]"
                        style={{ backgroundColor: colors.primaryGlow }}
                      >
                        <Building2 size={21} color={colors.primary} strokeWidth={2.2} />
                      </View>

                      <View className="min-w-0 flex-1 justify-center">
                        <Text
                          numberOfLines={1}
                          className="text-[15.5px] tracking-[-0.2px]"
                          style={{ color: colors.textPrimary, fontFamily: 'Inter-Bold' }}
                        >
                          {prop.name}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <MapPin size={11} color={colors.textMuted} />
                          <Text
                            numberOfLines={1}
                            className="text-[12px] flex-1"
                            style={{ color: colors.textSecondary, fontFamily: 'Inter-Regular' }}
                          >
                            {prop.address}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Metadata Box: Owner & Property Manager */}
                    <View
                      className="flex-row items-center justify-between rounded-[12px] border px-3 py-2 mb-3"
                      style={{
                        backgroundColor: colors.surfaceSecondary,
                        borderColor: colors.borderLight,
                      }}
                    >
                      <View className="flex-row items-center gap-1.5 min-w-0 flex-1">
                        <User size={12} color={colors.textMuted} />
                        <Text
                          numberOfLines={1}
                          className="text-[11.5px]"
                          style={{ color: colors.textSecondary, fontFamily: 'Inter-Medium' }}
                        >
                          Owner: {prop.landlordName}
                        </Text>
                      </View>

                      <View className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700 mx-2" />

                      <View className="flex-row items-center gap-1.5 min-w-0 flex-1 justify-end">
                        <Users size={12} color={colors.textMuted} />
                        <Text
                          numberOfLines={1}
                          className="text-[11.5px]"
                          style={{ color: colors.textSecondary, fontFamily: 'Inter-Medium' }}
                        >
                          Manager: {prop.propertyManagerName}
                        </Text>
                      </View>
                    </View>

                    {/* Available Units Strip */}
                    <View className="mb-3">
                      <View className="flex-row items-center gap-1 mb-1.5">
                        <Home size={11} color={colors.textMuted} />
                        <Text
                          className="text-[11px]"
                          style={{ color: colors.textMuted, fontFamily: 'Inter-Medium' }}
                        >
                          Available Units:
                        </Text>
                      </View>
                      <View className="flex-row flex-wrap gap-1.5">
                        {prop.unitsAvailable.map((unit) => (
                          <View
                            key={unit}
                            className="rounded-md border px-2 py-0.5"
                            style={{
                              backgroundColor: colors.surfaceSecondary,
                              borderColor: colors.borderLight,
                            }}
                          >
                            <Text
                              className="text-[11px]"
                              style={{ color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }}
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
                      className="flex-row items-center justify-center gap-1.5 rounded-[12px] py-2.5 border"
                      style={({ pressed }) => ({
                        backgroundColor: colors.primaryGlow,
                        borderColor: isDark ? 'rgba(20, 184, 166, 0.3)' : '#CCFBF1',
                        opacity: pressed ? 0.85 : 1,
                        transform: [{ scale: pressed ? 0.985 : 1 }],
                      })}
                    >
                      <Text
                        className="text-[13px]"
                        style={{ color: colors.primary, fontFamily: 'Inter-Bold' }}
                      >
                        Select This Property
                      </Text>
                      <ArrowRight size={14} color={colors.primary} strokeWidth={2.4} />
                    </Pressable>
                  </View>
                </Animated.View>
              ))}
            </>
          )}

          {/* Manual Verification Fallback Box */}
          <View
            className="flex-row items-center gap-3 rounded-[20px] border p-4 mt-2 mb-3"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.25 : 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              className="h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px]"
              style={{ backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7' }}
            >
              <FileEdit size={21} color="#D97706" strokeWidth={2.2} />
            </View>
            <View className="min-w-0 flex-1">
              <Text
                className="text-[14.5px] mb-0.5"
                style={{ color: colors.textPrimary, fontFamily: 'Inter-Bold' }}
              >
                Cannot find your property?
              </Text>
              <Text
                className="text-[12px] leading-[17px]"
                style={{ color: colors.textSecondary, fontFamily: 'Inter-Regular' }}
              >
                Submit your landlord or unit details manually and we'll route verification to them.
              </Text>
            </View>
          </View>

          {/* Manual Verification Action Button */}
          <Pressable
            onPress={handleManualVerification}
            className="w-full"
            style={({ pressed }) => [{
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.985 : 1 }],
            }]}
          >
            <View
              className="h-[50px] w-full flex-row items-center justify-center gap-2 rounded-[16px] border px-4"
              style={{
                backgroundColor: colors.primaryGlow,
                borderColor: colors.primary,
              }}
            >
              <Text
                className="text-[14px]"
                style={{ color: colors.primary, fontFamily: 'Inter-Bold' }}
              >
                Request Manual Verification
              </Text>
              <ArrowRight size={16} color={colors.primary} strokeWidth={2.2} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}


