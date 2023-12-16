import React from 'react';
import { View, Modal, Text, TouchableOpacity, Dimensions } from 'react-native';

const WIDTH = Dimensions.get("window").width

const ComfirmModal = ({ isVisible, onCancel, onSubmit, content }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
        <View style={{ width: WIDTH * 0.65,backgroundColor: 'white', padding: 20, paddingBottom: 10, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Xác Nhận</Text>
          <Text style={{ marginTop: 10, opacity: 0.6 }}>{content}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
            <TouchableOpacity onPress={onCancel} style={{ margin: 10 }}>
              <Text style={{ color: "#72AFD3" }}>Chưa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit} style={{ margin: 10 }}>
              <Text style={{ color: "#72AFD3" }}>Xác Nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ComfirmModal;
