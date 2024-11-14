import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { Header, Button, Icon, SpeedDial } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
const Procedure = () => {
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <Header
                leftComponent={<Button title="Cancel" type="clear" />}
                centerComponent={{ text: 'Create a Procedure', style: { fontSize: 18, fontWeight: 'bold' } }}
                rightComponent={<Button title="Done" type="clear" />}
            />

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Procedure Name */}
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

                {/* Section Example */}
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Section #1</Text>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        padding: 16,
                        marginTop: 10,
                        borderRadius: 8,
                    }}
                >
                    <TextInput placeholder="Field" style={{ borderBottomWidth: 1, padding: 8, marginBottom: 10 }} />
                    <TextInput placeholder="Text will be entered here" style={{ padding: 8 }} />
                </View>
            </ScrollView>

            {/* Speed Dial for Adding Fields */}
            {/* <SpeedDial style={{ marginVertical: 30 }}
                isOpen={open}
                icon={{ name: 'add', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
            >
                <SpeedDial.Action
                    icon={{ name: 'check-box', color: '#fff' }}
                    title="Checkbox"
                    onPress={() => console.log('Checkbox added')}
                />
                <SpeedDial.Action
                    icon={{ name: 'text-fields', color: '#fff' }}
                    title="Text Field"
                    onPress={() => console.log('Text Field added')}
                />
                <SpeedDial.Action
                    icon={{ name: 'add-circle-outline', color: '#fff' }}
                    title="Number Field"
                    onPress={() => console.log('Number Field added')}
                />
                {/* Add more actions as needed */}
            {/* </SpeedDial> */}

            {/* Bottom Action Buttons */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingVertical: 16,
                    borderTopWidth: 1,
                    borderColor: '#ddd',
                }}
            >
                <Button onPress={() => { navigation.navigate('Options') }} title="Add Field" icon={<Icon name="add" size={18} color="white" />} />
                <Button title="Add Heading" icon={<Icon name="title" size={18} color="white" />} />
                <Button title="Add Section" icon={<Icon name="view-list" size={18} color="white" />} />
                <Button title="Add Template" icon={<Icon name="file-download" size={18} color="white" />} />
            </View>
        </SafeAreaView>
    );
};

export default Procedure;
