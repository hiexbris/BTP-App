import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { getPublicUrl } from '../../../lib/clips';
import { getQuestions, Question } from '../../../lib/questions';
import { submitEvaluation } from '../../../lib/evaluations';
import AudioPlayer from '../../../components/AudioPlayer';
import RatingSelector from '../../../components/RatingSelector';
import Loading from '../../../components/Loading';

export default function EvaluateClip() {
  const { clipId } = useLocalSearchParams();
  const router = useRouter();
  
  const [clip, setClip] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ratings, setRatings] = useState<{ [questionId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasListenedFully, setHasListenedFully] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clip
        const { data: clipData, error: clipError } = await supabase
          .from('clips')
          .select('*')
          .eq('id', clipId)
          .single();
        
        if (clipError) throw clipError;
        setClip(clipData);

        // Fetch active questions
        const activeQuestions = await getQuestions(true);
        if (activeQuestions.length === 0) {
          Alert.alert('No questions', 'There are no active questions available for evaluation.');
          router.back();
          return;
        }
        setQuestions(activeQuestions);

      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load clip or questions.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clipId]);

  const handleRatingSelect = (rating: number) => {
    const currentQ = questions[currentQuestionIndex];
    setRatings(prev => ({
      ...prev,
      [currentQ.id]: rating
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.some(q => !ratings[q.id]);
    if (unanswered) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const ratingsArray = questions.map(q => ({
        question_id: q.id,
        rating: ratings[q.id],
      }));

      await submitEvaluation(session.user.id, clipId as string, ratingsArray);
      
      Alert.alert('Success', 'Evaluation submitted successfully!');
      router.replace('/user/home');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Submit Failed', 'Unable to submit evaluation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !clip) {
    return <Loading message="Loading evaluation..." />;
  }

  const isFinished = currentQuestionIndex === questions.length;
  const currentQ = questions[currentQuestionIndex];
  const audioUrl = getPublicUrl(clip.file_path);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{clip.title}</Text>
      
      <AudioPlayer 
        url={audioUrl} 
        onPlaybackComplete={() => setHasListenedFully(true)} 
      />

      {!hasListenedFully ? (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>
            Please listen to the entire audio clip to unlock the questions.
          </Text>
        </View>
      ) : !isFinished ? (
        <View style={styles.evaluationContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>

          <RatingSelector
            questionText={currentQ.question_text}
            selectedRating={ratings[currentQ.id] || null}
            onSelect={handleRatingSelect}
          />

          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]} 
              onPress={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>

            {currentQuestionIndex < questions.length - 1 ? (
              <TouchableOpacity 
                style={[styles.navButton, !ratings[currentQ.id] && styles.disabledButton]} 
                onPress={handleNext}
                disabled={!ratings[currentQ.id]}
              >
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.submitButton, !ratings[currentQ.id] && styles.disabledButton]} 
                onPress={() => setCurrentQuestionIndex(questions.length)}
                disabled={!ratings[currentQ.id]}
              >
                <Text style={styles.navButtonText}>Review</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.submitContainer}>
          <Text style={styles.finishedText}>You've answered all questions.</Text>
          <TouchableOpacity 
            style={[styles.finalSubmitButton, submitting && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.finalSubmitText}>
              {submitting ? 'Submitting...' : 'Submit Evaluation'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reviewButton} 
            onPress={() => setCurrentQuestionIndex(questions.length - 1)}
            disabled={submitting}
          >
            <Text style={styles.reviewButtonText}>Back to Review</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  evaluationContainer: {
    flex: 1,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishedText: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  finalSubmitButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  finalSubmitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewButton: {
    paddingVertical: 10,
  },
  reviewButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  waitingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
});
