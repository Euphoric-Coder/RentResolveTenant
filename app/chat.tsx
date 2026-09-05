import { useState, useRef, useEffect, useCallback } from 'react';
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
} from 'lucide-react-native';
import { useMessaging } from '@/context/MessagingContext';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_REQUESTS } from '@/data/mockData';

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(' ');
  return parts.length > 1 ? parts[1] : timeStr;
}

function StatusIcon({ status, color }: { status?: string; color: string }) {
  if (status === 'read' || status === 'delivered')
    return <CheckCheck size={12} color={color} />;
  if (status === 'sent') return <Check size={12} color={color} />;
  return <Clock size={12} color={color} />;
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const {
    getConversationById,
    getMessagesByConversationId,
    sendMessage,
    markConversationAsRead,
  } = useMessaging();
  const scrollRef = useRef<ScrollView>(null);
  const [text, setText] = useState('');

  const conv = id ? getConversationById(id) : undefined;
  const messages = id ? getMessagesByConversationId(id) : [];

  useEffect(() => {
    if (id) markConversationAsRead(id);
  }, [id, markConversationAsRead]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (!text.trim() || !id) return;
    sendMessage(id, text.trim());
    setText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [text, id, sendMessage]);

  const handleAttachment = () => {
    Alert.alert(
      'Attachments',
      'Attachment upload will be connected when backend/file storage is added.',
    );
  };

  if (!conv) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950">
        <View
          style={{ paddingTop: insets.top + 8 }}
          className="flex-row items-center px-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800"
        >
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-[12px] bg-slate-100 dark:bg-slate-800"
          >
            <ArrowLeft
              size={20}
              color={isDark ? '#F8FAFC' : '#0F172A'}
              strokeWidth={2.2}
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
            onPress={() => router.back()}
            className="mt-4 px-4 py-2 rounded-full bg-teal-600 dark:bg-teal-500"
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

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header Bar */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="flex-row items-center px-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-sm"
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-[12px] bg-slate-100 dark:bg-slate-800 active:opacity-75"
        >
          <ArrowLeft
            size={20}
            color={isDark ? '#F8FAFC' : '#0F172A'}
            strokeWidth={2.2}
          />
        </Pressable>

        <View className="flex-1 flex-row items-center gap-3 px-2.5 min-w-0">
          <View
            className={`h-10 w-10 items-center justify-center rounded-[13px] border ${
              isIssueLinked
                ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700'
                : 'bg-teal-100 dark:bg-teal-950/70 border-teal-300 dark:border-teal-700'
            }`}
          >
            <Text
              className={`text-[13px] ${
                isIssueLinked
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

          <View className="flex-1 min-w-0">
            <Text
              numberOfLines={1}
              className="text-[15px] tracking-[-0.2px] text-slate-900 dark:text-white"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              {conv.participantName}
            </Text>
            <Text
              numberOfLines={1}
              className="text-[11.5px] text-slate-500 dark:text-slate-400"
              style={{ fontFamily: 'Inter-Medium' }}
            >
              {conv.participantRole}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: '/contact-profile',
              params: { contactId: conv.participantId || '' },
            })
          }
          className="h-10 w-10 items-center justify-center rounded-[12px] bg-slate-100 dark:bg-slate-800 active:opacity-75"
        >
          <Info
            size={19}
            color={isDark ? '#94A3B8' : '#64748B'}
            strokeWidth={2.2}
          />
        </Pressable>
      </View>

      {/* Linked Request Sticky Banner */}
      {conv.linkedRequestId && (
        <Pressable
          onPress={() =>
            linkedRequest &&
            router.push({
              pathname: '/request-detail',
              params: { id: linkedRequest.id },
            })
          }
          className="flex-row items-center gap-2.5 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200/80 dark:border-amber-900/60 active:opacity-85"
        >
          <View className="h-7 w-7 items-center justify-center rounded-[8px] bg-amber-100 dark:bg-amber-900/80">
            <Link2 size={13} color="#D97706" strokeWidth={2.4} />
          </View>

          <View className="flex-1 min-w-0 pr-1">
            <Text
              className="text-[9.5px] tracking-[0.8px] text-amber-700 dark:text-amber-400"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              LINKED REQUEST
            </Text>
            <Text
              numberOfLines={1}
              className="text-[12px] text-slate-900 dark:text-white mt-0.5"
              style={{ fontFamily: 'Inter-Medium' }}
            >
              {conv.linkedRequestId} · {conv.linkedRequestTitle}
            </Text>
          </View>

          {linkedRequest && (
            <View className="px-2 py-0.5 rounded-md bg-amber-200/60 dark:bg-amber-900/60">
              <Text
                className="text-[10px] text-amber-800 dark:text-amber-300"
                style={{ fontFamily: 'Inter-SemiBold' }}
              >
                {linkedRequest.status}
              </Text>
            </View>
          )}
        </Pressable>
      )}

      {/* Messages Feed */}
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-2 p-3 mb-4 rounded-[14px] bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          <Info
            size={13}
            color={isDark ? '#94A3B8' : '#64748B'}
            strokeWidth={2.2}
          />
          <Text
            className="text-[11.5px] text-slate-500 dark:text-slate-400 flex-1 leading-[16px]"
            style={{ fontFamily: 'Inter-Regular' }}
          >
            Messages are linked to your rental property for transparency &
            dispute resolution.
          </Text>
        </View>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'tenant_001';
          return (
            <View
              key={msg.id}
              className={`mb-3 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {isMe ? (
                <View className="max-w-[82%] rounded-[20px] rounded-br-[4px] overflow-hidden shadow-sm">
                  <LinearGradient
                    colors={['#0F766E', '#0D9488']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-3.5"
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
                            className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-white/15"
                          >
                            {att.type === 'image' ? (
                              <ImageIcon size={13} color="#FFFFFF" />
                            ) : (
                              <FileText size={13} color="#FFFFFF" />
                            )}
                            <Text
                              numberOfLines={1}
                              className="text-[11px] text-white/90 max-w-[130px]"
                              style={{ fontFamily: 'Inter-Regular' }}
                            >
                              {att.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View className="flex-row items-center justify-end gap-1 mt-1.5 self-end">
                      <Text
                        className="text-[10px] text-white/70"
                        style={{ fontFamily: 'Inter-Regular' }}
                      >
                        {formatTime(msg.timestamp)}
                      </Text>
                      <StatusIcon
                        status={msg.status}
                        color="rgba(255,255,255,0.7)"
                      />
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View className="max-w-[82%] p-3.5 rounded-[20px] rounded-bl-[4px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
                  <Text
                    className="text-[11.5px] text-teal-600 dark:text-teal-400 mb-1"
                    style={{ fontFamily: 'Inter-SemiBold' }}
                  >
                    {msg.senderName}
                  </Text>
                  <Text
                    className="text-[14px] text-slate-900 dark:text-white leading-[20px]"
                    style={{ fontFamily: 'Inter-Regular' }}
                  >
                    {msg.text}
                  </Text>

                  {msg.attachments && msg.attachments.length > 0 && (
                    <View className="flex-row flex-wrap gap-1.5 mt-2">
                      {msg.attachments.map((att) => (
                        <View
                          key={att.id}
                          className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-slate-100 dark:bg-slate-800"
                        >
                          {att.type === 'image' ? (
                            <ImageIcon
                              size={13}
                              color={isDark ? '#94A3B8' : '#64748B'}
                            />
                          ) : (
                            <FileText
                              size={13}
                              color={isDark ? '#94A3B8' : '#64748B'}
                            />
                          )}
                          <Text
                            numberOfLines={1}
                            className="text-[11px] text-slate-700 dark:text-slate-300 max-w-[130px]"
                            style={{ fontFamily: 'Inter-Regular' }}
                          >
                            {att.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text
                    className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 self-end"
                    style={{ fontFamily: 'Inter-Regular' }}
                  >
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Message Input Bar */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        className="flex-row items-end gap-2.5 px-4 pt-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800"
      >
        <Pressable
          onPress={handleAttachment}
          className="h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 active:opacity-75"
        >
          <Paperclip
            size={19}
            color={isDark ? '#94A3B8' : '#64748B'}
            strokeWidth={2.2}
          />
        </Pressable>

        <TextInput
          className="flex-1 rounded-[22px] px-4 py-2.5 text-[14px] text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[44px] max-h-[100px]"
          style={{ fontFamily: 'Inter-Regular' }}
          placeholder="Type a message..."
          placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          multiline
        />

        <Pressable
          onPress={handleSend}
          disabled={!text.trim()}
          className="h-11 w-11 rounded-full overflow-hidden shadow-sm"
          style={({ pressed }) => ({
            opacity: text.trim() ? (pressed ? 0.9 : 1) : 0.4,
            transform: [{ scale: pressed && text.trim() ? 0.96 : 1 }],
          })}
        >
          <LinearGradient
            colors={['#0F766E', '#0D9488']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full items-center justify-center"
          >
            <Send size={18} color="#FFFFFF" strokeWidth={2.4} />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
