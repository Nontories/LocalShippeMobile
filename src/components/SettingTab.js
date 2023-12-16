import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";

import arrow from "../assets/arrow.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const SettingTab = (route) => {

    const name = route.name
    const action = route.action
    const image = route.img

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.tabContainer}
                onPress={action}
            >
                <View style={styles.tab}>
                    <View style={styles.tabLeft}>
                        <Image
                            style={styles.image}
                            source={image}
                        />
                        <Text style={styles.name}>
                            {name}
                        </Text>
                    </View>
                    <Image
                        style={styles.arrow}
                        source={arrow}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT * 0.06,
        marginVertical: 5,
        // backgroundColor: "white",
    },
    tabContainer: {
        width: WIDTH,
        height: HEIGHT * 0.06,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    tab: {
        width: WIDTH * 0.95,
        height: HEIGHT * 0.06,
        paddingHorizontal: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: 15,
        backgroundColor: "white"
    },
    tabLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    image:{
        width: 30,
        height: 30,
    },
    name: {
        opacity: 0.7,
        fontSize: 18,
        fontWeight: "500",
        marginLeft: 10,
    },
    arrow: {
        width: 10,
        height: 20,
    }
});

export default SettingTab