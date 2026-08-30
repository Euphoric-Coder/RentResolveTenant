import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Camera, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { InputField } from '@/components/InputField';
import { PickerSelect } from '@/components/PickerSelect';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DISPUTE_CATEGORIES, MOCK_DISPUTES, MOCK_REQUESTS } from '@/data/mockData';
import { SHADOWS } from '@/constants/theme';

const DISPUTE_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Submitted: { bg: '#DBEAFE', text: '#1E40AF' },
  'Under Review': { bg: '#FEF3C7', text: '#92400E' },
  'Landlord Responded': { bg: '#E0E7FF', text: '#4338CA' },
  'Awaiting Tenant Response': { bg: '#FFEDD5', text: '#9A3412' },
  Resolved: { bg: '#D1FAE5', text: '#166534' },
  Closed: { bg: '#F1F5F9', text: '#475569' },
};

export default function DisputeScreen() {
  const { requestId } = useLocalSearchParams<{ requestId?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const linkedRequest = requestId ? MOCK_REQUESTS.find(r => r.id === requestId) : null;
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expected, setExpected] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'new' | 'existing'>('new');

  const showAlert = (msg: string) => Platform.OS === 'web' ? window.alert(msg) : Alert.alert('', msg);
  const handleSubmit = () => {
    if (!title.trim() || !category || !description.trim()) { showAlert('Please fill in title, category, and description.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); showAlert('Your dispute has been submitted for review.'); router.back(); }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Disputes" />
      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        <Pressable style={styles.tabWrap} onPress={() => setTab('new')}>
          {tab === 'new' ? (
            <LinearGradient colors={['#1E6B5A', '#0D9488'] as [string, string]} style={styles.tab}>
              <Text style={[styles.tabText, { color: '#FFFFFF', fontFamily: 'Inter-SemiBold' }]}>New Dispute</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.tab, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.tabText, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>New Dispute</Text>
            </View>
          )}
        </Pressable>
        <Pressable style={styles.tabWrap} onPress={() => setTab('existing')}>
          {tab === 'existing' ? (
            <LinearGradient colors={['#1E6B5A', '#0D9488'] as [string, string]} style={styles.tab}>
              <Text style={[styles.tabText, { color: '#FFFFFF', fontFamily: 'Inter-SemiBold' }]}>My Disputes</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.tab, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.tabText, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>My Disputes</Text>
            </View>
          )}
        </Pressable>
      </View>

      {tab === 'new' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {linkedRequest && (
            <Animated.View entering={FadeInDown.duration(400)} style={[styles.linkedCard, { backgroundColor: colors.warningLight }]}>
              <Text style={[styles.linkedLabel, { color: colors.warning, fontFamily: 'Inter-SemiBold' }]}>Linked Request</Text>
              <Text style={[styles.linkedTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{linkedRequest.id}: {linkedRequest.title}</Text>
            </Animated.View>
          )}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <InputField label="Dispute Title" placeholder="Brief title for your dispute" value={title} onChangeText={setTitle} />
            <PickerSelect label="Dispute Category" value={category} options={DISPUTE_CATEGORIES} onSelect={setCategory} placeholder="Select category" />
            <InputField label="Description" placeholder="Describe the issue in detail..." value={description} onChangeText={setDescription} multiline numberOfLines={4} style={{ minHeight: 100, textAlignVertical: 'top' }} />
            <InputField label="Expected Resolution" placeholder="What outcome do you expect?" value={expected} onChangeText={setExpected} multiline numberOfLines={2} style={{ minHeight: 60, textAlignVertical: 'top' }} />
            <Pressable style={[styles.evidenceBtn, { borderColor: colors.border }]} onPress={() => showAlert('Evidence upload will be available with backend integration.')}>
              <Camera size={20} color={colors.primary} />
              <Text style={[styles.evidenceBtnText, { color: colors.primary, fontFamily: 'Inter-Medium' }]}>Add Evidence</Text>
            </Pressable>
            <PrimaryButton title="Submit Dispute" variant="danger" icon={<AlertTriangle size={18} color="#FFFFFF" />} onPress={handleSubmit} loading={loading} style={{ marginTop: 20 }} />
          </Animated.View>
          <View style={{ height: 32 }} />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {MOCK_DISPUTES.map((d, index) => {
            const dc = DISPUTE_STATUS_COLORS[d.status] || DISPUTE_STATUS_COLORS.Submitted;
            return (
              <Animated.View key={d.id} entering={FadeInRight.delay(index * 80).duration(400)}>
                <View style={[styles.disputeCard, { backgroundColor: colors.surface }, SHADOWS.card]}>
                  <View style={styles.disputeHeader}>
                    <Text style={[styles.disputeId, { color: colors.textMuted, fontFamily: 'Inter-Medium' }]}>{d.id}</Text>
                    <View style={[styles.disputeStatusBadge, { backgroundColor: dc.bg }]}>
                      <Text style={[styles.disputeStatusText, { color: dc.text, fontFamily: 'Inter-SemiBold' }]}>{d.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.disputeTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{d.title}</Text>
                  <Text style={[styles.disputeCategory, { color: colors.primary, fontFamily: 'Inter-Medium' }]}>{d.category}</Text>
                  <Text style={[styles.disputeDesc, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]} numberOfLines={2}>{d.description}</Text>
                  <Text style={[styles.disputeDate, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>Submitted: {d.submittedDate}</Text>
                </View>
              </Animated.View>
            );
          })}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 10 },
  tabWrap: { flex: 1 },
  tab: { paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabText: { fontSize: 13 },
  scrollContent: { padding: 20 },
  linkedCard: { borderRadius: 14, padding: 16, marginBottom: 20 },
  linkedLabel: { fontSize: 12 },
  linkedTitle: { fontSize: 14, marginTop: 4 },
  evidenceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, paddingVertical: 20 },
  evidenceBtnText: { fontSize: 14 },
  disputeCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
  disputeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  disputeId: { fontSize: 11 },
  disputeStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  disputeStatusText: { fontSize: 10 },
  disputeTitle: { fontSize: 15, marginBottom: 4 },
  disputeCategory: { fontSize: 12, marginBottom: 6 },
  disputeDesc: { fontSize: 12, lineHeight: 18 },
  disputeDate: { fontSize: 11, marginTop: 8 },
});
