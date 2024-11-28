import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Searchbar, FAB, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

export default function AddCategories() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const categories = useSelector(state => state.assets.category);
//   console.log('categories1111',categories)

  useEffect(() => {
    if (route.params?.selectedCategories) {
      setSelectedCategories(route.params.selectedCategories);
    }
  }, [route.params?.selectedCategories]);

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    navigation.navigate('WorkOrderAdd', { selectedCategories });
  };

  const handleCreateCategory = () => {
    // Handle create category action
  };

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories(prevSelected => 
      prevSelected.includes(categoryId)
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Categories</Text>
        <TouchableOpacity onPress={handleDone}>
          <Text style={styles.doneButton}>DONE</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#757575"
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Categories List */}
      <ScrollView style={styles.scrollView}>
        {filteredCategories?.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => toggleCategorySelection(category.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.backgroundColor }]}>
              <Icon name={category.icon} size={24} color={category.color} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Checkbox
              status={selectedCategories.includes(category.id) ? 'checked' : 'unchecked'}
              onPress={() => toggleCategorySelection(category.id)}
              color="#2196F3"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Create Category FAB */}
      <FAB
        icon="plus"
        label="Create Category"
        onPress={handleCreateCategory}
        style={styles.fab}
        color="#2196F3"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
  },
  doneButton: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#2196F3',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  searchInput: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
});

