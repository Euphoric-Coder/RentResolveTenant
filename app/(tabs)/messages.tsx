import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  MessageCircle, Search, X, Plus, Link2, MessageSquare,
  CircleDot, ChevronRight,
} from 'lucide-react-native';
import { useMessaging } from '@/context/MessagingContext';
import { useTheme } from '@/context/ThemeContext';

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
  const { isDark } = useTheme();
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
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Top Header */}
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="flex-row items-center justify-between px-5 pt-4 pb-3"
      >
        <View className="flex-1 pr-3">
          <Text
            className="text-[28px] tracking-[-0.6px] text-slate-900 dark:text-white"
            style={{ fontFamily: 'Inter-Bold' }}
          >
            Messages
          </Text>
          <Text
            className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 leading-[18px]"
            style={{ fontFamily: 'Inter-Regular' }}
          >
            Communicate with your landlord and property manager
          </Text>
        </View>

        <View className="relative shrink-0">
          <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800">
            <MessageCircle size={22} color="#0D9488" strokeWidth={2.2} />
          </View>
          {unreadCount > 0 && (
            <View className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950" />
          )}
        </View>
      </Animated.View>

      {/* Search Input Bar */}
      <View className="px-5 mb-3">
        <View className="flex-row items-center h-[50px] px-3.5 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2.2} />
          <TextInput
            className="flex-1 ml-2.5 text-[14px] text-slate-900 dark:text-white"
            style={{ fontFamily: 'Inter-Regular' }}
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations..."
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          />
          {search ? (
            <Pressable
              onPress={() => setSearch('')}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X size={14} color={isDark ? '#CBD5E1' : '#64748B'} strokeWidth={2.2} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="mb-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full border ${
                  active
                    ? 'bg-teal-700 dark:bg-teal-600 border-teal-700 dark:border-teal-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <Text
                  className={`text-[13px] ${
                    active
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  style={{ fontFamily: active ? 'Inter-SemiBold' : 'Inter-Medium' }}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Conversation List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 20 }}
      >
        {filtered.length === 0 ? (
          <View className="items-center justify-center py-16 px-6">
            <View className="h-16 w-16 items-center justify-center rounded-[20px] bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 mb-4">
              <MessageSquare size={28} color="#0D9488" strokeWidth={2.2} />
            </View>
            <Text
              className="text-[16px] text-slate-900 dark:text-white"
              style={{ fontFamily: 'Inter-SemiBold' }}
            >
              No conversations found
            </Text>
            <Text
              className="text-[13px] text-slate-500 dark:text-slate-400 text-center mt-1.5 leading-[19px] max-w-[260px]"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              {search
                ? 'Try adjusting your search query or clear the filter.'
                : 'Start a direct chat with your landlord or property manager.'}
            </Text>
          </View>
        ) : (
          filtered.map((conv, i) => {
            const isIssue = conv.conversationType === 'issue_linked';
            const hasUnread = conv.unreadCount > 0;
            return (
              <Animated.View key={conv.id} entering={FadeInUp.delay(i * 50).duration(350)}>
                <Pressable
                  className={`mb-3 overflow-hidden rounded-[20px] border ${
                    hasUnread
                      ? 'border-teal-400/90 dark:border-teal-500/80 bg-white dark:bg-slate-900 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.92 : 1,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                  })}
                  onPress={() => handleOpen(conv.id)}
                >
                  <View className="p-4 flex-row items-start gap-3.5">
                    {/* Participant Avatar */}
                    <View className="relative shrink-0">
                      <View
                        className={`h-[50px] w-[50px] items-center justify-center rounded-[16px] border ${
                          isIssue
                            ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/60'
                            : 'bg-teal-100 dark:bg-teal-950/70 border-teal-300 dark:border-teal-700/60'
                        }`}
                      >
                        <Text
                          className={`text-[15px] ${
                            isIssue
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-teal-700 dark:text-teal-400'
                          }`}
                          style={{ fontFamily: 'Inter-Bold' }}
                        >
                          {conv.participantName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </Text>
                      </View>
                      {hasUnread && (
                        <View className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      )}
                    </View>

                    {/* Conversation Body */}
                    <View className="flex-1 min-w-0">
                      {/* Name & Timestamp Row */}
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 flex-row items-center gap-1.5 min-w-0 pr-2">
                          <Text
                            numberOfLines={1}
                            className={`text-[15px] tracking-[-0.2px] ${
                              hasUnread
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                            style={{ fontFamily: hasUnread ? 'Inter-Bold' : 'Inter-SemiBold' }}
                          >
                            {conv.participantName}
                          </Text>
                          {isIssue ? (
                            <Link2 size={12} color="#D97706" strokeWidth={2.4} />
                          ) : (
                            <MessageSquare size={12} color="#64748B" strokeWidth={2.2} />
                          )}
                        </View>
                        <Text
                          className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0"
                          style={{ fontFamily: 'Inter-Regular' }}
                        >
                          {formatTime(conv.lastMessageTime)}
                        </Text>
                      </View>

                      {/* Participant Role */}
                      <Text
                        className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5"
                        style={{ fontFamily: 'Inter-Medium' }}
                      >
                        {conv.participantRole}
                      </Text>

                      {/* Linked Issue Tag */}
                      {isIssue && conv.linkedRequestId && (
                        <View className="flex-row items-center gap-1 self-start px-2 py-0.5 mt-1.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60">
                          <Link2 size={10} color="#D97706" strokeWidth={2.4} />
                          <Text
                            numberOfLines={1}
                            className="text-[10.5px] text-amber-700 dark:text-amber-400 max-w-[200px]"
                            style={{ fontFamily: 'Inter-Medium' }}
                          >
                            Linked: {conv.linkedRequestId} · {conv.linkedRequestTitle}
                          </Text>
                        </View>
                      )}

                      {/* Last Message Preview */}
                      <Text
                        numberOfLines={1}
                        className={`text-[13px] mt-1.5 leading-[18px] ${
                          hasUnread
                            ? 'text-slate-900 dark:text-slate-100 font-semibold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                        style={{ fontFamily: hasUnread ? 'Inter-SemiBold' : 'Inter-Regular' }}
                      >
                        {conv.lastMessage}
                      </Text>

                      {/* Footer Badge & Status */}
                      <View className="flex-row items-center justify-between mt-2.5">
                        <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60">
                          <CircleDot size={8} color="#059669" strokeWidth={2.4} />
                          <Text
                            className="text-[10px] text-emerald-700 dark:text-emerald-400"
                            style={{ fontFamily: 'Inter-SemiBold' }}
                          >
                            Active
                          </Text>
                        </View>

                        {hasUnread && (
                          <View className="h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-teal-600 dark:bg-teal-500">
                            <Text
                              className="text-[10.5px] text-white"
                              style={{ fontFamily: 'Inter-Bold' }}
                            >
                              {conv.unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Chevron Indicator */}
                    <View className="h-7 w-7 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-white/5 shrink-0 self-center">
                      <ChevronRight size={14} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2.4} />
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button (New Message) */}
      <Pressable
        onPress={() => router.push('/new-message')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full shadow-lg overflow-hidden"
        style={({ pressed }) => ({
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.94 : 1 }],
          elevation: 8,
          shadowColor: '#0D9488',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        })}
      >
        <LinearGradient
          colors={['#0F766E', '#0D9488']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={26} color="#FFFFFF" strokeWidth={2.6} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

