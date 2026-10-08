import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../../lib/supabase';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

export default function AdminUpload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!file) {
      Alert.alert('Error', 'Please select an audio file');
      return;
    }

    setLoading(true);

    try {
      // Get the extension
      const ext = file.name.split('.').pop() || 'mp3';
      const fileName = `${generateId()}.${ext}`;

      // Convert local URI to Blob for Supabase
      const res = await fetch(file.uri);
      const blob = await res.blob();

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('audio-clips')
        .upload(fileName, blob, {
          contentType: file.mimeType || 'audio/mpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Insert into database
      const { error: dbError } = await supabase
        .from('clips')
        .insert({
          title: title,
          file_path: fileName,
        });

      if (dbError) {
        // If DB insert fails, ideally we should delete the uploaded file, but for simplicity we just alert
        throw dbError;
      }

      Alert.alert('Success', 'Clip uploaded successfully.');
      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Upload Failed', err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Audio Clip</Text>
      
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Summer Evening"
      />
      
      <Text style={styles.label}>Audio File</Text>
      <TouchableOpacity style={styles.selectButton} onPress={handleSelectFile}>
        <Text style={styles.buttonText}>Select File</Text>
      </TouchableOpacity>

      {file && (
        <Text style={styles.selectedFile}>Selected: {file.name}</Text>
      )}
      
      <TouchableOpacity 
        style={[styles.uploadButton, (!title || !file) && styles.disabledButton]} 
        onPress={handleUpload}
        disabled={loading || !title || !file}
      >
        <Text style={styles.buttonText}>{loading ? 'Uploading...' : 'Upload'}</Text>
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
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  selectButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#99C7F9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedFile: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
});
