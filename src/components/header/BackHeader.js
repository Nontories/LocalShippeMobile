import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform } from "react-native";

import Status from "../utils/Status";

import Back from "../../assets/Back.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const BackHeader = (route) => {
    return (
        <View
            style={{
                paddingTop: Platform.OS === 'ios' ? 50 : 0,
                backgroundColor: Platform.OS === 'ios' ? "black" : "white",
            }}
        >
            <View
                style={styles.container}
            >
                <TouchableOpacity
                    style={styles.sideButton}
                    onPress={() => {
                        // route.navigation.goBack()
                        
                        // console.log(route?.goback);
                        // console.log(route.navigation.goBack());
                        route?.goback ? route?.goback() : route?.navigation?.goBack()
                    }}
                >
                    <Image
                        // style={styles.locker}
                        source={Back}
                    />
                </TouchableOpacity>

                <View>
                    <Text style={styles.content}>
                        {route.content}
                    </Text>
                </View>

                <Status navigation={route?.navigation}/>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: WIDTH,
        height: HEIGHT * 0.1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
    },
    sideButton: {
        position: "absolute",
        height: HEIGHT * 0.08,
        width: WIDTH * 0.15,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        fontSize: 20,
        fontWeight: "600",
        color: "#72AFD3"
    }
});

export default BackHeader