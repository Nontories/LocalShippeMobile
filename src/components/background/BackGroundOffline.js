import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";

import BackGroundImage from "../../assets/BackGroundOffline.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const BackGroundOffline = () => {

    return (
        <View source={BackGroundImage} resizeMode="cover" style={styles.backGround}>
            <Image
                source={BackGroundImage}
                style={styles.image}
            />
            <Text style={styles.text}>Tài khoản đang ngoại tuyến</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    backGround: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: "cover",
        width: WIDTH * 0.15,
        height: WIDTH * 0.15,
    },
    text:{
        opacity: 0.6,
        fontWeight: "300"
    }
});

export default BackGroundOffline