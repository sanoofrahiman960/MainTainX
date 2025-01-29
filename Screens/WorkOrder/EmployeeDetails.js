import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Title, Avatar, Text, Divider } from 'react-native-paper';

const EmployeeDetails = ({ route }) => {
  const { employees } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>Assigned Employees ({employees?.length || 0})</Title>
        {employees?.map((employee, index) => (
          <React.Fragment key={employee.id}>
            <View style={styles.employeeItem}>
              <Avatar.Text
                size={40}
                label={employee.name.substring(0, 2).toUpperCase()}
                style={styles.avatar}
              />
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{employee.name}</Text>
                {employee.emp_pass && (
                  <Text style={styles.employeeId}>ID: {employee.emp_pass}</Text>
                )}
              </View>
            </View>
            {index < employees.length - 1 && <Divider style={styles.divider} />}
          </React.Fragment>
        ))}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    padding: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    backgroundColor: '#3e85f7',
  },
  employeeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  employeeId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginHorizontal: 16,
  },
});

export default EmployeeDetails;