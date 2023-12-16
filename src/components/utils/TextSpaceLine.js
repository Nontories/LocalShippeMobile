import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const TextSpaceLine = (route) => {

    const text = route.content

    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <View style={styles.textView}>
                <Text style={styles.text}>{text}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: WIDTH * 0.65,
        // height: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: HEIGHT * 0.03,
    },
    line: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: "rgba( 0, 0, 0, 0.3)",
    },
    textView:{
        backgroundColor: "white", 
    },
    text: {
        opacity: 0.5,
        fontWeight: "500",
        fontSize: 15,
        paddingHorizontal:15,
        backgroundColor: "white",
    }
});

export default TextSpaceLine