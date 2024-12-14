import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../../redux/reducers/authReducer';
import { BASE_URL } from '../../Util/Const';
import { getData } from '../../Util/Storage';
import * as asyncCache from '../../Util/Storage';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSignIn = async() => {
    const Token=await getData("ACCESS_TOKEN")
    const empResponse = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `X-OpenERP=${Token}`,
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
            domain: [['work_email', '=', email]],
          },
        },
      }),
    });
    const empData = await empResponse.json();
    if (empData.result && empData.result.length > 0) {
      console.log("empData.result[0]", empData.result[0])
      // Store employee data
      await asyncCache.storeData('EMPLOYEE_ID', empData.result[0].id);
      await asyncCache.storeData('EMPLOYEE_NAME', empData.result[0].name);
      await asyncCache.storeData('EMPLOYEE_EMAIL', empData.result[0].work_email);
      await asyncCache.storeData('IS_TECHNICIAN', empData.result[0].employee_as_technician);
      navigation.navigate('Main');
    } else {
      Alert.alert('Error', 'Employee not found');
    }
     
    if (empData.error) {
      Alert.alert('Error', empData.error.data.message || 'Failed to fetch employee data');
      return;
    }

   

    const employee = empData.result[0];

    if (employee.emp_pass !== password) {
      Alert.alert('Error', 'Invalid password');
      return;
    }
   
}
  

  
    


  return (
    <View style={styles.container}>
      <Title style={styles.title}>Sign In</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        mode="contained"
        onPress={handleSignIn}
        loading={isLoading}
        style={styles.button}
      >
        Sign In
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('SignUp')}
        style={styles.button}
      >
        Don't have an account? Sign Up
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default SignIn;