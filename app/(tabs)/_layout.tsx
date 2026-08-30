import { Tabs } from 'expo-router';
import { View, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, ClipboardList, MessageSquare, Wallet, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-SemiBold',
          letterSpacing: 0.2,
          marginTop: 0,
          paddingBottom: Platform.OS === 'android' ? 2 : 0,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'android' ? 2 : 0,
        },
        tabBarStyle: {
          backgroundColor: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.97)',
          borderTopColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(0,0,0,0.04)',
          borderTopWidth: 1,
          height: 64 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} activeBg={colors.primaryGlow}>
              <LayoutDashboard size={22} color={color} strokeWidth={focused ? 2 : 1.6} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} activeBg={colors.primaryGlow}>
              <ClipboardList size={22} color={color} strokeWidth={focused ? 2 : 1.6} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarBadge: 2,
          tabBarBadgeStyle: {
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: 9,
            fontFamily: 'Inter-Bold',
            minWidth: 16,
            height: 16,
            lineHeight: Platform.OS === 'android' ? 14 : 16,
            borderRadius: 8,
            top: -2,
          },
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} activeBg={colors.primaryGlow}>
              <MessageSquare size={22} color={color} strokeWidth={focused ? 2 : 1.6} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="rent"
        options={{
          title: 'Rent',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} activeBg={colors.primaryGlow}>
              <Wallet size={22} color={color} strokeWidth={focused ? 2 : 1.6} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} activeBg={colors.primaryGlow}>
              <User size={22} color={color} strokeWidth={focused ? 2 : 1.6} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ children, focused, activeBg }: { children: React.ReactNode; focused: boolean; color: string; activeBg: string }) {
  return (
    <View style={[styles.tabIcon, focused && { backgroundColor: activeBg }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
