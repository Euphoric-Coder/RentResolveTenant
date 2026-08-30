import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { SHADOWS } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  index?: number;
}

export function StatCard({ label, value, color, icon, index = 0 }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(500).springify()}
      style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.card]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: color + '14' }]}>
          {icon}
        </View>
        <View style={[styles.glow, { backgroundColor: color + '08' }]} />
      </View>
      <Text style={[styles.value, { color: colors.textPrimary, fontFamily: 'Inter-ExtraBold' }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textMuted, fontFamily: 'Inter-Medium' }]}>{label}</Text>
      <LinearGradient
        colors={[color + '00', color + '20']}
        style={styles.bottomGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={[styles.accentBar, { backgroundColor: color }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    width: '48%',
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  value: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    borderRadius: 3,
  },
});
