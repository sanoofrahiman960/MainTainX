import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { signOut } from '../../redux/reducers/authReducer';
import { useSelector, useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding on each side, 16px gap

export default function LandingScreen() {
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.navigate('Tabs');
    }, 200);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim]);

  const handleAccount = () => {
    dispatch(signOut())
      .unwrap()
      .then((message) => {
        console.log('SignOut Success:', message);
        navigation.navigate('SignIn');
      })
      .catch((error) => {
        console.error('SignOut Error:', error);
      });
  };
    
  const CreateOption = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.createOption} onPress={onPress}>
      <View style={styles.createIconContainer}>
        <Icon name={icon} size={24} color="#007AFF" />
      </View>
      <Text style={styles.createOptionLabel}>{label}</Text>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  const actionButtons = [
    { id: 1, title: 'Due Today', icon: 'clock-outline', color: '#4CAF50' },
    { id: 2, title: 'Add', icon: 'plus', color: '#2196F3' },
    { id: 3, title: 'Scan Code', icon: 'qrcode', color: '#FF9800' },
    { id: 4, title: 'Support', icon: 'help-circle-outline', color: '#9C27B0' },
  ];

  const statusCards = [
    { id: 1, title: 'High Priority', icon: 'alert-circle-outline', count: 3, color: '#F44336' },
    { id: 2, title: 'Overdue', icon: 'clock-outline', count: 0, color: '#FF9800' },
    { id: 3, title: 'Pending Approval', icon: 'alert-circle-outline', count: 5, color: '#4CAF50' },
    { id: 4, title: 'Completed', icon: 'check-circle-outline', count: 12, color: '#2196F3' },
  ];

  const renderActionButton = ({ title, icon, color }) => (
    <TouchableOpacity
      style={styles.actionButton}
      key={title}
      onPress={() => {
        if (title === 'Scan Code') {
          console.log('Scan Code pressed');
        } else if (title === 'Add') {
          setModalVisible(true);
        } else if (title === 'Due Today') {
          console.log('Due Today pressed');
        } else if (title === 'Support') {
          console.log('Support pressed');
        }
      }}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderStatusCard = ({ title, icon, count, color }) => (
    <TouchableOpacity
      style={[styles.statusCard, { width: cardWidth }]}
      key={title}
      onPress={() => {
        console.log(`${title} card pressed`);
      }}
    >
      <View style={[styles.statusCardIcon, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.statusCount}>{count}</Text>
      <Text style={styles.statusTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.name}>{user ? user.name : 'Guest'}</Text>
            <TouchableOpacity onPress={handleAccount} style={styles.accountButton}>
              <Icon name="account" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.welcome}>
            <Text style={styles.organisation}>Welcome to Organisation Name</Text>
          </View>

          <View style={styles.actionButtonsContainer}>
            {actionButtons.map(renderActionButton)}
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>WORK ORDERS STATUS</Text>
            <View style={styles.statusCardsContainer}>
              {statusCards.map(renderStatusCard)}
            </View>
          </View>

          <View style={styles.todoSection}>
            <Text style={styles.sectionTitle}>TODOLIST</Text>
            <View style={styles.todoCard}>
              <View style={styles.todoAssigned}>
                <View style={styles.avatarPlaceholder}>
                  <Icon name="account" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.todoAssignedText}>Assigned To Me (1)</Text>
              </View>
              <View style={styles.todoItem}>
                <Text style={styles.todoTitle}>Maintenance Check</Text>
                <Text style={styles.todoId}>#1</Text>
                <View style={styles.todoStatus}>
                  <Text style={styles.todoStatusText}>In Progress</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>What would you like to Create?</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <CreateOption
              icon="clipboard-text"
              label="Work Order"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('WorkOrderAdd');
              }}
            />
            <CreateOption
              icon="file-document"
              label="Procedure"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Procedure');
              }}
            />
            <CreateOption
              icon="cube"
              label="Asset"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Asset');
              }}
            />
            <CreateOption
              icon="map-marker"
              label="Location"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Location');
              }}
            />
            <CreateOption
              icon="cog"
              label="Part"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Parts');
              }}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  accountButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 8,
  },
  welcome: {
    marginBottom: 24,
  },
  organisation: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    width: 80,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statusSection: {
    marginBottom: 24,
  },
  statusCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  todoSection: {
    marginBottom: 24,
  },
  todoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoAssigned: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: '#2196F3',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  todoAssignedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  todoItem: {
    marginTop: 8,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  todoId: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  todoStatus: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  todoStatusText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  createOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  createIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  createOptionLabel: {
    flex: 1,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

