import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";

import BackGroundImage from "../../assets/Intro_background.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const BackGround = () => {

    return (
        <ImageBackground source={BackGroundImage} resizeMode="cover" style={styles.backGround}>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backGround: {
        position: "absolute",
        top : 0,
        bottom: 0,
        right: 0,
        left: 0,
    }
});

export default BackGround