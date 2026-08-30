import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Megaphone } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_ANNOUNCEMENTS } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const PRIORITY_STYLES: Record<string, { color: string }> = {
  High: { color: '#DC2626' },
  Medium: { color: '#D97706' },
  Low: { color: '#0284C7' },
};

export default function AnnouncementsScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Announcements" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {MOCK_ANNOUNCEMENTS.map((ann, index) => {
          const ac = PRIORITY_STYLES[ann.priority] || PRIORITY_STYLES.Low;
          return (
            <Animated.View key={ann.id} entering={FadeInRight.delay(index * 80).duration(400)}>
              <View style={[styles.card, { backgroundColor: colors.surface, borderLeftWidth: 3, borderLeftColor: ac.color }, SHADOWS.card]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.icon, { backgroundColor: ac.color + '14' }]}>
                    <Megaphone size={14} color={ac.color} />
                  </View>
                  <Text style={[styles.title, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]} numberOfLines={1}>{ann.title}</Text>
                  <View style={[styles.badge, { backgroundColor: ac.color + '14' }]}>
                    <Text style={[styles.badgeText, { color: ac.color, fontFamily: 'Inter-SemiBold' }]}>{ann.priority}</Text>
                  </View>
                </View>
                <Text style={[styles.message, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>{ann.message}</Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.meta, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{ann.date}</Text>
                  <Text style={[styles.meta, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>by {ann.postedBy}</Text>
                </View>
              </View>
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
  card: { borderRadius: 16, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  icon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 15 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10 },
  message: { fontSize: 13, lineHeight: 21 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  meta: { fontSize: 11 },
});
