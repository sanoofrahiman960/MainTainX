import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';
import Toast from 'react-native-simple-toast';

const AddPartQuantity = ({ route, navigation }) => {
    const { workOrderId } = route.params;
    const [quantities, setQuantities] = useState({});
    const [productModalVisible, setProductModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productList, setProductList] = useState([]);
    const [addedParts, setAddedParts] = useState([]);
    const [existingParts, setExistingParts] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchExistingParts();
    }, []);

    const fetchProducts = async () => {
        try {
            const Token = await getData("ACCESS_TOKEN");
            const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `X-OpenERP=${Token}`,
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    params: {
                        model: "product.product",
                        method: "search_read",
                        args: [],
                        kwargs: {
                            fields: ["name", "free_qty", "default_code","list_price"],
                            domain: [["is_spare_part", "=", true]]
                        }
                    },
                }),
            });
            const data = await response.json();
            if (data.result) {
                setProductList(data.result);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            Toast.show('Error fetching products');
        }
    };

    const fetchExistingParts = async () => {
        try {
            const Token = await getData("ACCESS_TOKEN");
            const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `X-OpenERP=${Token}`,
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    params: {
                        model: "leap.maintenance.part",
                        method: "search_read",
                        args: [[["maintenance_request_id", "=", workOrderId]]],
                        kwargs: {
                            fields: ["product_id", "qty_estimated","amount"],
                        }
                    }
                }),
            });
            
            const data = await response.json();
            console.log(data,"existing parts")
            if (data.result) {
                setExistingParts(data.result);
            }
        } catch (err) {
            console.error('Error fetching existing parts:', err);
            Toast.show('Error fetching existing parts');
        }
    };

    const handleAddPart = async () => {
        if (!selectedProduct) {
            Alert.alert('Error', 'Please select a product');
            return;
        }

        const quantity = quantities[selectedProduct.id];
        if (!quantity || Number(quantity) <= 0) {
            Alert.alert('Error', 'Please enter a valid quantity');
            return;
        }

        if (Number(quantity) > selectedProduct.free_qty) {
            Alert.alert('Error', 'Quantity exceeds available stock');
            return;
        }

        try {
            const Token = await getData("ACCESS_TOKEN");
            const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `X-OpenERP=${Token}`,
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    params: {
                        model: "leap.maintenance.part",
                        method: "create",
                        args: [{
                            maintenance_request_id: workOrderId,
                            product_id: selectedProduct.id,
                            qty_estimated: Number(quantity)
                        }],
                        kwargs: {}
                    },
                }),
            });
            
            const data = await response.json();
            if (data.result) {
                const newPart = {
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    quantity: Number(quantity),
                    default_code: selectedProduct.default_code,
                    unit_price: selectedProduct.standard_price || 0,
                    total_price: (selectedProduct.standard_price || 0) * Number(quantity)
                };

                setAddedParts(prev => [newPart, ...prev]);
                setQuantities({ ...quantities, [selectedProduct.id]: '' });
                setSelectedProduct(null);
                fetchExistingParts(); // Refresh the list after adding
                Toast.show('Part added successfully');
            } else {
                Toast.show('Error adding part');
            }
        } catch (err) {
            console.error('Error adding part:', err);
            Toast.show('Error adding part');
        }
    };

    const handleDelete = async (partId) => {
        Alert.alert(
            'Delete Part',
            'Are you sure you want to delete this part?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const Token = await getData('ACCESS_TOKEN');
                            const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Cookie': `X-OpenERP=${Token}`,
                                },
                                body: JSON.stringify({
                                    jsonrpc: '2.0',
                                    params: {
                                        model: "leap.maintenance.part",
                                        method: 'unlink',
                                        args: [[partId]],
                                        kwargs: {}
                                    }
                                })
                            });

                            const data = await response.json();
                            if (data.result) {
                                fetchExistingParts(); // Refresh the list after deletion
                                Toast.show('Part deleted successfully');
                            } else {
                                Toast.show('Error deleting part');
                            }
                        } catch (err) {
                            console.error('Error deleting part:', err);
                            Toast.show('Error deleting part');
                        }
                    }
                }
            ]
        );
    };

    const renderProductItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.productItem}
            onPress={() => {
                setSelectedProduct(item);
                setProductModalVisible(false);
            }}
        >
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCode}>{item.default_code}</Text>
            </View>
            <Text style={styles.priceText}>₹{item.list_price.toFixed(2)}</Text>
            <Text style={styles.stockInfo}>Stock: {item.free_qty}</Text>
        </TouchableOpacity>
    );

    const renderAddedPart = ({ item }) => (
        <View style={styles.addedPartItem}>
            <View style={styles.partInfo}>
                <Text style={styles.partName}>{item.name}</Text>
                <Text style={styles.partCode}>{item.default_code}</Text>
                <View style={styles.partDetails}>
                    <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
                    <Text style={styles.priceText}>₹{item.amount}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
            >
                <Icon name="delete" size={24} color="#ff4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => setProductModalVisible(true)}
            >
                <Icon name="package-variant" size={24} color="#3e85f7" />
                <Text style={styles.selectButtonText}>
                    {selectedProduct ? selectedProduct.name : 'Select Product'}
                </Text>
            </TouchableOpacity>

            {selectedProduct && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.quantityInput}
                        placeholder="Enter quantity"
                        keyboardType="numeric"
                        value={quantities[selectedProduct.id] || ''}
                        onChangeText={(text) => 
                            setQuantities(prev => ({ ...prev, [selectedProduct.id]: text }))
                        }
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddPart}
                    >
                        <Text style={styles.addButtonText}>Add Part</Text>
                    </TouchableOpacity>
                </View>
            )}

            {addedParts.length > 0 && (
                <FlatList
                    data={addedParts}
                    renderItem={renderAddedPart}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    style={styles.partsList}
                />
            )}

            <View style={styles.existingPartsContainer}>
                <Text style={styles.sectionTitle}>Added Parts</Text>
                <FlatList
                    data={existingParts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.existingPartItem}>
                            <View style={styles.partContent}>
                                <Text style={styles.partText}>Product: {item.product_id[1]}</Text>
                                <Text style={styles.partText}>Quantity: {item.qty_estimated}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Icon name="delete" size={24} color="#ff4444" />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No parts added yet</Text>
                    }
                />
            </View>

            <Modal
                visible={productModalVisible}
                animationType="slide"
                onRequestClose={() => setProductModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Product</Text>
                        <TouchableOpacity onPress={() => setProductModalVisible(false)}>
                            <Icon name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={productList}
                        renderItem={renderProductItem}
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
    },
    selectButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16
    },
    quantityInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16
    },
    addButton: {
        backgroundColor: '#3e85f7',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center'
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500'
    },
    partsList: {
        flex: 1
    },
    addedPartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8
    },
    partInfo: {
        flex: 1
    },
    partName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    partCode: {
        fontSize: 14,
        color: '#666',
        marginTop: 4
    },
    partDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8
    },
    quantityText: {
        fontSize: 14,
        color: '#666'
    },
    priceText: {
        fontSize: 14,
        color: '#3e85f7',
        fontWeight: '500'
    },
    deleteButton: {
        padding: 8
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600'
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    productInfo: {
        flex: 1
    },
    productName: {
        fontSize: 16,
        fontWeight: '500'
    },
    productCode: {
        fontSize: 14,
        color: '#666',
        marginTop: 4
    },
    stockInfo: {
        fontSize: 14,
        color: '#3e85f7'
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8
    },
    existingPartsContainer: {
        marginTop: 16,
        flex: 1
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8
    },
    existingPartItem: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    partContent: {
        flex: 1
    },
    partText: {
        fontSize: 16,
        marginBottom: 4
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 16
    }
});

export default AddPartQuantity;
