import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import {
  Plus, ClipboardList, Wallet, AlertTriangle, Bell,
  Clock, CheckCircle, AlertCircle, BarChart3, Megaphone,
  ChevronRight, ArrowRight, TrendingUp, Zap, Home, MessageSquare,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useMessaging } from '@/context/MessagingContext';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_REQUESTS, MOCK_ANNOUNCEMENTS, MOCK_ACTIVITY, MOCK_PROPERTY, MOCK_RENT_PAYMENTS } from '@/data/mockData';
import { StatCard } from '@/components/StatCard';
import { SectionHeader } from '@/components/SectionHeader';
import { SHADOWS } from '@/constants/theme';

export default function DashboardScreen() {
  const { user, selectedProperty } = useAuth();
  const { conversations, unreadCount } = useMessaging();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const latestConversation = conversations.length > 0 ? conversations[0] : null;

  const connectedName = selectedProperty?.name || MOCK_PROPERTY.name;
  const connectedUnit = selectedProperty?.selectedUnit || MOCK_PROPERTY.unit;
  const connectedAddress = selectedProperty?.address || MOCK_PROPERTY.address;

  const total = MOCK_REQUESTS.length;
  const open = MOCK_REQUESTS.filter(r => ['Submitted', 'Under Review'].includes(r.status)).length;
  const inProgress = MOCK_REQUESTS.filter(r => ['Approved', 'Assigned', 'In Progress'].includes(r.status)).length;
  const resolved = MOCK_REQUESTS.filter(r => ['Resolved', 'Closed'].includes(r.status)).length;
  const nextRent = MOCK_RENT_PAYMENTS.find(r => r.status === 'Pending');
  const emergencyRequests = MOCK_REQUESTS.filter(r => r.isEmergency && !['Resolved', 'Closed'].includes(r.status));
  const recentActivity = MOCK_ACTIVITY.slice(0, 3);
  const latestAnnouncements = MOCK_ANNOUNCEMENTS.slice(0, 2);

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={isDark ? ['#134E4A', '#0F766E', '#064E3B'] : ['#1E6B5A', '#0D9488', '#115E59']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={[styles.heroBg1]} />
          <View style={[styles.heroBg2]} />

          <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 24 }}>
            <Animated.View entering={FadeInDown.duration(600)} style={styles.heroTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.greeting, { fontFamily: 'Inter-Regular' }]}>{greetingTime()},</Text>
                <Text style={[styles.userName, { fontFamily: 'Inter-ExtraBold' }]}>{user?.name || 'Tenant'}</Text>
                <View style={styles.propertyPill}>
                  <View style={styles.propertyDot} />
                  <Text style={[styles.propertyText, { fontFamily: 'Inter-Medium' }]}>
                    {connectedName} - {connectedUnit}
                  </Text>
                </View>
              </View>
              <Pressable style={styles.bellButton} onPress={() => router.push('/notifications')}>
                <Bell size={22} color="#FFFFFF" />
                <View style={styles.bellDot} />
              </Pressable>
            </Animated.View>
          </View>
        </LinearGradient>

      </View>

      {nextRent && (
        <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} style={[styles.rentCard, SHADOWS.prominent]}>
          <LinearGradient
            colors={isDark ? ['#1E293B', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
            style={styles.rentCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.rentLeft}>
              <View style={[styles.rentIconWrap, { backgroundColor: colors.warningLight }]}>
                <Wallet size={18} color={colors.warning} />
              </View>
              <View>
                <Text style={[styles.rentLabel, { color: colors.textMuted, fontFamily: 'Inter-Medium' }]}>Upcoming Rent</Text>
                <Text style={[styles.rentAmount, { color: colors.textPrimary, fontFamily: 'Inter-ExtraBold' }]}>
                  Rs. {nextRent.amount.toLocaleString()}
                </Text>
                <Text style={[styles.rentDue, { color: colors.warning, fontFamily: 'Inter-SemiBold' }]}>Due {nextRent.dueDate}</Text>
              </View>
            </View>
            <Pressable style={styles.rentButton} onPress={() => router.push('/(tabs)/rent')}>
              <LinearGradient
                colors={['#1E6B5A', '#0D9488']}
                style={styles.rentButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.rentButtonText, { fontFamily: 'Inter-SemiBold' }]}>Pay</Text>
                <ArrowRight size={14} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      )}

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(150).duration(500)} style={[styles.connectedCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
          <View style={styles.connectedHeader}>
            <View style={[styles.connectedIcon, { backgroundColor: colors.primaryGlow }]}>
              <Home size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.connectedLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>CONNECTED PROPERTY</Text>
              <Text style={[styles.connectedName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>
                {selectedProperty ? `${connectedName} · ${connectedUnit}` : 'No property connected'}
              </Text>
              <Text style={[styles.connectedAddr, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
                {selectedProperty ? connectedAddress : 'Please connect your rental place to continue.'}
              </Text>
            </View>
            <View style={[styles.approvalBadge, { backgroundColor: colors.successLight }]}>
              <CheckCircle size={12} color={colors.success} />
              <Text style={[styles.approvalBadgeText, { color: colors.success, fontFamily: 'Inter-SemiBold' }]}>Mock Approved</Text>
            </View>
          </View>
        </Animated.View>

        {unreadCount > 0 && (
          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <Pressable
              style={({ pressed }) => [styles.messagingCard, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }, SHADOWS.card]}
              onPress={() => router.push('/(tabs)/messages')}
            >
              <View style={[styles.messagingIcon, { backgroundColor: colors.accentLight }]}>
                <MessageSquare size={18} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.messagingLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>MESSAGES</Text>
                <Text style={[styles.messagingDesc, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>
                  {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'} from your property manager
                </Text>
                {latestConversation && (
                  <Text style={[styles.messagingPreview, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]} numberOfLines={1}>
                    {latestConversation.participantName}: {latestConversation.lastMessage}
                  </Text>
                )}
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </Pressable>
          </Animated.View>
        )}

        {emergencyRequests.length > 0 && (
          <Animated.View entering={FadeIn.delay(300).duration(400)}>
            <Pressable
              style={[styles.emergencyBanner, { backgroundColor: colors.dangerLight }]}
              onPress={() => router.push({ pathname: '/request-detail', params: { id: emergencyRequests[0].id } })}
            >
              <LinearGradient
                colors={['rgba(220,38,38,0.08)', 'rgba(220,38,38,0.02)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.emergencyIconWrap}>
                <AlertTriangle size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.emergencyTitle, { color: colors.danger, fontFamily: 'Inter-Bold' }]}>
                  {emergencyRequests.length} Emergency {emergencyRequests.length === 1 ? 'Issue' : 'Issues'}
                </Text>
                <Text style={[styles.emergencyDesc, { color: colors.danger, fontFamily: 'Inter-Regular' }]}>{emergencyRequests[0].title}</Text>
              </View>
              <ChevronRight size={18} color={colors.danger} />
            </Pressable>
          </Animated.View>
        )}

        <View style={styles.statsRow}>
          <StatCard label="Total" value={total} color="#2563EB" icon={<BarChart3 size={18} color="#2563EB" />} index={0} />
          <StatCard label="Open" value={open} color="#0284C7" icon={<AlertCircle size={18} color="#0284C7" />} index={1} />
          <StatCard label="Active" value={inProgress} color="#D97706" icon={<Clock size={18} color="#D97706" />} index={2} />
          <StatCard label="Resolved" value={resolved} color="#059669" icon={<CheckCircle size={18} color="#059669" />} index={3} />
        </View>

        <SectionHeader title="Quick Actions" />
        <View style={styles.actionsGrid}>
          <QuickAction colors={colors} icon={<Plus size={20} color="#FFFFFF" />} label="Raise Request" gradient={['#1E6B5A', '#0D9488']} onPress={() => router.push('/create-request')} />
          <QuickAction colors={colors} icon={<ClipboardList size={20} color="#FFFFFF" />} label="View Requests" gradient={['#0369A1', '#0284C7']} onPress={() => router.push('/(tabs)/requests')} />
          <QuickAction colors={colors} icon={<MessageSquare size={20} color="#FFFFFF" />} label="Message Landlord" gradient={['#4338CA', '#6366F1']} onPress={() => router.push('/new-message')} />
          <QuickAction colors={colors} icon={<Wallet size={20} color="#FFFFFF" />} label="Rent Overview" gradient={['#B45309', '#D97706']} onPress={() => router.push('/(tabs)/rent')} />
        </View>

        <SectionHeader title="Recent Activity" actionLabel="View All" onAction={() => router.push('/activity-history')} />
        {recentActivity.map((item, i) => (
          <Animated.View key={item.id} entering={FadeInUp.delay(400 + i * 80).duration(400)}>
            <Pressable
              style={[styles.activityItem, { backgroundColor: colors.surface }, SHADOWS.soft]}
              onPress={() => item.linkedRequestId && router.push({ pathname: '/request-detail', params: { id: item.linkedRequestId } })}
            >
              <View style={[styles.activityDot, { backgroundColor: i === 0 ? colors.primary : colors.textMuted + '40' }]}>
                {i === 0 && <View style={styles.activityPulse} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.activityTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{item.title}</Text>
                <Text style={[styles.activityDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{item.description}</Text>
                <Text style={[styles.activityTime, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{item.timestamp}</Text>
              </View>
              <ChevronRight size={14} color={colors.textMuted} />
            </Pressable>
          </Animated.View>
        ))}

        <SectionHeader title="Announcements" actionLabel="View All" onAction={() => router.push('/announcements')} />
        {latestAnnouncements.map((ann, i) => (
          <Animated.View key={ann.id} entering={FadeInUp.delay(600 + i * 80).duration(400)}>
            <View style={[styles.announcementCard, { backgroundColor: colors.surface }, SHADOWS.soft]}>
              <View style={styles.announcementHeader}>
                <View style={[styles.announcementIcon, { backgroundColor: (ann.priority === 'High' ? colors.danger : colors.warning) + '14' }]}>
                  <Megaphone size={14} color={ann.priority === 'High' ? colors.danger : colors.warning} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.announcementTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]} numberOfLines={1}>{ann.title}</Text>
                  <Text style={[styles.announcementMeta, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{ann.date}</Text>
                </View>
                <View style={[styles.priorityDot, { backgroundColor: ann.priority === 'High' ? colors.danger : colors.warning }]} />
              </View>
              <Text style={[styles.announcementBody, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]} numberOfLines={2}>{ann.message}</Text>
            </View>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInUp.delay(800).duration(400)}>
          <LinearGradient
            colors={isDark ? ['rgba(52,211,153,0.08)', 'rgba(52,211,153,0.02)'] : ['rgba(30,107,90,0.06)', 'rgba(13,148,136,0.02)']}
            style={styles.insightCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.insightLeft}>
              <TrendingUp size={20} color={colors.primary} />
              <View>
                <Text style={[styles.insightTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>Resolution Rate</Text>
                <Text style={[styles.insightDesc, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>This quarter</Text>
              </View>
            </View>
            <Text style={[styles.insightValue, { color: colors.primary, fontFamily: 'Inter-ExtraBold' }]}>
              {Math.round((resolved / total) * 100)}%
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

function QuickAction({ colors, icon, label, gradient, onPress }: { colors: any; icon: React.ReactNode; label: string; gradient: [string, string]; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
      <LinearGradient colors={gradient} style={styles.quickActionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.quickActionIcon}>{icon}</View>
        <Text style={[styles.quickActionLabel, { fontFamily: 'Inter-SemiBold' }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    position: 'relative',
  },
  heroSection: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroBg2: {
    position: 'absolute',
    bottom: 20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: 28, color: '#FFFFFF', marginTop: 2, letterSpacing: -0.5 },
  propertyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
  },
  propertyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  propertyText: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bellDot: {
    position: 'absolute',
    top: 12,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: 'rgba(30,107,90,0.8)',
  },
  rentCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: -28,
    overflow: 'hidden',
  },
  rentCardGradient: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rentIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rentLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  rentAmount: { fontSize: 22, marginTop: 2, letterSpacing: -0.5 },
  rentDue: { fontSize: 11, marginTop: 2 },
  rentButton: { borderRadius: 12, overflow: 'hidden' },
  rentButtonGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  rentButtonText: { color: '#FFFFFF', fontSize: 14 },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  connectedCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 20 },
  connectedHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  connectedIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  connectedLabel: { fontSize: 10, letterSpacing: 1 },
  connectedName: { fontSize: 16, marginTop: 4 },
  connectedAddr: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  approvalBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  approvalBadgeText: { fontSize: 10 },
  messagingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 16 },
  messagingIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  messagingLabel: { fontSize: 10, letterSpacing: 1 },
  messagingDesc: { fontSize: 13, marginTop: 3 },
  messagingPreview: { fontSize: 11, marginTop: 4, lineHeight: 16 },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  emergencyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTitle: { fontSize: 14 },
  emergencyDesc: { fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickAction: { width: '48%', flexGrow: 1, flexBasis: '46%', borderRadius: 18, overflow: 'hidden' },
  quickActionGradient: { padding: 18, alignItems: 'center', borderRadius: 18 },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionLabel: { fontSize: 13, color: '#FFFFFF' },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activityPulse: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(30,107,90,0.3)',
  },
  activityTitle: { fontSize: 14 },
  activityDesc: { fontSize: 12, marginTop: 3, lineHeight: 17 },
  activityTime: { fontSize: 11, marginTop: 4 },
  announcementCard: { borderRadius: 18, padding: 16, marginBottom: 10 },
  announcementHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  announcementIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  announcementTitle: { fontSize: 14 },
  announcementMeta: { fontSize: 11, marginTop: 2 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  announcementBody: { fontSize: 13, lineHeight: 19 },
  insightCard: {
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(30,107,90,0.1)',
  },
  insightLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  insightTitle: { fontSize: 14 },
  insightDesc: { fontSize: 11, marginTop: 2 },
  insightValue: { fontSize: 28, letterSpacing: -1 },
});
