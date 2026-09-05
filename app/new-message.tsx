import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft, Send, Link2, MessageSquare, Check, AlertCircle,
  ShieldCheck, Clock, CheckCircle2, ChevronRight, Hash, Users, Wrench,
  Building2,
} from 'lucide-react-native';
import { useMessaging } from '@/context/MessagingContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mockLinkableRequests, MOCK_PROPERTY } from '@/data/mockData';

type ConvType = 'general' | 'issue_linked';

// Semantic status pill helper for maintenance tickets
function getStatusStyle(status?: string, isDark?: boolean) {
  switch (status?.toLowerCase()) {
    case 'in progress':
      return {
        bg: isDark ? 'rgba(37, 99, 235, 0.16)' : '#EFF6FF',
        border: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
        text: isDark ? '#93C5FD' : '#1D4ED8',
      };
    case 'resolved':
      return {
        bg: isDark ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5',
        border: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
        text: isDark ? '#6EE7B7' : '#047857',
      };
    case 'submitted':
    case 'pending':
    default:
      return {
        bg: isDark ? 'rgba(245, 158, 11, 0.16)' : '#FFFBEB',
        border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
        text: isDark ? '#FCD34D' : '#B45309',
      };
  }
}

// Low-saturation role badge helper for clean mobile chips
function getRoleBadgeStyle(role?: string, isDark?: boolean) {
  const isLandlord = (role || '').toLowerCase().includes('landlord');
  if (isLandlord) {
    return {
      bg: isDark ? 'rgba(99, 102, 241, 0.12)' : '#F1F5F9',
      border: isDark ? 'rgba(99, 102, 241, 0.25)' : '#E2E8F0',
      text: isDark ? '#CBD5E1' : '#475569',
    };
  }
  return {
    bg: isDark ? 'rgba(148, 163, 184, 0.12)' : '#F1F5F9',
    border: isDark ? 'rgba(148, 163, 184, 0.25)' : '#E2E8F0',
    text: isDark ? '#94A3B8' : '#475569',
  };
}

interface StepHeaderProps {
  step: number;
  label: string;
  completed?: boolean;
  active?: boolean;
  summary?: string;
  summaryType?: 'teal' | 'amber';
  isDark?: boolean;
}

function StepHeader({ step, label, completed, active, summary, summaryType = 'teal', isDark }: StepHeaderProps) {
  return (
    <View className="flex-row items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800/60">
      <View className="flex-row items-center gap-2 flex-1 pr-2">
        <View
          className="h-5 w-5 items-center justify-center rounded-full"
          style={{
            backgroundColor: completed
              ? '#0D9488'
              : active
              ? isDark
                ? 'rgba(13, 148, 136, 0.2)'
                : '#CCFBF1'
              : isDark
              ? '#1E293B'
              : '#F1F5F9',
            borderWidth: completed ? 0 : 1.2,
            borderColor: completed
              ? '#0D9488'
              : active
              ? isDark
                ? '#2DD4BF'
                : '#0D9488'
              : isDark
              ? '#475569'
              : '#CBD5E1',
          }}
        >
          {completed ? (
            <Check size={11} color="#FFFFFF" strokeWidth={3} />
          ) : (
            <Text
              className="text-[10px]"
              style={{
                fontFamily: 'Inter-Bold',
                color: active
                  ? isDark
                    ? '#2DD4BF'
                    : '#0D9488'
                  : isDark
                  ? '#94A3B8'
                  : '#64748B',
              }}
            >
              {step}
            </Text>
          )}
        </View>

        <Text
          className="text-[11.5px] tracking-[0.5px]"
          style={{
            fontFamily: 'Inter-Bold',
            color: active || completed
              ? isDark
                ? '#F8FAFC'
                : '#0F172A'
              : isDark
              ? '#94A3B8'
              : '#64748B',
          }}
        >
          {label}
        </Text>
      </View>

      {summary ? (
        <View
          className="flex-row items-center gap-1 px-2 py-0.5 rounded-full border shrink-0"
          style={{
            backgroundColor: summaryType === 'amber'
              ? isDark ? 'rgba(245, 158, 11, 0.14)' : '#FFFBEB'
              : isDark ? 'rgba(13, 148, 136, 0.14)' : '#F0FDFA',
            borderColor: summaryType === 'amber'
              ? isDark ? 'rgba(245, 158, 11, 0.35)' : '#FDE68A'
              : isDark ? 'rgba(45, 212, 191, 0.35)' : '#99F6E4',
          }}
        >
          <CheckCircle2
            size={10}
            color={summaryType === 'amber' ? '#D97706' : '#0D9488'}
          />
          <Text
            numberOfLines={1}
            className="text-[10.5px] max-w-[125px]"
            style={{
              fontFamily: 'Inter-SemiBold',
              color: summaryType === 'amber'
                ? isDark ? '#FCD34D' : '#B45309'
                : isDark ? '#5EEAD4' : '#0F766E',
            }}
          >
            {summary}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default function NewMessageScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedProperty } = useAuth();
  const { contacts, createConversation } = useMessaging();
  const [recipientId, setRecipientId] = useState<string>('');
  const [convType, setConvType] = useState<ConvType>('general');
  const [linkedRequestId, setLinkedRequestId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const connectedName = selectedProperty?.name || MOCK_PROPERTY.name;
  const connectedUnit = selectedProperty?.selectedUnit || MOCK_PROPERTY.unit;

  const isValid =
    !!recipientId &&
    message.trim().length > 0 &&
    (convType !== 'issue_linked' || !!linkedRequestId);

  const selectedContact = (contacts || []).find((c) => String(c?.id ?? '') === recipientId);

  const triggerHaptic = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Haptic fallback
    }
  };

  const handleStart = () => {
    if (!recipientId) {
      setError('Please select a recipient.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }
    if (convType === 'issue_linked' && !linkedRequestId) {
      setError('Please select a linked request.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptic fallback
    }

    const linkedReq = (mockLinkableRequests || []).find((r) => String(r?.id ?? '') === linkedRequestId);
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

  // Dynamic contextual composer header
  const getComposerHeader = () => {
    if (convType === 'issue_linked' && linkedRequestId) {
      return `Message regarding ${linkedRequestId}`;
    }
    if (selectedContact) {
      return `Message to ${selectedContact.name}`;
    }
    return 'Compose Message';
  };

  // Dynamic contextual placeholder
  const getComposerPlaceholder = () => {
    if (!recipientId) {
      return 'Select a recipient above to start writing...';
    }
    if (convType === 'issue_linked') {
      return 'Describe your question or update about this request...';
    }
    return 'Write your message...';
  };

  // Footer guidance status
  const getActionHint = () => {
    if (!recipientId) return 'Select recipient';
    if (convType === 'issue_linked' && !linkedRequestId) return 'Select request';
    if (!message.trim()) return 'Add message';
    return 'Ready';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-slate-50 dark:bg-slate-950"
    >
      {/* Extremely Faint Ambient Wash */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 160,
          backgroundColor: isDark ? 'rgba(13, 148, 136, 0.03)' : 'rgba(20, 184, 166, 0.025)',
        }}
      />

      {/* Header Bar */}
      <View
        className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.2 : 0.03,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{ paddingTop: insets.top + 6 }}
          className="px-4 pb-3"
        >
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-9 w-9 items-center justify-center rounded-[12px] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80"
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
              hitSlop={8}
            >
              <ArrowLeft size={18} color={isDark ? '#F8FAFC' : '#0F172A'} strokeWidth={2.4} />
            </Pressable>

            <View className="flex-1 items-center px-3">
              <Text
                className="text-[17px] tracking-[-0.3px] text-slate-900 dark:text-white text-center"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                New Message
              </Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <Text
                  numberOfLines={1}
                  className="text-[11.5px] text-slate-500 dark:text-slate-400"
                  style={{ fontFamily: 'Inter-Medium' }}
                >
                  {connectedName} · {connectedUnit}
                </Text>
              </View>
            </View>

            <View
              className="h-9 w-9 items-center justify-center rounded-[12px] bg-teal-50 dark:bg-teal-950/70 border border-teal-200/70 dark:border-teal-800/80"
            >
              <Building2 size={16} color="#0D9488" strokeWidth={2.2} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 14, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        {/* Compact Official Tenancy Channel Banner */}
        <View
          className="flex-row items-center gap-3 py-2.5 px-3.5 mb-3 rounded-[16px] bg-white dark:bg-slate-900 border border-teal-200/60 dark:border-teal-900/50"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0.15 : 0.02,
            shadowRadius: 3,
            elevation: 1,
          }}
        >
          <View
            className="h-7 w-7 items-center justify-center rounded-[9px] bg-teal-50 dark:bg-teal-950/80 shrink-0"
          >
            <ShieldCheck size={15} color="#0D9488" strokeWidth={2.4} />
          </View>
          <View className="flex-1 pr-1">
            <Text
              className="text-[12px] text-slate-900 dark:text-white"
              style={{ fontFamily: 'Inter-Bold' }}
            >
              Official Tenancy Channel
            </Text>
            <Text
              className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-[14px]"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              Communications are recorded & timestamped for your lease records.
            </Text>
          </View>
        </View>

        {/* Error Banner */}
        {error ? (
          <View
            className="flex-row items-center gap-2 p-3 mb-3 rounded-[14px] bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800"
          >
            <AlertCircle size={16} color="#E11D48" strokeWidth={2.4} />
            <Text
              className="text-[12px] text-rose-700 dark:text-rose-300 flex-1"
              style={{ fontFamily: 'Inter-Medium' }}
            >
              {error}
            </Text>
          </View>
        ) : null}

        {/* STEP 1: Recipient Selection Card */}
        <View
          className="rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 mb-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.18 : 0.03,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <StepHeader
            step={1}
            label="SELECT RECIPIENT"
            completed={!!recipientId}
            active={!recipientId}
            summary={selectedContact ? `${selectedContact.name.split(' ')[0]} selected` : undefined}
            summaryType="teal"
            isDark={isDark}
          />

          {(contacts || []).length === 0 ? (
            <View className="py-4 items-center justify-center">
              <Users size={20} color={isDark ? '#64748B' : '#94A3B8'} />
              <Text
                className="text-[12.5px] text-slate-800 dark:text-slate-200 mt-1.5 text-center"
                style={{ fontFamily: 'Inter-SemiBold' }}
              >
                No messaging contacts available
              </Text>
              <Text
                className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-0.5"
                style={{ fontFamily: 'Inter-Regular' }}
              >
                Your landlord or property manager will appear here once connected.
              </Text>
            </View>
          ) : (
            (contacts || []).map((c, index) => {
              const contactId = String(c?.id ?? '');
              if (!contactId) return null;
              const active = recipientId === contactId;
              const displayName = c?.name || 'Unknown User';
              const displayRole = c?.role || 'Contact';
              const displayResponse = c?.responseTime || '';
              const roleStyle = getRoleBadgeStyle(displayRole, isDark);
              const initials = displayName
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .join('')
                .slice(0, 2) || 'U';

              return (
                <Pressable
                  key={`recipient-${contactId}-${index}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Select ${displayName}, ${displayRole}`}
                  onPress={() => {
                    triggerHaptic();
                    setRecipientId(contactId);
                    setError('');
                  }}
                  className="flex-row items-center gap-3 p-3 mb-2 rounded-[16px]"
                  style={({ pressed }) => ({
                    borderWidth: active ? 1.5 : 1,
                    borderColor: active
                      ? isDark
                        ? '#2DD4BF'
                        : '#14B8A6'
                      : isDark
                      ? '#2A374A'
                      : '#F1F5F9',
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(13, 148, 136, 0.14)'
                        : '#F0FDFA'
                      : isDark
                      ? '#172234'
                      : '#F8FAFC',
                    opacity: pressed ? 0.92 : 1,
                    transform: [{ scale: pressed ? 0.99 : 1 }],
                    shadowColor: active ? '#0D9488' : 'transparent',
                    shadowOffset: { width: 0, height: active ? 2 : 0 },
                    shadowOpacity: active ? (isDark ? 0.2 : 0.06) : 0,
                    shadowRadius: active ? 4 : 0,
                    elevation: active ? 2 : 0,
                  })}
                >
                  {/* Compact Avatar Initials Box */}
                  <View
                    className="h-11 w-11 items-center justify-center rounded-[13px] border shrink-0"
                    style={{
                      backgroundColor: active
                        ? isDark
                          ? 'rgba(13, 148, 136, 0.28)'
                          : '#CCFBF1'
                        : isDark
                        ? '#0F172A'
                        : '#EDF2F7',
                      borderColor: active
                        ? isDark
                          ? '#0F766E'
                          : '#5EEAD4'
                        : isDark
                        ? '#334155'
                        : '#E2E8F0',
                    }}
                  >
                    <Text
                      className="text-[14px]"
                      style={{
                        fontFamily: 'Inter-Bold',
                        color: active
                          ? isDark
                            ? '#2DD4BF'
                            : '#0F766E'
                          : isDark
                          ? '#CBD5E1'
                          : '#475569',
                      }}
                    >
                      {initials}
                    </Text>
                  </View>

                  <View className="flex-1 min-w-0 pr-1">
                    <View className="flex-row items-center gap-1.5">
                      <Text
                        numberOfLines={1}
                        className="text-[14px] tracking-[-0.2px] text-slate-900 dark:text-white flex-1"
                        style={{ fontFamily: 'Inter-Bold' }}
                      >
                        {displayName}
                      </Text>
                      <View
                        className="px-2 py-0.5 rounded-full border shrink-0"
                        style={{
                          backgroundColor: roleStyle.bg,
                          borderColor: roleStyle.border,
                        }}
                      >
                        <Text
                          className="text-[9.5px]"
                          style={{
                            fontFamily: 'Inter-Medium',
                            color: roleStyle.text,
                          }}
                        >
                          {displayRole}
                        </Text>
                      </View>
                    </View>

                    {displayResponse ? (
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <Clock size={10.5} color={active ? '#0D9488' : isDark ? '#94A3B8' : '#64748B'} />
                        <Text
                          numberOfLines={1}
                          className="text-[11px]"
                          style={{
                            fontFamily: 'Inter-Regular',
                            color: active
                              ? isDark
                                ? '#2DD4BF'
                                : '#0D9488'
                              : isDark
                              ? '#94A3B8'
                              : '#64748B',
                          }}
                        >
                          {displayResponse}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Radio Button Indicator */}
                  <View
                    className="h-4.5 w-4.5 rounded-full border-[1.5px] items-center justify-center shrink-0"
                    style={{
                      borderColor: active
                        ? isDark
                          ? '#2DD4BF'
                          : '#0D9488'
                        : isDark
                        ? '#475569'
                        : '#CBD5E1',
                      backgroundColor: active
                        ? isDark
                          ? '#2DD4BF'
                          : '#0D9488'
                        : 'transparent',
                    }}
                  >
                    {active ? <Check size={10} color="#FFFFFF" strokeWidth={3.5} /> : null}
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        {/* STEP 2: Conversation Type Card */}
        <View
          className="rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 mb-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.18 : 0.03,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <StepHeader
            step={2}
            label="CONVERSATION TYPE"
            completed={!!recipientId}
            active={!!recipientId}
            summary={convType === 'general' ? 'General' : 'Issue-Linked'}
            summaryType={convType === 'issue_linked' ? 'amber' : 'teal'}
            isDark={isDark}
          />

          <View className="flex-row gap-2.5">
            {/* General Chat Option */}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: convType === 'general' }}
              accessibilityLabel="General Chat: Questions, updates and general messages"
              onPress={() => {
                triggerHaptic();
                setConvType('general');
                setLinkedRequestId('');
                setError('');
              }}
              className="flex-1 p-3 rounded-[16px] justify-between"
              style={({ pressed }) => ({
                borderWidth: convType === 'general' ? 1.5 : 1,
                borderColor: convType === 'general'
                  ? isDark
                    ? '#2DD4BF'
                    : '#0D9488'
                  : isDark
                  ? '#2A374A'
                  : '#F1F5F9',
                backgroundColor: convType === 'general'
                  ? isDark
                    ? 'rgba(13, 148, 136, 0.14)'
                    : '#F0FDFA'
                  : isDark
                  ? '#172234'
                  : '#F8FAFC',
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}
            >
              {/* Top Row: Icon + Selection Indicator */}
              <View className="flex-row items-center justify-between">
                <View
                  className="h-8 w-8 items-center justify-center rounded-[10px] border"
                  style={{
                    backgroundColor: convType === 'general'
                      ? isDark
                        ? 'rgba(13, 148, 136, 0.28)'
                        : '#CCFBF1'
                      : isDark
                      ? '#0F172A'
                      : '#EDF2F7',
                    borderColor: convType === 'general'
                      ? isDark
                        ? '#0F766E'
                        : '#5EEAD4'
                      : isDark
                      ? '#334155'
                      : '#E2E8F0',
                  }}
                >
                  <MessageSquare
                    size={16}
                    color={convType === 'general' ? '#0D9488' : isDark ? '#94A3B8' : '#64748B'}
                    strokeWidth={2.2}
                  />
                </View>

                <View
                  className="h-4.5 w-4.5 rounded-full border-[1.5px] items-center justify-center"
                  style={{
                    borderColor: convType === 'general'
                      ? isDark
                        ? '#2DD4BF'
                        : '#0D9488'
                      : isDark
                      ? '#475569'
                      : '#CBD5E1',
                    backgroundColor: convType === 'general'
                      ? isDark
                        ? '#2DD4BF'
                        : '#0D9488'
                      : 'transparent',
                  }}
                >
                  {convType === 'general' ? <Check size={10} color="#FFFFFF" strokeWidth={3.5} /> : null}
                </View>
              </View>

              {/* Text Info */}
              <View className="mt-2">
                <Text
                  className="text-[13.5px]"
                  style={{
                    fontFamily: convType === 'general' ? 'Inter-Bold' : 'Inter-SemiBold',
                    color: convType === 'general'
                      ? isDark
                        ? '#2DD4BF'
                        : '#0F766E'
                      : isDark
                      ? '#F8FAFC'
                      : '#1E293B',
                  }}
                >
                  General Chat
                </Text>
                <Text
                  numberOfLines={2}
                  className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-[15px]"
                  style={{ fontFamily: 'Inter-Regular' }}
                >
                  Questions, updates & general messages
                </Text>
              </View>
            </Pressable>

            {/* Issue-Linked Option */}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: convType === 'issue_linked' }}
              accessibilityLabel="Issue-Linked: Discuss a maintenance request"
              onPress={() => {
                triggerHaptic();
                setConvType('issue_linked');
                setError('');
              }}
              className="flex-1 p-3 rounded-[16px] justify-between"
              style={({ pressed }) => ({
                borderWidth: convType === 'issue_linked' ? 1.5 : 1,
                borderColor: convType === 'issue_linked'
                  ? '#F59E0B'
                  : isDark
                  ? '#2A374A'
                  : '#F1F5F9',
                backgroundColor: convType === 'issue_linked'
                  ? isDark
                    ? 'rgba(245, 158, 11, 0.14)'
                    : '#FFFBEB'
                  : isDark
                  ? '#172234'
                  : '#F8FAFC',
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}
            >
              {/* Top Row: Icon + Selection Indicator */}
              <View className="flex-row items-center justify-between">
                <View
                  className="h-8 w-8 items-center justify-center rounded-[10px] border"
                  style={{
                    backgroundColor: convType === 'issue_linked'
                      ? isDark
                        ? 'rgba(245, 158, 11, 0.28)'
                        : '#FEF3C7'
                      : isDark
                      ? '#0F172A'
                      : '#EDF2F7',
                    borderColor: convType === 'issue_linked'
                      ? isDark
                        ? '#B45309'
                        : '#FDE68A'
                      : isDark
                      ? '#334155'
                      : '#E2E8F0',
                  }}
                >
                  <Link2
                    size={16}
                    color={convType === 'issue_linked' ? '#D97706' : isDark ? '#94A3B8' : '#64748B'}
                    strokeWidth={2.4}
                  />
                </View>

                <View
                  className="h-4.5 w-4.5 rounded-full border-[1.5px] items-center justify-center"
                  style={{
                    borderColor: convType === 'issue_linked'
                      ? '#F59E0B'
                      : isDark
                      ? '#475569'
                      : '#CBD5E1',
                    backgroundColor: convType === 'issue_linked'
                      ? '#F59E0B'
                      : 'transparent',
                  }}
                >
                  {convType === 'issue_linked' ? <Check size={10} color="#FFFFFF" strokeWidth={3.5} /> : null}
                </View>
              </View>

              {/* Text Info */}
              <View className="mt-2">
                <Text
                  className="text-[13.5px]"
                  style={{
                    fontFamily: convType === 'issue_linked' ? 'Inter-Bold' : 'Inter-SemiBold',
                    color: convType === 'issue_linked'
                      ? isDark
                        ? '#FBBF24'
                        : '#B45309'
                      : isDark
                      ? '#F8FAFC'
                      : '#1E293B',
                  }}
                >
                  Issue-Linked
                </Text>
                <Text
                  numberOfLines={2}
                  className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-[15px]"
                  style={{ fontFamily: 'Inter-Regular' }}
                >
                  Discuss a maintenance request
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* STEP 2.5: Optional Maintenance Request Card (Toned Down, Compact) */}
        {convType === 'issue_linked' && (
          <View
            className="rounded-[22px] bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 p-3.5 mb-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.18 : 0.03,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between pb-2.5 mb-2.5 border-b border-amber-100/80 dark:border-amber-950/60">
              <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                <Hash size={13} color="#D97706" strokeWidth={2.4} />
                <Text
                  className="text-[11.5px] tracking-[0.5px] text-amber-800 dark:text-amber-400"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  ATTACH MAINTENANCE REQUEST
                </Text>
              </View>

              {linkedRequestId ? (
                <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200/80 dark:border-amber-800">
                  <CheckCircle2 size={10} color="#D97706" />
                  <Text
                    numberOfLines={1}
                    className="text-[10.5px] text-amber-800 dark:text-amber-300 max-w-[110px]"
                    style={{ fontFamily: 'Inter-SemiBold' }}
                  >
                    {linkedRequestId}
                  </Text>
                </View>
              ) : null}
            </View>

            {(mockLinkableRequests || []).length === 0 ? (
              <View className="py-4 items-center justify-center">
                <Wrench size={20} color={isDark ? '#64748B' : '#94A3B8'} />
                <Text
                  className="text-[12.5px] text-slate-800 dark:text-slate-200 mt-1.5 text-center"
                  style={{ fontFamily: 'Inter-SemiBold' }}
                >
                  No active maintenance requests
                </Text>
                <Text
                  className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-0.5"
                  style={{ fontFamily: 'Inter-Regular' }}
                >
                  You don't currently have any requests available to link.
                </Text>
              </View>
            ) : (
              (mockLinkableRequests || []).map((r, index) => {
                const requestId = String(r?.id ?? '');
                if (!requestId) return null;
                const active = linkedRequestId === requestId;
                const requestTitle = r?.title || 'Untitled maintenance request';
                const requestStatus = r?.status || 'Active';
                const badgeStyle = getStatusStyle(requestStatus, isDark);

                return (
                  <Pressable
                    key={`request-${requestId}-${index}`}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Maintenance request ${requestId}, ${requestTitle}, status ${requestStatus}`}
                    onPress={() => {
                      triggerHaptic();
                      setLinkedRequestId(requestId);
                      setError('');
                    }}
                    className="flex-row items-center gap-2.5 p-3 mb-2 rounded-[16px]"
                    style={({ pressed }) => ({
                      borderWidth: active ? 1.5 : 1,
                      borderColor: active
                        ? isDark
                          ? '#F59E0B'
                          : '#FBBF24'
                        : isDark
                        ? '#2A374A'
                        : '#F1F5F9',
                      backgroundColor: active
                        ? isDark
                          ? 'rgba(245, 158, 11, 0.14)'
                          : '#FFFBEB'
                        : isDark
                        ? '#172234'
                        : '#F8FAFC',
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                      shadowColor: active ? '#D97706' : 'transparent',
                      shadowOffset: { width: 0, height: active ? 2 : 0 },
                      shadowOpacity: active ? (isDark ? 0.2 : 0.06) : 0,
                      shadowRadius: active ? 4 : 0,
                      elevation: active ? 2 : 0,
                    })}
                  >
                    <View
                      className="h-9 w-9 items-center justify-center rounded-[11px] shrink-0"
                      style={{
                        backgroundColor: active
                          ? isDark
                            ? 'rgba(245, 158, 11, 0.28)'
                            : '#FEF3C7'
                          : isDark
                          ? '#0F172A'
                          : '#EDF2F7',
                      }}
                    >
                      <Link2
                        size={16}
                        color={active ? '#D97706' : isDark ? '#94A3B8' : '#64748B'}
                        strokeWidth={2.2}
                      />
                    </View>

                    <View className="flex-1 min-w-0 pr-1">
                      <View className="flex-row items-center gap-1.5">
                        <Text
                          className="text-[13.5px] text-slate-900 dark:text-white"
                          style={{ fontFamily: 'Inter-Bold' }}
                        >
                          {requestId}
                        </Text>
                        <View
                          className="px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: badgeStyle.bg,
                            borderColor: badgeStyle.border,
                          }}
                        >
                          <Text
                            className="text-[9.5px]"
                            style={{
                              fontFamily: 'Inter-SemiBold',
                              color: badgeStyle.text,
                            }}
                          >
                            {requestStatus}
                          </Text>
                        </View>
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5"
                        style={{ fontFamily: 'Inter-Regular' }}
                      >
                        {requestTitle}
                      </Text>
                    </View>

                    {active ? (
                      <View className="h-4.5 w-4.5 rounded-full bg-amber-500 items-center justify-center shrink-0">
                        <Check size={10} color="#FFFFFF" strokeWidth={3.5} />
                      </View>
                    ) : (
                      <ChevronRight size={14} color={isDark ? '#475569' : '#CBD5E1'} strokeWidth={2.2} />
                    )}
                  </Pressable>
                );
              })
            )}
          </View>
        )}

        {/* STEP 3: Message Composer Card */}
        <View
          className="rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 mb-2"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.18 : 0.03,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <StepHeader
            step={3}
            label="TYPE MESSAGE"
            completed={message.trim().length > 0}
            active={isInputFocused || message.trim().length > 0}
            summary={message.trim().length > 0 ? `${message.trim().length} chars` : undefined}
            summaryType="teal"
            isDark={isDark}
          />

          {/* Nested Composer Card */}
          <View
            className="rounded-[16px] overflow-hidden"
            style={{
              borderWidth: isInputFocused ? 1.5 : 1,
              borderColor: isInputFocused
                ? isDark
                  ? '#2DD4BF'
                  : '#0D9488'
                : isDark
                ? '#2A374A'
                : '#E2E8F0',
              backgroundColor: isDark ? '#172234' : '#FFFFFF',
              shadowColor: isInputFocused ? '#0D9488' : 'transparent',
              shadowOffset: { width: 0, height: isInputFocused ? 2 : 0 },
              shadowOpacity: isInputFocused ? (isDark ? 0.25 : 0.06) : 0,
              shadowRadius: isInputFocused ? 5 : 0,
              elevation: isInputFocused ? 2 : 0,
            }}
          >
            {/* Context Header Strip */}
            <View
              className="flex-row items-center justify-between px-3 py-2 border-b"
              style={{
                backgroundColor: isDark
                  ? 'rgba(15, 23, 42, 0.7)'
                  : '#F8FAFC',
                borderColor: isDark ? '#2A374A' : '#F1F5F9',
              }}
            >
              <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                {convType === 'issue_linked' ? (
                  <Link2 size={12} color="#D97706" strokeWidth={2.4} />
                ) : (
                  <MessageSquare size={12} color={isDark ? '#2DD4BF' : '#0D9488'} strokeWidth={2.2} />
                )}
                <Text
                  numberOfLines={1}
                  className="text-[11.5px] text-slate-700 dark:text-slate-300"
                  style={{ fontFamily: 'Inter-Medium' }}
                >
                  {getComposerHeader()}
                </Text>
              </View>

              <Text
                className="text-[10.5px] text-slate-400 dark:text-slate-500 shrink-0"
                style={{ fontFamily: 'Inter-Regular' }}
              >
                {message.length} chars
              </Text>
            </View>

            {/* Compact TextInput */}
            <View className="p-3 min-h-[95px]">
              <TextInput
                className="text-[14px] text-slate-900 dark:text-white leading-[21px] p-0"
                style={{ fontFamily: 'Inter-Regular' }}
                value={message}
                onChangeText={(t) => { setMessage(t); setError(''); }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={getComposerPlaceholder()}
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Docked Action Panel / Bottom Footer */}
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, 14) + 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.25 : 0.05,
          shadowRadius: 8,
          elevation: 5,
        }}
        className="px-4 pt-3 bg-white/98 dark:bg-slate-900/98 border-t border-slate-200/90 dark:border-slate-800"
      >
        {/* Context Summary Row */}
        <View className="flex-row items-center justify-between mb-2 px-0.5">
          <View className="flex-1 pr-2">
            <Text
              numberOfLines={1}
              className="text-[12px] text-slate-800 dark:text-slate-200"
              style={{ fontFamily: 'Inter-SemiBold' }}
            >
              {selectedContact
                ? `To ${selectedContact.name}`
                : 'Direct Tenancy Message'}
            </Text>
            <Text
              numberOfLines={1}
              className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5"
              style={{ fontFamily: 'Inter-Regular' }}
            >
              {convType === 'issue_linked' && linkedRequestId
                ? `${linkedRequestId} · Issue-linked`
                : 'General message'}
            </Text>
          </View>

          <View className="items-end shrink-0">
            <View
              className="px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: isValid
                  ? isDark ? 'rgba(13, 148, 136, 0.16)' : '#F0FDFA'
                  : isDark ? 'rgba(51, 65, 85, 0.4)' : '#F1F5F9',
                borderColor: isValid
                  ? isDark ? 'rgba(45, 212, 191, 0.4)' : '#99F6E4'
                  : isDark ? '#334155' : '#E2E8F0',
              }}
            >
              <Text
                className="text-[10.5px]"
                style={{
                  fontFamily: 'Inter-SemiBold',
                  color: isValid
                    ? isDark
                      ? '#2DD4BF'
                      : '#0D9488'
                    : isDark
                    ? '#94A3B8'
                    : '#64748B',
                }}
              >
                {getActionHint()}
              </Text>
            </View>
          </View>
        </View>

        {/* Start Conversation CTA Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid }}
          accessibilityLabel="Start Conversation"
          onPress={handleStart}
          disabled={!isValid}
          className="w-full h-[50px] rounded-[16px] overflow-hidden"
          style={({ pressed }) => ({
            transform: [{ scale: pressed && isValid ? 0.988 : 1 }],
            shadowColor: isValid ? '#0D9488' : 'transparent',
            shadowOffset: { width: 0, height: isValid ? 2 : 0 },
            shadowOpacity: isValid ? (isDark ? 0.35 : 0.18) : 0,
            shadowRadius: isValid ? 6 : 0,
            elevation: isValid ? 3 : 0,
          })}
        >
          {isValid ? (
            <LinearGradient
              colors={['#0F766E', '#0D9488', '#14B8A6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full h-full flex-row items-center justify-center gap-2"
              style={{
                borderTopWidth: 1,
                borderTopColor: 'rgba(255, 255, 255, 0.25)',
              }}
            >
              <Text
                className="text-[15px] tracking-[-0.2px] text-white"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                Start Conversation
              </Text>
              <Send size={16} color="#FFFFFF" strokeWidth={2.4} />
            </LinearGradient>
          ) : (
            <View
              className="w-full h-full flex-row items-center justify-center gap-2 border"
              style={{
                backgroundColor: isDark ? '#1E293B' : '#E8EEF5',
                borderColor: isDark ? '#334155' : '#D7E0EA',
              }}
            >
              <Text
                className="text-[15px] tracking-[-0.2px]"
                style={{
                  fontFamily: 'Inter-Bold',
                  color: isDark ? '#64748B' : '#64748B',
                }}
              >
                Start Conversation
              </Text>
              <Send size={16} color={isDark ? '#64748B' : '#94A3B8'} strokeWidth={2.2} />
            </View>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
