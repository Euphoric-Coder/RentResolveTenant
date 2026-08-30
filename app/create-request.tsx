import { useState } from 'react';
import { View, Text, ScrollView, Switch, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Video, File, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { InputField } from '@/components/InputField';
import { PickerSelect } from '@/components/PickerSelect';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CATEGORIES, SUBCATEGORIES, PRIORITY_LEVELS } from '@/data/mockData';
import { SHADOWS } from '@/constants/theme';

const ROOMS = ['Kitchen', 'Bedroom', 'Bathroom', 'Living Room', 'Balcony', 'Hall', 'Other'];
const TIME_SLOTS = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', 'ASAP'];

export default function CreateRequestScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [room, setRoom] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [permissionToEnter, setPermissionToEnter] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [loading, setLoading] = useState(false);

  const subcats = category ? (SUBCATEGORIES[category] || []) : [];
  const showAlert = (msg: string) => Platform.OS === 'web' ? window.alert(msg) : Alert.alert('', msg);

  const handleSubmit = () => {
    if (!title.trim() || !category || !description.trim()) { showAlert('Please fill in title, category, and description.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); showAlert('Request submitted successfully!'); router.back(); }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="New Request" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isEmergency && (
          <View style={[styles.emergencyBanner, { backgroundColor: colors.dangerLight }]}>
            <AlertTriangle size={18} color={colors.danger} />
            <Text style={[styles.emergencyText, { color: colors.danger, fontFamily: 'Inter-SemiBold' }]}>This will be flagged as an emergency request</Text>
          </View>
        )}

        <InputField label="Issue Title" placeholder="Brief description of the issue" value={title} onChangeText={setTitle} />
        <PickerSelect label="Category" value={category} options={CATEGORIES} onSelect={(v) => { setCategory(v); setSubcategory(''); }} placeholder="Select category" />
        {subcats.length > 0 && <PickerSelect label="Subcategory" value={subcategory} options={subcats} onSelect={setSubcategory} placeholder="Select subcategory" />}
        <InputField label="Description" placeholder="Describe the issue in detail..." value={description} onChangeText={setDescription} multiline numberOfLines={4} style={{ minHeight: 100, textAlignVertical: 'top' }} />
        <PickerSelect label="Priority Level" value={priority} options={[...PRIORITY_LEVELS]} onSelect={setPriority} placeholder="Select priority" />
        <PickerSelect label="Property Area / Room" value={room} options={ROOMS} onSelect={setRoom} placeholder="Select area" />
        <InputField label="Preferred Visit Date" placeholder="YYYY-MM-DD" value={preferredDate} onChangeText={setPreferredDate} />
        <PickerSelect label="Preferred Time Slot" value={timeSlot} options={TIME_SLOTS} onSelect={setTimeSlot} placeholder="Select time" />

        <View style={[styles.switchCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.soft]}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={[styles.switchTitle, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>Permission to enter when absent</Text>
            <Text style={[styles.switchHint, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>Allow access if you are not home</Text>
          </View>
          <Switch value={permissionToEnter} onValueChange={setPermissionToEnter} trackColor={{ true: colors.primary }} />
        </View>

        <View style={[styles.switchCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.soft]}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={[styles.switchTitle, { color: colors.danger, fontFamily: 'Inter-SemiBold' }]}>Emergency Issue</Text>
            <Text style={[styles.switchHint, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>Mark for immediate attention</Text>
          </View>
          <Switch value={isEmergency} onValueChange={setIsEmergency} trackColor={{ true: colors.danger }} />
        </View>

        <Text style={[styles.evidenceLabel, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>Evidence</Text>
        <View style={styles.evidenceRow}>
          <EvidenceBtn icon={<Camera size={20} color={colors.primary} />} label="Photo" onPress={() => showAlert('Photo upload will be available with backend integration.')} colors={colors} />
          <EvidenceBtn icon={<Video size={20} color={colors.primary} />} label="Video" onPress={() => showAlert('Video upload will be available with backend integration.')} colors={colors} />
          <EvidenceBtn icon={<File size={20} color={colors.primary} />} label="Document" onPress={() => showAlert('Document upload will be available with backend integration.')} colors={colors} />
        </View>

        <PrimaryButton title="Submit Request" onPress={handleSubmit} loading={loading} style={{ marginTop: 20 }} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function EvidenceBtn({ icon, label, onPress, colors }: { icon: React.ReactNode; label: string; onPress: () => void; colors: any }) {
  return (
    <Pressable style={[styles.evidenceBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress}>
      {icon}
      <Text style={[styles.evidenceBtnLabel, { color: colors.primary, fontFamily: 'Inter-Medium' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  emergencyBanner: { borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  emergencyText: { fontSize: 13, flex: 1 },
  switchCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1 },
  switchTitle: { fontSize: 14 },
  switchHint: { fontSize: 11, marginTop: 2 },
  evidenceLabel: { fontSize: 13, marginBottom: 10 },
  evidenceRow: { flexDirection: 'row', gap: 12 },
  evidenceBtn: { flex: 1, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', paddingVertical: 20, alignItems: 'center', gap: 6 },
  evidenceBtnLabel: { fontSize: 12 },
});
