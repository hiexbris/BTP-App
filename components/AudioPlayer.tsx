import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

interface AudioPlayerProps {
  url: string;
  onPlaybackComplete?: () => void;
}

export default function AudioPlayer({ url, onPlaybackComplete }: AudioPlayerProps) {
  // Initialize the player and status using the new Expo 57 hooks
  const player = useAudioPlayer(url);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    // If the audio has a duration and we've reached the end (within 100ms)
    if (status.duration > 0 && status.currentTime >= status.duration - 0.1) {
      onPlaybackComplete?.();
    }
  }, [status.currentTime, status.duration]);

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleRestart = async () => {
    await player.seekTo(0);
    player.play();
  };

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds || 0);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getProgressWidth = () => {
    if (!status.duration || status.duration === 0) return '0%';
    return `${(status.currentTime / status.duration) * 100}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handlePlayPause}>
          <Text style={styles.buttonText}>{status.playing ? '⏸ Pause' : '▶ Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRestart}>
          <Text style={styles.buttonText}>🔁 Restart</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(status.currentTime)}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: getProgressWidth() as any }]} />
        </View>
        <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    width: 45,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
});
