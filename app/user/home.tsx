import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { getUnratedClips } from '../../lib/evaluations';
import { Clip, getPublicUrl } from '../../lib/clips';
import Loading from '../../components/Loading';

export default function UserHome() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const unrated = await getUnratedClips(session.user.id);
      setClips(unrated);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load your feed');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFeed();
    }, [])
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  const handleRate = (clip: Clip) => {
    router.push(`/user/evaluate/${clip.id}`);
  };

  if (loading && clips.length === 0) {
    return <Loading message="Loading your feed..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.remaining}>Remaining clips: {clips.length}</Text>
      </View>

      <Text style={styles.sectionTitle}>Available Clips</Text>

      <FlatList
        data={clips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.clipTitle}>{item.title}</Text>
            <TouchableOpacity style={styles.rateButton} onPress={() => handleRate(item)}>
              <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>You're all done!</Text>
            <Text style={styles.emptyText}>You have rated every available clip.</Text>
          </View>
        }
        onRefresh={fetchFeed}
        refreshing={loading}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  remaining: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  rateButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34C759',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
