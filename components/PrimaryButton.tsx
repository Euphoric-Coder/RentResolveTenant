import { Pressable, Text, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { SHADOWS } from '@/constants/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
  icon?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

export function PrimaryButton({ title, onPress, loading, variant = 'primary', icon, style, disabled }: PrimaryButtonProps) {
  const { colors } = useTheme();

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={loading || disabled}
        style={({ pressed }) => [
          { opacity: loading || disabled ? 0.6 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }], borderRadius: 16, overflow: 'hidden' },
          SHADOWS.card,
          style,
        ]}
      >
        <LinearGradient colors={['#1E6B5A', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
          {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : (
            <>
              {icon}
              <Text style={[styles.label, { color: '#FFFFFF', fontFamily: 'Inter-SemiBold' }]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'danger') {
    return (
      <Pressable
        onPress={onPress}
        disabled={loading || disabled}
        style={({ pressed }) => [
          { opacity: loading || disabled ? 0.6 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }], borderRadius: 16, overflow: 'hidden' },
          style,
        ]}
      >
        <LinearGradient colors={['#DC2626', '#B91C1C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
          {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : (
            <>
              {icon}
              <Text style={[styles.label, { color: '#FFFFFF', fontFamily: 'Inter-SemiBold' }]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        styles.outlineButton,
        {
          borderColor: colors.primary,
          opacity: loading || disabled ? 0.6 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          backgroundColor: colors.primaryGlow,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={colors.primary} size="small" /> : (
        <>
          {icon}
          <Text style={[styles.label, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 15,
  },
});
