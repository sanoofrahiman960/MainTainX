import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TaskDetailsScreen = ({ navigation }) => {
  const statusOptions = [
    { id: 'open', label: 'Open', icon: '🔓' },
    { id: 'hold', label: 'On Hold', icon: '⏸' },
    { id: 'progress', label: 'In Progress', icon: '🔄' },
    { id: 'done', label: 'Done', icon: '✓' },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>TEST</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusOptions}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.statusButton,
                    option.id === 'open' && styles.statusButtonActive,
                  ]}>
                  <Text style={styles.statusButtonText}>
                    {option.icon} {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.row}
            onPress={() => navigation.navigate('SelectUser')}>
            <Text style={styles.label}>Assigned to</Text>
            <View style={styles.rowContent}>
              <Image
                source={{ uri: 'https://via.placeholder.com/40' }}
                style={styles.avatar}
              />
              <Text style={styles.value}>Mash</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Add other rows for Location, Asset, etc. */}
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('TimeOverview')}>
            <Text style={styles.startButtonText}>Start Timer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statusContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flex: 1,
    marginHorizontal: 4,
  },
  statusButtonActive: {
    backgroundColor: '#007AFF',
  },
  statusButtonText: {
    textAlign: 'center',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: '#8E8E93',
  },
  chevron: {
    fontSize: 20,
    color: '#8E8E93',
    marginLeft: 8,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 24,
  },
  startButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskDetailsScreen;