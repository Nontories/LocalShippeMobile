import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";

import { OrderStatus, OrderStatusText } from "../../constrant/OrderStatus"
import { getKeyByValue } from "../../util/util"

import Icon from "../../assets/Icon.png"
import Location from "../../assets/Location.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const OrderStatusBar = (route) => {

    const status = route.status

    const getColor = (status) => {
        switch (status) {
            case OrderStatus.ACCEPTED:
                return "#19779B"
            case OrderStatus.ASSIGNING:
                return "rgba( 114, 175, 211, 0.85)"
            case OrderStatus.CANCELLED:
                return "#F24444"
            case OrderStatus.COMPLETED:
                return "#37ECBA"
            case OrderStatus.DELETED:
                return "#F24444"
            case OrderStatus.IDLE:
                return "rgba( 114, 175, 211, 0.85)"
            case OrderStatus.INPROCESS:
                return "#55B3D9"
            case OrderStatus.WAITING:
                return "rgba( 114, 175, 211, 0.85)"
            case OrderStatus.RETURN:
                return "#F24444"

            default:
                return "#ffffff"
        }
    }

    return (
        <View style={{ ...styles.container, backgroundColor: getColor(status) }}>
            <Text style={styles.text}>
                {OrderStatusText[getKeyByValue(OrderStatus, status)]}
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

export default OrderStatusBar