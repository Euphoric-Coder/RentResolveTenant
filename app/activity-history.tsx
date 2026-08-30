import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import {
  Plus, RefreshCw, MessageSquare, UserCheck, Calendar,
  Wallet, CheckCircle, RotateCcw, AlertTriangle, FileText, Clock,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_ACTIVITY } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const TYPE_CONFIG: Record<string, { icon: any; color: string; gradient: [string, string] }> = {
  request_created: { icon: Plus, color: '#1E6B5A', gradient: ['#1E6B5A', '#0D9488'] },
  status_changed: { icon: RefreshCw, color: '#0284C7', gradient: ['#0284C7', '#38BDF8'] },
  comment_added: { icon: MessageSquare, color: '#059669', gradient: ['#059669', '#34D399'] },
  technician_assigned: { icon: UserCheck, color: '#0D9488', gradient: ['#0D9488', '#5EEAD4'] },
  visit_scheduled: { icon: Calendar, color: '#D97706', gradient: ['#D97706', '#FBBF24'] },
  rent_paid: { icon: Wallet, color: '#059669', gradient: ['#059669', '#6EE7B7'] },
  request_resolved: { icon: CheckCircle, color: '#16A34A', gradient: ['#16A34A', '#4ADE80'] },
  request_reopened: { icon: RotateCcw, color: '#DC2626', gradient: ['#DC2626', '#F87171'] },
  dispute_escalated: { icon: AlertTriangle, color: '#DC2626', gradient: ['#DC2626', '#FB923C'] },
  document_uploaded: { icon: FileText, color: '#0284C7', gradient: ['#0284C7', '#7DD3FC'] },
  feedback_submitted: { icon: CheckCircle, color: '#F59E0B', gradient: ['#F59E0B', '#FDE68A'] },
};

export default function ActivityHistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Activity History" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.summaryCard, { backgroundColor: colors.surface }, SHADOWS.card]}>
          <LinearGradient
            colors={['#1E6B5A10', '#0D948806'] as [string, string]}
            style={styles.summaryGlow}
          />
          <Text style={[styles.summaryTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Recent Activity</Text>
          <Text style={[styles.summarySubtitle, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{MOCK_ACTIVITY.length} events in your history</Text>
        </Animated.View>

        {MOCK_ACTIVITY.map((item, i) => {
          const config = TYPE_CONFIG[item.type] || { icon: Clock, color: colors.textMuted, gradient: ['#6B7280', '#9CA3AF'] as [string, string] };
          const Icon = config.icon;
          return (
            <Animated.View key={item.id} entering={FadeInRight.delay(100 + i * 70).duration(400)} style={styles.timelineRow}>
              <View style={styles.timelineSide}>
                <LinearGradient
                  colors={config.gradient}
                  style={styles.timelineDot}
                >
                  <Icon size={14} color="#FFFFFF" />
                </LinearGradient>
                {i < MOCK_ACTIVITY.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: colors.borderLight }]} />
                )}
              </View>
              <Pressable
                style={[styles.timelineCard, { backgroundColor: colors.surface }, SHADOWS.soft]}
                onPress={() => item.linkedRequestId && router.push({ pathname: '/request-detail', params: { id: item.linkedRequestId } })}
              >
                <View style={styles.timelineCardHeader}>
                  <Text style={[styles.timelineTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{item.title}</Text>
                  {item.linkedRequestId && (
                    <View style={[styles.linkedBadge, { backgroundColor: colors.primaryGlow }]}>
                      <Text style={[styles.linkedBadgeText, { color: colors.primary, fontFamily: 'Inter-Medium' }]}>View</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.timelineDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{item.description}</Text>
                <View style={styles.timelineMeta}>
                  <Clock size={10} color={colors.textMuted} />
                  <Text style={[styles.timelineTime, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{item.timestamp}</Text>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  summaryCard: { borderRadius: 16, padding: 18, marginBottom: 24, overflow: 'hidden' },
  summaryGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  summaryTitle: { fontSize: 17 },
  summarySubtitle: { fontSize: 13, marginTop: 4 },
  timelineRow: { flexDirection: 'row' },
  timelineSide: { width: 40, alignItems: 'center' },
  timelineDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { width: 2, flex: 1, marginVertical: 2 },
  timelineCard: { flex: 1, borderRadius: 14, padding: 14, marginLeft: 12, marginBottom: 12 },
  timelineCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timelineTitle: { fontSize: 14, flex: 1 },
  linkedBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  linkedBadgeText: { fontSize: 11 },
  timelineDesc: { fontSize: 12, marginTop: 6, lineHeight: 18 },
  timelineMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  timelineTime: { fontSize: 11 },
});
