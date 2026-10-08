import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { exportRatingsToCSV } from '../../lib/exports';

export default function AdminResults() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportRatingsToCSV();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Export Failed', err.message || 'An error occurred during export.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download Results</Text>
      <Text style={styles.description}>
        Export all submitted ratings as a CSV file. This file can be opened in Excel, Google Sheets, or any other spreadsheet application.
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, exporting && styles.disabledButton]} 
        onPress={handleExport}
        disabled={exporting}
      >
        <Text style={styles.buttonText}>{exporting ? 'Generating CSV...' : 'Download Results'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#A0DCA6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
