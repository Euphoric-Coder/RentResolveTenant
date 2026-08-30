import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeIn, FadeInRight } from 'react-native-reanimated';
import {
  User, Wrench, Calendar, Clock, MapPin,
  MessageSquare, RotateCcw, Star, AlertTriangle, Image as ImageIcon,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useMessaging } from '@/context/MessagingContext';
import { MOCK_REQUESTS } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const STATUS_PROGRESS: Record<string, number> = {
  Submitted: 0.15,
  'In Progress': 0.4,
  'Under Review': 0.6,
  Escalated: 0.7,
  Resolved: 0.9,
  Closed: 1,
};

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { conversations, createConversation } = useMessaging();
  const request = MOCK_REQUESTS.find(r => r.id === id);

  if (!request) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Request Not Found" />
      </View>
    );
  }

  const isResolved = ['Resolved', 'Closed'].includes(request.status);
  const canEscalate = !isResolved && !['Escalated'].includes(request.status);
  const progress = STATUS_PROGRESS[request.status] || 0.2;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={request.id} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{request.title}</Text>
          <View style={styles.badgeRow}>
            <StatusBadge label={request.status} />
            <StatusBadge label={request.priority} type="priority" />
            {request.isEmergency && (
              <View style={[styles.urgentBadge, { backgroundColor: colors.dangerLight }]}>
                <AlertTriangle size={10} color={colors.danger} />
                <Text style={[styles.urgentText, { color: colors.danger, fontFamily: 'Inter-Bold' }]}>EMERGENCY</Text>
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={[styles.progressSection, { backgroundColor: colors.surface }, SHADOWS.card]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>Progress</Text>
            <Text style={[styles.progressPercent, { color: colors.primary, fontFamily: 'Inter-Bold' }]}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.borderLight }]}>
            <LinearGradient
              colors={['#1E6B5A', '#0D9488'] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress * 100}%` as any }]}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={[styles.detailCard, { backgroundColor: colors.surface }, SHADOWS.card]}>
          <DetailRow icon={<Clock size={16} color={colors.textMuted} />} label="Submitted" value={request.submittedDate} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <DetailRow icon={<Calendar size={16} color={colors.textMuted} />} label="Expected Resolution" value={request.expectedResolution} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <DetailRow icon={<MapPin size={16} color={colors.textMuted} />} label="Property Area" value={request.propertyArea} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <DetailRow icon={<Wrench size={16} color={colors.textMuted} />} label="Category" value={`${request.category} / ${request.subcategory}`} colors={colors} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Description</Text>
          <View style={[styles.descriptionCard, { backgroundColor: colors.surface }, SHADOWS.soft]}>
            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{request.description}</Text>
          </View>
        </Animated.View>

        {(request.assignedTo || request.technicianName) && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Assigned Team</Text>
            <View style={[styles.detailCard, { backgroundColor: colors.surface }, SHADOWS.card]}>
              {request.assignedTo && <DetailRow icon={<User size={16} color={colors.primary} />} label="Manager" value={request.assignedTo} colors={colors} />}
              {request.assignedTo && request.technicianName && <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />}
              {request.technicianName && <DetailRow icon={<Wrench size={16} color={colors.success} />} label="Technician" value={`${request.technicianName} (${request.technicianPhone})`} colors={colors} />}
            </View>
          </Animated.View>
        )}

        {request.evidence.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500).duration(500)}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Evidence ({request.evidence.length})</Text>
            <View style={styles.evidenceGrid}>
              {request.evidence.map((file, i) => (
                <Animated.View key={i} entering={FadeIn.delay(550 + i * 60).duration(400)} style={[styles.evidenceItem, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.soft]}>
                  <View style={[styles.evidenceIconWrap, { backgroundColor: colors.primaryGlow }]}>
                    <ImageIcon size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.evidenceText, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]} numberOfLines={1}>{file}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {request.resolutionNotes && (
          <Animated.View entering={FadeInDown.delay(600).duration(500)}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Resolution Notes</Text>
            <View style={[styles.resolutionCard, { backgroundColor: colors.successLight }]}>
              <LinearGradient
                colors={['#05966920', '#05966908'] as [string, string]}
                style={styles.resolutionGlow}
              />
              <Text style={[styles.resolutionText, { color: colors.success, fontFamily: 'Inter-Medium' }]}>{request.resolutionNotes}</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(650).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Status Timeline</Text>
          {request.timeline.map((event, i) => (
            <Animated.View key={event.id} entering={FadeInRight.delay(700 + i * 80).duration(400)} style={styles.timelineItem}>
              <View style={styles.timelineLine}>
                <View style={[styles.timelineDotOuter, { backgroundColor: i === 0 ? colors.primary + '20' : colors.borderLight }]}>
                  <View style={[styles.timelineDotInner, { backgroundColor: i === 0 ? colors.primary : colors.border }]} />
                </View>
                {i < request.timeline.length - 1 && <View style={[styles.timelineBar, { backgroundColor: colors.borderLight }]} />}
              </View>
              <View style={[styles.timelineContent, i === 0 && { backgroundColor: colors.primaryGlow }, { borderRadius: 12, padding: 12 }]}>
                <Text style={[styles.timelineEvent, { color: i === 0 ? colors.primary : colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{event.event}</Text>
                <Text style={[styles.timelineDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{event.description}</Text>
                <Text style={[styles.timelineMeta, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{event.date} - {event.actor}</Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(900).duration(500)} style={styles.actions}>
          <PrimaryButton title={`Message About ${request.id}`} variant="outline" icon={<MessageSquare size={18} color={colors.primary} />} onPress={() => {
            const existing = conversations.find(c => c.linkedRequestId === request.id);
            if (existing) {
              router.push({ pathname: '/chat', params: { id: existing.id } });
            } else {
              const newId = createConversation({
                participantId: 'manager_001',
                conversationType: 'issue_linked',
                linkedRequestId: request.id,
                linkedRequestTitle: request.title,
                messageText: `Hello, I would like to discuss this request: ${request.title}`,
              });
              if (newId) router.push({ pathname: '/chat', params: { id: newId } });
            }
          }} />
          {isResolved && (
            <>
              <PrimaryButton title="Reopen Request" variant="outline" icon={<RotateCcw size={18} color={colors.primary} />} onPress={() => router.push({ pathname: '/reopen-request', params: { id: request.id } })} />
              <PrimaryButton title="Submit Feedback" icon={<Star size={18} color="#FFFFFF" />} onPress={() => router.push({ pathname: '/feedback', params: { id: request.id } })} />
            </>
          )}
          {canEscalate && (
            <PrimaryButton title="Escalate Issue" variant="danger" icon={<AlertTriangle size={18} color="#FFFFFF" />} onPress={() => router.push({ pathname: '/dispute', params: { requestId: request.id } })} />
          )}
        </Animated.View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function DetailRow({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string; colors: any }) {
  return (
    <View style={styles.detailRow}>
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  titleSection: { marginBottom: 20 },
  title: { fontSize: 20, marginBottom: 12, lineHeight: 28 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  urgentText: { fontSize: 10 },
  progressSection: { borderRadius: 16, padding: 16, marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressLabel: { fontSize: 13 },
  progressPercent: { fontSize: 14 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  detailCard: { borderRadius: 16, padding: 16, marginBottom: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 6 },
  detailLabel: { fontSize: 11 },
  detailValue: { fontSize: 14, marginTop: 2 },
  divider: { height: 1, marginVertical: 10 },
  sectionTitle: { fontSize: 16, marginTop: 24, marginBottom: 12 },
  descriptionCard: { borderRadius: 14, padding: 16 },
  description: { fontSize: 14, lineHeight: 22 },
  evidenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  evidenceItem: { borderRadius: 12, borderWidth: 1, padding: 14, alignItems: 'center', width: '30%', gap: 8 },
  evidenceIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  evidenceText: { fontSize: 10, textAlign: 'center' },
  resolutionCard: { borderRadius: 14, padding: 16, overflow: 'hidden' },
  resolutionGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 },
  resolutionText: { fontSize: 13, lineHeight: 20 },
  timelineItem: { flexDirection: 'row', minHeight: 72 },
  timelineLine: { width: 32, alignItems: 'center' },
  timelineDotOuter: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  timelineDotInner: { width: 10, height: 10, borderRadius: 5 },
  timelineBar: { width: 2, flex: 1, marginTop: 2 },
  timelineContent: { flex: 1, paddingLeft: 10, paddingBottom: 16 },
  timelineEvent: { fontSize: 13 },
  timelineDesc: { fontSize: 11, marginTop: 3, lineHeight: 16 },
  timelineMeta: { fontSize: 11, marginTop: 4 },
  actions: { gap: 10, marginTop: 28 },
});
