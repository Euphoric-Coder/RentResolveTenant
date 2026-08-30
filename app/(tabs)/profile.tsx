import { useCallback, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mail, Phone, Home, ShieldCheck, LogOut,
  FileText, Building2, Bell, Megaphone, History, HelpCircle, ChevronRight,
  Sun, Moon,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_PROPERTY } from '@/data/mockData';
import { SHADOWS } from '@/constants/theme';

const MENU_ITEMS = [
  { icon: Building2, label: 'Property Info', desc: 'View your rental property details', route: '/property-info', color: '#0D9488' },
  { icon: FileText, label: 'Lease Documents', desc: 'Access your lease agreement & files', route: '/lease-documents', color: '#0284C7' },
  { icon: Bell, label: 'Notifications', desc: 'Manage your notification preferences', route: '/notifications', color: '#D97706' },
  { icon: Megaphone, label: 'Announcements', desc: 'Latest updates from your landlord', route: '/announcements', color: '#DC2626' },
  { icon: History, label: 'Activity History', desc: 'Review your past activity log', route: '/activity-history', color: '#059669' },
  { icon: HelpCircle, label: 'Help & Support', desc: 'Get help or contact support', route: '/help-support', color: '#7C3AED' },
] as const;

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollRef}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={isDark ? ['#134E4A', '#0F766E', '#064E3B'] : ['#1E6B5A', '#0D9488', '#115E59']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 24 }]}
        >
          <View style={styles.heroCircleTop} />
          <View style={styles.heroCircleBottom} />
          <View style={styles.avatarOuter}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.split(' ').map((name: string) => name[0]).join('') || 'T'}
              </Text>
            </View>
          </View>
          <Text style={styles.heroName}>{user?.name || 'Tenant'}</Text>
          <Text style={styles.heroEmail}>{user?.email || ''}</Text>
          <View style={styles.verifiedPill}>
            <ShieldCheck size={13} color="#34D399" />
            <Text style={styles.verifiedText}>Verified Tenant</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Info card */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <InfoRow colors={colors} icon={<Mail size={18} color={colors.primary} />} label="Email" value={user?.email || ''} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow colors={colors} icon={<Phone size={18} color={colors.primary} />} label="Phone" value={user?.phone || ''} />
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <InfoRow colors={colors} icon={<Home size={18} color={colors.primary} />} label="Property" value={`${MOCK_PROPERTY.name} - ${MOCK_PROPERTY.unit}`} />
          </View>

          {/* Theme toggle */}
          <Pressable
            style={({ pressed }) => [styles.cardWrapper, pressed && styles.pressed]}
            onPress={toggleTheme}
          >
            <View style={[styles.themeCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
              <View style={[styles.themeIcon, { backgroundColor: isDark ? colors.primaryGlow : colors.warningLight }]}>
                {isDark ? <Moon size={19} color={colors.primary} /> : <Sun size={19} color={colors.warning} />}
              </View>
              <View style={styles.themeText}>
                <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
                <Text style={[styles.themeHint, { color: colors.textMuted }]}>{isDark ? 'Switch to light' : 'Switch to dark'}</Text>
              </View>
              <View style={[styles.toggle, { backgroundColor: isDark ? colors.primary : colors.surfaceSecondary }]}>
                <View style={[styles.toggleKnob, isDark && styles.toggleKnobActive]} />
              </View>
            </View>
          </Pressable>

          {/* Section header */}
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ACCOUNT</Text>

          {/* Menu items */}
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.label}
                style={({ pressed }) => [styles.cardWrapper, pressed && styles.pressed]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                    <Icon size={20} color={item.color} />
                  </View>
                  <View style={styles.menuCopy}>
                    <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                    <Text style={[styles.menuDesc, { color: colors.textMuted }]} numberOfLines={1}>{item.desc}</Text>
                  </View>
                  <View style={[styles.chevron, { backgroundColor: colors.surfaceSecondary }]}>
                    <ChevronRight size={17} color={colors.textMuted} />
                  </View>
                </View>
              </Pressable>
            );
          })}

          {/* Sign out */}
          <Pressable
            style={({ pressed }) => [styles.cardWrapper, pressed && styles.pressed]}
            onPress={handleLogout}
          >
            <View style={[styles.logoutCard, { backgroundColor: colors.danger + '0D', borderColor: colors.danger + '55' }, SHADOWS.card]}>
              <View style={[styles.logoutIcon, { backgroundColor: colors.dangerLight }]}>
                <LogOut size={18} color={colors.danger} />
              </View>
              <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
            </View>
          </Pressable>

          <Text style={[styles.version, { color: colors.textMuted }]}>Rent Resolve v1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ colors, icon, label, value }: { colors: any; icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primaryGlow }]}>{icon}</View>
      <View style={styles.infoCopy}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.textPrimary }]} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  hero: {
    height: 300,
    paddingHorizontal: 20,
    paddingBottom: 48,
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  heroCircleTop: { position: 'absolute', top: -50, right: -35, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,255,255,0.06)' },
  heroCircleBottom: { position: 'absolute', bottom: 8, left: -35, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.04)' },
  avatarOuter: { width: 104, height: 104, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatar: { width: 86, height: 86, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontFamily: 'Inter-Bold', fontSize: 30 },
  heroName: { color: '#FFFFFF', fontFamily: 'Inter-Bold', fontSize: 24 },
  heroEmail: { color: 'rgba(255,255,255,0.72)', fontFamily: 'Inter-Regular', fontSize: 14, marginTop: 4 },
  verifiedPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, backgroundColor: 'rgba(52,211,153,0.16)', borderWidth: 1, borderColor: 'rgba(52,211,153,0.3)', marginTop: 12 },
  verifiedText: { color: '#34D399', fontFamily: 'Inter-SemiBold', fontSize: 11, marginLeft: 5 },

  content: { paddingHorizontal: 20, marginTop: -24 },

  infoCard: { borderRadius: 20, borderWidth: 1, padding: 18, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', minHeight: 48 },
  infoIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  infoCopy: { flex: 1 },
  infoLabel: { fontFamily: 'Inter-Regular', fontSize: 11 },
  infoValue: { fontFamily: 'Inter-Medium', fontSize: 14, marginTop: 3 },
  divider: { height: 1, marginVertical: 9 },

  cardWrapper: { width: '100%', marginBottom: 10 },

  themeCard: {
    width: '100%', minHeight: 72, borderRadius: 18, borderWidth: 1, padding: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  themeIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  themeText: { flex: 1 },
  themeLabel: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  themeHint: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 3 },
  toggle: { width: 52, height: 30, borderRadius: 15, padding: 3, justifyContent: 'center' },
  toggleKnob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF' },
  toggleKnobActive: { alignSelf: 'flex-end' },

  sectionTitle: { fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.2, marginBottom: 12, marginLeft: 4 },

  menuCard: {
    width: '100%', minHeight: 78, borderRadius: 17, borderWidth: 1, padding: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  menuIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  menuCopy: { flex: 1 },
  menuLabel: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  menuDesc: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 4 },
  chevron: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },

  logoutCard: {
    width: '100%', minHeight: 58, borderRadius: 18, borderWidth: 1.5,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  logoutIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  logoutText: { fontFamily: 'Inter-Bold', fontSize: 16 },

  version: { fontFamily: 'Inter-Regular', fontSize: 12, textAlign: 'center', marginTop: 20 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});
