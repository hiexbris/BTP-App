import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: 'Home', headerLeft: () => null }} />
      <Stack.Screen name="evaluate/[clipId]" options={{ title: 'Evaluate Clip' }} />
    </Stack>
  );
}
