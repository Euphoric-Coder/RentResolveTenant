import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Search, Plus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_REQUESTS } from '@/data/mockData';
import { RequestCard } from '@/components/RequestCard';
import { EmptyState } from '@/components/EmptyState';
import { SHADOWS } from '@/constants/theme';

const FILTER_OPTIONS = ['All', 'Open', 'In Progress', 'Resolved', 'Emergency'] as const;

export default function RequestsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    let list = MOCK_REQUESTS;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    if (activeFilter === 'Open') list = list.filter(r => ['Submitted', 'Under Review'].includes(r.status));
    else if (activeFilter === 'In Progress') list = list.filter(r => ['Approved', 'Assigned', 'In Progress', 'Waiting for Tenant', 'Waiting for Landlord'].includes(r.status));
    else if (activeFilter === 'Resolved') list = list.filter(r => ['Resolved', 'Closed'].includes(r.status));
    else if (activeFilter === 'Emergency') list = list.filter(r => r.isEmergency);
    return list;
  }, [search, activeFilter]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>My Requests</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{MOCK_REQUESTS.length} total requests</Text>
        </View>
        <Pressable style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.92 : 1 }] }]} onPress={() => router.push('/create-request')}>
          <LinearGradient colors={['#1E6B5A', '#0D9488']} style={styles.addButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Plus size={20} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.searchBar, { backgroundColor: colors.surface }, SHADOWS.soft]}>
        <View style={[styles.searchIconWrap, { backgroundColor: colors.primaryGlow }]}>
          <Search size={16} color={colors.primary} />
        </View>
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]}
          placeholder="Search by title, ID, or category..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {FILTER_OPTIONS.map(f => {
            const active = activeFilter === f;
            return (
              <Pressable
                key={f}
                style={({ pressed }) => [styles.filterPill, { opacity: pressed ? 0.85 : 1 }]}
                onPress={() => setActiveFilter(f)}
              >
                {active ? (
                  <LinearGradient colors={['#1E6B5A', '#0D9488']} style={styles.filterPillInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={[styles.filterText, { color: '#FFFFFF', fontFamily: 'Inter-SemiBold' }]}>{f}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.filterPillInner, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
                    <Text style={[styles.filterText, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>{f}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <EmptyState title="No requests found" message="Try adjusting your search or filters" />
        ) : (
          filtered.map((req, i) => (
            <RequestCard
              key={req.id}
              request={req}
              index={i}
              onPress={() => router.push({ pathname: '/request-detail', params: { id: req.id } })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 28, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  addButton: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 16, paddingHorizontal: 6, paddingVertical: 6, gap: 0 },
  searchIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  searchInput: { flex: 1, fontSize: 15, paddingHorizontal: 8 },
  filterScroll: { maxHeight: 48, marginTop: 14 },
  filterContent: { gap: 8, paddingHorizontal: 20 },
  filterPill: { borderRadius: 22, overflow: 'hidden' },
  filterPillInner: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22 },
  filterText: { fontSize: 13 },
  listContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24 },
});
