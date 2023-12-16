import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";

import { RouteStatus, RouteStatusText } from "../../constrant/RouteStatus"
import { getKeyByValue } from "../../util/util"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const RouteStatusBar = (route) => {

    const status = route.status

    const getColor = (status) => {
        switch (status) {
            case RouteStatus.IDLE:
                return "#19779B"
            // case RouteStatus.ASSIGNING:
            //     return "rgba( 114, 175, 211, 0.85)"
            case RouteStatus.COMPLETED:
                return "#37ECBA"
            case RouteStatus.DELETED:
                return "#F24444"
            case RouteStatus.INPROGESS:
                return "#55B3D9"
            default:
                return "#ffffff"
        }
    }

    return (
        <View style={{ ...styles.container, backgroundColor: getColor(status)}}>
            <Text style={styles.text}>
                {RouteStatusText[getKeyByValue(RouteStatus, status)]}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 7,
        marginVertical: 5,
        // marginHorizontal: 10,
    },
    text: {
        fontSize: 15,
        color: "white",
        fontWeight: "400",
    }
});

export default RouteStatusBar