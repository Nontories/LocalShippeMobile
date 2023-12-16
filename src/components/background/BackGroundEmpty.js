import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";

import emptyOrder from "../../assets/emptyOrder.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const BackGroundEmpty = () => {

    return (
        <View style={styles.backGround}>
            <Image
                source={emptyOrder}
                style={styles.image}
            />
            <Text style={styles.text}>Không có đơn hàng nào hiện tại</Text>
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

export default BackGroundEmpty