import { StyleSheet, Image as RNImage } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SignOutButton } from '@/components/SignOutButton';

export default function SettingsScreen() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Account</ThemedText>
        <ThemedView style={styles.userRow}>
          <RNImage source={{ uri: user?.imageUrl || undefined }} style={styles.avatar} />
          <ThemedView style={styles.userInfo}>
            <ThemedText type="defaultSemiBold">
              {(user?.firstName || '') + (user?.lastName ? ` ${user?.lastName}` : '')}
            </ThemedText>
            <ThemedText>{user?.primaryEmailAddress?.emailAddress}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Security</ThemedText>
        <SignOutButton label="Sign out" />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  card: {
    gap: 12,
    borderRadius: 12,
    padding: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eee',
  },
});
