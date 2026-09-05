import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

interface ScreenHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

export function ScreenHeader({ title, rightElement }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  return (
    <View
      style={{ paddingTop: insets.top + 8 }}
      className="flex-row items-center px-5 pb-3.5 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-sm"
    >
      <Pressable
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-[12px] bg-slate-100 dark:bg-slate-800 active:opacity-75"
        hitSlop={8}
      >
        <ArrowLeft size={20} color={isDark ? '#F8FAFC' : '#0F172A'} strokeWidth={2.2} />
      </Pressable>
      <Text
        className="text-[17px] tracking-[-0.2px] text-slate-900 dark:text-white flex-1 text-center"
        style={{ fontFamily: 'Inter-Bold' }}
      >
        {title}
      </Text>
      <View className="w-10 items-end">{rightElement}</View>
    </View>
  );
}

