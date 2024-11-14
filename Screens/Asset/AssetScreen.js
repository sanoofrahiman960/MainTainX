import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

export default function AssetScreen() {
    return (
        <View style={styles.container}>
            {/* Content for Assets tab */}
            <View style={styles.emptyState}>
                <Icon name="folder-outline" size={80} color="#007bff" />
                <Text style={styles.emptyTitle}>How can we break it if we don’t know what it is?</Text>
                <Text style={styles.emptySubtitle}>Start adding the Assets you’re in charge of maintaining</Text>
                <TouchableOpacity>
                    <Text style={styles.learnMore}>Learn More</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.newAssetButton}>
                <Text style={styles.newAssetText}>+ New Asset</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyState: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#007bff',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
        marginTop: 10,
    },
    learnMore: {
        fontSize: 16,
        color: '#007bff',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    newAssetButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        marginTop: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    newAssetText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});