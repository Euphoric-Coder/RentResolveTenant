import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Camera } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { InputField } from '@/components/InputField';
import { PickerSelect } from '@/components/PickerSelect';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { REOPEN_REASONS, MOCK_REQUESTS } from '@/data/mockData';

const SEVERITY = ['Minor - Cosmetic issue remains', 'Moderate - Partially fixed', 'Major - Issue persists', 'Critical - Worse than before'];

export default function ReopenRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const request = MOCK_REQUESTS.find(r => r.id === id);
  const [reason, setReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (msg: string) => Platform.OS === 'web' ? window.alert(msg) : Alert.alert('', msg);
  const handleSubmit = () => {
    if (!reason || !explanation.trim()) { showAlert('Please select a reason and provide an explanation.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); showAlert('Your request to reopen has been submitted.'); router.back(); }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Reopen Request" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {request && (
          <Animated.View entering={FadeInDown.duration(400)} style={[styles.linkedCard, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.linkedId, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>{request.id}</Text>
            <Text style={[styles.linkedTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{request.title}</Text>
          </Animated.View>
        )}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <PickerSelect label="Reason for Reopening" value={reason} options={REOPEN_REASONS} onSelect={setReason} placeholder="Select reason" />
          <InputField label="Additional Explanation" placeholder="Describe why you are reopening..." value={explanation} onChangeText={setExplanation} multiline numberOfLines={4} style={{ minHeight: 100, textAlignVertical: 'top' }} />
          <PickerSelect label="Severity of Remaining Issue" value={severity} options={SEVERITY} onSelect={setSeverity} placeholder="Select severity" />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(250).duration(400)}>
          <Pressable style={[styles.evidenceBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => showAlert('Evidence upload will be available with backend integration.')}>
            <Camera size={20} color={colors.primary} />
            <Text style={[styles.evidenceBtnText, { color: colors.primary, fontFamily: 'Inter-Medium' }]}>Add New Evidence</Text>
          </Pressable>
          <PrimaryButton title="Submit Reopen Request" onPress={handleSubmit} loading={loading} style={{ marginTop: 20 }} />
        </Animated.View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  linkedCard: { borderRadius: 14, padding: 16, marginBottom: 20 },
  linkedId: { fontSize: 12 },
  linkedTitle: { fontSize: 14, marginTop: 4 },
  evidenceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, paddingVertical: 20, marginTop: 4 },
  evidenceBtnText: { fontSize: 14 },
});
