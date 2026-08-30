import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { CheckCircle, AlertTriangle, Info, AlertCircle, CheckCheck, Trash2, BellOff } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_NOTIFICATIONS, Notification } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  info: { icon: Info, color: '#0284C7', bg: '#E0F2FE' },
  success: { icon: CheckCircle, color: '#059669', bg: '#D1FAE5' },
  warning: { icon: AlertTriangle, color: '#D97706', bg: '#FEF3C7' },
  error: { icon: AlertCircle, color: '#DC2626', bg: '#FEE2E2' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const showAlert = (msg: string) => Platform.OS === 'web' ? window.alert(msg) : Alert.alert('', msg);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showAlert('All notifications marked as read.');
  };

  const deleteOne = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAll = () => {
    if (notifications.length === 0) return;
    Alert.alert(
      'Delete All Notifications',
      'Are you sure you want to delete all notifications? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete All', style: 'destructive', onPress: () => setNotifications([]) },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Notifications" />

      <View style={[styles.toolbar, { backgroundColor: colors.surface }]}>
        <View style={styles.toolbarInfo}>
          <Text style={[styles.toolbarCount, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>
            {notifications.length} total
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.unreadPill, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.unreadPillText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>
                {unreadCount} unread
              </Text>
            </View>
          )}
        </View>
        <View style={styles.toolbarActions}>
          <Pressable
            style={[styles.toolBtn, { backgroundColor: colors.primaryGlow }, unreadCount === 0 && { opacity: 0.4 }]}
            onPress={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={15} color={colors.primary} />
            <Text style={[styles.toolBtnText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>Mark all read</Text>
          </Pressable>
          <Pressable
            style={[styles.toolBtn, { backgroundColor: colors.dangerLight }, notifications.length === 0 && { opacity: 0.4 }]}
            onPress={deleteAll}
            disabled={notifications.length === 0}
          >
            <Trash2 size={15} color={colors.danger} />
            <Text style={[styles.toolBtnText, { color: colors.danger, fontFamily: 'Inter-SemiBold' }]}>Delete all</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceSecondary }]}>
              <BellOff size={32} color={colors.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>No notifications</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>You're all caught up!</Text>
          </View>
        ) : (
          notifications.map((notif, index) => {
            const config = TYPE_CONFIG[notif.type];
            const Icon = config.icon;
            return (
              <Animated.View
                key={notif.id}
                entering={FadeInRight.delay(index * 60).duration(400)}
                exiting={FadeOutRight.duration(300)}
              >
                <Pressable
                  style={[
                    styles.notifCard,
                    { backgroundColor: colors.surface, borderLeftWidth: !notif.isRead ? 3 : 0, borderLeftColor: !notif.isRead ? colors.primary : 'transparent' },
                    SHADOWS.card,
                  ]}
                  onPress={() => notif.linkedRequestId && router.push({ pathname: '/request-detail', params: { id: notif.linkedRequestId } })}
                >
                  <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
                    <Icon size={18} color={config.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.notifTitleRow}>
                      <Text style={[styles.notifTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]} numberOfLines={1}>{notif.title}</Text>
                      {!notif.isRead && <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />}
                    </View>
                    <Text style={[styles.notifMessage, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]} numberOfLines={2}>{notif.message}</Text>
                    <Text style={[styles.notifTime, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{notif.timestamp}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    {!notif.isRead && (
                      <Pressable
                        style={[styles.cardActionBtn, { backgroundColor: colors.primaryGlow }]}
                        onPress={() => markAsRead(notif.id)}
                      >
                        <CheckCircle size={14} color={colors.primary} />
                      </Pressable>
                    )}
                    <Pressable
                      style={[styles.cardActionBtn, { backgroundColor: colors.dangerLight }]}
                      onPress={() => deleteOne(notif.id)}
                    >
                      <Trash2 size={14} color={colors.danger} />
                    </Pressable>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  toolbarInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toolbarCount: { fontSize: 13 },
  unreadPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  unreadPillText: { fontSize: 11 },
  toolbarActions: { flexDirection: 'row', gap: 8 },
  toolBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10 },
  toolBtnText: { fontSize: 11 },
  scrollContent: { padding: 20 },
  notifCard: { borderRadius: 16, padding: 16, flexDirection: 'row', gap: 14, marginBottom: 10 },
  notifIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifTitle: { fontSize: 14, flex: 1 },
  notifDot: { width: 8, height: 8, borderRadius: 4 },
  notifMessage: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  notifTime: { fontSize: 11, marginTop: 6 },
  cardActions: { flexDirection: 'column', gap: 8, justifyContent: 'center' },
  cardActionBtn: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16 },
  emptyDesc: { fontSize: 13, marginTop: 4 },
});
