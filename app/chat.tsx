import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Send,
  Link2,
  Info,
  Paperclip,
  CheckCheck,
  Check,
  Clock,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react-native';
import { useMessaging } from '@/context/MessagingContext';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_REQUESTS, Message } from '@/data/mockData';

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(' ');
  return parts.length > 1 ? parts[1] : timeStr;
}

function StatusIcon({ status, color }: { status?: string; color: string }) {
  if (status === 'read' || status === 'delivered')
    return <CheckCheck size={11} color={color} strokeWidth={2.4} />;
  if (status === 'sent')
    return <Check size={11} color={color} strokeWidth={2.4} />;
  return <Clock size={10} color={color} strokeWidth={2.2} />;
}

// Semantic status pill helper for linked maintenance requests
function getRequestStatusStyle(status?: string, isDark?: boolean) {
  switch (status?.toLowerCase()) {
    case 'in progress':
      return {
        bg: isDark ? 'rgba(37, 99, 235, 0.18)' : '#EFF6FF',
        border: isDark ? 'rgba(59, 130, 246, 0.35)' : '#BFDBFE',
        text: isDark ? '#93C5FD' : '#1D4ED8',
      };
    case 'resolved':
      return {
        bg: isDark ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5',
        border: isDark ? 'rgba(16, 185, 129, 0.35)' : '#A7F3D0',
        text: isDark ? '#6EE7B7' : '#047857',
      };
    case 'submitted':
    case 'pending':
    default:
      return {
        bg: isDark ? 'rgba(245, 158, 11, 0.18)' : '#FFFBEB',
        border: isDark ? 'rgba(245, 158, 11, 0.35)' : '#FDE68A',
        text: isDark ? '#FCD34D' : '#B45309',
      };
  }
}

interface MessageBubbleProps {
  msg: Message;
  isMe: boolean;
  isDark: boolean;
  isNextSameSender: boolean;
}

function MessageBubble({
  msg,
  isMe,
  isDark,
  isNextSameSender,
}: MessageBubbleProps) {
  const bottomMargin = isNextSameSender ? 4 : 12;

  return (
    <View
      className={`flex-row ${isMe ? 'justify-end' : 'justify-start'}`}
      style={{ marginBottom: bottomMargin }}
    >
      {isMe ? (
        <View
          style={{
            maxWidth: '78%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: isNextSameSender ? 12 : 6,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={['#0F766E', '#0D9488', '#14B8A6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 14,
              paddingTop: 10,
              paddingBottom: 8,
            }}
          >
            <Text
              className="text-[14px] text-white leading-[20px]"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              {msg.text}
            </Text>

            {msg.attachments && msg.attachments.length > 0 && (
              <View className="flex-row flex-wrap gap-1.5 mt-2">
                {msg.attachments.map((att) => (
                  <View
                    key={att.id}
                    className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-[10px]"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    {att.type === 'image' ? (
                      <ImageIcon size={12} color="#FFFFFF" />
                    ) : (
                      <FileText size={12} color="#FFFFFF" />
                    )}
                    <Text
                      numberOfLines={1}
                      className="text-[11px] text-white max-w-[130px]"
                      style={{ fontFamily: 'Inter-Medium' }}
                    >
                      {att.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View className="flex-row items-center justify-end gap-1 mt-1 self-end">
              <Text
                className="text-[10px]"
                style={{
                  fontFamily: 'Inter-Regular',
                  color: 'rgba(255, 255, 255, 0.75)',
                }}
              >
                {formatTime(msg.timestamp)}
              </Text>
              <StatusIcon
                status={msg.status}
                color="rgba(255, 255, 255, 0.8)"
              />
            </View>
          </LinearGradient>
        </View>
      ) : (
        <View
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800"
          style={{
            maxWidth: '78%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: isNextSameSender ? 12 : 6,
            paddingHorizontal: 14,
            paddingTop: 10,
            paddingBottom: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0.2 : 0.04,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Text
            className="text-[14px] text-slate-900 dark:text-slate-50 leading-[20px]"
            style={{ fontFamily: 'Inter-Regular' }}
          >
            {msg.text}
          </Text>

          {msg.attachments && msg.attachments.length > 0 && (
            <View className="flex-row flex-wrap gap-1.5 mt-2">
              {msg.attachments.map((att) => (
                <View
                  key={att.id}
                  className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80"
                >
                  {att.type === 'image' ? (
                    <ImageIcon
                      size={12}
                      color={isDark ? '#94A3B8' : '#64748B'}
                    />
                  ) : (
                    <FileText
                      size={12}
                      color={isDark ? '#94A3B8' : '#64748B'}
                    />
                  )}
                  <Text
                    numberOfLines={1}
                    className="text-[11px] text-slate-700 dark:text-slate-300 max-w-[130px]"
                    style={{ fontFamily: 'Inter-Medium' }}
                  >
                    {att.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text
            className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 self-end"
            style={{ fontFamily: 'Inter-Regular' }}
          >
            {formatTime(msg.timestamp)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const {
    conversations,
    messages: allMessages,
    sendMessage,
    markConversationAsRead,
  } = useMessaging();
  const scrollRef = useRef<ScrollView>(null);
  const [text, setText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const conv = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id],
  );
  const messages = useMemo(
    () => allMessages.filter((m) => m.conversationId === id),
    [allMessages, id],
  );

  const markedReadRef = useRef<string | null>(null);
  useEffect(() => {
    if (id && markedReadRef.current !== id) {
      markedReadRef.current = id;
      markConversationAsRead(id);
    }
  }, [id, markConversationAsRead]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (!text.trim() || !id) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    sendMessage(id, text.trim());
    setText('');
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [text, id, sendMessage]);

  const handleAttachment = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Haptics fallback
    }
    Alert.alert(
      'Attachments',
      'Attachment upload will be connected when backend/file storage is added.',
    );
  };

  if (!conv) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950">
        <View
          style={{ paddingTop: insets.top + 6 }}
          className="flex-row items-center px-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-[14px] bg-slate-100 dark:bg-slate-800"
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <ArrowLeft
              size={19}
              color={isDark ? '#F8FAFC' : '#0F172A'}
              strokeWidth={2.4}
            />
          </Pressable>
          <Text
            className="text-[16px] text-slate-900 dark:text-white flex-1 text-center"
            style={{ fontFamily: 'Inter-Bold' }}
          >
            Chat
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 items-center justify-center p-6">
          <Text
            className="text-[15px] text-slate-500 dark:text-slate-400"
            style={{ fontFamily: 'Inter-Medium' }}
          >
            Conversation not found
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="mt-4 px-5 py-2.5 rounded-full bg-teal-600 dark:bg-teal-500"
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Text
              className="text-white text-[13px]"
              style={{ fontFamily: 'Inter-SemiBold' }}
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isIssueLinked = conv.conversationType === 'issue_linked';
  const linkedRequest = conv.linkedRequestId
    ? MOCK_REQUESTS.find((r) => r.id === conv.linkedRequestId)
    : null;
  const participantFirstName = conv.participantName.split(' ')[0] || 'Contact';
  const canSend = text.trim().length > 0;
  const reqStatusStyle = getRequestStatusStyle(linkedRequest?.status, isDark);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header Bar */}
      <View
        style={{
          paddingTop: insets.top + 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.25 : 0.04,
          shadowRadius: 5,
          elevation: 3,
        }}
        className="flex-row items-center px-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-[14px] bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70"
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <ArrowLeft
            size={19}
            color={isDark ? '#F8FAFC' : '#0F172A'}
            strokeWidth={2.4}
          />
        </Pressable>

        <View className="flex-1 flex-row items-center gap-3 px-2.5 min-w-0">
          <LinearGradient
            colors={
              isIssueLinked
                ? isDark
                  ? ['#78350F', '#451A03']
                  : ['#FEF3C7', '#FDE68A']
                : isDark
                  ? ['#134E4A', '#042F2E']
                  : ['#CCFBF1', '#99F6E4']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: isIssueLinked
                ? isDark
                  ? 'rgba(245, 158, 11, 0.4)'
                  : '#FCD34D'
                : isDark
                  ? 'rgba(45, 212, 191, 0.35)'
                  : '#5EEAD4',
            }}
          >
            <Text
              className="text-[13.5px]"
              style={{
                fontFamily: 'Inter-Bold',
                color: isIssueLinked
                  ? isDark
                    ? '#FCD34D'
                    : '#B45309'
                  : isDark
                    ? '#2DD4BF'
                    : '#0F766E',
              }}
            >
              {conv.participantName
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </Text>
          </LinearGradient>

          <View className="flex-1 min-w-0">
            <Text
              numberOfLines={1}
              className="text-[15.5px] tracking-[-0.2px] text-slate-900 dark:text-white"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              {conv.participantName}
            </Text>
            <Text
              numberOfLines={1}
              className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5"
              style={{ fontFamily: 'Inter-Medium' }}
            >
              {conv.participantRole} · {isIssueLinked ? (conv.linkedRequestId || 'Issue Chat') : 'Property conversation'}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${conv.participantName}'s profile`}
          onPress={() =>
            router.push({
              pathname: '/contact-profile',
              params: { contactId: conv.participantId || '' },
            })
          }
          className="h-10 w-10 items-center justify-center rounded-[14px] bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70"
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <Info
            size={18}
            color={isDark ? '#94A3B8' : '#64748B'}
            strokeWidth={2.2}
          />
        </Pressable>
      </View>

      {/* Messages Feed */}
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 16,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        {/* Linked Request Context Card (if applicable) */}
        {conv.linkedRequestId && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open linked request ${conv.linkedRequestId}`}
            onPress={() =>
              linkedRequest &&
              router.push({
                pathname: '/request-detail',
                params: { id: linkedRequest.id },
              })
            }
            className="flex-row items-center gap-2.5 p-3 mb-2.5 rounded-[16px] bg-amber-50/90 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/50"
            style={({ pressed }) => ({
              opacity: pressed ? 0.88 : 1,
              transform: [{ scale: pressed ? 0.99 : 1 }],
              shadowColor: '#D97706',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0.15 : 0.04,
              shadowRadius: 3,
              elevation: 1,
            })}
          >
            <View className="h-8 w-8 items-center justify-center rounded-[10px] bg-amber-100 dark:bg-amber-900/80 shrink-0">
              <Link2 size={15} color="#D97706" strokeWidth={2.4} />
            </View>

            <View className="flex-1 min-w-0 pr-1">
              <View className="flex-row items-center gap-1.5">
                <Text
                  className="text-[10px] tracking-[0.6px] text-amber-700 dark:text-amber-400"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  LINKED REQUEST · {conv.linkedRequestId}
                </Text>
                {linkedRequest?.status && (
                  <View
                    className="px-1.5 py-0.2 rounded border"
                    style={{
                      backgroundColor: reqStatusStyle.bg,
                      borderColor: reqStatusStyle.border,
                    }}
                  >
                    <Text
                      className="text-[9px]"
                      style={{
                        fontFamily: 'Inter-SemiBold',
                        color: reqStatusStyle.text,
                      }}
                    >
                      {linkedRequest.status}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                numberOfLines={1}
                className="text-[12.5px] text-slate-900 dark:text-white mt-0.5"
                style={{ fontFamily: 'Inter-Medium' }}
              >
                {conv.linkedRequestTitle ||
                  linkedRequest?.title ||
                  'Maintenance Request'}
              </Text>
            </View>

            <ChevronRight
              size={15}
              color={isDark ? '#94A3B8' : '#64748B'}
              strokeWidth={2.2}
            />
          </Pressable>
        )}

        {/* Compact Trust Banner */}
        <View className="flex-row items-center gap-2 py-2 px-3 mb-3 rounded-[12px] bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800">
          <ShieldCheck
            size={13}
            color={isDark ? '#2DD4BF' : '#0D9488'}
            strokeWidth={2.2}
          />
          <Text
            className="text-[11px] text-slate-500 dark:text-slate-400 flex-1 leading-[15px]"
            style={{ fontFamily: 'Inter-Regular' }}
          >
            Official conversation saved with your property tenancy records.
          </Text>
        </View>

        {/* Date Separator Pill */}
        <View className="items-center my-2">
          <View className="px-3 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/40">
            <Text
              className="text-[10px] text-slate-500 dark:text-slate-400"
              style={{ fontFamily: 'Inter-SemiBold' }}
            >
              Today
            </Text>
          </View>
        </View>

        {/* Message Feed or Empty State */}
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12 px-4">
            <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800 mb-3">
              <MessageSquare size={22} color="#0D9488" strokeWidth={2.2} />
            </View>
            <Text
              className="text-[14px] text-slate-800 dark:text-slate-200 text-center"
              style={{ fontFamily: 'Inter-SemiBold' }}
            >
              Start the conversation
            </Text>
            <Text
              className="text-[11.5px] text-slate-400 dark:text-slate-500 text-center mt-1 max-w-[220px]"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              {isIssueLinked
                ? `Discuss details regarding ${conv.linkedRequestId || 'this request'}.`
                : `Messages with ${participantFirstName} will appear here.`}
            </Text>
          </View>
        ) : (
          <View className="mt-1 flex-1 justify-end">
            {messages.map((msg, index) => {
              const isMe = msg.senderId === 'tenant_001';
              const nextMessage = messages[index + 1];
              const isNextSameSender = nextMessage?.senderId === msg.senderId;

              return (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMe={isMe}
                  isDark={isDark}
                  isNextSameSender={isNextSameSender}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Docked Message Composer Bar */}
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, 10),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 8,
          elevation: 6,
        }}
        className="flex-row items-end gap-2 px-3.5 pt-2.5 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800"
      >
        {/* Attachment Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add attachment"
          onPress={handleAttachment}
          className="h-11 w-11 items-center justify-center rounded-[15px] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80"
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
        >
          <Paperclip
            size={18}
            color={isDark ? '#94A3B8' : '#64748B'}
            strokeWidth={2.2}
          />
        </Pressable>

        {/* Compact Text Input */}
        <View
          className="flex-1 rounded-[18px] px-3.5 py-1.5 min-h-[44px] max-h-[110px] justify-center"
          style={{
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            borderWidth: isInputFocused ? 1.5 : 1,
            borderColor: isInputFocused
              ? isDark
                ? '#2DD4BF'
                : '#0D9488'
              : isDark
                ? '#334155'
                : '#E2E8F0',
          }}
        >
          <TextInput
            className="text-[14px] text-slate-900 dark:text-white leading-[20px] p-0"
            style={{ fontFamily: 'Inter-Regular' }}
            placeholder={
              isIssueLinked && conv.linkedRequestId
                ? `Message about ${conv.linkedRequestId}...`
                : `Message ${participantFirstName}...`
            }
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            value={text}
            onChangeText={setText}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            multiline
          />
        </View>

        {/* Send Button */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: !canSend }}
          onPress={handleSend}
          disabled={!canSend}
          hitSlop={6}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 14,
            overflow: 'hidden',

            alignItems: 'center',
            justifyContent: 'center',

            transform: [
              {
                scale: pressed && canSend ? 0.94 : 1,
              },
            ],

            shadowColor: canSend ? '#0D9488' : 'transparent',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: canSend
              ? isDark
                ? 0.32
                : 0.18
              : 0,
            shadowRadius: canSend ? 6 : 0,
            elevation: canSend ? 4 : 0,
          })}
        >
          <LinearGradient
            colors={
              canSend
                ? ['#0F766E', '#0D9488', '#14B8A6']
                : isDark
                  ? ['#1E293B', '#1E293B']
                  : ['#E8EEF5', '#E2E8F0']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,

              alignItems: 'center',
              justifyContent: 'center',

              borderWidth: canSend ? 0 : 1,
              borderColor: isDark
                ? '#334155'
                : '#D7E0EA',
            }}
          >
            <Send
              size={17}
              color={
                canSend
                  ? '#FFFFFF'
                  : isDark
                    ? '#64748B'
                    : '#94A3B8'
              }
              strokeWidth={canSend ? 2.5 : 2.2}
            />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
