import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function AdminHome() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Link href="/admin/upload" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Upload Clip</Text>
        </TouchableOpacity>
      </Link>
      
      <Link href="/admin/clips" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Clips</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/admin/questions" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Questions</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/admin/results" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Download Results</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
