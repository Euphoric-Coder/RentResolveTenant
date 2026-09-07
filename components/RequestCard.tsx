import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  AlertTriangle,
  ChevronRight,
  MapPin,
  Wrench,
  Droplet,
  Zap,
  Flame,
  Bug,
  DoorOpen,
  Calendar,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import type { MaintenanceRequest } from '@/data/mockData';

interface RequestCardProps {
  request: MaintenanceRequest;
  onPress: () => void;
  index?: number;
}

// Semantic category icon mapper
function getCategoryIcon(category: string, color: string, size = 12) {
  const cat = category.toLowerCase();
  if (cat.includes('plumb') || cat.includes('water') || cat.includes('leak')) {
    return <Droplet size={size} color={color} strokeWidth={2.4} />;
  }
  if (cat.includes('electr') || cat.includes('power') || cat.includes('light')) {
    return <Zap size={size} color={color} strokeWidth={2.4} />;
  }
  if (cat.includes('heat') || cat.includes('cool') || cat.includes('ac') || cat.includes('hvac')) {
    return <Flame size={size} color={color} strokeWidth={2.4} />;
  }
  if (cat.includes('pest') || cat.includes('bug') || cat.includes('insect')) {
    return <Bug size={size} color={color} strokeWidth={2.4} />;
  }
  if (cat.includes('door') || cat.includes('window') || cat.includes('lock')) {
    return <DoorOpen size={size} color={color} strokeWidth={2.4} />;
  }
  return <Wrench size={size} color={color} strokeWidth={2.4} />;
}

// Advanced Semantic status helper with full-card gradients & borders
function getStatusStyle(status: string, isDark: boolean) {
  switch (status.toLowerCase()) {
    case 'in progress':
      return {
        bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
        border: isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE',
        text: isDark ? '#93C5FD' : '#1D4ED8',
        dot: '#3B82F6',
        progressColor: '#3B82F6',
        progressPercent: 72,
        isCompleted: false,
        cardGradient: isDark ? ['#172554', '#0A1128'] : ['#F0F9FF', '#FFFFFF'],
        cardBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : '#E0F2FE',
      };
    case 'assigned':
      return {
        bg: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF',
        border: isDark ? 'rgba(99, 102, 241, 0.25)' : '#E0E7FF',
        text: isDark ? '#A5B4FC' : '#4338CA',
        dot: '#6366F1',
        progressColor: '#6366F1',
        progressPercent: 45,
        isCompleted: false,
        cardGradient: isDark ? ['#1E1B4B', '#0F0E24'] : ['#F5F3FF', '#FFFFFF'],
        cardBorder: isDark ? 'rgba(99, 102, 241, 0.3)' : '#EDE9FE',
      };
    case 'resolved':
    case 'closed':
      return {
        bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
        border: isDark ? 'rgba(16, 185, 129, 0.25)' : '#D1FAE5',
        text: isDark ? '#6EE7B7' : '#047857',
        dot: '#10B981',
        progressColor: '#10B981',
        progressPercent: 100,
        isCompleted: true,
        cardGradient: isDark ? ['#022C22', '#01130E'] : ['#ECFDF5', '#FFFFFF'],
        cardBorder: isDark ? 'rgba(16, 185, 129, 0.3)' : '#D1FAE5',
      };
    case 'under review':
      return {
        bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
        border: isDark ? 'rgba(245, 158, 11, 0.25)' : '#FEF3C7',
        text: isDark ? '#FCD34D' : '#B45309',
        dot: '#F59E0B',
        progressColor: '#F59E0B',
        progressPercent: 30,
        isCompleted: false,
        cardGradient: isDark ? ['#451A03', '#270F01'] : ['#FFFBEB', '#FFFFFF'],
        cardBorder: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FEF3C7',
      };
    case 'submitted':
    default:
      return {
        bg: isDark ? 'rgba(148, 163, 184, 0.15)' : '#F1F5F9',
        border: isDark ? 'rgba(148, 163, 184, 0.25)' : '#E2E8F0',
        text: isDark ? '#CBD5E1' : '#475569',
        dot: '#64748B',
        progressColor: '#0D9488',
        progressPercent: 18,
        isCompleted: false,
        cardGradient: isDark ? ['#1E293B', '#0F172A'] : ['#F8FAFC', '#FFFFFF'],
        cardBorder: isDark ? 'rgba(148, 163, 184, 0.2)' : '#E2E8F0',
      };
  }
}

// Priority style helper
function getPriorityStyle(priority: string, isDark: boolean) {
  switch (priority.toLowerCase()) {
    case 'urgent':
    case 'emergency':
      return {
        bg: isDark ? 'rgba(220, 38, 38, 0.16)' : '#FEF2F2',
        border: isDark ? 'rgba(220, 38, 38, 0.3)' : '#FECACA',
        text: isDark ? '#FCA5A5' : '#B91C1C',
        dot: '#EF4444',
      };
    case 'high':
      return {
        bg: isDark ? 'rgba(249, 115, 22, 0.15)' : '#FFF7ED',
        border: isDark ? 'rgba(249, 115, 22, 0.25)' : '#FFEDD5',
        text: isDark ? '#FDBA74' : '#C2410C',
        dot: '#F97316',
      };
    case 'medium':
      return {
        bg: isDark ? 'rgba(245, 158, 11, 0.14)' : '#FFFBEB',
        border: isDark ? 'rgba(245, 158, 11, 0.25)' : '#FEF3C7',
        text: isDark ? '#FCD34D' : '#B45309',
        dot: '#F59E0B',
      };
    case 'low':
    default:
      return {
        bg: isDark ? 'rgba(148, 163, 184, 0.12)' : '#F8FAFC',
        border: isDark ? 'rgba(148, 163, 184, 0.2)' : '#E2E8F0',
        text: isDark ? '#94A3B8' : '#64748B',
        dot: '#94A3B8',
      };
  }
}

// Format date into natural display format (e.g., "Jun 18, 2026")
function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return 'Recent';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (monthIndex >= 0 && monthIndex < 12 && !isNaN(day) && !isNaN(year)) {
        return `${monthNames[monthIndex]} ${day}, ${year}`;
      }
    }
  } catch {
    // Fallback
  }
  return dateStr;
}

export function RequestCard({ request, onPress, index = 0 }: RequestCardProps) {
  const { isDark } = useTheme();
  const statusInfo = getStatusStyle(request.status, isDark);
  const priorityInfo = getPriorityStyle(request.priority, isDark);

  const assigneeName = request.assignedTo || 'Unassigned';
  const assigneeInitials = assigneeName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const displayDate = formatDisplayDate(request.submittedDate);

  // Dynamic overrides for emergency state
  const statusAccentColor = request.isEmergency ? '#EF4444' : statusInfo.dot;
  
  const finalGradient = request.isEmergency 
    ? (isDark ? ['#3F1616', '#1F0B0B'] : ['#FEF2F2', '#FFF6F6']) 
    : statusInfo.cardGradient;
    
  const finalBorder = request.isEmergency
    ? (isDark ? 'rgba(220, 38, 38, 0.4)' : '#FECACA')
    : statusInfo.cardBorder;

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 35, 180)).duration(260)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${request.id}, ${request.title}, ${request.priority} priority, ${request.status}`}
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardContainer,
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.9 : 1,
            shadowColor: statusAccentColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isDark ? 0.35 : 0.15,
            shadowRadius: 16,
            elevation: 6,
          },
        ]}
      >
        <LinearGradient
          colors={finalGradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cardGradient, { borderColor: finalBorder }]}
        >
          {/* Subtle Watermark Icon in background matching the accent color */}
          <View style={[styles.watermark, { opacity: isDark ? 0.08 : 0.04 }]}>
            {getCategoryIcon(request.category, statusAccentColor, 140)}
          </View>

          {/* Left glowing accent line */}
          <LinearGradient
            colors={[statusAccentColor, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.accentLine}
          />

          <View style={styles.contentPadding}>
            {/* Top Row: Category, Urgent Pill, Status */}
            <View style={styles.topRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <View
                  style={[
                    styles.categoryIconTile,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' },
                  ]}
                >
                  {getCategoryIcon(request.category, isDark ? '#F1F5F9' : '#475569', 14)}
                </View>

                {request.isEmergency && (
                  <View style={[styles.urgentPill, { backgroundColor: isDark ? 'rgba(220, 38, 38, 0.2)' : '#FEE2E2', borderColor: isDark ? 'rgba(220, 38, 38, 0.4)' : '#FECACA' }]}>
                    <AlertTriangle size={10} color="#EF4444" strokeWidth={3} />
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
                {!request.isEmergency && (
                  <Text style={[styles.idText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    {request.id}
                  </Text>
                )}
              </View>

              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: statusInfo.bg, borderColor: statusInfo.border },
                ]}
              >
                <View style={[styles.statusDot, { backgroundColor: statusInfo.dot }]} />
                <Text style={[styles.statusText, { color: statusInfo.text }]}>
                  {request.status}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text
              numberOfLines={2}
              style={[styles.titleText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            >
              {request.title}
            </Text>

            {/* Contextual Row: Location & Priority */}
            <View style={styles.contextRow}>
              <View style={styles.locationTag}>
                <MapPin size={13} color={isDark ? '#94A3B8' : '#64748B'} />
                <Text style={[styles.locationText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {request.propertyArea}
                </Text>
              </View>

              <View style={[styles.priorityPill, { backgroundColor: priorityInfo.bg, borderColor: priorityInfo.border }]}>
                <View style={[styles.priorityDot, { backgroundColor: priorityInfo.dot }]} />
                <Text style={[styles.priorityText, { color: priorityInfo.text }]}>
                  {request.priority}
                </Text>
              </View>
            </View>

            {/* Progress Section */}
            {statusInfo.isCompleted ? (
              <View style={styles.completedRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <Text style={[styles.completedText, { color: isDark ? '#34D399' : '#059669' }]}>
                    Completed
                  </Text>
                </View>
                <View style={styles.completedLine} />
              </View>
            ) : (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    Progress
                  </Text>
                  <Text style={[styles.progressValue, { color: statusInfo.text }]}>
                    {statusInfo.progressPercent}%
                  </Text>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${statusInfo.progressPercent}%`, backgroundColor: statusInfo.progressColor },
                    ]}
                  />
                  {/* Glowing end dot for progress */}
                  <View
                    style={[
                      styles.progressGlowDot,
                      {
                        left: `${statusInfo.progressPercent}%`,
                        backgroundColor: statusInfo.progressColor,
                        shadowColor: statusInfo.progressColor,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Footer Section (Date & Assignee) */}
            <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} color={isDark ? '#94A3B8' : '#64748B'} />
                <Text style={[styles.dateText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {displayDate}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {request.assignedTo ? (
                  <View style={[styles.assigneePill, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
                    <View style={styles.assigneeAvatar}>
                      <Text style={styles.assigneeInitials}>
                        {assigneeInitials[0] || 'A'}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[styles.assigneeName, { color: isDark ? '#F1F5F9' : '#334155' }]}
                    >
                      {request.assignedTo.split(' ')[0]}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.unassignedText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    Unassigned
                  </Text>
                )}
                <ChevronRight size={18} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2.5} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1.5,
  },
  watermark: {
    position: 'absolute',
    right: -30,
    bottom: -30,
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  contentPadding: {
    padding: 18,
    paddingLeft: 22, // Extra padding for the thick accent line
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryIconTile: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'Inter-Black',
    color: '#EF4444',
    letterSpacing: 0.8,
  },
  idText: {
    fontSize: 12.5,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11.5,
    fontFamily: 'Inter-Bold',
  },
  titleText: {
    fontSize: 18.5,
    lineHeight: 25,
    fontFamily: 'Inter-Black',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 12.5,
    fontFamily: 'Inter-Medium',
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  completedText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  completedLine: {
    height: 5,
    flex: 1,
    maxWidth: 120,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  progressContainer: {
    marginBottom: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  progressValue: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressGlowDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  assigneePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
  },
  assigneeAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeInitials: {
    fontSize: 9.5,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  assigneeName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    maxWidth: 100,
  },
  unassignedText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});
