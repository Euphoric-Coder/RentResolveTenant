import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Clock, AlertTriangle, ChevronRight, MapPin } from 'lucide-react-native';
import { StatusBadge } from './StatusBadge';
import { useTheme } from '@/context/ThemeContext';
import { SHADOWS } from '@/constants/theme';
import type { MaintenanceRequest } from '@/data/mockData';

interface RequestCardProps {
  request: MaintenanceRequest;
  onPress: () => void;
  index?: number;
}

export function RequestCard({ request, onPress, index = 0 }: RequestCardProps) {
  const { colors } = useTheme();

  const progressPercent = (() => {
    const stages = ['Submitted', 'Under Review', 'Approved', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    const idx = stages.indexOf(request.status);
    return idx >= 0 ? ((idx + 1) / stages.length) * 100 : 20;
  })();

  return (
    <Animated.View entering={FadeInRight.delay(index * 60).duration(400).springify()}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.surface, transform: [{ scale: pressed ? 0.985 : 1 }] },
          SHADOWS.card,
          request.isEmergency && styles.emergencyBorder,
        ]}
      >
        {request.isEmergency && (
          <LinearGradient
            colors={['rgba(220, 38, 38, 0.04)', 'transparent']}
            style={styles.emergencyGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        <View style={styles.topRow}>
          <View style={styles.idRow}>
            <Text style={[styles.id, { color: colors.textMuted, fontFamily: 'Inter-Medium' }]}>{request.id}</Text>
            {request.isEmergency && (
              <View style={[styles.emergencyBadge, { backgroundColor: colors.dangerLight }]}>
                <AlertTriangle size={9} color={colors.danger} />
                <Text style={[styles.emergencyText, { color: colors.danger, fontFamily: 'Inter-Bold' }]}>URGENT</Text>
              </View>
            )}
          </View>
          <StatusBadge label={request.status} small />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]} numberOfLines={1}>
          {request.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primaryGlow }]}>
            <Text style={[styles.categoryText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>{request.category}</Text>
          </View>
          <View style={styles.areaRow}>
            <MapPin size={10} color={colors.textMuted} />
            <Text style={[styles.areaText, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{request.propertyArea}</Text>
          </View>
          <StatusBadge label={request.priority} type="priority" small />
        </View>

        <View style={styles.progressSection}>
          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSecondary }]}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.dateRow}>
            <Clock size={12} color={colors.textMuted} />
            <Text style={[styles.dateText, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{request.submittedDate}</Text>
          </View>
          {request.assignedTo && (
            <View style={[styles.assigneeBadge, { backgroundColor: colors.surfaceSecondary }]}>
              <View style={[styles.assigneeDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.assigneeText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]} numberOfLines={1}>
                {request.assignedTo.split(' ')[0]}
              </Text>
            </View>
          )}
          <ChevronRight size={16} color={colors.textMuted} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    overflow: 'hidden',
  },
  emergencyBorder: {
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  emergencyGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  id: { fontSize: 11 },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  emergencyText: { fontSize: 9 },
  title: {
    fontSize: 16,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: { fontSize: 11 },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  areaText: { fontSize: 11 },
  progressSection: { marginBottom: 14 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11 },
  assigneeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    maxWidth: 100,
  },
  assigneeDot: { width: 6, height: 6, borderRadius: 3 },
  assigneeText: { fontSize: 10 },
});
