import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Search, Building2, User, Users, MapPin, ArrowRight,
  HelpCircle, FileEdit, X, Sparkles,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockNearbyProperties, NearbyProperty, SelectedProperty } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

export default function PropertySearchScreen() {
  const { colors } = useTheme();
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
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Search Property" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.soft]}>
              <Search size={18} color={colors.primary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}
                value={query}
                onChangeText={setQuery}
                placeholder="Search building, landlord, street or unit..."
                placeholderTextColor={colors.textMuted}
                autoCorrect={false}
                returnKeyType="search"
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={8} style={[styles.clearBtn, { backgroundColor: colors.surfaceSecondary }]}>
                  <X size={14} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
          </Animated.View>

          {results.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceSecondary }]}>
                <HelpCircle size={32} color={colors.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>
                No Properties Found
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
                We couldn't find any property matching "{query}". You can request manual verification below.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.resultsHeaderRow}>
                <Text style={[styles.resultsLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>
                  {results.length} {results.length === 1 ? 'PROPERTY MATCH' : 'PROPERTIES MATCHED'}
                </Text>
              </View>

              {results.map((prop, i) => (
                <Animated.View key={prop.id} entering={FadeInUp.delay(i * 70).duration(300)}>
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
                    </View>

                    <View style={[styles.propMetaContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderLight }]}>
                      <View style={styles.propMetaItem}>
                        <User size={13} color={colors.textMuted} />
                        <Text style={[styles.propMetaText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]} numberOfLines={1}>Owner: {prop.landlordName}</Text>
                      </View>
                      <View style={styles.propMetaDivider} />
                      <View style={styles.propMetaItem}>
                        <Users size={13} color={colors.textMuted} />
                        <Text style={[styles.propMetaText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]} numberOfLines={1}>Manager: {prop.propertyManagerName}</Text>
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
              ))}
            </>
          )}

          {/* Manual Option */}
          <View style={[styles.helperCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <View style={[styles.helperIcon, { backgroundColor: '#FEF3C7' }]}>
              <FileEdit size={22} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.helperTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Cannot find your property?</Text>
              <Text style={[styles.helperDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
                Submit your landlord or unit details manually and we'll route verification to them.
              </Text>
            </View>
          </View>

          <Pressable onPress={handleManualVerification} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            <View style={[styles.manualBtn, { borderColor: colors.primary, backgroundColor: colors.primaryGlow }]}>
              <Text style={[styles.manualBtnText, { color: colors.primary, fontFamily: 'Inter-Bold' }]}>Request Manual Verification</Text>
              <ArrowRight size={17} color={colors.primary} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 18,
  },
  searchInput: { flex: 1, fontSize: 14.5, paddingVertical: 12, paddingHorizontal: 10 },
  clearBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resultsHeaderRow: { marginBottom: 12, paddingHorizontal: 4 },
  resultsLabel: { fontSize: 11, letterSpacing: 1 },
  propCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 14 },
  propHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  propIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  propName: { fontSize: 15.5 },
  propAddrRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  propAddr: { fontSize: 12, flex: 1 },
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
  emptyState: { alignItems: 'center', padding: 28, borderRadius: 18, borderWidth: 1, marginBottom: 18 },
  emptyIconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 16, marginBottom: 6 },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
  helperCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 16, marginBottom: 14 },
  helperIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  helperTitle: { fontSize: 14.5 },
  helperDesc: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  manualBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 15, borderWidth: 1.5 },
  manualBtnText: { fontSize: 14.5 },
});

