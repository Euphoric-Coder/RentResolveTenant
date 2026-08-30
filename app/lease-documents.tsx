import { View, Text, ScrollView, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { FileText, Download, Eye } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_DOCUMENTS } from '@/data/mockData';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SHADOWS } from '@/constants/theme';

const TYPE_COLORS: Record<string, string> = {
  Agreement: '#1E6B5A', Inspection: '#059669', Rules: '#D97706', Receipt: '#16A34A',
  Maintenance: '#0284C7', Identity: '#0D9488', Notice: '#DC2626',
};

const STATUS_MAP: Record<string, { bg: string; text: string }> = {
  Available: { bg: '#D1FAE5', text: '#059669' },
  Pending: { bg: '#FEF3C7', text: '#D97706' },
  Expired: { bg: '#FEE2E2', text: '#DC2626' },
};

export default function LeaseDocumentsScreen() {
  const { colors } = useTheme();
  const handleView = (name: string) => {
    const msg = `Document viewer for "${name}" will be available with backend integration.`;
    Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Preview', msg);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Lease Documents" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {MOCK_DOCUMENTS.map((doc, index) => {
          const iconColor = TYPE_COLORS[doc.type] || colors.textMuted;
          const status = STATUS_MAP[doc.status] || STATUS_MAP.Available;
          return (
            <Animated.View key={doc.id} entering={FadeInRight.delay(index * 70).duration(400)}>
              <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.card]}>
                <View style={[styles.docIcon, { backgroundColor: iconColor + '14' }]}>
                  <FileText size={22} color={iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.docName, { color: colors.textPrimary, fontFamily: 'Inter-SemiBold' }]}>{doc.name}</Text>
                  <Text style={[styles.docMeta, { color: colors.textMuted, fontFamily: 'Inter-Regular' }]}>{doc.type} - {doc.uploadedDate}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.text, fontFamily: 'Inter-SemiBold' }]}>{doc.status}</Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Pressable style={[styles.actionBtn, { backgroundColor: colors.surfaceSecondary }]} onPress={() => handleView(doc.name)}>
                    <Eye size={16} color={colors.primary} />
                  </Pressable>
                  <Pressable style={[styles.actionBtn, { backgroundColor: colors.surfaceSecondary }]} onPress={() => handleView(doc.name)}>
                    <Download size={16} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  card: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  docIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  docName: { fontSize: 14 },
  docMeta: { fontSize: 11, marginTop: 3 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 6 },
  statusText: { fontSize: 10 },
  actions: { gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
