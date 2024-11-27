import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {
  Appbar,
  Text,
  List,
  Portal,
  Surface,
  Button,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

interface RecurrenceSettings {
  type: RecurrenceType;
  interval: number;
  selectedDays: WeekDay[];
  dayOfMonth?: number;
  date?: Date;
}

export default function RecurrenceScreen() {
  const navigation = useNavigation();
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [interval, setInterval] = useState(1);
  const [dayOfMonth, setDayOfMonth] = useState([1]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = {number:["1","2"]}

  useEffect(() => {
    if (recurrenceType === 'daily') {
      setSelectedDays(weekDays);
    }
  }, [recurrenceType]);

  const handleSave = () => {
    const settings: RecurrenceSettings = {
      type: recurrenceType,
      interval,
      selectedDays,
      dayOfMonth: recurrenceType === 'monthly' ? dayOfMonth : undefined,
      date: recurrenceType === 'yearly' ? selectedDate : undefined,
    };
    // Handle saving the recurrence settings
    navigation.goBack();
  };

  const toggleDay = (day: WeekDay) => {
    let newSelectedDays: WeekDay[];
    if (selectedDays.includes(day)) {
      newSelectedDays = selectedDays.filter(d => d !== day);
    } else {
      newSelectedDays = [...selectedDays, day];
    }
    setSelectedDays(newSelectedDays);

    // If any day is deselected and it was previously in daily mode, switch to weekly
    if (recurrenceType === 'daily' && newSelectedDays.length < 7) {
      setRecurrenceType('weekly');
    }
    // If all days are selected and it was in weekly mode, switch to daily
    if (recurrenceType === 'weekly' && newSelectedDays.length === 7) {
      setRecurrenceType('daily');
    }
  };

  const getHelperText = () => {
    switch (recurrenceType) {
      case 'daily':
        return 'Repeats every day after completion of this work order.';
      case 'weekly':
        if (selectedDays.length === 0) {
          return 'Please select at least one day for recurrence.';
        }
        return `Repeats every week on ${selectedDays.join(', ')} after completion of this work order.`;
      case 'monthly':
        return `Repeats every month on the ${dayOfMonth}${getDayOfMonthSuffix(dayOfMonth)} day of the month after completion of this work order.`;
      case 'yearly':
        return `Repeats every year on ${format(selectedDate, 'MMMM d')} after completion of this work order.`;
      default:
        return '';
    }
  };

  const getDayOfMonthSuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const renderScheduleContent = () => {
    switch (recurrenceType) {
      case 'daily':
      case 'weekly':
        return (
          <>
            <View style={styles.frequencyContainer}>
              <Text style={styles.frequencyLabel}>Every:</Text>
              <TouchableOpacity style={styles.frequencySelector}>
                <Text style={styles.frequencyText}>{months.number.map((t)=>t)} {recurrenceType === 'daily' ? 'day' : 'week'}</Text>
                <Icon name="chevron-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.daysContainer}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.selectedDayButton,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDays.includes(day) && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );

      case 'monthly':
        return (
          <>
            <View style={styles.frequencyContainer}>
              <Text style={styles.frequencyLabel}>Every:</Text>
              <TouchableOpacity style={styles.frequencySelector}>
                <Text style={styles.frequencyText}>1 month</Text>
                <Icon name="chevron-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.monthlyContainer}>
              <Text style={styles.frequencyLabel}>Day of month:</Text>
              <TouchableOpacity style={styles.frequencySelector}>
                <Text style={styles.frequencyText}>{dayOfMonth}{getDayOfMonthSuffix(dayOfMonth)}</Text>
                <Icon name="chevron-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </>
        );

      case 'yearly':
        return (
          <View style={styles.frequencyContainer}>
            <Text style={styles.frequencyLabel}>Every:</Text>
            <TouchableOpacity style={styles.frequencySelector}>
              <Text style={styles.frequencyText}>1 year</Text>
              <Icon name="chevron-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const renderRecurrenceOption = (type: RecurrenceType, label: string) => (
    <List.Item
      title={label}
      onPress={() => {
        setRecurrenceType(type);
        if (type !== 'none') {
          if (type === 'daily') {
            setSelectedDays(weekDays);
          }
          setShowScheduleModal(true);
        }
      }}
      right={props => 
        type === recurrenceType ? (
          <Icon name="check" size={24} color="#2196F3" style={{ marginRight: 8 }} />
        ) : null
      }
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Recurrence" color="#fff" />
        <Appbar.Action icon="check" color="#fff" onPress={handleSave} />
      </Appbar.Header>

      <ScrollView>
        {renderRecurrenceOption('none', 'Does not repeat')}
        {renderRecurrenceOption('daily', 'Daily')}
        {renderRecurrenceOption('weekly', 'Weekly')}
        {renderRecurrenceOption('monthly', 'Monthly')}
        {renderRecurrenceOption('yearly', 'Yearly')}
      </ScrollView>

      <Portal>
        <Modal
          visible={showScheduleModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowScheduleModal(false)}
        >
          <View style={styles.modalContainer}>
            <Surface style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.scheduleTitle}>Schedule</Text>
                <TouchableOpacity 
                  onPress={() => {
                    setShowScheduleModal(false);
                  }}
                >
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>

              {renderScheduleContent()}

              <Text style={styles.helperText}>
                {getHelperText()}
              </Text>
            </Surface>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2196F3',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  cancelButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  doneButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  frequencyLabel: {
    fontSize: 16,
    marginRight: 12,
  },
  frequencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  frequencyText: {
    fontSize: 16,
    marginRight: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayText: {
    color: '#fff',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

