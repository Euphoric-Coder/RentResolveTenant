import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View className="flex-row justify-between items-center mb-3.5 mt-6">
      <Text
        className="text-[18px] text-slate-900 dark:text-white"
        style={{ fontFamily: 'Inter-Bold' }}
      >
        {title}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="flex-row items-center gap-1 active:opacity-75"
        >
          <Text
            className="text-[13px] text-teal-600 dark:text-teal-400"
            style={{ fontFamily: 'Inter-SemiBold' }}
          >
            {actionLabel}
          </Text>
          <ChevronRight size={14} color="#0D9488" strokeWidth={2.4} />
        </Pressable>
      )}
    </View>
  );
}

