import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  CheckCircle, Clock, Send, Building2, User, Users,
  ArrowRight, RefreshCw, Info, Home, ShieldAlert,
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
  { id: 's5', label: 'Dashboard access activated', icon: Home },
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <LinearGradient
          colors={['#B45309', '#D97706', '#F59E0B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerSection, { paddingTop: Math.max(insets.top, 20) + 24 }]}
        >
          <View style={styles.headerOrb1} />
          <View style={styles.headerOrb2} />
          
          <Animated.View entering={FadeInDown.duration(600)} style={styles.headerContent}>
            <View style={styles.headerIconWrap}>
              <Clock size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.headerTitle, { fontFamily: 'Inter-Bold' }]}>Waiting for Landlord Approval</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: 'Inter-Regular' }]}>
              Your request is queued for verification. Once your landlord approves, your dashboard and services will unlock.
            </Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(120).duration(500)}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>STATUS TRACKER</Text>
              <Text style={[styles.sectionCount, { color: '#D97706', fontFamily: 'Inter-SemiBold' }]}>Step 4 of 5</Text>
            </View>
            
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
                          backgroundColor: isDone ? '#059669' : isCurrent ? '#D97706' : colors.surfaceSecondary,
                          borderColor: isDone ? '#059669' : isCurrent ? '#D97706' : colors.border,
                        },
                      ]}>
                        <Icon size={14} color={isDone || isCurrent ? '#FFFFFF' : colors.textMuted} />
                      </View>
                      {i < TIMELINE.length - 1 ? (
                        <View style={[styles.timelineConnector, { backgroundColor: isDone ? '#059669' : colors.borderLight }]} />
                      ) : null}
                    </View>
                    <View style={{ flex: 1, paddingBottom: i < TIMELINE.length - 1 ? 16 : 0, paddingTop: 4 }}>
                      <Text style={[
                        styles.timelineLabel,
                        {
                          color: isFuture ? colors.textMuted : colors.textPrimary,
                          fontFamily: isCurrent ? 'Inter-Bold' : isDone ? 'Inter-SemiBold' : 'Inter-Medium',
                        },
                      ]}>
                        {step.label}
                      </Text>
                      {isCurrent ? (
                        <Text style={[styles.timelineSubLabel, { color: '#D97706', fontFamily: 'Inter-Medium' }]}>Verification in progress</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          {property && (
            <Animated.View entering={FadeInUp.delay(220).duration(500)} style={[styles.propCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
              <View style={styles.propCardHeader}>
                <View style={[styles.propCardIcon, { backgroundColor: colors.primaryGlow }]}>
                  <Building2 size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={[styles.propCardName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{property.name}</Text>
                  <Text style={[styles.propCardUnit, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>
                    Unit: {property.selectedUnit || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                  <Clock size={12} color="#D97706" />
                  <Text style={[styles.statusBadgeText, { color: "#D97706", fontFamily: 'Inter-Bold' }]}>Pending</Text>
                </View>
              </View>

              <View style={[styles.propDivider, { backgroundColor: colors.borderLight }]} />

              <DetailRow icon={<User size={14} color={colors.textMuted} />} label="Landlord" value={property.landlordName} colors={colors} />
              <DetailRow icon={<Users size={14} color={colors.textMuted} />} label="Property Manager" value={property.propertyManagerName} colors={colors} />
              <DetailRow icon={<Send size={14} color={colors.textMuted} />} label="Request ID" value={requestId} colors={colors} />
              <DetailRow icon={<Clock size={14} color={colors.textMuted} />} label="Submitted On" value={submittedTime} colors={colors} />
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={[styles.demoNote, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.soft]}>
            <View style={[styles.demoNoteIcon, { backgroundColor: '#FEF3C7' }]}>
              <Info size={18} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.demoNoteTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Demo Prototype Notice</Text>
              <Text style={[styles.demoNoteDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
                In production, you'll receive a push notification when your landlord confirms. For previewing the app now, you can proceed directly.
              </Text>
            </View>
          </Animated.View>

          <Pressable onPress={handleContinue} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            <LinearGradient colors={['#134E48', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueBtn}>
              <Text style={[styles.continueText, { fontFamily: 'Inter-Bold' }]}>Explore Tenant Dashboard</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleChangeProperty} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            <View style={[styles.changeBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <RefreshCw size={15} color={colors.textSecondary} />
              <Text style={[styles.changeBtnText, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Change Selected Property</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string; colors: any }) {
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: colors.surfaceSecondary }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, { color: colors.textMuted, fontFamily: 'Inter-Medium' }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerSection: {
    paddingHorizontal: 22,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  headerOrb1: { position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.12)' },
  headerOrb2: { position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.08)' },
  headerContent: { alignItems: 'center' },
  headerIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 14 },
  headerTitle: { fontSize: 22, color: '#FFFFFF', textAlign: 'center', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13.5, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8, lineHeight: 19, paddingHorizontal: 12 },

  content: { paddingHorizontal: 18, paddingTop: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 4 },
  sectionLabel: { fontSize: 11.5, letterSpacing: 1 },
  sectionCount: { fontSize: 11.5 },

  timelineCard: { borderRadius: 18, borderWidth: 1, padding: 18 },
  timelineItem: { flexDirection: 'row' },
  timelineLeft: { alignItems: 'center', marginRight: 14 },
  timelineDot: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  timelineConnector: { width: 2, flex: 1, minHeight: 20, marginVertical: 3 },
  timelineLabel: { fontSize: 13.5, lineHeight: 18 },
  timelineSubLabel: { fontSize: 11, marginTop: 2 },

  propCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginTop: 18, marginBottom: 14 },
  propCardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  propCardIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  propCardName: { fontSize: 16 },
  propCardUnit: { fontSize: 13, marginTop: 3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusBadgeText: { fontSize: 10.5 },
  propDivider: { height: 1, marginVertical: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  detailLabel: { fontSize: 11 },
  detailValue: { fontSize: 13.5, marginTop: 1 },

  demoNote: { flexDirection: 'row', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 18 },
  demoNoteIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  demoNoteTitle: { fontSize: 13.5 },
  demoNoteDesc: { fontSize: 12, marginTop: 3, lineHeight: 17 },

  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  continueText: { color: '#FFFFFF', fontSize: 15 },

  changeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 14, borderWidth: 1, marginTop: 10 },
  changeBtnText: { fontSize: 13.5 },
});

