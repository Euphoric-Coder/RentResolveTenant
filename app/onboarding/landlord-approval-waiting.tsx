import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  CheckCircle, Clock, Send, Building2, User, Users,
  ArrowRight, RefreshCw, Info, Home,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { SelectedProperty } from '@/data/mockData';
import { SHADOWS } from '@/constants/theme';

const TIMELINE = [
  { id: 's1', label: 'Property selected', icon: Building2 },
  { id: 's2', label: 'Tenant details submitted', icon: User },
  { id: 's3', label: 'Request sent to landlord', icon: Send },
  { id: 's4', label: 'Waiting for approval', icon: Clock },
  { id: 's5', label: 'Dashboard access', icon: Home },
];

export default function LandlordApprovalWaitingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { completeOnboarding, selectedProperty } = useAuth();
  const insets = useSafeAreaInsets();
  const [property, setProperty] = useState<SelectedProperty | null>(null);

  useEffect(() => {
    const pending = (globalThis as any).__pendingProperty as SelectedProperty | undefined;
    if (pending) setProperty(pending);
    else if (selectedProperty) setProperty(selectedProperty);
  }, [selectedProperty]);

  const requestId = property ? `REQ-${property.id.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${String(Math.floor(1000 + Math.random() * 9000))}` : 'REQ-PENDING';
  const submittedTime = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleContinue = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleChangeProperty = () => {
    router.replace('/onboarding/tenant-place-selection');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerSection, { paddingTop: insets.top + 28 }]}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.headerContent}>
            <View style={styles.headerIconWrap}>
              <Clock size={34} color="#FFFFFF" />
            </View>
            <Text style={[styles.headerTitle, { fontFamily: 'Inter-ExtraBold' }]}>Waiting for Landlord Approval</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: 'Inter-Regular' }]}>
              Your request has been sent to the landlord/property manager for verification. Once approved, your tenant dashboard will be activated for this property.
            </Text>
          </Animated.View>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(150).duration(500)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>STATUS TIMELINE</Text>
            <View style={[styles.timelineCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
              {TIMELINE.map((step, i) => {
                const Icon = step.icon;
                const isCurrent = i === 3;
                const isDone = i < 3;
                const isFuture = i > 3;
                return (
                  <View key={step.id} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[
                        styles.timelineDot,
                        {
                          backgroundColor: isDone ? colors.success : isCurrent ? colors.warning : colors.surfaceSecondary,
                          borderColor: isDone ? colors.success : isCurrent ? colors.warning : colors.border,
                        },
                      ]}>
                        <Icon size={14} color={isDone || isCurrent ? '#FFFFFF' : colors.textMuted} />
                      </View>
                      {i < TIMELINE.length - 1 ? (
                        <View style={[styles.timelineConnector, { backgroundColor: isDone ? colors.success : colors.borderLight }]} />
                      ) : null}
                    </View>
                    <View style={{ flex: 1, paddingBottom: i < TIMELINE.length - 1 ? 18 : 0 }}>
                      <Text style={[
                        styles.timelineLabel,
                        {
                          color: isFuture ? colors.textMuted : colors.textPrimary,
                          fontFamily: isCurrent ? 'Inter-SemiBold' : 'Inter-Medium',
                        },
                      ]}>
                        {step.label}
                      </Text>
                      {isCurrent ? (
                        <Text style={[styles.timelineSubLabel, { color: colors.warning, fontFamily: 'Inter-Regular' }]}>In progress...</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          {property && (
            <Animated.View entering={FadeInUp.delay(250).duration(500)} style={[styles.propCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
              <View style={styles.propCardHeader}>
                <View style={[styles.propCardIcon, { backgroundColor: colors.primaryGlow }]}>
                  <Building2 size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.propCardName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{property.name}</Text>
                  <Text style={[styles.propCardUnit, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
                    Unit: {property.selectedUnit || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: colors.warningLight }]}>
                  <Clock size={12} color={colors.warning} />
                  <Text style={[styles.statusBadgeText, { color: colors.warning, fontFamily: 'Inter-SemiBold' }]}>Pending</Text>
                </View>
              </View>

              <View style={[styles.propDivider, { backgroundColor: colors.borderLight }]} />

              <DetailRow icon={<User size={14} color={colors.textMuted} />} label="Landlord" value={property.landlordName} colors={colors} />
              <DetailRow icon={<Users size={14} color={colors.textMuted} />} label="Property Manager" value={property.propertyManagerName} colors={colors} />
              <DetailRow icon={<Send size={14} color={colors.textMuted} />} label="Request ID" value={requestId} colors={colors} />
              <DetailRow icon={<Clock size={14} color={colors.textMuted} />} label="Submitted" value={submittedTime} colors={colors} />
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(350).duration(500)} style={[styles.demoNote, { backgroundColor: colors.warningLight, borderColor: colors.warning + '40' }]}>
            <View style={[styles.demoNoteIcon, { backgroundColor: colors.warning }]}>
              <Info size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.demoNoteTitle, { color: colors.warning, fontFamily: 'Inter-Bold' }]}>Demo Mode</Text>
              <Text style={[styles.demoNoteDesc, { color: colors.warning, fontFamily: 'Inter-Regular' }]}>
                In a real application, the tenant would wait until the landlord approves this request. For this mock version, you can continue directly to the dashboard.
              </Text>
            </View>
          </Animated.View>

          <Pressable onPress={handleContinue} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            <LinearGradientWrapper>
              <Text style={[styles.continueText, { fontFamily: 'Inter-SemiBold' }]}>Continue to Dashboard Mock Mode</Text>
              <ArrowRight size={17} color="#FFFFFF" />
            </LinearGradientWrapper>
          </Pressable>

          <Pressable onPress={handleChangeProperty} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
            <View style={[styles.changeBtn, { borderColor: colors.border }]}>
              <RefreshCw size={16} color={colors.textSecondary} />
              <Text style={[styles.changeBtnText, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Change Selected Property</Text>
            </View>
          </Pressable>

          <Text style={[styles.footnote, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
            This approval step will be connected to the landlord dashboard when backend integration is added.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function LinearGradientWrapper({ children }: { children: React.ReactNode }) {
  const { LinearGradient } = require('expo-linear-gradient');
  return (
    <LinearGradient colors={['#1E6B5A', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueBtn}>
      {children}
    </LinearGradient>
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
  headerSection: {
    backgroundColor: '#D97706',
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  headerContent: { alignItems: 'center' },
  headerIconWrap: { width: 68, height: 68, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', marginBottom: 16 },
  headerTitle: { fontSize: 22, color: '#FFFFFF', textAlign: 'center', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 8, lineHeight: 20 },

  content: { paddingHorizontal: 20, paddingTop: 24 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: 14, marginLeft: 2 },

  timelineCard: { borderRadius: 20, borderWidth: 1, padding: 20 },
  timelineItem: { flexDirection: 'row' },
  timelineLeft: { alignItems: 'center', marginRight: 14 },
  timelineDot: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  timelineConnector: { width: 2, flex: 1, minHeight: 22, marginTop: 4 },
  timelineLabel: { fontSize: 14, lineHeight: 20 },
  timelineSubLabel: { fontSize: 11, marginTop: 3 },

  propCard: { borderRadius: 20, borderWidth: 1, padding: 18, marginTop: 16, marginBottom: 16 },
  propCardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  propCardIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  propCardName: { fontSize: 16 },
  propCardUnit: { fontSize: 13, marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusBadgeText: { fontSize: 11 },
  propDivider: { height: 1, marginVertical: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  detailLabel: { fontSize: 11 },
  detailValue: { fontSize: 14, marginTop: 2 },

  demoNote: { flexDirection: 'row', gap: 12, borderRadius: 16, borderWidth: 1.5, padding: 16, marginBottom: 20 },
  demoNoteIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  demoNoteTitle: { fontSize: 14 },
  demoNoteDesc: { fontSize: 13, marginTop: 4, lineHeight: 19 },

  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  continueText: { color: '#FFFFFF', fontSize: 15 },

  changeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 14, borderWidth: 1.5, marginTop: 12 },
  changeBtnText: { fontSize: 14 },

  footnote: { fontSize: 12, textAlign: 'center', marginTop: 20, lineHeight: 17, paddingHorizontal: 20 },
});
