import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  MapPin,
  Navigation,
  Loader2,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Home,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import {
  mockNearbyProperties,
  NearbyProperty,
  SelectedProperty,
} from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';

const MATCH_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  'High Match': { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  'Possible Match': { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  Nearby: { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD' },
};

export default function LocationBasedPropertyScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleUseLocation = () => {
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1200);
  };

  const handleSelect = (prop: NearbyProperty) => {
    const selected: SelectedProperty = {
      id: prop.id,
      name: prop.name,
      address: prop.address,
      landlordName: prop.landlordName,
      propertyManagerName: prop.propertyManagerName,
      verificationMethod: 'Live Location',
      matchConfidence: prop.matchConfidence,
      distance: prop.distance,
      monthlyRent: prop.monthlyRent,
      securityDeposit: prop.securityDeposit,
    };
    (globalThis as any).__pendingProperty = selected;
    router.push({
      pathname: '/onboarding/property-confirmation',
      params: { source: 'location' },
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Nearby Rental Properties" />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 36,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-[18px] pt-3">
          {/* Subtitle Intro */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text
              className="text-[13.5px] leading-5 mb-3 px-0.5"
              style={{
                color: colors.textSecondary,
                fontFamily: 'Inter-Regular',
              }}
            >
              Detect nearby apartment buildings and rental residences using your
              device's location.
            </Text>
          </Animated.View>

          {/* Location Permission Info Card */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            className="flex-row items-center gap-3 rounded-[20px] border p-4 mb-3"
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
              style={{ backgroundColor: colors.accentLight }}
            >
              <Navigation size={20} color={colors.accent} strokeWidth={2.2} />
            </View>
            <View className="min-w-0 flex-1">
              <View className="flex-row items-center justify-between mb-0.5">
                <Text
                  className="text-[14.5px]"
                  style={{
                    color: colors.textPrimary,
                    fontFamily: 'Inter-Bold',
                  }}
                >
                  Location Access
                </Text>
                <View
                  className="flex-row items-center gap-1 rounded-full px-2.5 py-0.5"
                  style={{ backgroundColor: colors.surfaceSecondary }}
                >
                  <ShieldCheck size={11} color={colors.primary} />
                  <Text
                    className="text-[10.5px]"
                    style={{
                      color: colors.primary,
                      fontFamily: 'Inter-SemiBold',
                    }}
                  >
                    Private
                  </Text>
                </View>
              </View>
              <Text
                className="text-[12px] leading-[17px]"
                style={{ color: colors.textMuted, fontFamily: 'Inter-Regular' }}
              >
                Used exclusively to locate properties near you. Your coordinate
                history is never tracked.
              </Text>
            </View>
          </Animated.View>

          {/* Location Trigger Action Button */}
          <Pressable
            onPress={handleUseLocation}
            disabled={loading}
            className="w-full mb-1 rounded-2xl overflow-hidden"
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
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
                borderRadius: 16,
                justifyContent: 'center',
              }}
            >
              <View className="flex-1 flex-row items-center justify-center gap-2 px-4">
                {loading ? (
                  <>
                    <Loader2 size={19} color="#FFFFFF" strokeWidth={2.2} />

                    <Text
                      className="text-[15px] text-white"
                      style={{ fontFamily: 'Inter-SemiBold' }}
                    >
                      Scanning nearby area...
                    </Text>
                  </>
                ) : (
                  <>
                    <MapPin size={19} color="#FFFFFF" strokeWidth={2.2} />

                    <Text
                      className="text-[15px] text-white"
                      style={{ fontFamily: 'Inter-SemiBold' }}
                    >
                      Use My Current Location
                    </Text>
                  </>
                )}
              </View>
            </LinearGradient>
          </Pressable>

          {/* Loading Animation Area */}
          {loading && (
            <View className="items-center py-7">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 mb-2.5">
                <Loader2 size={24} color={colors.primary} />
              </View>
              <Text
                className="text-[13px]"
                style={{
                  color: colors.textSecondary,
                  fontFamily: 'Inter-Medium',
                }}
              >
                Searching properties within 1 km...
              </Text>
            </View>
          )}

          {/* Results List */}
          {showResults && (
            <View className="mt-4">
              <View className="flex-row items-center justify-between mb-2.5 px-1">
                <View className="flex-row items-center gap-1.5">
                  <View className="h-2 w-2 rounded-full bg-teal-500" />
                  <Text
                    className="text-[11.5px] tracking-[0.8px]"
                    style={{
                      color: colors.textMuted,
                      fontFamily: 'Inter-Bold',
                    }}
                  >
                    FOUND {mockNearbyProperties.length} PROPERTIES
                  </Text>
                </View>
                <View
                  className="rounded-full px-2.5 py-0.5"
                  style={{ backgroundColor: colors.surfaceSecondary }}
                >
                  <Text
                    className="text-[11px]"
                    style={{
                      color: colors.textSecondary,
                      fontFamily: 'Inter-Medium',
                    }}
                  >
                    GPS Verified
                  </Text>
                </View>
              </View>

              {mockNearbyProperties.map((prop, i) => {
                const mc =
                  MATCH_COLORS[prop.matchConfidence] || MATCH_COLORS['Nearby'];
                return (
                  <Animated.View
                    key={prop.id}
                    entering={FadeInUp.delay(i * 80).duration(350)}
                    className="mb-3"
                  >
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
                      {/* Property Header: Icon + Title/Address + Match Badge */}
                      <View className="flex-row items-center justify-between mb-2.5">
                        <View
                          className="mr-3 h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px]"
                          style={{ backgroundColor: colors.primaryGlow }}
                        >
                          <Building2
                            size={21}
                            color={colors.primary}
                            strokeWidth={2.2}
                          />
                        </View>

                        <View className="min-w-0 flex-1 justify-center pr-2">
                          <Text
                            numberOfLines={1}
                            className="text-[15.5px] tracking-[-0.2px]"
                            style={{
                              color: colors.textPrimary,
                              fontFamily: 'Inter-Bold',
                            }}
                          >
                            {prop.name}
                          </Text>
                          <View className="flex-row items-center gap-1 mt-0.5">
                            <MapPin size={11} color={colors.textMuted} />
                            <Text
                              numberOfLines={1}
                              className="text-[12px] flex-1"
                              style={{
                                color: colors.textSecondary,
                                fontFamily: 'Inter-Regular',
                              }}
                            >
                              {prop.address}
                            </Text>
                          </View>
                        </View>

                        <View
                          className="shrink-0 rounded-full px-2.5 py-1 border"
                          style={{
                            backgroundColor: mc.bg,
                            borderColor: mc.border,
                          }}
                        >
                          <Text
                            className="text-[10px]"
                            style={{ color: mc.text, fontFamily: 'Inter-Bold' }}
                          >
                            {prop.matchConfidence}
                          </Text>
                        </View>
                      </View>

                      {/* Metadata Pill Box (Distance & Landlord Info) */}
                      <View
                        className="flex-row items-center justify-between rounded-[12px] border px-3 py-2 mb-2.5"
                        style={{
                          backgroundColor: colors.surfaceSecondary,
                          borderColor: colors.borderLight,
                        }}
                      >
                        <View className="flex-row items-center gap-1.5 shrink-0">
                          <Navigation size={12} color={colors.primary} />
                          <Text
                            className="text-[11.5px]"
                            style={{
                              color: colors.textPrimary,
                              fontFamily: 'Inter-SemiBold',
                            }}
                          >
                            {prop.distance} away
                          </Text>
                        </View>

                        <View className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700" />

                        <View className="flex-row items-center gap-1.5 min-w-0 flex-1 justify-end">
                          <User size={12} color={colors.textMuted} />
                          <Text
                            numberOfLines={1}
                            className="text-[11.5px]"
                            style={{
                              color: colors.textSecondary,
                              fontFamily: 'Inter-Medium',
                            }}
                          >
                            {prop.landlordName}
                          </Text>
                        </View>
                      </View>

                      {/* Available Units Chip Strip */}
                      <View className="mb-3">
                        <View className="flex-row items-center gap-1 mb-1.5">
                          <Home size={11} color={colors.textMuted} />
                          <Text
                            className="text-[11px]"
                            style={{
                              color: colors.textMuted,
                              fontFamily: 'Inter-Medium',
                            }}
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
                                style={{
                                  color: colors.textPrimary,
                                  fontFamily: 'Inter-SemiBold',
                                }}
                              >
                                {unit}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* CTA Action Button */}
                      <Pressable
                        onPress={() => handleSelect(prop)}
                        className="flex-row items-center justify-center gap-1.5 rounded-[12px] py-2.5 border"
                        style={({ pressed }) => ({
                          backgroundColor: colors.primaryGlow,
                          borderColor: isDark
                            ? 'rgba(20, 184, 166, 0.3)'
                            : '#CCFBF1',
                          opacity: pressed ? 0.85 : 1,
                          transform: [{ scale: pressed ? 0.985 : 1 }],
                        })}
                      >
                        <Text
                          className="text-[13px]"
                          style={{
                            color: colors.primary,
                            fontFamily: 'Inter-Bold',
                          }}
                        >
                          Select This Property
                        </Text>
                        <ArrowRight
                          size={14}
                          color={colors.primary}
                          strokeWidth={2.4}
                        />
                      </Pressable>
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
