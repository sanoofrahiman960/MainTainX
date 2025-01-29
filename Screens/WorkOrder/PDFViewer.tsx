import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Appbar } from 'react-native-paper';
import Pdf from 'react-native-pdf';

const PDFViewer = ({ route, navigation }) => {
  const { pdfData, fileName } = route.params;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={fileName || 'PDF Viewer'} />
      </Appbar.Header>
      <View style={styles.pdfContainer}>
        <Pdf
          source={{
            uri: `data:application/pdf;base64,${pdfData}`,
          }}
          style={styles.pdf}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          enablePaging={true}
          horizontal={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default PDFViewer;
