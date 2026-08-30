import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Phone, Mail, Clock, Building2, MessageSquare, AlertTriangle,
  ArrowRight, MapPin,
} from 'lucide-react-native';
import { useMessaging } from '@/context/MessagingContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

export default function ContactProfileScreen() {
  const { contactId } = useLocalSearchParams<{ contactId: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { contacts, conversations, createConversation } = useMessaging();
  const { selectedProperty } = useAuth();
  const insets = useSafeAreaInsets();

  const contact = contacts.find((c) => c.id === contactId);

  if (!contact) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Contact Not Found" />
      </View>
    );
  }

  const activeConversations = conversations.filter(
    (c) => c.participantId === contact.id && c.status === 'active',
  ).length;

  const propertyName = selectedProperty?.name || 'Green Residency';
  const propertyUnit = selectedProperty?.selectedUnit || 'Flat 3B';
  const propertyAddress = selectedProperty?.address || 'Bhelupur, Varanasi, Uttar Pradesh';

  const handleMessageAgain = () => {
    const existing = conversations.find((c) => c.participantId === contact.id && c.conversationType === 'general');
    if (existing) {
      router.push({ pathname: '/chat', params: { id: existing.id } });
    } else {
      const newId = createConversation({
        participantId: contact.id,
        conversationType: 'general',
        linkedRequestId: null,
        linkedRequestTitle: null,
        messageText: 'Hello, I would like to discuss something about the property.',
      });
      if (newId) router.replace({ pathname: '/chat', params: { id: newId } });
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Contact Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryGlow }]}>
            <Text style={[styles.avatarText, { color: colors.primary, fontFamily: 'Inter-ExtraBold' }]}>
              {contact.name.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <Text style={[styles.profileName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{contact.name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: colors.primaryGlow }]}>
            <Text style={[styles.roleBadgeText, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>{contact.role}</Text>
          </View>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(100).duration(400)} style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <DetailRow icon={<Phone size={16} color={colors.primary} />} label="Phone" value={contact.phone} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <DetailRow icon={<Mail size={16} color={colors.primary} />} label="Email" value={contact.email} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <DetailRow icon={<Clock size={16} color={colors.primary} />} label="Response Time" value={contact.responseTime} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <DetailRow icon={<MessageSquare size={16} color={colors.primary} />} label="Active Conversations" value={`${activeConversations}`} colors={colors} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(150).duration(400)} style={[styles.propertyCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <View style={styles.propertyHeader}>
              <View style={[styles.propertyIcon, { backgroundColor: colors.primaryGlow }]}>
                <Building2 size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.propertyLabel, { color: colors.textMuted, fontFamily: 'Inter-SemiBold' }]}>LINKED PROPERTY</Text>
                <Text style={[styles.propertyName, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>
                  {propertyName} · {propertyUnit}
                </Text>
                <View style={styles.propertyAddrRow}>
                  <MapPin size={11} color={colors.textMuted} />
                  <Text style={[styles.propertyAddr, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]} numberOfLines={2}>{propertyAddress}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(400)} style={[styles.warningCard, { backgroundColor: colors.dangerLight, borderColor: colors.danger + '30' }]}>
            <View style={[styles.warningIcon, { backgroundColor: colors.danger }]}>
              <AlertTriangle size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.warningTitle, { color: colors.danger, fontFamily: 'Inter-Bold' }]}>Emergency Notice</Text>
              <Text style={[styles.warningDesc, { color: colors.danger, fontFamily: 'Inter-Regular' }]}>
                For emergencies, use the emergency request option in the dashboard instead of waiting for a normal message response.
              </Text>
            </View>
          </Animated.View>

          <Pressable onPress={handleMessageAgain} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            <LinearGradientWrapper>
              <MessageSquare size={18} color="#FFFFFF" />
              <Text style={[styles.messageBtnText, { fontFamily: 'Inter-SemiBold' }]}>Message Again</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </LinearGradientWrapper>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function LinearGradientWrapper({ children }: { children: React.ReactNode }) {
  const { LinearGradient } = require('expo-linear-gradient');
  return (
    <LinearGradient colors={['#1E6B5A', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.messageBtn}>
      {children}
    </LinearGradient>
  );
}

function DetailRow({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string; colors: any }) {
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: colors.primaryGlow }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  profileHeader: { alignItems: 'center', paddingVertical: 28 },
  avatar: { width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 28 },
  profileName: { fontSize: 22 },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginTop: 10 },
  roleBadgeText: { fontSize: 12 },
  content: { paddingHorizontal: 20 },
  detailsCard: { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  detailIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  detailLabel: { fontSize: 11 },
  detailValue: { fontSize: 14, marginTop: 3 },
  divider: { height: 1, marginVertical: 8 },
  propertyCard: { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 14 },
  propertyHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  propertyIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  propertyLabel: { fontSize: 10, letterSpacing: 1 },
  propertyName: { fontSize: 15, marginTop: 4 },
  propertyAddrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 5 },
  propertyAddr: { fontSize: 12, flex: 1, lineHeight: 17 },
  warningCard: { flexDirection: 'row', gap: 12, borderRadius: 16, borderWidth: 1.5, padding: 16, marginBottom: 20 },
  warningIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  warningTitle: { fontSize: 14 },
  warningDesc: { fontSize: 13, marginTop: 4, lineHeight: 19 },
  messageBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  messageBtnText: { color: '#FFFFFF', fontSize: 15 },
});
