import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  MapPin, Search, Ticket, ChevronRight, User, Mail, Phone, Shield,
  X, ArrowRight, CheckCircle,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mockInvitationCodes, SelectedProperty } from '@/data/mockData';
import { SHADOWS } from '@/constants/theme';

export default function TenantPlaceSelectionScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteError, setInviteError] = useState('');

  const handleInviteSubmit = () => {
    const code = inviteCode.trim().toUpperCase();
    const match = mockInvitationCodes[code];
    if (match) {
      const selected: SelectedProperty = {
        id: match.id,
        name: match.name,
        address: match.address,
        selectedUnit: match.selectedUnit,
        landlordName: match.landlordName,
        propertyManagerName: match.propertyManagerName,
        verificationMethod: match.verificationMethod,
        approvalStatus: match.approvalStatus,
        monthlyRent: match.monthlyRent,
        securityDeposit: match.securityDeposit,
      };
      setInviteModalVisible(false);
      setInviteCode('');
      setInviteError('');
      router.replace({ pathname: '/onboarding/property-confirmation', params: { source: 'invitation' } });
      // Store selection in a module-level holder for the confirmation screen.
      (globalThis as any).__pendingProperty = selected;
    } else {
      setInviteError('Invalid invitation code. Please check and try again.');
    }
  };

  const options = [
    {
      icon: MapPin,
      title: 'Use Live Location',
      desc: 'Detect nearby rental properties using your current location',
      color: '#0284C7',
      bg: '#E0F2FE',
      onPress: () => router.push('/onboarding/location-based'),
    },
    {
      icon: Search,
      title: 'Search Property Manually',
      desc: 'Search by property name, address, landlord name, or unit number',
      color: '#1E6B5A',
      bg: '#E6F5F0',
      onPress: () => router.push('/onboarding/property-search'),
    },
    {
      icon: Ticket,
      title: 'Enter Invitation Code',
      desc: 'Enter a code shared by your landlord or property manager',
      color: '#7C3AED',
      bg: '#F3E8FF',
      onPress: () => { setInviteError(''); setInviteModalVisible(true); },
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1E6B5A', '#0D9488', '#115E59']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 28 }]}
        >
          <View style={styles.heroOrb1} />
          <View style={styles.heroOrb2} />
          <Animated.View entering={FadeInDown.duration(600)} style={styles.heroContent}>
            <View style={styles.heroIconWrap}>
              <MapPin size={30} color="#FFFFFF" />
            </View>
            <Text style={[styles.heroTitle, { fontFamily: 'Inter-ExtraBold' }]}>Connect Your Rental Place</Text>
            <Text style={[styles.heroSubtitle, { fontFamily: 'Inter-Regular' }]}>
              Select the property or unit where you are currently staying so your landlord can verify your tenancy.
            </Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(150).duration(500)} style={[styles.tenantCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <View style={styles.tenantCardHeader}>
              <View style={[styles.tenantAvatar, { backgroundColor: colors.primaryGlow }]}>
                <User size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tenantName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{user?.name || 'Tenant'}</Text>
                <Text style={[styles.tenantRole, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>Current login role: Tenant</Text>
              </View>
              <View style={[styles.roleBadge, { backgroundColor: colors.primaryGlow }]}>
                <Shield size={12} color={colors.primary} />
                <Text style={[styles.roleBadgeText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>Tenant</Text>
              </View>
            </View>
            <View style={[styles.tenantDivider, { backgroundColor: colors.borderLight }]} />
            <DetailRow icon={<Mail size={15} color={colors.textMuted} />} label="Email" value={user?.email || ''} colors={colors} />
            <DetailRow icon={<Phone size={15} color={colors.textMuted} />} label="Phone" value={user?.phone || ''} colors={colors} />
          </Animated.View>

          <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>CHOOSE A METHOD</Text>

          {options.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <Animated.View key={opt.title} entering={FadeInUp.delay(250 + i * 100).duration(400)}>
                <Pressable
                  style={({ pressed }) => [styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }, SHADOWS.card]}
                  onPress={opt.onPress}
                >
                  <View style={[styles.optionIcon, { backgroundColor: opt.bg }]}>
                    <Icon size={22} color={opt.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{opt.title}</Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{opt.desc}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textMuted} />
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={inviteModalVisible} animationType="slide" transparent onRequestClose={() => setInviteModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }, SHADOWS.prominent]}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ticket size={22} color="#7C3AED" />
              </View>
              <Pressable style={styles.modalClose} onPress={() => setInviteModalVisible(false)} hitSlop={8}>
                <X size={22} color={colors.textMuted} />
              </Pressable>
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Enter Invitation Code</Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
              Enter the code shared by your landlord or property manager to instantly connect to your rental property.
            </Text>
            <View style={[styles.codeInput, { backgroundColor: colors.inputBg, borderColor: inviteError ? colors.danger : colors.inputBorder }]}>
              <TextInput
                style={[styles.codeField, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}
                value={inviteCode}
                onChangeText={(t) => { setInviteCode(t); setInviteError(''); }}
                placeholder="e.g. RR-GREEN-3B"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
            {inviteError ? (
              <Text style={[styles.inviteError, { color: colors.danger, fontFamily: 'Inter-Medium' }]}>{inviteError}</Text>
            ) : null}
            <Pressable onPress={handleInviteSubmit} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
              <LinearGradient colors={['#1E6B5A', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalSubmit}>
                <Text style={[styles.modalSubmitText, { fontFamily: 'Inter-SemiBold' }]}>Verify & Continue</Text>
                <ArrowRight size={17} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
            <View style={[styles.hintBox, { backgroundColor: colors.surfaceSecondary }]}>
              <CheckCircle size={14} color={colors.primary} />
              <Text style={[styles.hintText, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>Demo code: RR-GREEN-3B</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function DetailRow({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string; colors: any }) {
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: colors.surfaceSecondary }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: {
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  heroOrb1: { position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.05)' },
  heroOrb2: { position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.03)' },
  heroContent: { alignItems: 'center' },
  heroIconWrap: { width: 64, height: 64, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
  heroTitle: { fontSize: 24, color: '#FFFFFF', textAlign: 'center', letterSpacing: -0.4 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 8, lineHeight: 20 },

  content: { paddingHorizontal: 20, paddingTop: 24 },

  tenantCard: { borderRadius: 20, borderWidth: 1, padding: 18, marginBottom: 24 },
  tenantCardHeader: { flexDirection: 'row', alignItems: 'center' },
  tenantAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  tenantName: { fontSize: 16 },
  tenantRole: { fontSize: 12, marginTop: 3 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  roleBadgeText: { fontSize: 11 },
  tenantDivider: { height: 1, marginVertical: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  detailLabel: { fontSize: 11 },
  detailValue: { fontSize: 14, marginTop: 2 },

  sectionLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: 14, marginLeft: 4 },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  optionIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  optionTitle: { fontSize: 16 },
  optionDesc: { fontSize: 13, marginTop: 4, lineHeight: 18 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  modalClose: { padding: 4 },
  modalTitle: { fontSize: 20 },
  modalDesc: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 20 },
  codeInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4 },
  codeField: { flex: 1, fontSize: 16, paddingVertical: 12, letterSpacing: 1.5 },
  inviteError: { fontSize: 13, marginTop: 10 },
  modalSubmit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16, marginTop: 18 },
  modalSubmitText: { color: '#FFFFFF', fontSize: 15 },
  hintBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 12, marginTop: 16 },
  hintText: { fontSize: 12 },
});
