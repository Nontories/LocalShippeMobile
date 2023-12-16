import React, { useEffect, useState } from 'react';
import { View, Image, Modal, Text, TouchableOpacity, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const ImagePickupModal = ({ isVisible, onCancel, onSubmit, image, setImage }) => {

    const [submiting, setSubmiting] = useState(true)

    useEffect(() => {
        setSubmiting(true)
    }, [isVisible])

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
            // const base64String = await dataURItoBlob(result.assets[0].uri);
            // setImage(base64String);
            setImage(result.assets[0].uri);
        }
    }

    const handleSubmit = async () => {
        setSubmiting(false)
        await onSubmit()
        setSubmiting(true)
    }

    // const pickImage = async () => {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.All,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });

    //     console.log(result);

    //     if (!result.canceled) {
    //         setImage(result.assets[0].uri);
    //     }
    // };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                <View style={{ width: WIDTH * 0.9, backgroundColor: 'white', padding: 20, paddingBottom: 10, borderRadius: 10 }}>
                    {
                        image ?
                            <>
                                <Image source={{ uri: image }} style={{ width: WIDTH * 0.8, height: HEIGHT * 0.5 }} resizeMode='cover' />
                                <TouchableOpacity
                                    onPress={openCamera}
                                    style={{ justifyContent: "center", alignItems: "center", backgroundColor: "lightblue", padding: 10, marginTop: 10 }}
                                >
                                    <Text style={{ color: "white" }}>Chụp ảnh khác</Text>
                                </TouchableOpacity>
                            </>

                            :
                            submiting &&
                            <TouchableOpacity
                                onPress={openCamera}
                                style={{ justifyContent: "center", alignItems: "center", backgroundColor: "lightblue", padding: 10 }}
                            >
                                <Text style={{ color: "white" }}>Chụp ảnh</Text>
                            </TouchableOpacity>
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                        {
                            submiting &&
                            <>
                                <TouchableOpacity onPress={onCancel} style={{ margin: 10 }}>
                                    <Text style={{ color: "#72AFD3" }}>Huỷ</Text>
                                </TouchableOpacity>
                                {
                                    image &&
                                    <TouchableOpacity onPress={handleSubmit} style={{ margin: 10 }}>
                                        <Text style={{ color: "#72AFD3" }}>Xác Nhận</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ImagePickupModal;
