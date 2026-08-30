import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Building2, MapPin, User, Users, CheckCircle, ArrowRight,
  Calendar, Wallet, Shield, FileText, Tag,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mockNearbyProperties, SelectedProperty } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const VERIFICATION_LABELS: Record<string, string> = {
  'Live Location': 'Live Location',
  'Manual Search': 'Manual Search',
  'Invitation Code': 'Invitation Code',
  'Manual Verification': 'Manual Verification',
};

export default function PropertyConfirmationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { setSelectedProperty } = useAuth();

  const [property, setProperty] = useState<SelectedProperty | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [leaseStart, setLeaseStart] = useState('2026-01-01');
  const [monthlyRent, setMonthlyRent] = useState('18000');
  const [securityDeposit, setSecurityDeposit] = useState('36000');
  const [tenantNote, setTenantNote] = useState('Hello, I am requesting access to connect with this rental unit.');
  const [confirmStay, setConfirmStay] = useState(false);
  const [confirmVerify, setConfirmVerify] = useState(false);

  useEffect(() => {
    const pending = (globalThis as any).__pendingProperty as SelectedProperty | undefined;
    if (pending) {
      setProperty(pending);
      if (pending.selectedUnit) setSelectedUnit(pending.selectedUnit);
      if (pending.monthlyRent) setMonthlyRent(String(pending.monthlyRent));
      if (pending.securityDeposit) setSecurityDeposit(String(pending.securityDeposit));
    }
  }, []);

  // For nearby/manual-search properties, derive available units from mock data.
  const availableUnits: string[] = property
    ? property.id.startsWith('manual')
      ? []
      : mockNearbyProperties.find((p) => p.id === property.id)?.unitsAvailable || (property.selectedUnit ? [property.selectedUnit] : [])
    : [];

  const canSubmit = !!property && (selectedUnit !== '' || availableUnits.length === 0) && confirmStay && confirmVerify;

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
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Confirm Property" />
        <View style={styles.missingState}>
          <Building2 size={32} color={colors.textMuted} />
          <Text style={[styles.missingText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>
            No property selected. Please go back and choose a property.
          </Text>
          <Pressable onPress={() => router.replace('/onboarding/tenant-place-selection')} style={[styles.missingBtn, { backgroundColor: colors.primaryGlow }]}>
            <Text style={[styles.missingBtnText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>Back to Selection</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Confirm Property" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(400)} style={[styles.propSummaryCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <View style={styles.propSummaryHeader}>
              <View style={[styles.propSummaryIcon, { backgroundColor: colors.primaryGlow }]}>
                <Building2 size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.propSummaryName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{property.name}</Text>
                <View style={styles.propSummaryAddrRow}>
                  <MapPin size={12} color={colors.textMuted} />
                  <Text style={[styles.propSummaryAddr, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{property.address}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.summaryDivider, { backgroundColor: colors.borderLight }]} />

            <SummaryRow icon={<User size={14} color={colors.textMuted} />} label="Landlord" value={property.landlordName} colors={colors} />
            <SummaryRow icon={<Users size={14} color={colors.textMuted} />} label="Property Manager" value={property.propertyManagerName} colors={colors} />
            <SummaryRow icon={<Tag size={14} color={colors.textMuted} />} label="Verification Method" value={VERIFICATION_LABELS[property.verificationMethod] || property.verificationMethod} colors={colors} />
            {property.distance ? <SummaryRow icon={<MapPin size={14} color={colors.textMuted} />} label="Distance" value={property.distance} colors={colors} /> : null}
            {property.matchConfidence ? <SummaryRow icon={<CheckCircle size={14} color={colors.textMuted} />} label="Match Confidence" value={property.matchConfidence} colors={colors} /> : null}
          </Animated.View>

          {availableUnits.length > 0 && (
            <Animated.View entering={FadeInUp.delay(100).duration(400)}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Select Your Unit</Text>
              <View style={styles.unitsGrid}>
                {availableUnits.map((unit) => {
                  const active = selectedUnit === unit;
                  return (
                    <Pressable
                      key={unit}
                      onPress={() => setSelectedUnit(unit)}
                      style={[
                        styles.unitOption,
                        { backgroundColor: active ? colors.primaryGlow : colors.surface, borderColor: active ? colors.primary : colors.border },
                      ]}
                    >
                      <Text style={[styles.unitOptionText, { color: active ? colors.primary : colors.textSecondary, fontFamily: active ? 'Inter-SemiBold' : 'Inter-Medium' }]}>{unit}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(150).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>RENTAL DETAILS</Text>

            <View style={[styles.inputGroup, { marginBottom: 14 }]}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Lease Start Date</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Calendar size={16} color={colors.textMuted} />
                <TextInput style={[styles.input, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]} value={leaseStart} onChangeText={setLeaseStart} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textMuted} />
              </View>
            </View>

            <View style={styles.dualRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Monthly Rent (Rs.)</Text>
                <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                  <Wallet size={16} color={colors.textMuted} />
                  <TextInput style={[styles.input, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]} value={monthlyRent} onChangeText={setMonthlyRent} placeholder="18000" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Security Deposit (Rs.)</Text>
                <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                  <Shield size={16} color={colors.textMuted} />
                  <TextInput style={[styles.input, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]} value={securityDeposit} onChangeText={setSecurityDeposit} placeholder="36000" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
                </View>
              </View>
            </View>

            <View style={[styles.inputGroup, { marginBottom: 14 }]}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Note to Landlord</Text>
              <View style={[styles.noteRow, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <FileText size={16} color={colors.textMuted} style={{ alignSelf: 'flex-start', marginTop: 12, marginLeft: 12 }} />
                <TextInput style={[styles.noteInput, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]} value={tenantNote} onChangeText={setTenantNote} placeholder="Add a message for your landlord..." placeholderTextColor={colors.textMuted} multiline numberOfLines={4} textAlignVertical="top" />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>CONFIRMATION</Text>

            <Pressable style={styles.checkboxRow} onPress={() => setConfirmStay(!confirmStay)}>
              <View style={[styles.checkbox, { backgroundColor: confirmStay ? colors.primary : 'transparent', borderColor: confirmStay ? colors.primary : colors.inputBorder }]}>
                {confirmStay ? <CheckCircle size={16} color="#FFFFFF" /> : null}
              </View>
              <Text style={[styles.checkboxText, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]}>
                I confirm that I am currently staying at this rental place.
              </Text>
            </Pressable>

            <Pressable style={styles.checkboxRow} onPress={() => setConfirmVerify(!confirmVerify)}>
              <View style={[styles.checkbox, { backgroundColor: confirmVerify ? colors.primary : 'transparent', borderColor: confirmVerify ? colors.primary : colors.inputBorder }]}>
                {confirmVerify ? <CheckCircle size={16} color="#FFFFFF" /> : null}
              </View>
              <Text style={[styles.checkboxText, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]}>
                I understand that the landlord/property manager may verify my request.
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={({ pressed }) => [{ opacity: !canSubmit ? 0.5 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}
        >
          <LinearGradientWrapper active={canSubmit}>
            <Text style={[styles.submitText, { fontFamily: 'Inter-SemiBold' }]}>Send Request to Landlord</Text>
            <ArrowRight size={17} color="#FFFFFF" />
          </LinearGradientWrapper>
        </Pressable>
      </View>
    </View>
  );
}

function LinearGradientWrapper({ children, active }: { children: React.ReactNode; active: boolean }) {
  const { LinearGradient } = require('expo-linear-gradient');
  return (
    <LinearGradient colors={active ? ['#1E6B5A', '#0D9488'] : ['#CBD5E1', '#94A3B8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
      {children}
    </LinearGradient>
  );
}

function SummaryRow({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string; colors: any }) {
  return (
    <View style={styles.summaryRow}>
      <View style={[styles.summaryIcon, { backgroundColor: colors.surfaceSecondary }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.summaryLabel, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{label}</Text>
        <Text style={[styles.summaryValue, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  propSummaryCard: { borderRadius: 20, borderWidth: 1, padding: 18, marginBottom: 24 },
  propSummaryHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  propSummaryIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  propSummaryName: { fontSize: 17 },
  propSummaryAddrRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  propSummaryAddr: { fontSize: 13, flex: 1 },
  summaryDivider: { height: 1, marginVertical: 14 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  summaryIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  summaryLabel: { fontSize: 11 },
  summaryValue: { fontSize: 14, marginTop: 2 },

  fieldLabel: { fontSize: 13, marginBottom: 8 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: 14, marginLeft: 2 },

  unitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  unitOption: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5 },
  unitOptionText: { fontSize: 14 },

  inputGroup: {},
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4, gap: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 12 },
  dualRow: { flexDirection: 'row', marginBottom: 14 },
  noteRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, paddingVertical: 4, paddingRight: 12 },
  noteInput: { flex: 1, fontSize: 14, paddingVertical: 10, paddingHorizontal: 10, minHeight: 90 },

  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxText: { flex: 1, fontSize: 14, lineHeight: 20 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 24 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  submitText: { color: '#FFFFFF', fontSize: 15 },

  missingState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  missingText: { fontSize: 14, textAlign: 'center', marginTop: 14, marginBottom: 20, lineHeight: 20 },
  missingBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  missingBtnText: { fontSize: 14 },
});
