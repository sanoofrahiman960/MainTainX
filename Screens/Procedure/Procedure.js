import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { Header, Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import ProcedureOptionsSheet from './ProcedureOptionsSheet';
import FieldTypesSheet from './FieldTypesSheet';
import ProcedureField from './ProcedureField';

const Procedure = () => {
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const [isFieldTypesVisible, setIsFieldTypesVisible] = useState(false);
    const [fields, setFields] = useState([]);
    const navigation = useNavigation();

    const handleOptionSelect = (option) => {
        setIsBottomSheetVisible(false);
        // Handle different options
        switch (option) {
            case 'quick':
                // Handle quick create
                break;
            case 'library':
                // Handle library selection
                break;
            case 'blank':
                // Handle blank procedure
                break;
        }
    };

    const handleFieldTypeSelect = (fieldType) => {
        setIsFieldTypesVisible(false);
        setFields([...fields, fieldType]);
    };

    const handleDeleteField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const handleAddHeading = () => {
        const headingField = {
            id: Date.now().toString(),
            type: 'Heading',
            icon: 'title',
            description: 'Add a heading with customizable size (H1-H6)'
        };
        setFields([...fields, headingField]);
    };

    const handleAddSection = () => {
        const sectionField = {
            id: Date.now().toString(),
            type: 'Section',
            icon: 'view-list',
            description: 'Add a section with title and description'
        };
        setFields([...fields, sectionField]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header
                leftComponent={<Button title="Cancel" type="clear" onPress={() => navigation.goBack()} />}
                centerComponent={{ text: 'Create a Procedure', style: { fontSize: 18, fontWeight: 'bold' } }}
                rightComponent={
                    <Button
                        icon={<Icon name="add" color="#007AFF" />}
                        type="clear"
                        onPress={() => setIsBottomSheetVisible(true)}
                    />
                }
            />

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Enter Procedure Name</Text>
                <TextInput
                    placeholder="Procedure Name"
                    style={{
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        padding: 8,
                        marginVertical: 10,
                    }}
                />

                {fields.map((field, index) => (
                    <ProcedureField
                        key={index}
                        type={field}
                        onDelete={() => handleDeleteField(index)}
                    />
                ))}
            </ScrollView>

            {/* Bottom buttons */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: '#E0E0E0',
            }}>
                <Button
                    onPress={() => setIsFieldTypesVisible(true)}
                    title="Add Field"
                    icon={<Icon name="add" size={18} color="white" />}
                />
                <Button
                    title="Add Heading"
                    icon={<Icon name="title" size={18} color="white" />}
                    onPress={handleAddHeading}
                />
                <Button
                    title="Add Section"
                    icon={<Icon name="view-list" size={18} color="white" />}
                    onPress={handleAddSection}
                />
                <Button
                    title="Add Template"
                    icon={<Icon name="file-download" size={18} color="white" />}
                />
            </View>

            <ProcedureOptionsSheet
                isVisible={isBottomSheetVisible}
                onClose={() => setIsBottomSheetVisible(false)}
                onOptionSelect={handleOptionSelect}
            />

            <FieldTypesSheet
                isVisible={isFieldTypesVisible}
                onClose={() => setIsFieldTypesVisible(false)}
                onSelectFieldType={handleFieldTypeSelect}
            />
        </SafeAreaView>
    );
};

export default Procedure;
