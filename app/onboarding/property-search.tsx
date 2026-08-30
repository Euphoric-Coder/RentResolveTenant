import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Search, Building2, User, Users, MapPin, ArrowRight,
  HelpCircle, FileEdit, X,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockNearbyProperties, NearbyProperty, SelectedProperty } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

export default function PropertySearchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
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

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.inputBorder }, SHADOWS.soft]}>
            <Search size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]}
              value={query}
              onChangeText={setQuery}
              placeholder="Search by property name, address, landlord, or unit number"
              placeholderTextColor={colors.textMuted}
              autoCorrect={false}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8} style={styles.clearBtn}>
                <X size={16} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>

          {results.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.soft]}>
              <HelpCircle size={32} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>
                No matching property found
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
                Try a different name, address, or landlord.
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.resultsLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>
                {results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'}
              </Text>
              {results.map((prop, i) => (
                <Animated.View key={prop.id} entering={FadeInUp.delay(i * 80).duration(300)}>
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
                    </View>

                    <View style={[styles.propMetaRow, { borderColor: colors.borderLight }]}>
                      <View style={styles.propMetaItem}>
                        <User size={13} color={colors.textMuted} />
                        <Text style={[styles.propMetaText, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{prop.landlordName}</Text>
                      </View>
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
              ))}
            </>
          )}

          <View style={[styles.helperCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <View style={[styles.helperIcon, { backgroundColor: '#FEF3C7' }]}>
              <FileEdit size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.helperTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>Cannot find your property?</Text>
              <Text style={[styles.helperDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
                You can still submit a manual connection request.
              </Text>
            </View>
          </View>

          <Pressable onPress={handleManualVerification} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            <View style={[styles.manualBtn, { borderColor: colors.primary }]}>
              <Text style={[styles.manualBtnText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>Request Manual Verification</Text>
              <ArrowRight size={16} color={colors.primary} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 12, paddingHorizontal: 10 },
  clearBtn: { padding: 6 },
  resultsLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: 14, marginLeft: 2 },
  propCard: { borderRadius: 20, borderWidth: 1, padding: 18, marginBottom: 14 },
  propHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  propIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  propName: { fontSize: 16 },
  propAddrRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  propAddr: { fontSize: 12, flex: 1 },
  propMetaRow: { flexDirection: 'row', gap: 18, marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  propMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  propMetaText: { fontSize: 12 },
  unitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  unitChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  unitChipText: { fontSize: 12 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 13, marginTop: 16 },
  selectBtnText: { fontSize: 14 },
  emptyState: { alignItems: 'center', padding: 36, borderRadius: 18, borderWidth: 1, marginBottom: 20 },
  emptyTitle: { fontSize: 16, marginTop: 14 },
  emptyDesc: { fontSize: 13, marginTop: 6, textAlign: 'center' },
  helperCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 24, marginBottom: 14 },
  helperIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  helperTitle: { fontSize: 14 },
  helperDesc: { fontSize: 12, marginTop: 4 },
  manualBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 15, borderWidth: 1.5 },
  manualBtnText: { fontSize: 14 },
});
