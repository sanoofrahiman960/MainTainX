import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator,
    Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import {
    addPartQuantity,
    updatePartQuantity,
    removePartQuantity
} from '../../redux/slices/partQuantitySlice';
import { getData, getObjectData, storeData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';
import { isCacheValid, CACHE_KEYS } from '../../Util/Cache';

const AddExpense = ({ route, navigation }) => {
    const { workOrderId, selectedPart } = route.params;
    const [descriptions, setDescriptions] = useState({});
    const [amounts, setAmounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [productModalVisible, setProductModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productList, setProductList] = useState([]);
    const [addedExpenses, setAddedExpenses] = useState([]);
    const [existingExpenses, setExistingExpenses] = useState([]);
    const [deletedTimestamps, setDeletedTimestamps] = useState({});
    const dispatch = useDispatch();
    const [EmployeeData, SetEmployeeData] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchExistingExpenses();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
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
                        "model": "product.product",
                        "method": "search_read",
                        "args": [],
                        "kwargs": {
                            "fields": ["name", "free_qty", "default_code", "list_price"],
                            "domain": [["is_spare_part", "=", true]]
                        }
                    },
                }),
            });
            const data = await response.json();
            if (data.result) {
                setProductList(data.result);
            } else {
                setError('No products found');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingExpenses = async () => {
        try {
            const cachedData = await getObjectData(CACHE_KEYS.expenses(workOrderId));
            if (cachedData && isCacheValid(cachedData.timestamp)) {
                setExistingExpenses(cachedData.data);
                return;
            }

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
                        model: "hr.expense",
                        method: "search_read",
                        args: [],
                        kwargs: {
                            fields: ["name", "employee_id", "total_amount_currency", "product_id", "create_date"],
                            domain: [["maintenance_id", "=", workOrderId]]
                        }
                    },
                }),
            });
            const data = await response.json();
            if (data.result) {
                setExistingExpenses(data.result);
                await storeData(CACHE_KEYS.expenses(workOrderId), {
                    data: data.result,
                    timestamp: Date.now()
                });
            }
        } catch (err) {
            console.error('Error fetching existing expenses:', err);
        }
    };

    const handleAddPart = async (part) => {
        const description = descriptions[part.id];
        const amount = amounts[part.id];

        if (!description || !description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            const token = await getData('ACCESS_TOKEN');
            const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `X-OpenERP=${token}`,
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    params: {
                        model: "hr.expense",
                        method: "create",
                        args: [{
                            product_id: part.id,
                            name: description,
                            total_amount_currency: Number(amount),
                            employee_id: EmployeeData?.id,
                            payment_mode: "own_account",
                            account_id: 91,
                            company_id: 1,
                            maintenance_id: workOrderId
                        }],
                        kwargs: {}
                    }
                })
            });

            const data = await response.json();
            if (data.result) {
                // Add to local list of expenses
                const newExpense = {
                    id: data.result,
                    product_id: [part.id, part.name],
                    name: description,
                    total_amount_currency: Number(amount),
                    create_date: new Date().toISOString()
                };

                setExistingExpenses(prev => [newExpense, ...prev]);
                
                // Clear inputs
                setDescriptions(prev => ({ ...prev, [part.id]: '' }));
                setAmounts(prev => ({ ...prev, [part.id]: '' }));
                setSelectedProduct(null);
                setProductModalVisible(false);

                // Update cache
                const cachedExpenses = await getObjectData(CACHE_KEYS.expenses(workOrderId));
                await storeData(CACHE_KEYS.expenses(workOrderId), {
                    data: cachedExpenses ? [newExpense, ...cachedExpenses.data] : [newExpense],
                    timestamp: Date.now()
                });

                Toast.show('Expense added successfully');
            } else {
                throw new Error('Failed to add expense');
            }
        } catch (error) {
            setError(error.message);
            Alert.alert('Error', 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (expenseId) => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
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
                                        model: 'hr.expense',
                                        method: 'unlink',
                                        args: [[expenseId]],
                                        kwargs: {}
                                    }
                                })
                            });
                            const result = await response.json();
                            if (result.result) {
                                // Remove from local state
                                setAddedExpenses(prev => prev.filter(expense => expense.id !== expenseId));
                                Toast.show('Expense deleted successfully');
                            }
                        } catch (error) {
                            console.error('Error deleting expense:', error);
                            Alert.alert('Error', 'Failed to delete expense');
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteExisting = async (expenseId) => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
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
                                        model: 'hr.expense',
                                        method: 'unlink',
                                        args: [[expenseId]],
                                        kwargs: {}
                                    }
                                })
                            });
                            const result = await response.json();
                            if (result.result) {
                                setDeletedTimestamps(prev => ({
                                    ...prev,
                                    [expenseId]: new Date().toISOString()
                                }));
                                setExistingExpenses(prev => 
                                    prev.filter(expense => expense.id !== expenseId)
                                );
                                Toast.show('Expense deleted successfully');
                            }
                        } catch (error) {
                            console.error('Error deleting expense:', error);
                            Alert.alert('Error', 'Failed to delete expense');
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
            <View style={styles.productItemContent}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCode}>Code: {item.default_code}</Text>
                <Text style={styles.productPrice}>Price: ${item.list_price}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
    );

    const renderExpenseItem = ({ item }) => (
        <View style={styles.expenseItem}>
            <View style={styles.expenseHeader}>
                <Text style={styles.expenseName}>{item.product_name}</Text>
                <View style={styles.expenseActions}>
                    <Text style={styles.expenseAmount}>${item.amount}</Text>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Icon name="delete" size={24} color="#ff4444" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.expenseDescription}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>

            <TouchableOpacity 
                    style={styles.selectProductButton}
                    onPress={() => setProductModalVisible(true)}
                >
                    <Icon name="package-variant" size={24} color="#3e85f7" />
                    <Text style={styles.selectProductText}>
                        {selectedProduct ? selectedProduct.name : 'Select Product'}
                    </Text>
                </TouchableOpacity>
                {/* Existing Expenses List */}
                {existingExpenses.length > 0 && (
                    <View style={styles.expensesList}>
                        <Text style={styles.expensesTitle}>Existing Expenses</Text>
                        <FlatList
                            data={existingExpenses}
                            renderItem={({ item }) => (
                                <View style={styles.expenseItem}>
                                    <View style={styles.expenseHeader}>
                                        <Text style={styles.expenseName}>{item.product_id[1]}</Text>
                                        <View style={styles.expenseActions}>
                                            <Text style={styles.expenseAmount}>
                                                ${item.total_amount_currency}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => handleDeleteExisting(item.id)}
                                            >
                                                <Icon name="delete" size={24} color="#ff4444" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text style={styles.expenseDescription}>{item.name}</Text>
                                    <Text style={styles.expenseDate}>
                                        Created: {new Date(item.create_date).toLocaleString()}
                                    </Text>
                                    {deletedTimestamps[item.id] && (
                                        <Text style={styles.deletedTime}>
                                            Deleted: {new Date(deletedTimestamps[item.id]).toLocaleString()}
                                        </Text>
                                    )}
                                </View>
                            )}
                            keyExtractor={item => item.id.toString()}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                )}

                {/* Product Selection Button */}
              

                {/* Input Fields */}
                {selectedProduct && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Enter description"
                            value={descriptions[selectedProduct.id] || ''}
                            onChangeText={(text) => 
                                setDescriptions(prev => ({ ...prev, [selectedProduct.id]: text }))
                            }
                            multiline
                        />

                        <TextInput
                            style={styles.amountInput}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={amounts[selectedProduct.id] || ''}
                            onChangeText={(text) => 
                                setAmounts(prev => ({ ...prev, [selectedProduct.id]: text }))
                            }
                        />

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleAddPart(selectedProduct)}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.addButtonText}>Add Expense</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Added Expenses List */}
                {addedExpenses.length > 0 && (
                    <View style={styles.expensesList}>
                        <Text style={styles.expensesTitle}>Added Expenses</Text>
                        <FlatList
                            data={addedExpenses}
                            renderItem={renderExpenseItem}
                            keyExtractor={item => item.id.toString()}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                )}

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            {/* Product Selection Modal */}
            <Modal
                visible={productModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setProductModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Product</Text>
                            <TouchableOpacity 
                                onPress={() => setProductModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={productList}
                            renderItem={renderProductItem}
                            keyExtractor={item => item.id.toString()}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        flex: 1,
        padding: 16
    },
    selectProductButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
    },
    selectProductText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
        flex: 1
    },
    inputContainer: {
        marginBottom: 16
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        minHeight: 60,
        fontSize: 16
    },
    amountInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16
    },
    addButton: {
        backgroundColor: '#3e85f7',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center'
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80%'
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1
    },
    closeButton: {
        padding: 4
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff'
    },
    productItemContent: {
        flex: 1
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    productCode: {
        fontSize: 14,
        color: '#666',
        marginTop: 4
    },
    productPrice: {
        fontSize: 14,
        color: '#3e85f7',
        marginTop: 4
    },
    expensesList: {
        marginTop: 24
    },
    expensesTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12
    },
    expenseItem: {
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8
    },
    expenseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    expenseActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    expenseName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    expenseAmount: {
        fontSize: 16,
        color: '#3e85f7',
        fontWeight: '600'
    },
    expenseDescription: {
        fontSize: 14,
        color: '#666'
    },
    deleteButton: {
        padding: 4
    },
    separator: {
        height: 1,
        backgroundColor: '#eee'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 8
    },
    expenseDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 4
    },
    deletedTime: {
        fontSize: 12,
        color: '#ff4444',
        fontStyle: 'italic',
        marginTop: 4
    },
});

export default AddExpense;
