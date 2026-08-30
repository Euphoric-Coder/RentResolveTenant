import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { MOCK_REQUESTS } from '@/data/mockData';
import { SHADOWS } from '@/constants/theme';

function StarRating({ label, value, onChange, colors }: { label: string; value: number; onChange: (v: number) => void; colors: any }) {
  return (
    <View style={styles.ratingGroup}>
      <Text style={[styles.ratingLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>{label}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map(i => (
          <Pressable key={i} onPress={() => onChange(i)} hitSlop={4}>
            <Star size={28} color={i <= value ? colors.warning : colors.border} fill={i <= value ? colors.warning : 'transparent'} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function FeedbackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const request = MOCK_REQUESTS.find(r => r.id === id);
  const [overall, setOverall] = useState(0);
  const [quality, setQuality] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [techBehavior, setTechBehavior] = useState(0);
  const [resolved, setResolved] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (msg: string) => Platform.OS === 'web' ? window.alert(msg) : Alert.alert('', msg);
  const handleSubmit = () => {
    if (overall === 0) { showAlert('Please provide an overall rating.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); showAlert('Thank you for your feedback!'); router.back(); }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Feedback" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {request && (
          <Animated.View entering={FadeInDown.duration(400)} style={[styles.linkedCard, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.linkedId, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>{request.id}</Text>
            <Text style={[styles.linkedTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{request.title}</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <StarRating label="Overall Rating" value={overall} onChange={setOverall} colors={colors} />
          <StarRating label="Repair Quality" value={quality} onChange={setQuality} colors={colors} />
          <StarRating label="Response Time" value={responseTime} onChange={setResponseTime} colors={colors} />
          <StarRating label="Technician Behavior" value={techBehavior} onChange={setTechBehavior} colors={colors} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Text style={[styles.resolvedLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Was the issue fully resolved?</Text>
          <View style={styles.resolvedRow}>
            <Pressable
              style={[styles.resolvedBtn, {
                backgroundColor: resolved === true ? colors.successLight : colors.surface,
                borderColor: resolved === true ? colors.success : colors.border,
              }, SHADOWS.soft]}
              onPress={() => setResolved(true)}
            >
              <Text style={[styles.resolvedBtnText, { color: resolved === true ? colors.success : colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Yes</Text>
            </Pressable>
            <Pressable
              style={[styles.resolvedBtn, {
                backgroundColor: resolved === false ? colors.dangerLight : colors.surface,
                borderColor: resolved === false ? colors.danger : colors.border,
              }, SHADOWS.soft]}
              onPress={() => setResolved(false)}
            >
              <Text style={[styles.resolvedBtnText, { color: resolved === false ? colors.danger : colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>No</Text>
            </Pressable>
          </View>

          <InputField label="Written Feedback" placeholder="Share your experience..." value={comment} onChangeText={setComment} multiline numberOfLines={4} style={{ minHeight: 100, textAlignVertical: 'top' }} />
          <PrimaryButton title="Submit Feedback" onPress={handleSubmit} loading={loading} style={{ marginTop: 12 }} />
        </Animated.View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  linkedCard: { borderRadius: 14, padding: 16, marginBottom: 24 },
  linkedId: { fontSize: 12 },
  linkedTitle: { fontSize: 14, marginTop: 4 },
  ratingGroup: { marginBottom: 24 },
  ratingLabel: { fontSize: 14, marginBottom: 8 },
  stars: { flexDirection: 'row', gap: 6 },
  resolvedLabel: { fontSize: 14, marginBottom: 10 },
  resolvedRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  resolvedBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  resolvedBtnText: { fontSize: 15 },
});
