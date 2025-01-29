import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, Appbar, IconButton } from 'react-native-paper';
import { getData, getObjectData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';

const ViewAttachments = ({ route, navigation }) => {
  const { workOrderId } = route.params;
  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAttachments = async () => {
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
            model: "ir.attachment",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["name", "datas", "id", "mimetype"],
              domain: [["document_maintenance_id", "=", workOrderId]]
            }
          }
        })
      });
      const data = await response.json();
      if (data?.result) {
        setAttachments(data.result);
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    Alert.alert(
      "Delete Attachment",
      "Are you sure you want to delete this attachment?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
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
                    model: "ir.attachment",
                    method: "unlink",
                    args: [[attachmentId]],
                    kwargs: {}
                  }
                })
              });
              const data = await response.json();
              if (data.result) {
                fetchAttachments();
              }
            } catch (error) {
              console.error('Error deleting attachment:', error);
              Alert.alert('Error', 'Failed to delete attachment');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  useEffect(() => {
    fetchAttachments();
  }, [workOrderId]);

  const isPDF = (attachment) => {
    return attachment.mimetype === 'application/pdf';
  };

  const handleAttachmentPress = (attachment) => {
    if (isPDF(attachment)) {
      navigation.navigate('PDFViewer', {
        pdfData: attachment.datas,
        fileName: attachment.name
      });
    } else {
      setSelectedImage(attachment);
      setModalVisible(true);
    }
  };

  const renderThumbnail = (attachment) => {
    if (isPDF(attachment)) {
      return (
        <View style={styles.pdfThumbnail}>
          <IconButton icon="file" size={40} iconColor="#FF0000" />
          <Text style={styles.pdfLabel}>PDF</Text>
        </View>
      );
    }
    return (
      <Image
        source={{ uri: `data:image/jpeg;base64,${attachment.datas}` }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3e85f7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="All Attachments" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {attachments.map((attachment, index) => (
            <View key={index} style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.imageWrapper}
                onPress={() => handleAttachmentPress(attachment)}
              >
                {renderThumbnail(attachment)}
                <IconButton
                  icon="delete"
                  size={20}
                  iconColor="#fff"
                  style={styles.deleteIcon}
                  onPress={() => handleDelete(attachment.id)}
                />
              </TouchableOpacity>
              <Text style={styles.imageName} numberOfLines={1}>
                {attachment.name}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          {selectedImage?.datas && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${selectedImage.datas}` }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  imageContainer: {
    width: (windowWidth - 32) / 3,
    margin: 4,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  pdfThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#FF0000',
  },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 0,
  },
  imageName: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default ViewAttachments;
