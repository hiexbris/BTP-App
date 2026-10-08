import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: 'Admin Panel', headerLeft: () => null }} />
      <Stack.Screen name="upload" options={{ title: 'Upload Clip' }} />
      <Stack.Screen name="clips" options={{ title: 'Manage Clips' }} />
      <Stack.Screen name="questions" options={{ title: 'Manage Questions' }} />
      <Stack.Screen name="results" options={{ title: 'Download Results' }} />
    </Stack>
  );
}
