import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal, ScrollView } from "react-native";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const CustomDropDown = ({ isVisible, dropdownList, setIsVisible }) => {

    return (
        isVisible &&
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.layout}
            />
            <ScrollView style={styles.dropdownContent}>
                {dropdownList?.map((item, key) => (
                    <TouchableOpacity
                        key={key}
                        onPress={() => {
                            item.action()
                            setIsVisible(false)
                        }}
                        style={styles.contentBox}
                    >
                        <Text style={styles.contentText}>{item.name}</Text>
                        <Image source={item?.image} style={styles.contentImage} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    toggleButton: {
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
        marginBottom: 50,
        elevation: 10,
        zIndex: 999,
    },
    contentBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: WIDTH * 0.4,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.25)"
    },
    contentText: {
        padding: 10,
        fontSize: 15,
        textAlign: "center"
    },
    contentImage: {
        width: 25,
        height: 25,
    }
});

export default CustomDropDown