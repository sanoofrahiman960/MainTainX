import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Icon } from '@rneui/themed';

const fieldTypes = [
    { name: 'Checkbox', icon: 'check-box', iconColor: '#4CAF50' },
    { name: 'Text Field', icon: 'text-fields', iconColor: '#64B5F6' },
    { name: 'Number Field', icon: 'filter-9-plus', iconColor: '#FFB74D' },
    { name: 'Amount ($)', icon: 'attach-money', iconColor: '#E57373' },
    { name: 'Checklist', icon: 'checklist', iconColor: '#BA68C8' },
    { name: 'Multiple Choice', icon: 'radio-button-checked', iconColor: '#FF8A65' },
    { name: 'Inspection Check', icon: 'search', iconColor: '#4DD0E1' },
    { name: 'Yes, No, N/A', icon: 'check-circle', iconColor: '#FFD54F' },
    { name: 'Picture/File Field', icon: 'insert-photo', iconColor: '#81C784' },
];

const Options = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Field Details', { fieldType: item.name })}
            style={{ flexDirection: 'row', padding: 16, alignItems: 'center' }}
        >
            <Icon name={item.icon} color={item.iconColor} size={30} />
            <Text style={{ marginLeft: 16, fontSize: 16 }}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TextInput
                placeholder="Search"
                style={{
                    borderColor: '#ddd',
                    borderWidth: 1,
                    borderRadius: 8,
                    margin: 16,
                    padding: 8,
                }}
            />
            <FlatList
                data={fieldTypes}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
            />
        </SafeAreaView>
    );
};

export default Options;
