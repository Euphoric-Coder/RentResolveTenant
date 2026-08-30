import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Wallet, CheckCircle, Clock, AlertTriangle, TrendingUp, CreditCard } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_RENT_PAYMENTS, MOCK_PROPERTY } from '@/data/mockData';
import { SHADOWS } from '@/constants/theme';

export default function RentScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const pending = MOCK_RENT_PAYMENTS.find(r => r.status === 'Pending');
  const paidTotal = MOCK_RENT_PAYMENTS.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
  const paidCount = MOCK_RENT_PAYMENTS.filter(r => r.status === 'Paid').length;

  const statusConfig = (status: string) => {
    if (status === 'Paid') return { icon: <CheckCircle size={16} color={colors.success} />, color: colors.success };
    if (status === 'Pending') return { icon: <Clock size={16} color={colors.warning} />, color: colors.warning };
    return { icon: <AlertTriangle size={16} color={colors.danger} />, color: colors.danger };
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      <LinearGradient
        colors={isDark ? ['#134E4A', '#0F766E', '#064E3B'] : ['#1E6B5A', '#0D9488', '#115E59']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroBg1} />
        <View style={styles.heroBg2} />
        <Animated.View entering={FadeInDown.duration(600)} style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={[styles.heroTitle, { fontFamily: 'Inter-Bold' }]}>Rent Overview</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <CreditCard size={16} color="rgba(255,255,255,0.6)" />
              <Text style={[styles.heroStatLabel, { fontFamily: 'Inter-Regular' }]}>Monthly</Text>
              <Text style={[styles.heroStatValue, { fontFamily: 'Inter-ExtraBold' }]}>Rs. {MOCK_PROPERTY.monthlyRent.toLocaleString()}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStatItem}>
              <Wallet size={16} color="rgba(255,255,255,0.6)" />
              <Text style={[styles.heroStatLabel, { fontFamily: 'Inter-Regular' }]}>Deposit</Text>
              <Text style={[styles.heroStatValue, { fontFamily: 'Inter-ExtraBold' }]}>Rs. {MOCK_PROPERTY.securityDeposit.toLocaleString()}</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        {pending && (
          <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} style={[styles.pendingCard, { backgroundColor: colors.surface }, SHADOWS.elevated]}>
            <LinearGradient colors={[colors.warningLight, 'transparent']} style={styles.pendingGlow} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            <View style={[styles.pendingIcon, { backgroundColor: colors.warningLight }]}>
              <Wallet size={20} color={colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.pendingLabel, { color: colors.warning, fontFamily: 'Inter-Bold' }]}>Payment Due</Text>
              <Text style={[styles.pendingMonth, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{pending.month}</Text>
              <Text style={[styles.pendingDate, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>Due by {pending.dueDate}</Text>
            </View>
            <Text style={[styles.pendingAmount, { color: colors.warning, fontFamily: 'Inter-ExtraBold' }]}>
              Rs. {pending.amount.toLocaleString()}
            </Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <LinearGradient
            colors={isDark ? ['rgba(52,211,153,0.1)', 'rgba(52,211,153,0.03)'] : ['rgba(5,150,105,0.08)', 'rgba(5,150,105,0.02)']}
            style={[styles.summaryCard, { borderColor: colors.success + '20' }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryLeft}>
                <View style={[styles.summaryIconWrap, { backgroundColor: colors.successLight }]}>
                  <TrendingUp size={16} color={colors.success} />
                </View>
                <Text style={[styles.summaryLabel, { color: colors.success, fontFamily: 'Inter-SemiBold' }]}>Total Paid in 2026</Text>
              </View>
              <Text style={[styles.summaryValue, { color: colors.success, fontFamily: 'Inter-ExtraBold' }]}>Rs. {paidTotal.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryBar, { backgroundColor: colors.success + '15' }]}>
              <View style={[styles.summaryBarFill, { backgroundColor: colors.success, width: `${(paidCount / 12) * 100}%` }]} />
            </View>
            <Text style={[styles.summaryNote, { color: colors.success, fontFamily: 'Inter-Medium' }]}>{paidCount} of 12 months paid</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Payment History</Text>

        {MOCK_RENT_PAYMENTS.map((payment, i) => {
          const sc = statusConfig(payment.status);
          return (
            <Animated.View key={payment.id} entering={FadeInUp.delay(400 + i * 60).duration(400)}>
              <View style={[styles.paymentCard, { backgroundColor: colors.surface }, SHADOWS.soft]}>
                <View style={[styles.paymentDotWrap, { backgroundColor: sc.color + '14' }]}>
                  {sc.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.paymentMonth, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{payment.month}</Text>
                  <Text style={[styles.paymentDate, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>
                    {payment.paidDate ? `Paid on ${payment.paidDate}` : `Due ${payment.dueDate}`}
                  </Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={[styles.paymentAmount, { color: sc.color, fontFamily: 'Inter-Bold' }]}>
                    Rs. {payment.amount.toLocaleString()}
                  </Text>
                  <View style={[styles.paymentStatusPill, { backgroundColor: sc.color + '12' }]}>
                    <Text style={[styles.paymentStatusText, { color: sc.color, fontFamily: 'Inter-SemiBold' }]}>{payment.status}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heroSection: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' },
  heroBg1: { position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.04)' },
  heroBg2: { position: 'absolute', bottom: 10, left: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.03)' },
  heroTitle: { fontSize: 26, color: '#FFFFFF', letterSpacing: -0.3 },
  heroStats: { flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  heroStatItem: { flex: 1, alignItems: 'center', gap: 4 },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroStatValue: { fontSize: 18, color: '#FFFFFF', letterSpacing: -0.3 },
  heroDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  pendingCard: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16, overflow: 'hidden' },
  pendingGlow: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  pendingIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  pendingLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  pendingMonth: { fontSize: 15, marginTop: 2 },
  pendingDate: { fontSize: 11, marginTop: 2 },
  pendingAmount: { fontSize: 22, letterSpacing: -0.5 },
  summaryCard: { borderRadius: 18, padding: 18, marginBottom: 24, borderWidth: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 17, letterSpacing: -0.3 },
  summaryBar: { height: 6, borderRadius: 3, marginTop: 14 },
  summaryBarFill: { height: 6, borderRadius: 3 },
  summaryNote: { fontSize: 11, marginTop: 8 },
  sectionTitle: { fontSize: 18, marginBottom: 14, letterSpacing: -0.2 },
  paymentCard: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  paymentDotWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  paymentMonth: { fontSize: 15 },
  paymentDate: { fontSize: 11, marginTop: 2 },
  paymentRight: { alignItems: 'flex-end' },
  paymentAmount: { fontSize: 15, letterSpacing: -0.2 },
  paymentStatusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  paymentStatusText: { fontSize: 10 },
});
