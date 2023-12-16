import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal } from "react-native";

import filterIcon from "../assets/filter.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Filter = (route) => {

    const content = route?.content

    return (
        <View style={styles.filterContainer}>
            {route?.dropdown && (
                <View style={styles.dropdownContent}>
                    {content.map((item) => (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => {
                                route?.setFilterValue(item.value);
                            }}
                            style={styles.contentBox}
                        >
                            <Text style={styles.contentText}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <TouchableOpacity onPress={() => { route?.setDropdown() }} style={styles.toggleButton}>
                <Image
                    style={styles.toggleButtonText}
                    source={filterIcon}
                />
            </TouchableOpacity>


        </View>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        position: "relative",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    toggleButton: {
        // position: "absolute",
        // right: 0,
        // top: 0,
        padding: 9,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.25)"
    },
    toggleButtonText: {
        width: 25,
        height: 25,
    },
    dropdownContent: {
        position: "absolute",
        right: 0,
        top: 40,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginTop: 10,
        elevation: 10,
        zIndex: 999,
    },
    contentBox:{
        width: WIDTH * 0.4,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.25)"
    },
    contentText :{
        fontSize: 15,
        textAlign: "center"
    }
});

export default Filter