import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, Dimensions, TextInput } from 'react-native';

const WIDTH = Dimensions.get("window").width

const InputModal = ({ isVisible, onCancel, onSubmit, title, name}) => {

    const [input, setInput] = useState("")

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
        >
            <View style={{ flex: 1, position: "relative", justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={onCancel}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    }}
                    activeOpacity={1}
                />
                <View style={{ width: WIDTH * 0.8, backgroundColor: 'white', padding: 20, paddingBottom: 10, borderRadius: 10 }}>
                    <Text style={{ marginBottom: 10, opacity: 1,fontWeight: "600" }}>{title}</Text>
                    <TextInput
                        onChangeText={setInput}
                        value={input}
                        style={{
                            width: WIDTH * 0.7,
                            height: 50,
                            padding: 5,
                            borderWidth:1,
                            borderColor: "#72AFD3",
                            borderRadius: 5,
                            marginTop: 5,
                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                        <TouchableOpacity onPress={()=>{onSubmit(input, name)}} style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: "600", color: "#72AFD3" }}>Xác Nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default InputModal;
