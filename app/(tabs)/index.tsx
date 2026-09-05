import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import {
  Plus, ClipboardList, Wallet, AlertTriangle, Bell,
  Clock, CheckCircle, AlertCircle, BarChart3, Megaphone,
  ChevronRight, ArrowRight, TrendingUp, Home, MessageSquare,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useMessaging } from '@/context/MessagingContext';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_REQUESTS, MOCK_ANNOUNCEMENTS, MOCK_ACTIVITY, MOCK_PROPERTY, MOCK_RENT_PAYMENTS } from '@/data/mockData';
import { StatCard } from '@/components/StatCard';
import { SectionHeader } from '@/components/SectionHeader';

export default function DashboardScreen() {
  const { user, selectedProperty } = useAuth();
  const { conversations, unreadCount } = useMessaging();
  const { isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const latestConversation = conversations.length > 0 ? conversations[0] : null;

  const connectedName = selectedProperty?.name || MOCK_PROPERTY.name;
  const connectedUnit = selectedProperty?.selectedUnit || MOCK_PROPERTY.unit;
  const connectedAddress = selectedProperty?.address || MOCK_PROPERTY.address;

  const total = MOCK_REQUESTS.length;
  const open = MOCK_REQUESTS.filter(r => ['Submitted', 'Under Review'].includes(r.status)).length;
  const inProgress = MOCK_REQUESTS.filter(r => ['Approved', 'Assigned', 'In Progress'].includes(r.status)).length;
  const resolved = MOCK_REQUESTS.filter(r => ['Resolved', 'Closed'].includes(r.status)).length;
  const nextRent = MOCK_RENT_PAYMENTS.find(r => r.status === 'Pending');
  const emergencyRequests = MOCK_REQUESTS.filter(r => r.isEmergency && !['Resolved', 'Closed'].includes(r.status));
  const recentActivity = MOCK_ACTIVITY.slice(0, 3);
  const latestAnnouncements = MOCK_ANNOUNCEMENTS.slice(0, 2);

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Hero Header Section */}
      <View className="relative">
        <LinearGradient
          colors={
            isDark
              ? ['#134E4A', '#0F766E', '#064E3B']
              : ['#1E6B5A', '#0D9488', '#115E59']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-b-[32px] pb-8 overflow-hidden relative"
        >
          {/* Ambient Background Circles */}
          <View className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/[0.05]" />
          <View className="absolute bottom-5 -left-5 h-24 w-24 rounded-full bg-white/[0.03]" />

          <View style={{ paddingTop: insets.top + 16 }} className="px-5 pb-6">
            <Animated.View
              entering={FadeInDown.duration(600)}
              className="flex-row items-start justify-between"
            >
              <View className="flex-1 pr-3">
                <Text
                  className="text-[14px] text-white/70"
                  style={{ fontFamily: 'Inter-Regular' }}
                >
                  {greetingTime()},
                </Text>
                <Text
                  className="text-[28px] text-white tracking-[-0.5px] mt-0.5"
                  style={{ fontFamily: 'Inter-ExtraBold' }}
                >
                  {user?.name || 'Tenant'}
                </Text>
                <View className="flex-row items-center gap-1.5 self-start rounded-full bg-white/10 dark:bg-white/15 px-3 py-1.5 mt-2.5 border border-white/10">
                  <View className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <Text
                    numberOfLines={1}
                    className="text-[12px] text-white/90"
                    style={{ fontFamily: 'Inter-Medium' }}
                  >
                    {connectedName} · {connectedUnit}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push('/notifications')}
                className="h-12 w-12 items-center justify-center rounded-[16px] bg-white/10 dark:bg-white/15 border border-white/15 relative active:opacity-80"
              >
                <Bell size={22} color="#FFFFFF" strokeWidth={2.2} />
                <View className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-[#1E6B5A] dark:border-[#134E4A]" />
              </Pressable>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      {/* Upcoming Rent Floating Banner */}
      {nextRent && (
        <Animated.View
          entering={FadeInUp.delay(200).duration(500).springify()}
          className="mt-5 mx-5 mb-2 overflow-hidden rounded-[24px] border border-amber-300 dark:border-amber-500/40 bg-white dark:bg-slate-900"
          style={{
            shadowColor: '#D97706',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.35 : 0.08,
            shadowRadius: 14,
            elevation: 6,
          }}
        >
          <LinearGradient
            colors={
              isDark
                ? ['rgba(217,119,6,0.14)', 'rgba(217,119,6,0.02)']
                : ['#FFFDF7', '#FFFFFF']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-1 flex-row items-center gap-3 pr-3 min-w-0">
              <View className="relative shrink-0">
                <View className="absolute -inset-1 rounded-[16px] bg-amber-400/25 blur-sm" />
                <View className="h-[48px] w-[48px] items-center justify-center rounded-[15px] border border-amber-300 dark:border-amber-500/50 bg-amber-100 dark:bg-amber-950/80">
                  <Wallet size={22} color="#D97706" strokeWidth={2.2} />
                </View>
              </View>

              <View className="min-w-0 flex-1">
                <Text
                  className="text-[10.5px] tracking-[0.8px] text-amber-700 dark:text-amber-400"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  UPCOMING RENT
                </Text>

                <Text
                  numberOfLines={1}
                  className="text-[19px] tracking-[-0.4px] text-slate-900 dark:text-white mt-0.5"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  ₹{nextRent.amount.toLocaleString()}
                </Text>

                <Text
                  numberOfLines={1}
                  className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5"
                  style={{ fontFamily: 'Inter-Medium' }}
                >
                  Due {nextRent.dueDate}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/(tabs)/rent')}
              className="overflow-hidden rounded-[14px] shadow-sm shrink-0"
              style={({ pressed }) => ({
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <LinearGradient
                colors={['#0F766E', '#0D9488']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                <Text
                  className="text-[13.5px] text-white"
                  style={{ fontFamily: 'Inter-Bold', lineHeight: 18 }}
                >
                  Pay Now
                </Text>
                <ArrowRight size={13.5} color="#FFFFFF" strokeWidth={2.4} />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Main Content Area */}
      <View className="px-5 pt-4">
        {/* Connected Property Card */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(500)}
          className="mb-4 overflow-hidden rounded-[22px] border border-teal-300 dark:border-teal-500/40 bg-white dark:bg-slate-900 shadow-sm"
        >
          <LinearGradient
            colors={
              isDark
                ? ['rgba(13,148,136,0.15)', 'rgba(13,148,136,0.02)']
                : ['#F0FDFA', '#FFFFFF']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View className="p-4 flex-row items-center">
            <View className="relative mr-3.5 shrink-0">
              <View className="absolute -inset-1 rounded-[16px] bg-teal-400/25 blur-sm" />
              <View className="h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-teal-300 dark:border-teal-500/50 bg-teal-100 dark:bg-teal-950/80">
                <Home size={21} color="#0D9488" strokeWidth={2.2} />
              </View>
            </View>

            <View className="min-w-0 flex-1 justify-center pr-2">
              <View className="flex-row items-center justify-between mb-0.5">
                <Text
                  className="text-[11px] tracking-[0.8px] text-teal-700 dark:text-teal-400"
                  style={{ fontFamily: 'Inter-Bold' }}
                >
                  CONNECTED PROPERTY
                </Text>
                <View className="flex-row items-center gap-1 rounded-full px-2 py-0.5 border border-emerald-300 dark:border-emerald-500/40 bg-emerald-100 dark:bg-emerald-950/60">
                  <CheckCircle size={10} color="#059669" />
                  <Text
                    className="text-[10px] text-emerald-700 dark:text-emerald-300"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    Verified
                  </Text>
                </View>
              </View>

              <Text
                numberOfLines={1}
                className="text-[15px] tracking-[-0.2px] text-slate-900 dark:text-white"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                {selectedProperty
                  ? `${connectedName} · ${connectedUnit}`
                  : 'No property connected'}
              </Text>

              <Text
                numberOfLines={1}
                className="text-[12.5px] mt-0.5 text-slate-500 dark:text-slate-400"
                style={{ fontFamily: 'Inter-Regular' }}
              >
                {selectedProperty
                  ? connectedAddress
                  : 'Please connect your rental place to continue.'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Unread Messaging Notification */}
        {unreadCount > 0 && (
          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <Pressable
              onPress={() => router.push('/(tabs)/messages')}
              className="mb-4 overflow-hidden rounded-[22px] border border-sky-300 dark:border-sky-500/40 bg-white dark:bg-slate-900 shadow-sm"
              style={({ pressed }) => ({
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              })}
            >
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(2,132,199,0.15)', 'rgba(2,132,199,0.02)']
                    : ['#F0F9FF', '#FFFFFF']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              <View className="flex-row items-center p-4">
                <View className="relative mr-3.5 shrink-0">
                  <View className="absolute -inset-1 rounded-[16px] bg-sky-400/25 blur-sm" />
                  <View className="h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-sky-300 dark:border-sky-500/50 bg-sky-100 dark:bg-sky-950/80">
                    <MessageSquare
                      size={21}
                      color="#0284C7"
                      strokeWidth={2.2}
                    />
                  </View>
                  <View className="absolute -top-1 -right-1 h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-500 px-1 border-2 border-white dark:border-slate-900">
                    <Text
                      className="text-[10px] text-white"
                      style={{ fontFamily: 'Inter-Bold' }}
                    >
                      {unreadCount}
                    </Text>
                  </View>
                </View>

                <View className="min-w-0 flex-1 justify-center pr-2">
                  <View className="flex-row items-center justify-between mb-0.5">
                    <Text
                      className="text-[11px] tracking-[0.8px] text-sky-700 dark:text-sky-400"
                      style={{ fontFamily: 'Inter-Bold' }}
                    >
                      NEW MESSAGES
                    </Text>
                    <View className="rounded-full px-2 py-0.5 border border-sky-300 dark:border-sky-500/40 bg-sky-100 dark:bg-sky-900/40">
                      <Text
                        className="text-[10px] text-sky-600 dark:text-sky-400"
                        style={{ fontFamily: 'Inter-Bold' }}
                      >
                        {unreadCount} UNREAD
                      </Text>
                    </View>
                  </View>

                  <Text
                    numberOfLines={1}
                    className="text-[14.5px] tracking-[-0.2px] text-slate-900 dark:text-white"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    {latestConversation
                      ? latestConversation.participantName
                      : 'Property Manager'}
                  </Text>

                  <Text
                    numberOfLines={1}
                    className="text-[12.5px] mt-0.5 text-slate-500 dark:text-slate-400"
                    style={{ fontFamily: 'Inter-Regular' }}
                  >
                    {latestConversation
                      ? latestConversation.lastMessage
                      : 'You have pending updates regarding your tenancy.'}
                  </Text>
                </View>

                <View className="h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-sky-100/70 dark:bg-white/10">
                  <ChevronRight
                    size={16}
                    color={isDark ? '#94A3B8' : '#0284C7'}
                    strokeWidth={2.2}
                  />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Emergency Notice Card */}
        {emergencyRequests.length > 0 && (
          <Animated.View entering={FadeIn.delay(300).duration(400)}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/request-detail',
                  params: { id: emergencyRequests[0].id },
                })
              }
              className="mb-4 overflow-hidden rounded-[22px] border border-rose-300 dark:border-rose-500/40 bg-white dark:bg-slate-900 shadow-sm"
              style={({ pressed }) => ({
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              })}
            >
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(244,63,94,0.18)', 'rgba(244,63,94,0.03)']
                    : ['#FFF1F2', '#FFFFFF']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              <View className="flex-row items-center p-4">
                <View className="relative mr-3.5 shrink-0">
                  <View className="absolute -inset-1 rounded-[16px] bg-rose-500/25 blur-sm" />
                  <View className="h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-rose-300 dark:border-rose-500/50 bg-rose-500 shadow-sm">
                    <AlertTriangle
                      size={22}
                      color="#FFFFFF"
                      strokeWidth={2.4}
                    />
                  </View>
                </View>

                <View className="min-w-0 flex-1 justify-center pr-2">
                  <View className="flex-row items-center justify-between mb-0.5">
                    <Text
                      className="text-[11px] tracking-[0.8px] text-rose-600 dark:text-rose-400"
                      style={{ fontFamily: 'Inter-Bold' }}
                    >
                      URGENT ATTENTION
                    </Text>
                    <View className="rounded-full px-2 py-0.5 border border-rose-300 dark:border-rose-500/40 bg-rose-100 dark:bg-rose-950/60">
                      <Text
                        className="text-[10px] text-rose-600 dark:text-rose-300"
                        style={{ fontFamily: 'Inter-Bold' }}
                      >
                        {emergencyRequests.length}{' '}
                        {emergencyRequests.length === 1 ? 'ACTIVE' : 'ACTIVES'}
                      </Text>
                    </View>
                  </View>

                  <Text
                    numberOfLines={1}
                    className="text-[14.5px] tracking-[-0.2px] text-rose-950 dark:text-rose-100"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    {emergencyRequests.length} Emergency{' '}
                    {emergencyRequests.length === 1 ? 'Issue' : 'Issues'}
                  </Text>

                  <Text
                    numberOfLines={1}
                    className="text-[12.5px] mt-0.5 text-rose-800/80 dark:text-rose-200/75"
                    style={{ fontFamily: 'Inter-Regular' }}
                  >
                    {emergencyRequests[0].title}
                  </Text>
                </View>

                <View className="h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-rose-100 dark:bg-white/10">
                  <ChevronRight
                    size={16}
                    color={isDark ? '#FDA4AF' : '#E11D48'}
                    strokeWidth={2.4}
                  />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* 4 Stat Cards */}
        <View className="flex-row flex-wrap justify-between mb-2">
          <StatCard
            label="Total"
            value={total}
            color="#2563EB"
            icon={<BarChart3 size={18} color="#2563EB" />}
            index={0}
          />
          <StatCard
            label="Open"
            value={open}
            color="#0284C7"
            icon={<AlertCircle size={18} color="#0284C7" />}
            index={1}
          />
          <StatCard
            label="Active"
            value={inProgress}
            color="#D97706"
            icon={<Clock size={18} color="#D97706" />}
            index={2}
          />
          <StatCard
            label="Resolved"
            value={resolved}
            color="#059669"
            icon={<CheckCircle size={18} color="#059669" />}
            index={3}
          />
        </View>

        {/* Quick Actions Grid */}
        <SectionHeader title="Quick Actions" />
        <View className="flex-row flex-wrap justify-between mb-4">
          <QuickAction
            icon={<Plus size={20} color="#FFFFFF" strokeWidth={2.4} />}
            label="Raise Request"
            subtitle="Submit new ticket"
            gradient={['#0F766E', '#0D9488']}
            onPress={() => router.push('/create-request')}
          />
          <QuickAction
            icon={<ClipboardList size={20} color="#FFFFFF" strokeWidth={2.2} />}
            label="View Requests"
            subtitle="Track status & logs"
            gradient={['#0369A1', '#0284C7']}
            onPress={() => router.push('/(tabs)/requests')}
          />
          <QuickAction
            icon={<MessageSquare size={20} color="#FFFFFF" strokeWidth={2.2} />}
            label="Message Landlord"
            subtitle="Direct chat channel"
            gradient={['#4338CA', '#6366F1']}
            onPress={() => router.push('/new-message')}
          />
          <QuickAction
            icon={<Wallet size={20} color="#FFFFFF" strokeWidth={2.2} />}
            label="Rent Overview"
            subtitle="Payments & history"
            gradient={['#B45309', '#D97706']}
            onPress={() => router.push('/(tabs)/rent')}
          />
        </View>

        {/* Recent Activity Section */}
        <SectionHeader
          title="Recent Activity"
          actionLabel="View All"
          onAction={() => router.push('/activity-history')}
        />
        {recentActivity.map((item, i) => (
          <Animated.View
            key={item.id}
            entering={FadeInUp.delay(400 + i * 80).duration(400)}
          >
            <Pressable
              onPress={() =>
                item.linkedRequestId &&
                router.push({
                  pathname: '/request-detail',
                  params: { id: item.linkedRequestId },
                })
              }
              className="mb-3 overflow-hidden rounded-[20px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              style={({ pressed }) => ({
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              })}
            >
              <View className="p-4 flex-row items-center gap-3.5">
                <View className="relative shrink-0">
                  {i === 0 && (
                    <View className="absolute -inset-1 rounded-full bg-teal-400/30 blur-sm" />
                  )}
                  <View
                    className={`h-3 w-3 rounded-full ${
                      i === 0
                        ? 'bg-teal-600 dark:bg-teal-400'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                </View>

                <View className="flex-1 min-w-0 pr-1">
                  <Text
                    numberOfLines={1}
                    className="text-[14.5px] tracking-[-0.2px] text-slate-900 dark:text-white"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    className="text-[12.5px] leading-[17px] text-slate-500 dark:text-slate-400 mt-0.5"
                    style={{ fontFamily: 'Inter-Regular' }}
                  >
                    {item.description}
                  </Text>
                  <Text
                    className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5"
                    style={{ fontFamily: 'Inter-Medium' }}
                  >
                    {item.timestamp}
                  </Text>
                </View>

                <View className="h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-slate-100 dark:bg-white/5">
                  <ChevronRight
                    size={14}
                    color={isDark ? '#94A3B8' : '#64748B'}
                    strokeWidth={2.4}
                  />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}

        {/* Announcements Section */}
        <SectionHeader
          title="Announcements"
          actionLabel="View All"
          onAction={() => router.push('/announcements')}
        />
        {latestAnnouncements.map((ann, i) => {
          const isHigh = ann.priority === 'High';
          return (
            <Animated.View
              key={ann.id}
              entering={FadeInUp.delay(600 + i * 80).duration(400)}
            >
              <View className="mb-3 overflow-hidden rounded-[20px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4">
                <View className="flex-row items-center gap-3 mb-2.5">
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-[12px] ${
                      isHigh
                        ? 'bg-rose-100 dark:bg-rose-950/60'
                        : 'bg-amber-100 dark:bg-amber-950/60'
                    }`}
                  >
                    <Megaphone
                      size={16}
                      color={isHigh ? '#E11D48' : '#D97706'}
                      strokeWidth={2.2}
                    />
                  </View>

                  <View className="flex-1 min-w-0 pr-1">
                    <Text
                      numberOfLines={1}
                      className="text-[14px] text-slate-900 dark:text-white"
                      style={{ fontFamily: 'Inter-Bold' }}
                    >
                      {ann.title}
                    </Text>
                    <Text
                      className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5"
                      style={{ fontFamily: 'Inter-Medium' }}
                    >
                      {ann.date}
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-0.5 rounded-full border ${
                      isHigh
                        ? 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50'
                        : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50'
                    }`}
                  >
                    <Text
                      className={`text-[9.5px] ${
                        isHigh
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                      style={{ fontFamily: 'Inter-Bold' }}
                    >
                      {ann.priority}
                    </Text>
                  </View>
                </View>

                <Text
                  numberOfLines={2}
                  className="text-[12.5px] leading-[18px] text-slate-600 dark:text-slate-400"
                  style={{ fontFamily: 'Inter-Regular' }}
                >
                  {ann.message}
                </Text>
              </View>
            </Animated.View>
          );
        })}

        {/* Resolution Rate Insight Card */}
        {total > 0 && (
          <Animated.View entering={FadeInUp.delay(800).duration(400)}>
            <View className="mt-2 mb-8 overflow-hidden rounded-[22px] border border-teal-300 dark:border-teal-500/40 bg-white dark:bg-slate-900 shadow-sm">
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(13,148,136,0.16)', 'rgba(13,148,136,0.02)']
                    : ['#F0FDFA', '#FFFFFF']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 18 }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3.5 flex-1 pr-3">
                    <View className="relative shrink-0">
                      <View className="absolute -inset-1 rounded-[14px] bg-teal-400/25 blur-sm" />
                      <View className="h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-500/40">
                        <TrendingUp
                          size={21}
                          color="#0D9488"
                          strokeWidth={2.4}
                        />
                      </View>
                    </View>

                    <View className="flex-1 min-w-0">
                      <Text
                        numberOfLines={1}
                        className="text-[14.5px] text-slate-900 dark:text-white"
                        style={{ fontFamily: 'Inter-Bold' }}
                      >
                        Resolution Rate
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5"
                        style={{ fontFamily: 'Inter-Medium' }}
                      >
                        {resolved} of {total} requests resolved
                      </Text>
                    </View>
                  </View>

                  <Text
                    className="text-[24px] tracking-[-0.5px] text-teal-600 dark:text-teal-400 shrink-0"
                    style={{ fontFamily: 'Inter-Bold' }}
                  >
                    {Math.round((resolved / total) * 100)}%
                  </Text>
                </View>

                {/* Progress Track Bar */}
                <View className="mt-3.5 h-[6px] w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <LinearGradient
                    colors={['#0F766E', '#14B8A6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: '100%',
                      width: `${Math.min(Math.round((resolved / total) * 100), 100)}%`,
                      borderRadius: 999,
                    }}
                  />
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  subtitle,
  gradient,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  gradient: [string, string];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[48%] mb-3 overflow-hidden rounded-[22px]"
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 16,
          borderRadius: 22,
          minHeight: 118,
          justifyContent: 'space-between',
        }}
      >
        {/* Glassmorphic Icon Container */}
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            backgroundColor: 'rgba(255,255,255,0.22)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.32)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>

        {/* Action Titles */}
        <View style={{ marginTop: 12 }}>
          <Text
            numberOfLines={1}
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontFamily: 'Inter-Bold',
              letterSpacing: -0.2,
            }}
          >
            {label}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={{
                color: 'rgba(255,255,255,0.82)',
                fontSize: 11,
                fontFamily: 'Inter-Medium',
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

