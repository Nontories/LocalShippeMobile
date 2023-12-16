import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal, ScrollView } from "react-native";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Dropdown = ({ isVisible, dropdownList, setValue, setIsVisible }) => {

    return (
        isVisible &&
        <View style={styles.filterContainer}>
            <TouchableOpacity
                style={styles.layout}
            />
            <ScrollView style={styles.dropdownContent}>
                {dropdownList?.map((item, key) => (
                    <TouchableOpacity
                        key={key}
                        onPress={() => {
                            setValue(item.value);
                            setIsVisible(false)
                        }}
                        style={styles.contentBox}
                    >
                        <Text style={styles.contentText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    layout: {
        position: "absolute",
        // top: -1,
        // bottom: -15,
        // right: 0,
        // left: 0,
        backgroundColor: "rgba(0,0,0,0.1)"
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
        height: HEIGHT * 0.2,
        right: 0,
        top: 40,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 50,
        elevation: 10,
        zIndex: 999,
    },
    contentBox: {
        width: WIDTH * 0.4,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.25)"
    },
    contentText: {
        padding: 10,
        fontSize: 15,
        textAlign: "center"
    }
});

export default Dropdown