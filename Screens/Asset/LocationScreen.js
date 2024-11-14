import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function LocationScreen() {
    return (
        <View style={styles.container}>
            {/* Content for Locations tab */}
            <Text style={styles.emptyTitle}>No locations found.</Text>
            <Text style={styles.emptySubtitle}>Start adding locations you're in charge of.</Text>
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
