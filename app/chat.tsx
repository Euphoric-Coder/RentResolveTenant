import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  ArrowLeft, Send, Link2, Info, Paperclip, CheckCheck, Check, Clock,
  FileText, Image as ImageIcon,
} from 'lucide-react-native';
import { useMessaging } from '@/context/MessagingContext';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_REQUESTS } from '@/data/mockData';
import { SHADOWS } from '@/constants/theme';

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(' ');
  return parts.length > 1 ? parts[1] : timeStr;
}

function StatusIcon({ status, color }: { status?: string; color: string }) {
  if (status === 'read') return <CheckCheck size={12} color={color} />;
  if (status === 'delivered') return <CheckCheck size={12} color={color} />;
  if (status === 'sent') return <Check size={12} color={color} />;
  return <Clock size={12} color={color} />;
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { getConversationById, getMessagesByConversationId, sendMessage, markConversationAsRead } = useMessaging();
  const scrollRef = useRef<ScrollView>(null);
  const [text, setText] = useState('');

  const conv = getConversationById(id);
  const messages = getMessagesByConversationId(id);

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
    Alert.alert('Attachments', 'Attachment upload will be connected when backend/file storage is added.');
    // TODO: Connect attachments to file storage.
  };

  if (!conv) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.headerBg, borderBottomColor: colors.headerBorder }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}><ArrowLeft size={22} color={colors.textPrimary} /></Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>
    );
  }

  const linkedRequest = conv.linkedRequestId ? MOCK_REQUESTS.find((r) => r.id === conv.linkedRequestId) : null;

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.headerBg, borderBottomColor: colors.headerBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}><ArrowLeft size={22} color={colors.textPrimary} /></Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.headerAvatar, { backgroundColor: conv.conversationType === 'issue_linked' ? colors.accentLight : colors.primaryGlow }]}>
            <Text style={[styles.headerAvatarText, { color: conv.conversationType === 'issue_linked' ? colors.accent : colors.primary, fontFamily: 'Inter-Bold' }]}>
              {conv.participantName.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{conv.participantName}</Text>
            <Text style={[styles.headerRole, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{conv.participantRole}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push({ pathname: '/contact-profile', params: { contactId: conv.participantId || '' } })}
          style={styles.infoButton}
        >
          <Info size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {conv.linkedRequestId && (
        <Pressable
          style={[styles.linkedCard, { backgroundColor: colors.accentLight, borderColor: colors.accent + '30' }]}
          onPress={() => linkedRequest && router.push({ pathname: '/request-detail', params: { id: linkedRequest.id } })}
        >
          <View style={[styles.linkedIcon, { backgroundColor: colors.accent + '20' }]}>
            <Link2 size={14} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.linkedLabel, { color: colors.accent, fontFamily: 'Inter-SemiBold' }]}>LINKED REQUEST</Text>
            <Text style={[styles.linkedTitle, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]} numberOfLines={1}>
              {conv.linkedRequestId} · {conv.linkedRequestTitle}
            </Text>
          </View>
          {linkedRequest && (
            <View style={[styles.linkedStatus, { backgroundColor: colors.accent + '15' }]}>
              <Text style={[styles.linkedStatusText, { color: colors.accent, fontFamily: 'Inter-SemiBold' }]}>{linkedRequest.status}</Text>
            </View>
          )}
        </Pressable>
      )}

      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.systemNote, { backgroundColor: colors.surfaceSecondary }]}>
          <Info size={11} color={colors.textMuted} />
          <Text style={[styles.systemNoteText, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
            Messages are linked to your rental property and may be used for request verification.
          </Text>
        </View>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'tenant_001';
          return (
            <Animated.View key={msg.id} entering={FadeIn.duration(200)} style={[styles.messageRow, { alignItems: isMe ? 'flex-end' : 'flex-start' }]}>
              {isMe ? (
                <LinearGradient
                  colors={['#1E6B5A', '#0D9488']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.bubbleMe, { borderBottomLeftRadius: 18, borderBottomRightRadius: 4 }]}
                >
                  <Text style={[styles.messageText, { color: '#FFFFFF', fontFamily: 'Inter-Regular' }]}>{msg.text}</Text>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <View style={styles.attachmentsRow}>
                      {msg.attachments.map((att) => (
                        <View key={att.id} style={[styles.attachmentCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                          {att.type === 'image' ? <ImageIcon size={14} color="#FFFFFF" /> : <FileText size={14} color="#FFFFFF" />}
                          <Text style={[styles.attachmentName, { color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter-Regular' }]} numberOfLines={1}>{att.name}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View style={styles.metaRow}>
                    <Text style={[styles.messageTime, { color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter-Regular' }]}>
                      {formatTime(msg.timestamp)}
                    </Text>
                    <StatusIcon status={msg.status} color="rgba(255,255,255,0.6)" />
                  </View>
                </LinearGradient>
              ) : (
                <View style={[styles.bubbleThem, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomLeftRadius: 4, borderBottomRightRadius: 18 }, SHADOWS.soft]}>
                  <Text style={[styles.senderName, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>{msg.senderName}</Text>
                  <Text style={[styles.messageText, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]}>{msg.text}</Text>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <View style={styles.attachmentsRow}>
                      {msg.attachments.map((att) => (
                        <View key={att.id} style={[styles.attachmentCard, { backgroundColor: colors.surfaceSecondary }]}>
                          {att.type === 'image' ? <ImageIcon size={14} color={colors.textSecondary} /> : <FileText size={14} color={colors.textSecondary} />}
                          <Text style={[styles.attachmentName, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]} numberOfLines={1}>{att.name}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text style={[styles.messageTime, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>

      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
        <Pressable onPress={handleAttachment} style={styles.attachButton}>
          <Paperclip size={20} color={colors.textMuted} />
        </Pressable>
        <TextInput
          style={[styles.chatInput, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.inputBorder, fontFamily: 'Inter-Regular' }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          multiline
        />
        <Pressable
          style={[styles.sendButton, { opacity: text.trim() ? 1 : 0.4 }]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <LinearGradient colors={['#1E6B5A', '#0D9488']} style={styles.sendGradient}>
            <Send size={18} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { fontSize: 13 },
  headerTitle: { fontSize: 15 },
  headerRole: { fontSize: 11, marginTop: 2 },
  infoButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  linkedCard: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  linkedIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  linkedLabel: { fontSize: 9, letterSpacing: 0.8 },
  linkedTitle: { fontSize: 12, marginTop: 2 },
  linkedStatus: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  linkedStatusText: { fontSize: 10 },
  messagesContent: { padding: 16, paddingBottom: 16 },
  systemNote: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 12, marginBottom: 16, marginHorizontal: 4 },
  systemNoteText: { fontSize: 11, flex: 1, lineHeight: 16 },
  messageRow: { marginBottom: 10 },
  bubbleMe: { maxWidth: '80%', borderRadius: 18, padding: 14 },
  bubbleThem: { maxWidth: '80%', borderRadius: 18, padding: 14, borderWidth: 1 },
  senderName: { fontSize: 11, marginBottom: 4 },
  messageText: { fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginTop: 4 },
  messageTime: { fontSize: 10 },
  attachmentsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  attachmentCard: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  attachmentName: { fontSize: 11 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1 },
  attachButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  chatInput: { flex: 1, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 10, fontSize: 14, borderWidth: 1, minHeight: 44, maxHeight: 100 },
  sendButton: { borderRadius: 22, overflow: 'hidden' },
  sendGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
