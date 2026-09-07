import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Search,
  Plus,
  X,
  Wrench,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ListFilter,
  Clock,
  CheckCircle2,
  Check,
  RotateCcw,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_REQUESTS, MaintenanceRequest } from '@/data/mockData';
import { RequestCard } from '@/components/RequestCard';
import { EmptyState } from '@/components/EmptyState';

type FilterType = 'All' | 'Open' | 'In Progress' | 'Resolved' | 'Emergency';

interface FilterItemConfig {
  key: FilterType;
  label: string;
}

const FILTER_ITEMS: FilterItemConfig[] = [
  { key: 'All', label: 'All requests' },
  { key: 'Open', label: 'Open requests' },
  { key: 'In Progress', label: 'In progress' },
  { key: 'Resolved', label: 'Resolved requests' },
  { key: 'Emergency', label: 'Emergency requests' },
];

interface StatusFilterDropdownProps {
  activeFilter: FilterType;
  counts: {
    all: number;
    open: number;
    inProgress: number;
    resolved: number;
    emergency: number;
  };
  isDark: boolean;
  open: boolean;
  onToggle: () => void;
  onSelect: (filter: FilterType) => void;
}

// Dedicated Dropdown Component using pure React Native StyleSheet and explicit styles
function StatusFilterDropdown({
  activeFilter,
  counts,
  isDark,
  open,
  onToggle,
  onSelect,
}: StatusFilterDropdownProps) {
  const getFilterBadgeCount = (key: FilterType) => {
    switch (key) {
      case 'All':
        return counts.all;
      case 'Open':
        return counts.open;
      case 'In Progress':
        return counts.inProgress;
      case 'Resolved':
        return counts.resolved;
      case 'Emergency':
        return counts.emergency;
    }
  };

  const getActiveFilterLabel = () => {
    switch (activeFilter) {
      case 'All':
        return 'All requests';
      case 'Open':
        return 'Open requests';
      case 'In Progress':
        return 'In progress';
      case 'Resolved':
        return 'Resolved requests';
      case 'Emergency':
        return 'Emergency requests';
      default:
        return 'All requests';
    }
  };

  const isEmergencyActive = activeFilter === 'Emergency';
  const isNonAllActive = activeFilter !== 'All';
  const activeCount = getFilterBadgeCount(activeFilter);

  // Colors mapping for option rows
  const getFilterVisuals = (key: FilterType) => {
    switch (key) {
      case 'All':
        return {
          icon: isDark ? '#2DD4BF' : '#0D9488',
          bg: isDark ? 'rgba(13, 148, 136, 0.22)' : '#CCFBF1',
        };
      case 'Open':
        return {
          icon: isDark ? '#FBBF24' : '#D97706',
          bg: isDark ? 'rgba(245, 158, 11, 0.22)' : '#FEF3C7',
        };
      case 'In Progress':
        return {
          icon: isDark ? '#60A5FA' : '#2563EB',
          bg: isDark ? 'rgba(37, 99, 235, 0.22)' : '#DBEAFE',
        };
      case 'Resolved':
        return {
          icon: isDark ? '#34D399' : '#059669',
          bg: isDark ? 'rgba(16, 185, 129, 0.22)' : '#D1FAE5',
        };
      case 'Emergency':
        return {
          icon: isDark ? '#F87171' : '#DC2626',
          bg: isDark ? 'rgba(220, 38, 38, 0.22)' : '#FEE2E2',
        };
    }
  };

  const renderFilterIcon = (key: FilterType, color: string, size = 18) => {
    switch (key) {
      case 'All':
        return <ListFilter size={size} color={color} strokeWidth={2.5} />;
      case 'Open':
        return <Clock size={size} color={color} strokeWidth={2.5} />;
      case 'In Progress':
        return <Wrench size={size} color={color} strokeWidth={2.5} />;
      case 'Resolved':
        return <CheckCircle2 size={size} color={color} strokeWidth={2.5} />;
      case 'Emergency':
        return <AlertTriangle size={size} color={color} strokeWidth={2.5} />;
    }
  };

  // Trigger dynamic color tokens
  const triggerBg = open
    ? isDark
      ? 'rgba(13, 148, 136, 0.14)'
      : '#F0FDFA'
    : isDark
      ? '#111827'
      : '#FFFFFF';

  const triggerBorder = open
    ? isDark
      ? '#2DD4BF'
      : '#5EEAD4'
    : isDark
      ? '#334155'
      : '#CBD5E1';

  const triggerIconBg = isEmergencyActive
    ? isDark
      ? 'rgba(220, 38, 38, 0.25)'
      : '#FFE4E6'
    : isNonAllActive
      ? isDark
        ? 'rgba(13, 148, 136, 0.25)'
        : '#CCFBF1'
      : isDark
        ? '#1E293B'
        : '#F1F5F9';

  const triggerIconColor = isEmergencyActive
    ? isDark
      ? '#FCA5A5'
      : '#DC2626'
    : isNonAllActive
      ? isDark
        ? '#2DD4BF'
        : '#0D9488'
      : isDark
        ? '#94A3B8'
        : '#64748B';

  const triggerValueColor = isEmergencyActive
    ? isDark
      ? '#FCA5A5'
      : '#B91C1C'
    : isNonAllActive
      ? isDark
        ? '#5EEAD4'
        : '#0F766E'
      : isDark
        ? '#F8FAFC'
        : '#0F172A';

  const triggerBadgeBg = isEmergencyActive
    ? isDark
      ? 'rgba(244, 63, 94, 0.25)'
      : '#FFE4E6'
    : isNonAllActive
      ? isDark
        ? 'rgba(20, 184, 166, 0.25)'
        : '#CCFBF1'
      : isDark
        ? '#1E293B'
        : '#F1F5F9';

  const triggerBadgeTextColor = isEmergencyActive
    ? isDark
      ? '#FDA4AF'
      : '#BE123C'
    : isNonAllActive
      ? isDark
        ? '#5EEAD4'
        : '#0F766E'
      : isDark
        ? '#94A3B8'
        : '#64748B';

  const chevronColor = open
    ? isDark
      ? '#2DD4BF'
      : '#0D9488'
    : isEmergencyActive
      ? isDark
        ? '#FCA5A5'
        : '#DC2626'
      : isDark
        ? '#94A3B8'
        : '#64748B';

  return (
    <View style={dropdownStyles.filterSection}>
      {/* Outer Styled Surface Card View */}
      <View
        style={[
          dropdownStyles.triggerContainer,
          {
            backgroundColor: triggerBg,
            borderColor: triggerBorder,
            shadowColor: open ? '#0D9488' : '#000000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: open ? (isDark ? 0.28 : 0.12) : isDark ? 0.22 : 0.07,
            shadowRadius: open ? 10 : 7,
            elevation: open ? 5 : 3,
          },
        ]}
      >
        {/* Inner Interaction Pressable */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Status filter, ${getActiveFilterLabel()}, ${activeCount} requests`}
          accessibilityState={{ expanded: open }}
          onPress={onToggle}
          style={({ pressed }) => ({
            opacity: pressed ? 0.94 : 1,
            transform: [{ scale: pressed ? 0.995 : 1 }],
          })}
        >
          <View style={dropdownStyles.triggerPressable}>
            {/* Left Content (Icon + Labels) with explicit minWidth: 0 */}
            <View style={dropdownStyles.triggerLeft}>
              {/* Icon Tile */}
              <View
                style={[
                  dropdownStyles.triggerIconTile,
                  { backgroundColor: triggerIconBg },
                ]}
              >
                {renderFilterIcon(activeFilter, triggerIconColor, 18)}
              </View>

              {/* Text Container */}
              <View style={dropdownStyles.triggerTextContainer}>
                <Text
                  numberOfLines={1}
                  style={[
                    dropdownStyles.triggerLabel,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Filter status
                </Text>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    dropdownStyles.triggerValue,
                    { color: triggerValueColor },
                  ]}
                >
                  {getActiveFilterLabel()}
                </Text>
              </View>
            </View>

            {/* Right Content (Count Badge + Chevron) with flexShrink: 0 */}
            <View style={dropdownStyles.triggerRight}>
              <View
                style={[
                  dropdownStyles.triggerBadge,
                  { backgroundColor: triggerBadgeBg },
                ]}
              >
                <Text
                  style={[
                    dropdownStyles.triggerBadgeText,
                    { color: triggerBadgeTextColor },
                  ]}
                >
                  {activeCount}
                </Text>
              </View>

              {open ? (
                <ChevronUp size={18} color={chevronColor} strokeWidth={2.4} />
              ) : (
                <ChevronDown size={18} color={chevronColor} strokeWidth={2.4} />
              )}
            </View>
          </View>
        </Pressable>
      </View>

      {/* Floating Expandable Dropdown Menu with Outer Animation and Inner Surface */}
      {open && (
        <Animated.View entering={FadeInDown.duration(180)}>
          <View
            style={[
              dropdownStyles.dropdownMenuContainer,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#CBD5E1',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 7 },
                shadowOpacity: isDark ? 0.36 : 0.13,
                shadowRadius: 16,
                elevation: 9,
              },
            ]}
          >
            {FILTER_ITEMS.map((item, index) => {
              const isSelected = activeFilter === item.key;
              const isEmergencyItem = item.key === 'Emergency';
              const count = getFilterBadgeCount(item.key);
              const visuals = getFilterVisuals(item.key);

              const selectedRowBg = isEmergencyItem
                ? isDark
                  ? 'rgba(220, 38, 38, 0.16)'
                  : '#FFF1F2'
                : isDark
                  ? 'rgba(13, 148, 136, 0.16)'
                  : '#F0FDFA';

              const rowTextColor = isSelected
                ? isEmergencyItem
                  ? isDark
                    ? '#FDA4AF'
                    : '#BE123C'
                  : isDark
                    ? '#5EEAD4'
                    : '#0F766E'
                : isDark
                  ? '#F1F5F9'
                  : '#1E293B';

              const badgeRowBg = isSelected
                ? isEmergencyItem
                  ? isDark
                    ? 'rgba(244, 63, 94, 0.28)'
                    : '#FFE4E6'
                  : isDark
                    ? 'rgba(20, 184, 166, 0.28)'
                    : '#CCFBF1'
                : isDark
                  ? '#1E293B'
                  : '#F1F5F9';

              const badgeRowTextColor = isSelected
                ? isEmergencyItem
                  ? isDark
                    ? '#FDA4AF'
                    : '#BE123C'
                  : isDark
                    ? '#5EEAD4'
                    : '#0F766E'
                : isDark
                  ? '#94A3B8'
                  : '#64748B';

              return (
                <View
                  key={item.key}
                  style={[
                    dropdownStyles.menuRow,
                    {
                      backgroundColor: isSelected
                        ? selectedRowBg
                        : 'transparent',
                      borderBottomWidth:
                        index < FILTER_ITEMS.length - 1
                          ? StyleSheet.hairlineWidth
                          : 0,
                      borderBottomColor: isDark ? '#263244' : '#EEF2F7',
                    },
                  ]}
                >
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${item.label}, ${count} requests`}
                    onPress={() => onSelect(item.key)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    {({ pressed }) => (
                      <View
                        style={[
                          dropdownStyles.menuPressable,
                          {
                            backgroundColor: isSelected
                              ? undefined
                              : pressed
                                ? isDark
                                  ? '#1F2937'
                                  : '#F8FAFC'
                                : 'transparent',
                          },
                        ]}
                      >
                        {/* Left: Radio + Icon + Label */}
                        <View style={dropdownStyles.menuLeft}>
                          {/* Radio / Check Circle */}
                          <View
                            style={[
                              dropdownStyles.menuRadio,
                              {
                                borderWidth: isSelected ? 0 : 1.5,
                                borderColor: isDark ? '#475569' : '#CBD5E1',
                                backgroundColor: isSelected
                                  ? isEmergencyItem
                                    ? '#EF4444'
                                    : '#0D9488'
                                  : 'transparent',
                              },
                            ]}
                          >
                            {isSelected && (
                              <Check
                                size={13}
                                color="#FFFFFF"
                                strokeWidth={3}
                              />
                            )}
                          </View>

                          {/* Semantic Icon Wrap */}
                          <View
                            style={[
                              dropdownStyles.menuIconTile,
                              { backgroundColor: visuals.bg },
                            ]}
                          >
                            {renderFilterIcon(item.key, visuals.icon, 16)}
                          </View>

                          {/* Text Label */}
                          <Text
                            numberOfLines={1}
                            style={[
                              dropdownStyles.menuText,
                              {
                                fontFamily: isSelected
                                  ? 'Inter-Bold'
                                  : 'Inter-Medium',
                                color: rowTextColor,
                              },
                            ]}
                          >
                            {item.label}
                          </Text>
                        </View>

                        {/* Right: Count Badge */}
                        <View
                          style={[
                            dropdownStyles.menuBadge,
                            { backgroundColor: badgeRowBg },
                          ]}
                        >
                          <Text
                            style={[
                              dropdownStyles.menuBadgeText,
                              {
                                fontFamily: isSelected
                                  ? 'Inter-Bold'
                                  : 'Inter-SemiBold',
                                color: badgeRowTextColor,
                              },
                            ]}
                          >
                            {count}
                          </Text>
                        </View>
                      </View>
                    )}
                  </Pressable>
                </View>
              );
            })}

            {/* Reset Row if non-All filter is active */}
            {isNonAllActive && (
              <View
                style={[
                  dropdownStyles.resetRow,
                  { borderTopColor: isDark ? '#1F2937' : '#E2E8F0' },
                ]}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reset to all requests"
                  onPress={() => onSelect('All')}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        dropdownStyles.resetPressable,
                        {
                          backgroundColor: pressed
                            ? isDark
                              ? '#1F2937'
                              : '#F8FAFC'
                            : 'transparent',
                        },
                      ]}
                    >
                      <RotateCcw
                        size={13}
                        color={isDark ? '#2DD4BF' : '#0D9488'}
                        strokeWidth={2.4}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          dropdownStyles.resetText,
                          { color: isDark ? '#2DD4BF' : '#0D9488' },
                        ]}
                      >
                        Reset to all requests
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

export default function RequestsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Fast counts calculation
  const counts = useMemo(() => {
    const all = MOCK_REQUESTS.length;
    const open = MOCK_REQUESTS.filter((r) =>
      ['Submitted', 'Under Review'].includes(r.status),
    ).length;
    const inProgress = MOCK_REQUESTS.filter((r) =>
      [
        'Approved',
        'Assigned',
        'In Progress',
        'Waiting for Tenant',
        'Waiting for Landlord',
      ].includes(r.status),
    ).length;
    const resolved = MOCK_REQUESTS.filter((r) =>
      ['Resolved', 'Closed'].includes(r.status),
    ).length;
    const emergency = MOCK_REQUESTS.filter((r) => r.isEmergency).length;

    return { all, open, inProgress, resolved, emergency };
  }, []);

  // Filtered requests list
  const filtered = useMemo(() => {
    let list = MOCK_REQUESTS;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.propertyArea.toLowerCase().includes(q),
      );
    }
    if (activeFilter === 'Open') {
      list = list.filter((r) =>
        ['Submitted', 'Under Review'].includes(r.status),
      );
    } else if (activeFilter === 'In Progress') {
      list = list.filter((r) =>
        [
          'Approved',
          'Assigned',
          'In Progress',
          'Waiting for Tenant',
          'Waiting for Landlord',
        ].includes(r.status),
      );
    } else if (activeFilter === 'Resolved') {
      list = list.filter((r) => ['Resolved', 'Closed'].includes(r.status));
    } else if (activeFilter === 'Emergency') {
      list = list.filter((r) => r.isEmergency);
    }
    return list;
  }, [search, activeFilter]);

  const handleFilterPress = useCallback((filter: FilterType) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Haptics fallback
    }
    setActiveFilter(filter);
    setFilterMenuOpen(false);
  }, []);

  const handleCreatePress = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics fallback
    }
    router.push('/create-request');
  }, [router]);

  const getActiveFilterLabel = () => {
    switch (activeFilter) {
      case 'All':
        return 'All requests';
      case 'Open':
        return 'Open requests';
      case 'In Progress':
        return 'In progress';
      case 'Resolved':
        return 'Resolved requests';
      case 'Emergency':
        return 'Emergency requests';
      default:
        return 'All requests';
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: MaintenanceRequest; index: number }) => (
      <RequestCard
        request={item}
        index={index}
        onPress={() =>
          router.push({ pathname: '/request-detail', params: { id: item.id } })
        }
      />
    ),
    [router],
  );

  const keyExtractor = useCallback((item: MaintenanceRequest) => item.id, []);

  // Header Component for FlatList (clean, reliable non-memoized or direct rendering)
  const renderListHeader = () => (
    <View className="mb-2">
      {/* Top Header */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        className="flex-row items-center justify-between pb-2"
      >
        <View className="flex-1 pr-3">
          <Text
            className="text-[28px] tracking-[-0.6px] text-slate-900 dark:text-white"
            style={{ fontFamily: 'Inter-Bold' }}
          >
            Requests
          </Text>
          <Text
            className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5"
            style={{ fontFamily: 'Inter-Medium' }}
          >
            Track and manage property maintenance
          </Text>
        </View>

        {/* Enhanced Add Request Button with Glowing Gradient, Icon, and Label */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create new maintenance request"
          onPress={handleCreatePress}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.94 : 1 }],
            shadowColor: '#0D9488',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: isDark ? 0.45 : 0.28,
            shadowRadius: 6,
            elevation: 4,
          })}
        >
          <LinearGradient
            colors={['#0F766E', '#0D9488', '#14B8A6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 40,
              paddingHorizontal: 14,
              borderRadius: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255, 255, 255, 0.35)',
            }}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.8} />
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 13,
                color: '#FFFFFF',
              }}
            >
              New
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Modern Attention Card Alert Banner */}
      {counts.emergency > 0 && (
        <Animated.View
          entering={FadeInDown.delay(40).duration(260)}
          style={{ marginBottom: 10 }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${counts.emergency} urgent maintenance requests need attention`}
            accessibilityHint="Shows urgent maintenance requests"
            onPress={() => handleFilterPress('Emergency')}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.95 : 1,
              shadowColor: '#E11D48',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.35 : 0.15,
              shadowRadius: 8,
              elevation: 4,
            })}
          >
            <LinearGradient
              colors={isDark ? ['#4C0519', '#2A000A'] : ['#FFF1F2', '#FFE4E6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(225, 29, 72, 0.4)' : '#FECACA',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  paddingRight: 8,
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: isDark
                      ? 'rgba(225, 29, 72, 0.15)'
                      : '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    borderWidth: 1,
                    borderColor: isDark
                      ? 'rgba(225, 29, 72, 0.3)'
                      : 'rgba(225, 29, 72, 0.1)',
                    shadowColor: '#E11D48',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <AlertTriangle
                    size={20}
                    color={isDark ? '#FDA4AF' : '#E11D48'}
                    strokeWidth={2.4}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#EF4444',
                      borderWidth: 2,
                      borderColor: isDark ? '#4C0519' : '#FFFFFF',
                    }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Inter-Bold',
                      fontSize: 14.5,
                      color: isDark ? '#FFE4E6' : '#9F1239',
                      marginBottom: 1,
                      letterSpacing: -0.2,
                    }}
                  >
                    {counts.emergency} Urgent {counts.emergency === 1 ? 'Request' : 'Requests'}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Inter-Medium',
                      fontSize: 12.5,
                      color: isDark ? '#FDA4AF' : '#E11D48',
                    }}
                  >
                    Requires immediate action
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark
                    ? 'rgba(225, 29, 72, 0.15)'
                    : 'rgba(225, 29, 72, 0.06)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark
                    ? 'rgba(225, 29, 72, 0.3)'
                    : 'rgba(225, 29, 72, 0.12)',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 12,
                    color: isDark ? '#FDA4AF' : '#BE123C',
                    marginRight: 4,
                  }}
                >
                  {activeFilter === 'Emergency' ? 'Active' : 'View'}
                </Text>
                <ChevronRight
                  size={14}
                  color={isDark ? '#FDA4AF' : '#BE123C'}
                  strokeWidth={2.5}
                />
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      {/* Smart Overview Section (Advanced Dashboard Metric Tiles) */}
      <Animated.View
        entering={FadeInDown.delay(70).duration(300)}
        style={{ marginBottom: 12, paddingHorizontal: 2, alignSelf: 'center', width: '100%', maxWidth: 500 }}
      >
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Open Metric Tile */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open requests, ${counts.open}`}
            accessibilityState={{ selected: activeFilter === 'Open' }}
            onPress={() => handleFilterPress('Open')}
            style={({ pressed }) => {
              const isActive = activeFilter === 'Open';
              const isFaded = activeFilter !== 'All' && !isActive;
              return {
                flex: 1,
                height: 116,
                borderRadius: 24,
                opacity: isFaded ? 0.5 : pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.95 : isActive ? 1.02 : 1 }],
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: isActive ? 6 : 2 },
                shadowOpacity: isActive ? (isDark ? 0.4 : 0.2) : isDark ? 0.1 : 0.05,
                shadowRadius: isActive ? 12 : 4,
                elevation: isActive ? 6 : 2,
              };
            }}
          >
            <LinearGradient
              colors={isDark ? ['#451A03', '#270F01'] : ['#FEF3C7', '#FFFBEB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 24,
                borderWidth: 1.5,
                borderColor: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <View style={{ position: 'absolute', bottom: -12, right: -12, opacity: isDark ? 0.15 : 0.1 }}>
                <Clock size={72} color={isDark ? '#FCD34D' : '#F59E0B'} strokeWidth={2} />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8, gap: 5 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isDark ? '#F59E0B' : '#D97706',
                    shadowColor: '#F59E0B',
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 0 },
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                    fontSize: 10.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    color: isDark ? '#FCD34D' : '#B45309',
                  }}
                >
                  Open
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Inter-Black',
                    fontSize: 32,
                    letterSpacing: -1.2,
                    lineHeight: 38,
                    color: isDark ? '#FFFFFF' : '#78350F',
                  }}
                >
                  {counts.open}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Inter-Medium',
                    fontSize: 11,
                    color: isDark ? '#FDE68A' : '#92400E',
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  Needs review
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Active Metric Tile */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Active requests, ${counts.inProgress}`}
            accessibilityState={{ selected: activeFilter === 'In Progress' }}
            onPress={() => handleFilterPress('In Progress')}
            style={({ pressed }) => {
              const isActive = activeFilter === 'In Progress';
              const isFaded = activeFilter !== 'All' && !isActive;
              return {
                flex: 1,
                height: 116,
                borderRadius: 24,
                opacity: isFaded ? 0.5 : pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.95 : isActive ? 1.02 : 1 }],
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: isActive ? 6 : 2 },
                shadowOpacity: isActive ? (isDark ? 0.4 : 0.2) : isDark ? 0.1 : 0.05,
                shadowRadius: isActive ? 12 : 4,
                elevation: isActive ? 6 : 2,
              };
            }}
          >
            <LinearGradient
              colors={isDark ? ['#172554', '#0A1128'] : ['#DBEAFE', '#EFF6FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 24,
                borderWidth: 1.5,
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <View style={{ position: 'absolute', bottom: -12, right: -12, opacity: isDark ? 0.15 : 0.1 }}>
                <Wrench size={72} color={isDark ? '#93C5FD' : '#3B82F6'} strokeWidth={2} />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8, gap: 5 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isDark ? '#3B82F6' : '#2563EB',
                    shadowColor: '#3B82F6',
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 0 },
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                    fontSize: 10.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    color: isDark ? '#93C5FD' : '#1D4ED8',
                  }}
                >
                  Active
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Inter-Black',
                    fontSize: 32,
                    letterSpacing: -1.2,
                    lineHeight: 38,
                    color: isDark ? '#FFFFFF' : '#1E3A8A',
                  }}
                >
                  {counts.inProgress}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Inter-Medium',
                    fontSize: 11,
                    color: isDark ? '#BFDBFE' : '#1E40AF',
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  Being handled
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Resolved Metric Tile */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Resolved requests, ${counts.resolved}`}
            accessibilityState={{ selected: activeFilter === 'Resolved' }}
            onPress={() => handleFilterPress('Resolved')}
            style={({ pressed }) => {
              const isActive = activeFilter === 'Resolved';
              const isFaded = activeFilter !== 'All' && !isActive;
              return {
                flex: 1,
                height: 116,
                borderRadius: 24,
                opacity: isFaded ? 0.5 : pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.95 : isActive ? 1.02 : 1 }],
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: isActive ? 6 : 2 },
                shadowOpacity: isActive ? (isDark ? 0.4 : 0.2) : isDark ? 0.1 : 0.05,
                shadowRadius: isActive ? 12 : 4,
                elevation: isActive ? 6 : 2,
              };
            }}
          >
            <LinearGradient
              colors={isDark ? ['#022C22', '#01130E'] : ['#D1FAE5', '#ECFDF5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 24,
                borderWidth: 1.5,
                borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <View style={{ position: 'absolute', bottom: -12, right: -12, opacity: isDark ? 0.15 : 0.1 }}>
                <CheckCircle2 size={72} color={isDark ? '#6EE7B7' : '#10B981'} strokeWidth={2} />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8, gap: 5 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isDark ? '#10B981' : '#059669',
                    shadowColor: '#10B981',
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 0 },
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                    fontSize: 10.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    color: isDark ? '#6EE7B7' : '#047857',
                  }}
                >
                  Resolved
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Inter-Black',
                    fontSize: 32,
                    letterSpacing: -1.2,
                    lineHeight: 38,
                    color: isDark ? '#FFFFFF' : '#064E3B',
                  }}
                >
                  {counts.resolved}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Inter-Medium',
                    fontSize: 11,
                    color: isDark ? '#A7F3D0' : '#065F46',
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  Completed
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </Animated.View>

      {/* Search Bar & Clear Filter Row */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(300)}
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Search */}
        <View
          style={{
            flex: 1,
            height: 48,
            paddingHorizontal: 14,

            flexDirection: 'row',
            alignItems: 'center',

            borderRadius: 16,

            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',

            borderWidth: 1,
            borderColor: isSearchFocused
              ? isDark
                ? '#2DD4BF'
                : '#0D9488'
              : isDark
                ? '#334155'
                : '#E2E8F0',

            shadowColor: isSearchFocused ? '#0D9488' : '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isSearchFocused
              ? isDark
                ? 0.25
                : 0.08
              : isDark
                ? 0.18
                : 0.025,
            shadowRadius: isSearchFocused ? 4 : 3,
            elevation: 1,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,

              alignItems: 'center',
              justifyContent: 'center',

              marginRight: 10,

              backgroundColor: isSearchFocused
                ? isDark
                  ? 'rgba(13,148,136,0.20)'
                  : '#CCFBF1'
                : isDark
                  ? '#1E293B'
                  : '#F1F5F9',
            }}
          >
            <Search
              size={14}
              color={
                isSearchFocused
                  ? isDark
                    ? '#2DD4BF'
                    : '#0D9488'
                  : isDark
                    ? '#94A3B8'
                    : '#64748B'
              }
              strokeWidth={2.2}
            />
          </View>

          <TextInput
            style={{
              flex: 1,
              paddingVertical: 0,

              fontFamily: 'Inter-Regular',
              fontSize: 13.5,

              color: isDark ? '#FFFFFF' : '#0F172A',
            }}
            placeholder="Search requests..."
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            value={search}
            onChangeText={setSearch}
            onFocus={() => {
              setIsSearchFocused(true);
              setFilterMenuOpen(false);
            }}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setSearch('')}
              hitSlop={6}
              style={({ pressed }) => ({
                width: 26,
                height: 26,
                borderRadius: 13,

                marginLeft: 6,

                alignItems: 'center',
                justifyContent: 'center',

                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',

                opacity: pressed ? 0.7 : 1,
              })}
            >
              <X
                size={12}
                color={isDark ? '#94A3B8' : '#64748B'}
                strokeWidth={2.2}
              />
            </Pressable>
          )}
        </View>

        {/* Reset active status filter */}
        {activeFilter !== 'All' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset status filter"
            onPress={() => handleFilterPress('All')}
            hitSlop={4}
            style={({ pressed }) => ({
              width: 48,
              height: 48,

              borderRadius: 16,

              alignItems: 'center',
              justifyContent: 'center',

              backgroundColor: pressed
                ? isDark
                  ? 'rgba(13,148,136,0.20)'
                  : '#CCFBF1'
                : isDark
                  ? 'rgba(13,148,136,0.12)'
                  : '#F0FDFA',

              borderWidth: 1,
              borderColor: isDark ? 'rgba(45,212,191,0.30)' : '#99F6E4',

              shadowColor: '#0D9488',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: pressed ? 0 : isDark ? 0.16 : 0.05,
              shadowRadius: 4,
              elevation: pressed ? 0 : 1,

              transform: [
                {
                  scale: pressed ? 0.95 : 1,
                },
              ],
            })}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,

                alignItems: 'center',
                justifyContent: 'center',

                backgroundColor: isDark ? 'rgba(20,184,166,0.18)' : '#CCFBF1',
              }}
            >
              <RotateCcw
                size={14}
                color={isDark ? '#5EEAD4' : '#0F766E'}
                strokeWidth={2.4}
              />
            </View>
          </Pressable>
        )}
      </Animated.View>

      {/* Modern Status Filter Dropdown Component */}
      <StatusFilterDropdown
        activeFilter={activeFilter}
        counts={counts}
        isDark={isDark}
        open={filterMenuOpen}
        onToggle={() => {
          try {
            Haptics.selectionAsync();
          } catch {
            // Haptics fallback
          }
          setFilterMenuOpen((prev) => !prev);
        }}
        onSelect={handleFilterPress}
      />

      {/* Clean Feed Header & Subtle Capsule Count */}
      <View className="flex-row items-center justify-between pb-0.5 px-0.5">
        <Text
          className="text-[13px] text-slate-700 dark:text-slate-300"
          style={{ fontFamily: 'Inter-SemiBold' }}
        >
          {search.trim()
            ? `Search results (${filtered.length})`
            : activeFilter === 'All'
              ? 'Maintenance requests'
              : getActiveFilterLabel()}
        </Text>

        <View
          className="px-2 py-0.5 rounded-full"
          style={{
            backgroundColor:
              activeFilter === 'Emergency'
                ? isDark
                  ? 'rgba(190, 24, 93, 0.15)'
                  : '#FFE4E6'
                : isDark
                  ? '#1E293B'
                  : '#F1F5F9',
          }}
        >
          <Text
            className="text-[11px]"
            style={{
              fontFamily: 'Inter-SemiBold',
              color:
                activeFilter === 'Emergency'
                  ? isDark
                    ? '#FDA4AF'
                    : '#BE123C'
                  : isDark
                    ? '#94A3B8'
                    : '#64748B',
            }}
          >
            {filtered.length}
          </Text>
        </View>
      </View>
    </View>
  );

  // Empty List Component with Contextual Reset Button
  const ListEmptyComponent = useMemo(
    () => (
      <View className="items-center justify-center py-12 px-4">
        <EmptyState
          icon={<Wrench size={32} color={isDark ? '#64748B' : '#94A3B8'} />}
          title="No requests found"
          message={
            search.trim() || activeFilter !== 'All'
              ? 'Try adjusting your search terms or active filters to view requests.'
              : 'You have no maintenance requests filed yet.'
          }
        />
        {(search.trim().length > 0 || activeFilter !== 'All') && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset all filters and search"
            onPress={() => {
              setSearch('');
              setActiveFilter('All');
            }}
            className="mt-2 px-4 py-2 rounded-full bg-slate-200/80 dark:bg-slate-800"
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Text
              className="text-[12px] text-slate-700 dark:text-slate-300"
              style={{ fontFamily: 'Inter-SemiBold' }}
            >
              Reset Filters
            </Text>
          </Pressable>
        )}
      </View>
    ),
    [search, activeFilter, isDark],
  );

  return (
    <View
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      style={{ paddingTop: insets.top }}
    >
      {/* Subtle Ambient Depth Background */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: insets.top + 20,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: isDark
            ? 'rgba(13, 148, 136, 0.03)'
            : 'rgba(20, 184, 166, 0.035)',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: 120,
          left: -50,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: isDark
            ? 'rgba(59, 130, 246, 0.018)'
            : 'rgba(59, 130, 246, 0.025)',
        }}
      />

      {/* Main FlatList Feed */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: insets.bottom + 90,
        }}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        extraData={`${activeFilter}-${filterMenuOpen}-${search}-${isDark}`}
      />
    </View>
  );
}

const dropdownStyles = StyleSheet.create({
  filterSection: {
    width: '100%',
    marginBottom: 14,
    zIndex: 50,
  },
  triggerContainer: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    borderWidth: 1.25,
  },
  triggerPressable: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerIconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  triggerTextContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  triggerLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  triggerValue: {
    marginTop: 2,
    fontFamily: 'Inter-Bold',
    fontSize: 14.5,
  },
  triggerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 12,
  },
  triggerBadge: {
    minWidth: 26,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  triggerBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    textAlign: 'center',
  },
  dropdownMenuContainer: {
    marginTop: 8,
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    width: '100%',
  },
  menuPressable: {
    height: 54,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    flexShrink: 0,
  },
  menuIconTile: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  menuText: {
    flex: 1,
    fontSize: 13.5,
  },
  menuBadge: {
    minWidth: 26,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    flexShrink: 0,
  },
  menuBadgeText: {
    fontSize: 11,
    textAlign: 'center',
  },
  resetRow: {
    borderTopWidth: 1,
  },
  resetPressable: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12.5,
  },
});
