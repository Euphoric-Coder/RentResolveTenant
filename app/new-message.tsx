import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  ArrowRight, User, Link2, MessageSquare, ChevronDown, Check,
} from 'lucide-react-native';
import { useMessaging } from '@/context/MessagingContext';
import { useTheme } from '@/context/ThemeContext';
import { mockLinkableRequests } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

type ConvType = 'general' | 'issue_linked';

export default function NewMessageScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { contacts, createConversation } = useMessaging();
  const [recipientId, setRecipientId] = useState<string>('');
  const [convType, setConvType] = useState<ConvType>('general');
  const [linkedRequestId, setLinkedRequestId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!recipientId) { setError('Please select a recipient.'); return; }
    if (!message.trim()) { setError('Please enter a message.'); return; }
    if (convType === 'issue_linked' && !linkedRequestId) { setError('Please select a linked request.'); return; }

    const linkedReq = mockLinkableRequests.find((r) => r.id === linkedRequestId);
    const newId = createConversation({
      participantId: recipientId,
      conversationType: convType,
      linkedRequestId: convType === 'issue_linked' ? linkedRequestId : null,
      linkedRequestTitle: convType === 'issue_linked' ? linkedReq?.title || null : null,
      messageText: message.trim(),
    });

    if (newId) {
      router.replace({ pathname: '/chat', params: { id: newId } });
    } else {
      setError('Failed to create conversation. Please try again.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="New Message" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {error ? (
            <Animated.View entering={FadeInDown.duration(300)} style={[styles.errorBanner, { backgroundColor: colors.dangerLight }]}>
              <Text style={[styles.errorText, { color: colors.danger, fontFamily: 'Inter-Medium' }]}>{error}</Text>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>SELECT RECIPIENT</Text>
            {contacts.map((c) => {
              const active = recipientId === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => { setRecipientId(c.id); setError(''); }}
                  style={({ pressed }) => [
                    styles.recipientCard,
                    { backgroundColor: colors.surface, borderColor: active ? colors.primary : colors.border, opacity: pressed ? 0.92 : 1 },
                    SHADOWS.card,
                  ]}
                >
                  <View style={[styles.recipientAvatar, { backgroundColor: active ? colors.primaryGlow : colors.surfaceSecondary }]}>
                    <Text style={[styles.recipientAvatarText, { color: active ? colors.primary : colors.textSecondary, fontFamily: 'Inter-Bold' }]}>
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.recipientName, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{c.name}</Text>
                    <Text style={[styles.recipientRole, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{c.role}</Text>
                    <Text style={[styles.recipientMeta, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{c.responseTime}</Text>
                  </View>
                  <View style={[styles.radioOuter, { borderColor: active ? colors.primary : colors.inputBorder }]}>
                    {active && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                  </View>
                </Pressable>
              );
            })}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>CONVERSATION TYPE</Text>
            <View style={styles.typeRow}>
              <Pressable
                onPress={() => { setConvType('general'); setLinkedRequestId(''); setError(''); }}
                style={[styles.typeCard, { backgroundColor: convType === 'general' ? colors.primaryGlow : colors.surface, borderColor: convType === 'general' ? colors.primary : colors.border }]}
              >
                <View style={[styles.typeIcon, { backgroundColor: convType === 'general' ? colors.primary + '20' : colors.surfaceSecondary }]}>
                  <MessageSquare size={18} color={convType === 'general' ? colors.primary : colors.textMuted} />
                </View>
                <Text style={[styles.typeLabel, { color: convType === 'general' ? colors.primary : colors.textSecondary, fontFamily: convType === 'general' ? 'Inter-SemiBold' : 'Inter-Medium' }]}>
                  General
                </Text>
              </Pressable>
              <Pressable
                onPress={() => { setConvType('issue_linked'); setError(''); }}
                style={[styles.typeCard, { backgroundColor: convType === 'issue_linked' ? colors.accentLight : colors.surface, borderColor: convType === 'issue_linked' ? colors.accent : colors.border }]}
              >
                <View style={[styles.typeIcon, { backgroundColor: convType === 'issue_linked' ? colors.accent + '20' : colors.surfaceSecondary }]}>
                  <Link2 size={18} color={convType === 'issue_linked' ? colors.accent : colors.textMuted} />
                </View>
                <Text style={[styles.typeLabel, { color: convType === 'issue_linked' ? colors.accent : colors.textSecondary, fontFamily: convType === 'issue_linked' ? 'Inter-SemiBold' : 'Inter-Medium' }]}>
                  Issue-linked
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {convType === 'issue_linked' && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>LINK TO MAINTENANCE REQUEST</Text>
              {mockLinkableRequests.map((r) => {
                const active = linkedRequestId === r.id;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => { setLinkedRequestId(r.id); setError(''); }}
                    style={({ pressed }) => [
                      styles.requestCard,
                      { backgroundColor: colors.surface, borderColor: active ? colors.accent : colors.border, opacity: pressed ? 0.92 : 1 },
                      SHADOWS.soft,
                    ]}
                  >
                    <View style={[styles.requestIcon, { backgroundColor: active ? colors.accentLight : colors.surfaceSecondary }]}>
                      <Link2 size={14} color={active ? colors.accent : colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.requestId, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{r.id}</Text>
                      <Text style={[styles.requestTitle, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]} numberOfLines={1}>{r.title}</Text>
                    </View>
                    <View style={[styles.requestStatus, { backgroundColor: colors.surfaceSecondary }]}>
                      <Text style={[styles.requestStatusText, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>{r.status}</Text>
                    </View>
                    {active && (
                      <View style={[styles.checkIcon, { backgroundColor: colors.accent }]}>
                        <Check size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>MESSAGE</Text>
            <View style={[styles.messageInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
              <TextInput
                style={[styles.messageField, { color: colors.textPrimary, fontFamily: 'Inter-Regular' }]}
                value={message}
                onChangeText={(t) => { setMessage(t); setError(''); }}
                placeholder="Type your message..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}
        >
          <LinearGradient colors={['#1E6B5A', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.startBtn}>
            <Text style={[styles.startBtnText, { fontFamily: 'Inter-SemiBold' }]}>Start Conversation</Text>
            <ArrowRight size={17} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  errorBanner: { borderRadius: 12, padding: 14, marginBottom: 16 },
  errorText: { fontSize: 13 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: 12, marginLeft: 2 },
  recipientCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1.5, padding: 14, marginBottom: 10 },
  recipientAvatar: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recipientAvatarText: { fontSize: 14 },
  recipientName: { fontSize: 15 },
  recipientRole: { fontSize: 12, marginTop: 3 },
  recipientMeta: { fontSize: 11, marginTop: 4 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 11, height: 11, borderRadius: 5.5 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeCard: { flex: 1, alignItems: 'center', borderRadius: 14, borderWidth: 1.5, padding: 16, gap: 10 },
  typeIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  typeLabel: { fontSize: 13 },
  requestCard: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1.5, padding: 12, marginBottom: 8 },
  requestIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  requestId: { fontSize: 13 },
  requestTitle: { fontSize: 12, marginTop: 2 },
  requestStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  requestStatusText: { fontSize: 10 },
  checkIcon: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  messageInput: { borderWidth: 1.5, borderRadius: 14, padding: 14, marginBottom: 20, minHeight: 120 },
  messageField: { fontSize: 14, lineHeight: 20, minHeight: 92 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 24 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  startBtnText: { color: '#FFFFFF', fontSize: 15 },
});
