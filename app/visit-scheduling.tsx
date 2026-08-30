import { useState } from 'react';
import { View, Text, ScrollView, Switch, Alert, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Calendar, Clock, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { InputField } from '@/components/InputField';
import { PickerSelect } from '@/components/PickerSelect';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const TIME_SLOTS = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

export default function VisitSchedulingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [altTimeSlot, setAltTimeSlot] = useState('');
  const [permission, setPermission] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (msg: string) => Platform.OS === 'web' ? window.alert(msg) : Alert.alert('', msg);
  const handleSubmit = () => {
    if (!date.trim() || !timeSlot) { showAlert('Please select a date and time slot.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); showAlert('Visit has been scheduled. You will receive a confirmation.'); router.back(); }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Schedule Visit" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={[styles.currentVisit, SHADOWS.card]}>
          <LinearGradient
            colors={['#05966918', '#05966906'] as [string, string]}
            style={styles.currentGlow}
          />
          <View style={styles.currentHeader}>
            <CheckCircle size={18} color={colors.success} />
            <Text style={[styles.currentTitle, { color: colors.success, fontFamily: 'Inter-Bold' }]}>Current Scheduled Visit</Text>
          </View>
          <View style={styles.currentDetails}>
            <View style={styles.currentRow}>
              <Calendar size={14} color={colors.textMuted} />
              <Text style={[styles.currentText, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>June 25, 2026</Text>
            </View>
            <View style={styles.currentRow}>
              <Clock size={14} color={colors.textMuted} />
              <Text style={[styles.currentText, { color: colors.textPrimary, fontFamily: 'Inter-Medium' }]}>2:00 PM - 4:00 PM</Text>
            </View>
          </View>
          <Text style={[styles.currentTech, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>Technician: Sunil Verma (AC Repair)</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>Schedule New / Reschedule</Text>
          <InputField label="Preferred Date" placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
          <PickerSelect label="Preferred Time Slot" value={timeSlot} options={TIME_SLOTS} onSelect={setTimeSlot} placeholder="Select time" />
          <PickerSelect label="Alternative Time Slot" value={altTimeSlot} options={TIME_SLOTS} onSelect={setAltTimeSlot} placeholder="Select alternative" />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <View style={[styles.switchCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.soft]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>Permission to enter when absent</Text>
              <Text style={[styles.switchHint, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>Allow technician access if you are not home</Text>
            </View>
            <Switch value={permission} onValueChange={setPermission} trackColor={{ true: colors.primary }} />
          </View>

          <InputField label="Special Instructions" placeholder="Any specific instructions for the technician..." value={instructions} onChangeText={setInstructions} multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />
          <PrimaryButton title="Confirm Schedule" onPress={handleSubmit} loading={loading} style={{ marginTop: 12 }} />
        </Animated.View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  currentVisit: { borderRadius: 16, padding: 16, marginBottom: 8, overflow: 'hidden' },
  currentGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  currentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  currentTitle: { fontSize: 14 },
  currentDetails: { gap: 6, marginBottom: 8 },
  currentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currentText: { fontSize: 14 },
  currentTech: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, marginTop: 20, marginBottom: 16 },
  switchCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1 },
  switchTitle: { fontSize: 14 },
  switchHint: { fontSize: 11, marginTop: 2 },
});
