import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useSelector, useDispatch } from 'react-redux';
import store from './Store';
import { checkAuth } from './redux/reducers/authReducer';

import SignIn from './Screens/Authentication/SignIn';
import SignUp from './Screens/Authentication/SignUp';
import AddAsset from './Screens/Asset/AddAsset';
import Navigation from './Navigation/Navigation';
// Import other screens as needed

const Stack = createStackNavigator();



const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

// const App = () => {
//   const [selectedOption, setSelectedOption] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);

//   // Dropdown options
//   const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

//   // Handle option selection
//   const handleSelectOption = (option) => {
//     setSelectedOption(option);
//     setModalVisible(false); // Close the modal after selection
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Select an option:</Text>

//       {/* Button to open the dropdown */}
//       <TouchableOpacity
//         style={styles.dropdownButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.dropdownButtonText}>
//           {selectedOption || 'Select an option'}
//         </Text>
//         <Icon name="chevron-down" size={20} color="#fff" />
//       </TouchableOpacity>

//       {/* Modal for dropdown options */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           onPress={() => setModalVisible(false)} // Close modal if tapped outside
//         >
//           <View style={styles.modalContent}>
//             {options.map((option, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.optionButton}
//                 onPress={() => handleSelectOption(option)}
//               >
//                 <Text style={styles.optionText}>{option}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       <Text style={styles.selectedOptionText}>
//         Selected: {selectedOption || 'None'}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f4f4f4',
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 12,
//     fontWeight: '600',
//   },
//   dropdownButton: {
//     width: 250,
//     padding: 15,
//     backgroundColor: '#007BFF',
//     borderRadius: 8,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     elevation: 3, // Adds shadow for Android
//     shadowColor: '#000', // Adds shadow for iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   dropdownButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//   },
//   modalContent: {
//     width: 250,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 10,
//     alignItems: 'flex-start',
//     elevation: 5, // Adds shadow for modal
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },
//   optionButton: {
//     width: '100%',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     backgroundColor: '#fff',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   selectedOptionText: {
//     fontSize: 16,
//     marginTop: 20,
//     fontWeight: '400',
//   },
// });

// export default App;
