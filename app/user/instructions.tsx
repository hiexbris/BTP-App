import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Instructions() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleAccept = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('hasAcceptedInstructions', 'true');
      router.replace('/user/home');
    } catch (e) {
      console.error('Failed to save instructions status', e);
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Text style={styles.text}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text style={styles.text}>
          Please read these instructions carefully before proceeding. By clicking accept, you agree to evaluate the audio clips sincerely and objectively.
        </Text>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.button, saving && styles.disabledButton]} 
        onPress={handleAccept}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? 'Accepting...' : 'I Accept'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
  },
  text: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
