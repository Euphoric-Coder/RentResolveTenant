import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { STATUS_COLORS, PRIORITY_COLORS } from '@/constants/theme';

interface StatusBadgeProps {
  label: string;
  type?: 'status' | 'priority';
  small?: boolean;
}

export function StatusBadge({ label, type = 'status', small }: StatusBadgeProps) {
  const colorMap = type === 'priority' ? PRIORITY_COLORS : STATUS_COLORS;
  const badgeColors = colorMap[label] || { bg: '#F1F5F9', text: '#475569' };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.badge, { backgroundColor: badgeColors.bg }, small && styles.badgeSmall]}>
      <View style={[styles.dot, { backgroundColor: badgeColors.text }]} />
      <Text style={[styles.label, { color: badgeColors.text, fontFamily: 'Inter-SemiBold' }, small && styles.labelSmall]}>
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
  },
  labelSmall: {
    fontSize: 10,
  },
});
