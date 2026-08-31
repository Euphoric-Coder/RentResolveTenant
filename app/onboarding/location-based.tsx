import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  MapPin, Navigation, Loader2, Building2, User, Users,
  ArrowRight, ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockNearbyProperties, NearbyProperty, SelectedProperty } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const MATCH_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'High Match': { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  'Possible Match': { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  'Nearby': { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD' },
};

export default function LocationBasedPropertyScreen() {
  const { colors } = useTheme();
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
    router.push({ pathname: '/onboarding/property-confirmation', params: { source: 'location' } });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Nearby Rental Properties" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={[styles.intro, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
              Detect nearby apartment buildings and rental residences using your device's location.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(100).duration(400)} style={[styles.permissionCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <View style={[styles.permissionIcon, { backgroundColor: colors.accentLight }]}>
              <Navigation size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.permHeader}>
                <Text style={[styles.permissionTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>Location Access</Text>
                <View style={[styles.secureBadge, { backgroundColor: colors.surfaceSecondary }]}>
                  <ShieldCheck size={12} color={colors.primary} />
                  <Text style={[styles.secureText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>Private</Text>
                </View>
              </View>
              <Text style={[styles.permissionDesc, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
                Used exclusively to locate rental places near you. Your coordinate history is never tracked.
              </Text>
            </View>
          </Animated.View>

          <Pressable onPress={handleUseLocation} disabled={loading} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            <LinearGradient colors={['#134E48', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.locateBtn}>
              {loading ? (
                <>
                  <Loader2 size={19} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={[styles.locateBtnText, { fontFamily: 'Inter-SemiBold' }]}>Scanning nearby area...</Text>
                </>
              ) : (
                <>
                  <MapPin size={19} color="#FFFFFF" />
                  <Text style={[styles.locateBtnText, { fontFamily: 'Inter-SemiBold' }]}>Use My Current Location</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>

          {loading && (
            <View style={styles.loadingState}>
              <Loader2 size={32} color={colors.primary} style={{ marginBottom: 12 }} />
              <Text style={[styles.loadingText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>Searching properties within 1 km...</Text>
            </View>
          )}

          {showResults && (
            <View style={{ marginTop: 24 }}>
              <View style={styles.resultsHeader}>
                <Text style={[styles.resultsLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>
                  FOUND {mockNearbyProperties.length} PROPERTIES
                </Text>
              </View>

              {mockNearbyProperties.map((prop, i) => {
                const mc = MATCH_COLORS[prop.matchConfidence] || MATCH_COLORS['Nearby'];
                return (
                  <Animated.View key={prop.id} entering={FadeInUp.delay(i * 100).duration(400)}>
                    <View style={[styles.propCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
                      <View style={styles.propHeader}>
                        <View style={[styles.propIcon, { backgroundColor: colors.primaryGlow }]}>
                          <Building2 size={22} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text style={[styles.propName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{prop.name}</Text>
                          <View style={styles.propAddrRow}>
                            <MapPin size={12} color={colors.textMuted} />
                            <Text style={[styles.propAddr, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]} numberOfLines={1}>{prop.address}</Text>
                          </View>
                        </View>
                        <View style={[styles.matchBadge, { backgroundColor: mc.bg, borderColor: mc.border }]}>
                          <Text style={[styles.matchBadgeText, { color: mc.text, fontFamily: 'Inter-Bold' }]}>{prop.matchConfidence}</Text>
                        </View>
                      </View>

                      <View style={[styles.propMetaContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderLight }]}>
                        <View style={styles.propMetaItem}>
                          <MapPin size={13} color={colors.textMuted} />
                          <Text style={[styles.propMetaText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>{prop.distance}</Text>
                        </View>
                        <View style={styles.propMetaDivider} />
                        <View style={styles.propMetaItem}>
                          <User size={13} color={colors.textMuted} />
                          <Text style={[styles.propMetaText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]} numberOfLines={1}>Owner: {prop.landlordName}</Text>
                        </View>
                      </View>

                      <View style={styles.unitsSection}>
                        <Text style={[styles.unitsLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>Available Units:</Text>
                        <View style={styles.unitsRow}>
                          {prop.unitsAvailable.map((unit) => (
                            <View key={unit} style={[styles.unitChip, { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderLight }]}>
                              <Text style={[styles.unitChipText, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>{unit}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <Pressable
                        onPress={() => handleSelect(prop)}
                        style={({ pressed }) => [styles.selectBtn, { backgroundColor: colors.primaryGlow, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                      >
                        <Text style={[styles.selectBtnText, { color: colors.primary, fontFamily: 'Inter-Bold' }]}>Select This Property</Text>
                        <ArrowRight size={16} color={colors.primary} />
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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 18 },
  intro: { fontSize: 13.5, lineHeight: 20, marginBottom: 18 },
  permissionCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 18 },
  permissionIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  permHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  permissionTitle: { fontSize: 14.5 },
  secureBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  secureText: { fontSize: 10 },
  permissionDesc: { fontSize: 12, lineHeight: 17 },
  locateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  locateBtnText: { color: '#FFFFFF', fontSize: 15 },
  loadingState: { alignItems: 'center', paddingVertical: 36 },
  loadingText: { fontSize: 13.5 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  resultsLabel: { fontSize: 11, letterSpacing: 1 },
  propCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 14 },
  propHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  propIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  propName: { fontSize: 15.5 },
  propAddrRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  propAddr: { fontSize: 12, flex: 1 },
  matchBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  matchBadgeText: { fontSize: 10, letterSpacing: 0.2 },
  propMetaContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, marginTop: 12 },
  propMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  propMetaDivider: { width: 1, height: 16, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  propMetaText: { fontSize: 11.5 },
  unitsSection: { marginTop: 12 },
  unitsLabel: { fontSize: 11, marginBottom: 6 },
  unitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  unitChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  unitChipText: { fontSize: 11.5 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 12, marginTop: 14 },
  selectBtnText: { fontSize: 13.5 },
});

