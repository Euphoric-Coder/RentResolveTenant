import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  MapPin, Navigation, Loader2, Building2, User, Users,
  CheckCircle, ArrowRight, AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockNearbyProperties, NearbyProperty, SelectedProperty } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const MATCH_COLORS: Record<string, { bg: string; text: string }> = {
  'High Match': { bg: '#D1FAE5', text: '#059669' },
  'Possible Match': { bg: '#FEF3C7', text: '#B45309' },
  'Nearby': { bg: '#E0F2FE', text: '#0284C7' },
};

export default function LocationBasedPropertyScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleUseLocation = () => {
    // TODO: Replace mock location with expo-location integration later.
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1800);
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

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={[styles.intro, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
              Based on your current location, we found possible rental places near you.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(100).duration(400)} style={[styles.permissionCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <View style={[styles.permissionIcon, { backgroundColor: colors.accentLight }]}>
              <Navigation size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.permissionTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>Location Permission</Text>
              <Text style={[styles.permissionDesc, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
                We use your location only to find nearby rental properties. No location data is stored.
              </Text>
            </View>
          </Animated.View>

          <Pressable onPress={handleUseLocation} disabled={loading} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            <LinearGradientWrapper colors={['#1E6B5A', '#0D9488']}>
              {loading ? (
                <>
                  <Loader2 size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={[styles.locateBtnText, { fontFamily: 'Inter-SemiBold' }]}>Finding nearby properties...</Text>
                </>
              ) : (
                <>
                  <MapPin size={18} color="#FFFFFF" />
                  <Text style={[styles.locateBtnText, { fontFamily: 'Inter-SemiBold' }]}>Use My Current Location</Text>
                </>
              )}
            </LinearGradientWrapper>
          </Pressable>

          {loading && (
            <View style={styles.loadingState}>
              <Loader2 size={28} color={colors.primary} style={{ marginBottom: 12 }} />
              <Text style={[styles.loadingText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>Finding nearby properties...</Text>
            </View>
          )}

          {showResults && (
            <View style={{ marginTop: 24 }}>
              <Text style={[styles.resultsLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>
                {mockNearbyProperties.length} PROPERTIES FOUND NEAR YOU
              </Text>

              {mockNearbyProperties.map((prop, i) => {
                const mc = MATCH_COLORS[prop.matchConfidence] || MATCH_COLORS['Nearby'];
                return (
                  <Animated.View key={prop.id} entering={FadeInUp.delay(i * 120).duration(400)}>
                    <View style={[styles.propCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
                      <View style={styles.propHeader}>
                        <View style={[styles.propIcon, { backgroundColor: colors.primaryGlow }]}>
                          <Building2 size={20} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.propName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{prop.name}</Text>
                          <View style={styles.propAddrRow}>
                            <MapPin size={12} color={colors.textMuted} />
                            <Text style={[styles.propAddr, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{prop.address}</Text>
                          </View>
                        </View>
                        <View style={[styles.matchBadge, { backgroundColor: mc.bg }]}>
                          <Text style={[styles.matchBadgeText, { color: mc.text, fontFamily: 'Inter-SemiBold' }]}>{prop.matchConfidence}</Text>
                        </View>
                      </View>

                      <View style={[styles.propMetaRow, { borderColor: colors.borderLight }]}>
                        <View style={styles.propMetaItem}>
                          <MapPin size={13} color={colors.textMuted} />
                          <Text style={[styles.propMetaText, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{prop.distance}</Text>
                        </View>
                        <View style={styles.propMetaItem}>
                          <User size={13} color={colors.textMuted} />
                          <Text style={[styles.propMetaText, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{prop.landlordName}</Text>
                        </View>
                      </View>
                      <View style={[styles.propMetaRowAlt, { borderColor: colors.borderLight }]}>
                        <View style={styles.propMetaItem}>
                          <Users size={13} color={colors.textMuted} />
                          <Text style={[styles.propMetaText, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{prop.propertyManagerName}</Text>
                        </View>
                      </View>

                      <View style={styles.unitsRow}>
                        {prop.unitsAvailable.map((unit) => (
                          <View key={unit} style={[styles.unitChip, { backgroundColor: colors.surfaceSecondary }]}>
                            <Text style={[styles.unitChipText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>{unit}</Text>
                          </View>
                        ))}
                      </View>

                      <Pressable
                        onPress={() => handleSelect(prop)}
                        style={({ pressed }) => [styles.selectBtn, { backgroundColor: colors.primaryGlow, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
                      >
                        <Text style={[styles.selectBtnText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>Select Property</Text>
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

function LinearGradientWrapper({ children, colors: gradColors }: { children: React.ReactNode; colors: [string, string] }) {
  const { LinearGradient } = require('expo-linear-gradient');
  return (
    <LinearGradient colors={gradColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.locateBtn}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  permissionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20 },
  permissionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  permissionTitle: { fontSize: 14 },
  permissionDesc: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  locateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  locateBtnText: { color: '#FFFFFF', fontSize: 15 },
  loadingState: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { fontSize: 14 },
  resultsLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: 14, marginLeft: 2 },
  propCard: { borderRadius: 20, borderWidth: 1, padding: 18, marginBottom: 14 },
  propHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  propIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  propName: { fontSize: 16 },
  propAddrRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  propAddr: { fontSize: 12, flex: 1 },
  matchBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  matchBadgeText: { fontSize: 10 },
  propMetaRow: { flexDirection: 'row', gap: 18, marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  propMetaRowAlt: { flexDirection: 'row', gap: 18, marginTop: 10, paddingTop: 10, borderTopWidth: 1 },
  propMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  propMetaText: { fontSize: 12 },
  unitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  unitChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  unitChipText: { fontSize: 12 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 13, marginTop: 16 },
  selectBtnText: { fontSize: 14 },
});
