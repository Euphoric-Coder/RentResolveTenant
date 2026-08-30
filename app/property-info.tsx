import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Building2, MapPin, User, Phone, Mail, Calendar, Wallet, Shield, Zap, Droplets, Flame, Wifi, Wrench } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_PROPERTY } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

export default function PropertyInfoScreen() {
  const { colors } = useTheme();
  const p = MOCK_PROPERTY;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Property Info" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={[styles.heroCard, { backgroundColor: colors.surface }, SHADOWS.elevated]}>
          <LinearGradient
            colors={['#1E6B5A12', '#0D948808'] as [string, string]}
            style={styles.heroGlow}
          />
          <View style={[styles.heroIcon, { backgroundColor: colors.primaryLight }]}>
            <Building2 size={28} color={colors.primary} />
          </View>
          <Text style={[styles.heroName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{p.name}</Text>
          <Text style={[styles.heroUnit, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>{p.unit}</Text>
          <View style={styles.addressRow}>
            <MapPin size={14} color={colors.textMuted} />
            <Text style={[styles.addressText, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{p.fullAddress}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Contacts</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.card]}>
            <InfoRow icon={<User size={16} color={colors.primary} />} label="Landlord" value={p.landlordName} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow icon={<Phone size={16} color={colors.primary} />} label="Landlord Phone" value={p.landlordPhone} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow icon={<User size={16} color={colors.success} />} label="Property Manager" value={p.propertyManagerName} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow icon={<Phone size={16} color={colors.success} />} label="Manager Phone" value={p.propertyManagerPhone} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow icon={<Mail size={16} color={colors.success} />} label="Manager Email" value={p.propertyManagerEmail} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow icon={<Phone size={16} color={colors.danger} />} label="Emergency" value={p.emergencyContact} colors={colors} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Lease Details</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.card]}>
            <InfoRow icon={<Calendar size={16} color={colors.textMuted} />} label="Lease Start" value={p.leaseStart} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow icon={<Calendar size={16} color={colors.textMuted} />} label="Lease End" value={p.leaseEnd} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow icon={<Wallet size={16} color={colors.textMuted} />} label="Monthly Rent" value={`Rs. ${p.monthlyRent.toLocaleString()}`} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow icon={<Shield size={16} color={colors.textMuted} />} label="Security Deposit" value={`Rs. ${p.securityDeposit.toLocaleString()}`} colors={colors} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(450).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Utility Responsibility</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.card]}>
            <UtilityRow icon={<Zap size={16} color="#F59E0B" />} label="Electricity" value={p.utilityResponsibility.electricity} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <UtilityRow icon={<Droplets size={16} color="#3B82F6" />} label="Water" value={p.utilityResponsibility.water} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <UtilityRow icon={<Flame size={16} color="#EF4444" />} label="Gas" value={p.utilityResponsibility.gas} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <UtilityRow icon={<Wifi size={16} color="#0284C7" />} label="Internet" value={p.utilityResponsibility.internet} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <UtilityRow icon={<Wrench size={16} color="#6B7280" />} label="Maintenance" value={p.utilityResponsibility.maintenance} colors={colors} />
          </View>
        </Animated.View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string; colors: any }) {
  return (
    <View style={styles.infoRow}>
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>{value}</Text>
      </View>
    </View>
  );
}

function UtilityRow({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string; colors: any }) {
  const isTenant = value === 'Tenant';
  return (
    <View style={styles.utilityRow}>
      {icon}
      <Text style={[styles.utilityLabel, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>{label}</Text>
      <View style={[styles.utilityBadge, { backgroundColor: isTenant ? colors.warningLight : colors.successLight }]}>
        <Text style={[styles.utilityBadgeText, { color: isTenant ? colors.warning : colors.success, fontFamily: 'Inter-SemiBold' }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 4, overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20 },
  heroIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroName: { fontSize: 20 },
  heroUnit: { fontSize: 15, marginTop: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  addressText: { fontSize: 13, textAlign: 'center', flex: 1 },
  sectionTitle: { fontSize: 16, marginTop: 24, marginBottom: 12 },
  card: { borderRadius: 16, padding: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
  infoLabel: { fontSize: 11 },
  infoValue: { fontSize: 14, marginTop: 2 },
  divider: { height: 1, marginVertical: 10 },
  utilityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  utilityLabel: { flex: 1, fontSize: 14 },
  utilityBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  utilityBadgeText: { fontSize: 11 },
});
