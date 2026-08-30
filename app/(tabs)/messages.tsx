import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  MessageCircle, Search, X, Plus, Link2, MessageSquare,
  CircleDot,
} from 'lucide-react-native';
import { useMessaging } from '@/context/MessagingContext';
import { useTheme } from '@/context/ThemeContext';
import { SHADOWS } from '@/constants/theme';

type FilterType = 'all' | 'unread' | 'issue_linked' | 'general';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'issue_linked', label: 'Issue-linked' },
  { key: 'general', label: 'General' },
];

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(' ');
  return parts.length > 1 ? parts[1] : timeStr;
}

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { conversations, unreadCount, markConversationAsRead } = useMessaging();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = conversations.filter((c) => {
    if (filter === 'unread' && c.unreadCount === 0) return false;
    if (filter === 'issue_linked' && c.conversationType !== 'issue_linked') return false;
    if (filter === 'general' && c.conversationType !== 'general') return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        c.participantName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        (c.linkedRequestTitle?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const handleOpen = (id: string) => {
    markConversationAsRead(id);
    router.push({ pathname: '/chat', params: { id } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Messages</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
            Communicate with your landlord and property manager
          </Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: colors.primaryGlow }]}>
          <MessageCircle size={20} color={colors.primary} />
          {unreadCount > 0 && <View style={styles.headerDot} />}
        </View>
      </Animated.View>

      <View style={styles.searchWrap}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.inputBorder }, SHADOWS.soft]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]}
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations..."
            placeholderTextColor={colors.textMuted}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <X size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[
                styles.filterChipText,
                { color: active ? '#FFFFFF' : colors.textSecondary, fontFamily: active ? 'Inter-SemiBold' : 'Inter-Medium' },
              ]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.primaryGlow }]}>
              <MessageSquare size={28} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>
              No conversations yet.
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
              Start a conversation with your landlord or property manager.
            </Text>
          </View>
        ) : (
          filtered.map((conv, i) => {
            const isIssue = conv.conversationType === 'issue_linked';
            return (
              <Animated.View key={conv.id} entering={FadeInUp.delay(i * 60).duration(350)}>
                <Pressable
                  style={({ pressed }) => [
                    styles.convCard,
                    {
                      backgroundColor: colors.surface,
                      borderLeftWidth: conv.unreadCount > 0 ? 3 : 0,
                      borderLeftColor: conv.unreadCount > 0 ? colors.primary : 'transparent',
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.985 : 1 }],
                    },
                    SHADOWS.card,
                  ]}
                  onPress={() => handleOpen(conv.id)}
                >
                  <View style={[styles.avatar, { backgroundColor: isIssue ? colors.accentLight : colors.primaryGlow }]}>
                    <Text style={[styles.avatarText, { color: isIssue ? colors.accent : colors.primary, fontFamily: 'Inter-Bold' }]}>
                      {conv.participantName.split(' ').map((n) => n[0]).join('')}
                    </Text>
                    {conv.unreadCount > 0 && <View style={styles.onlineDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.name, { color: colors.textPrimary, fontFamily: conv.unreadCount > 0 ? 'Inter-SemiBold' : 'Inter-Medium' }]} numberOfLines={1}>
                        {conv.participantName}
                      </Text>
                      <View style={styles.typeIcon}>
                        {isIssue ? (
                          <Link2 size={11} color={colors.accent} />
                        ) : (
                          <MessageSquare size={11} color={colors.textMuted} />
                        )}
                      </View>
                      <Text style={[styles.time, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
                        {formatTime(conv.lastMessageTime)}
                      </Text>
                    </View>
                    <Text style={[styles.role, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{conv.participantRole}</Text>
                    {isIssue && conv.linkedRequestId && (
                      <View style={[styles.linkRow, { backgroundColor: colors.accentLight }]}>
                        <Link2 size={9} color={colors.accent} />
                        <Text style={[styles.linkText, { color: colors.accent, fontFamily: 'Inter-Medium' }]} numberOfLines={1}>
                          Linked to: {conv.linkedRequestId} · {conv.linkedRequestTitle}
                        </Text>
                      </View>
                    )}
                    <View style={styles.previewRow}>
                      <Text
                        style={[
                          styles.preview,
                          {
                            color: conv.unreadCount > 0 ? colors.textPrimary : colors.textSecondary,
                            fontFamily: conv.unreadCount > 0 ? 'Inter-SemiBold' : 'Inter-Regular',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {conv.lastMessage}
                      </Text>
                    </View>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusBadge, { backgroundColor: colors.successLight }]}>
                        <CircleDot size={8} color={colors.success} />
                        <Text style={[styles.statusText, { color: colors.success, fontFamily: 'Inter-SemiBold' }]}>Active</Text>
                      </View>
                    </View>
                  </View>
                  {conv.unreadCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.badgeText, { fontFamily: 'Inter-Bold' }]}>{conv.unreadCount}</Text>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/new-message')}
        style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
      >
        <Plus size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 28, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  headerDot: { position: 'absolute', top: 10, right: 10, width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFFFFF' },
  searchWrap: { paddingHorizontal: 20, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 11 },
  filterRow: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  filterChipText: { fontSize: 13 },
  convCard: { borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 10, marginHorizontal: 20 },
  avatar: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarText: { fontSize: 15 },
  onlineDot: { position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#34D399', borderWidth: 2, borderColor: '#FFFFFF' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 15, flex: 1, letterSpacing: -0.1 },
  typeIcon: { marginTop: 2 },
  time: { fontSize: 11 },
  role: { fontSize: 11, marginTop: 2 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  linkText: { fontSize: 10 },
  previewRow: { marginTop: 6 },
  preview: { fontSize: 13, lineHeight: 18 },
  statusRow: { flexDirection: 'row', marginTop: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10 },
  badge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  badgeText: { fontSize: 10, color: '#FFFFFF' },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16 },
  emptyDesc: { fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 19 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1E6B5A', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
});
