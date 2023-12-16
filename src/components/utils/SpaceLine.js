import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";

const WIDTH = Dimensions.get("window").width

const SpaceLine = () => {
    return (
        <View style={styles.line}>
        </View>
    )
}

const styles = StyleSheet.create({
    line: {
        width: WIDTH,
        height: 5,
        backgroundColor: "#f5f5f5",
    }
});

export default SpaceLine