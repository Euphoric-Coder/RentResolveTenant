import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="tenant-place-selection" />
      <Stack.Screen name="location-based" />
      <Stack.Screen name="property-search" />
      <Stack.Screen name="property-confirmation" />
      <Stack.Screen name="landlord-approval-waiting" />
    </Stack>
  );
}
