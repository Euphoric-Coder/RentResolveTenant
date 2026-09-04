import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  index?: number;
}

export function StatCard({ label, value, color, icon, index = 0 }: StatCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(500).springify()}
      className="w-[48%] mb-3 overflow-hidden rounded-[22px]"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: isDark ? color + '55' : color + '65',
        shadowColor: color,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {/* Background Ambient Corner Glow */}
      <LinearGradient
        colors={[color + (isDark ? '18' : '0C'), color + '02']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View className="p-4 relative">
        {/* Top Row: Glowing Icon Badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="relative">
            <View
              className="absolute -inset-1 rounded-[14px] blur-sm"
              style={{ backgroundColor: color + '30' }}
            />
            <View
              className="h-[42px] w-[42px] items-center justify-center rounded-[13px] border"
              style={{
                backgroundColor: color + (isDark ? '25' : '15'),
                borderColor: color + (isDark ? '45' : '30'),
              }}
            >
              {icon}
            </View>
          </View>

          {/* Micro Ambient Indicator Orb */}
          <View
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </View>

        {/* Count Figure */}
        <Text
          numberOfLines={1}
          className="text-[26px] tracking-[-0.6px] text-slate-900 dark:text-white"
          style={{ fontFamily: 'Inter-Bold', lineHeight: 32 }}
        >
          {value}
        </Text>

        {/* Label */}
        <Text
          numberOfLines={1}
          className="text-[11.5px] tracking-[0.6px] text-slate-500 dark:text-slate-400 mt-0.5"
          style={{ fontFamily: 'Inter-SemiBold', textTransform: 'uppercase' }}
        >
          {label}
        </Text>
      </View>

      {/* Bottom Accent Highlight Bar */}
      <View
        className="h-[3px] mx-4 rounded-full mb-1"
        style={{ backgroundColor: color }}
      />
    </Animated.View>
  );
}

