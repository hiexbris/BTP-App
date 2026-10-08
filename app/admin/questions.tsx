import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { getQuestions, addQuestion, toggleQuestionActive, Question } from '../../lib/questions';
import Loading from '../../components/Loading';

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newDisplayOrder, setNewDisplayOrder] = useState('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getQuestions();
      setQuestions(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async () => {
    if (!newQuestionText || !newDisplayOrder) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const order = parseInt(newDisplayOrder, 10);
    if (isNaN(order)) {
      Alert.alert('Error', 'Display order must be a number');
      return;
    }

    try {
      setLoading(true);
      await addQuestion(newQuestionText, order);
      setNewQuestionText('');
      setNewDisplayOrder('');
      await fetchQuestions();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add question');
      setLoading(false);
    }
  };

  const handleToggleActive = async (q: Question) => {
    try {
      setLoading(true);
      await toggleQuestionActive(q.id, q.active);
      await fetchQuestions();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update question');
      setLoading(false);
    }
  };

  if (loading && questions.length === 0) {
    return <Loading message="Loading questions..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Questions</Text>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.active && styles.cardInactive]}>
            <View style={styles.info}>
              <Text style={styles.questionText}>{item.display_order}. {item.question_text}</Text>
              <Text style={styles.statusText}>{item.active ? 'Active' : 'Inactive'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleButton, !item.active && styles.activateButton]} 
              onPress={() => handleToggleActive(item)}
            >
              <Text style={styles.buttonText}>{item.active ? 'Deactivate' : 'Activate'}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No questions found.</Text>}
        onRefresh={fetchQuestions}
        refreshing={loading}
      />

      <View style={styles.addForm}>
        <Text style={styles.addTitle}>Add Question</Text>
        <TextInput
          style={styles.input}
          placeholder="Question Text"
          value={newQuestionText}
          onChangeText={setNewQuestionText}
        />
        <TextInput
          style={styles.input}
          placeholder="Display Order (e.g. 4)"
          value={newDisplayOrder}
          onChangeText={setNewDisplayOrder}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Adding...' : '+ Add Question'}</Text>
        </TouchableOpacity>
      </View>
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
  cardInactive: {
    opacity: 0.6,
  },
  info: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activateButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
  addForm: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
});
