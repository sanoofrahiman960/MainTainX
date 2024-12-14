import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import * as asyncCache from '../../Util/Storage';
import { authenticate, searchEmployee } from '../API';

const LoginMasterScreen = ({ navigation, route }) => {
  const { serverUrl } = route.params;
  const [db, setDb] = useState('zamcodev-odoo-staging-16677381');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!db || !username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/web/session/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            db,
            login: username,
            password,
          },
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        Alert.alert('Error', data.error.data.message || 'Authentication failed');
        return;
      }

      if (data.result) {
        // Store session token
        await asyncCache.storeData('ACCESS_TOKEN', data.result.ocn_token_key);
        
        // Search for employee details
        const empResponse = await fetch(`${serverUrl}/web/dataset/call_kw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `X-OpenERP=${data.result.ocn_token_key}`,
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            params: {
              model: 'hr.employee',
              method: 'search_read',
              args: [],
              kwargs: {
                fields: [
                  'work_email',
                  'emp_pass',
                  'name',
                  'employee_as_technician'
                ],
                domain: [['work_email', '=', username]],
              },
            },
          }),
        });

        const empData = await empResponse.json();
        
        if (empData.error) {
          Alert.alert('Error', empData.error.data.message || 'Failed to fetch employee data');
          return;
        }

        if (empData.result && empData.result.length > 0) {
          // Store employee data
          await asyncCache.storeObjectData('EMPLOYEE_DATA', empData.result[0]);
          navigation.navigate('SignIn');
        } else {
          Alert.alert('Error', 'Employee not found');
        }
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred while logging in. Please check your server URL and credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>{serverUrl}</Text>
          
          <View style={styles.pickerContainer}>
            <Icon name="database" size={24} color="#4A90E2" style={styles.icon} />
            <Picker
              selectedValue={db}
              style={styles.picker}
              onValueChange={(itemValue) => setDb(itemValue)}
            >
              <Picker.Item 
                key="zamcodev-odoo-staging-16677381"
                label="zamcodev-odoo-staging-16677381"
                value="zamcodev-odoo-staging-16677381"
              />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="user" size={24} color="#4A90E2" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#95A5A6"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color="#4A90E2" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#95A5A6"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#4A90E2" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2C3E50',
  },
  picker: {
    flex: 1,
    height: 50,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginMasterScreen;
