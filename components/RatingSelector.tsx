import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RatingSelectorProps {
  questionText: string;
  selectedRating: number | null;
  onSelect: (rating: number) => void;
}

export default function RatingSelector({ questionText, selectedRating, onSelect }: RatingSelectorProps) {
  const ratings = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{questionText}</Text>
      <View style={styles.buttonsContainer}>
        {ratings.map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[styles.button, selectedRating === rating && styles.selectedButton]}
            onPress={() => onSelect(rating)}
          >
            <Text style={[styles.buttonText, selectedRating === rating && styles.selectedButtonText]}>
              {rating}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
});
