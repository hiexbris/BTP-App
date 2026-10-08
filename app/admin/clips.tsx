import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getClips, deleteClip, Clip } from '../../lib/clips';
import Loading from '../../components/Loading';

export default function AdminClips() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClips = async () => {
    try {
      setLoading(true);
      const data = await getClips();
      setClips(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load clips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips();
  }, []);

  const handleDelete = (clip: Clip) => {
    Alert.alert(
      'Delete Clip',
      `Delete "${clip.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteClip(clip.id, clip.file_path);
              await fetchClips();
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to delete clip');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading && clips.length === 0) {
    return <Loading message="Loading clips..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploaded Clips</Text>
      <FlatList
        data={clips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.clipTitle}>{item.title}</Text>
              <Text style={styles.filePath}>{item.file_path}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No clips found.</Text>}
        onRefresh={fetchClips}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  clipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  filePath: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});
