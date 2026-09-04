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
  Home,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import {
  mockNearbyProperties,
  NearbyProperty,
  SelectedProperty,
} from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';

const MATCH_CONFIG: Record<
  string,
  { bgClass: string; textClass: string; borderClass: string }
> = {
  'High Match': {
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/80',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
  },
  'Possible Match': {
    bgClass: 'bg-amber-50 dark:bg-amber-950/80',
    textClass: 'text-amber-700 dark:text-amber-300',
    borderClass: 'border-amber-200 dark:border-amber-800',
  },
  Nearby: {
    bgClass: 'bg-sky-50 dark:bg-sky-950/80',
    textClass: 'text-sky-700 dark:text-sky-300',
    borderClass: 'border-sky-200 dark:border-sky-800',
  },
};

export default function LocationBasedPropertyScreen() {
  const { isDark } = useTheme();
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
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
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
              className="text-[13.5px] leading-5 mb-3 px-0.5 text-slate-600 dark:text-slate-400"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              Detect nearby apartment buildings and rental residences using your
              device's location.
            </Text>
          </Animated.View>

          {/* Location Permission Info Card */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            className="flex-row items-center gap-3 rounded-[20px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 mb-3 shadow-sm"
          >
            <View className="h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800">
              <Navigation
                size={20}
                color={isDark ? '#38BDF8' : '#0284C7'}
                strokeWidth={2.2}
              />
            </View>
            <View className="min-w-0 flex-1">
              <View className="flex-row items-center justify-between mb-0.5">
                <Text
                  className="text-[14.5px] text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  Location Access
                </Text>
                <View className="flex-row items-center gap-1 rounded-full px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                  <ShieldCheck
                    size={11}
                    color={isDark ? '#2DD4BF' : '#0D9488'}
                  />
                  <Text
                    className="text-[10.5px] text-teal-700 dark:text-teal-300"
                    style={{ fontFamily: 'Inter-SemiBold' }}
                  >
                    Private
                  </Text>
                </View>
              </View>
              <Text
                className="text-[12px] leading-[17px] text-slate-500 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Regular' }}
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
            className="w-full mb-1 rounded-2xl overflow-hidden shadow-sm"
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
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-400/20 mb-2.5">
                <Loader2 size={24} color={isDark ? '#2DD4BF' : '#0D9488'} />
              </View>
              <Text
                className="text-[13px] text-slate-600 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Medium' }}
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
                    className="text-[11.5px] tracking-[0.8px] text-slate-500 dark:text-slate-400"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    FOUND {mockNearbyProperties.length} PROPERTIES
                  </Text>
                </View>
                <View className="rounded-full px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Text
                    className="text-[11px] text-slate-600 dark:text-slate-400"
                    style={{ fontFamily: 'Inter-Medium' }}
                  >
                    GPS Verified
                  </Text>
                </View>
              </View>

              {mockNearbyProperties.map((prop, i) => {
                const mc =
                  MATCH_CONFIG[prop.matchConfidence] || MATCH_CONFIG['Nearby'];
                return (
                  <Animated.View
                    key={prop.id}
                    entering={FadeInUp.delay(i * 80).duration(350)}
                    className="mb-3"
                  >
                    <View className="rounded-[20px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                      {/* Property Header: Icon + Title/Address + Match Badge */}
                      <View className="flex-row items-center justify-between mb-2.5">
                        <View className="mr-3 h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800">
                          <Building2
                            size={21}
                            color={isDark ? '#2DD4BF' : '#0D9488'}
                            strokeWidth={2.2}
                          />
                        </View>

                        <View className="min-w-0 flex-1 justify-center pr-2">
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

                        <View
                          className={`shrink-0 rounded-full px-2.5 py-1 border ${mc.bgClass} ${mc.borderClass}`}
                        >
                          <Text
                            className={`text-[10px] ${mc.textClass}`}
                            style={{ fontFamily: 'Inter-Bold' }}
                          >
                            {prop.matchConfidence}
                          </Text>
                        </View>
                      </View>

                      {/* Metadata Pill Box (Distance & Landlord Info) */}
                      <View className="flex-row items-center justify-between rounded-[12px] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 mb-2.5">
                        <View className="flex-row items-center gap-1.5 shrink-0">
                          <Navigation
                            size={12}
                            color={isDark ? '#2DD4BF' : '#0D9488'}
                          />
                          <Text
                            className="text-[11.5px] text-slate-900 dark:text-white"
                            style={{ fontFamily: 'Inter-SemiBold' }}
                          >
                            {prop.distance} away
                          </Text>
                        </View>

                        <View className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700" />

                        <View className="flex-row items-center gap-1.5 min-w-0 flex-1 justify-end">
                          <User
                            size={12}
                            color={isDark ? '#94A3B8' : '#64748B'}
                          />
                          <Text
                            numberOfLines={1}
                            className="text-[11.5px] text-slate-600 dark:text-slate-400"
                            style={{ fontFamily: 'Inter-Medium' }}
                          >
                            {prop.landlordName}
                          </Text>
                        </View>
                      </View>

                      {/* Available Units Chip Strip */}
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

                      {/* CTA Action Button */}
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
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
