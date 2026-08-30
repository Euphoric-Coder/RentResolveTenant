import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SHADOWS } from '@/constants/theme';

interface PickerSelectProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function PickerSelect({ label, value, options, onSelect, placeholder }: PickerSelectProps) {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' }]}>{label}</Text>
      <Pressable
        style={[styles.trigger, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            styles.triggerText,
            { color: value ? colors.textPrimary : colors.textMuted, fontFamily: 'Inter-Regular' },
          ]}
        >
          {value || placeholder || 'Select...'}
        </Text>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }, SHADOWS.prominent]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.textPrimary, fontFamily: 'Inter-Bold' }]}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.option,
                    item === value && { backgroundColor: colors.primaryLight },
                  ]}
                  onPress={() => { onSelect(item); setVisible(false); }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: item === value ? colors.primary : colors.textPrimary,
                        fontFamily: item === value ? 'Inter-SemiBold' : 'Inter-Regular',
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && <Check size={16} color={colors.primary} />}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  triggerText: {
    fontSize: 15,
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 15,
  },
});
