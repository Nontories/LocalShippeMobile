import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";

import { UserContext } from '../../context/UserContext';

import { ChangeShipperStatus } from "../../api/shipper";

import statusArrow from "../../assets/status_arrow.png"
import rocket from "../../assets/rocket.png"

import OrderStatusBar from "./OrderStatusBar";
import CustomToast from "../../components/utils/CustomToast";

import { OrderStatus } from "../../constrant/OrderStatus";
import { District } from "../../constrant/District";
import { ShipperStatus } from "../../constrant/ShipperStatus";

import { findObjectByValue, formatPrice } from "../../util/util"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const EditOrderRouteTab = (route) => {

    let order = route?.order
    const editable = route?.editable
    const navigation = route?.navigation
    const onPress = route?.handleOnPress
    const { user, updateUser, token } = useContext(UserContext);
    const showToast = CustomToast();

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDate = `${day} Th${date.getMonth() + 1}, ${hours}:${minutes} ${ampm}`;

        return formattedDate;
    }

    return (
        <View>
            <TouchableOpacity
                style={[
                    styles.orderContainer,
                    {
                        marginBottom: (order.status === OrderStatus.WAITING || order.status === OrderStatus.ASSIGNING) ? 0 : 15,
                        zIndex: editable ? 10 : 1
                    }
                ]}
                onPress={() => {
                    onPress(order.id)
                }}
                activeOpacity={1}
            >
                <View style={styles.orderHeader}>
                    <OrderStatusBar status={order.status} />

                    <View style={styles.headerDetail}>
                        <Text style={styles.price}>
                            <Text
                                style={{
                                    opacity: 0.5,
                                    fontSize: 13,
                                    fontWeight: "300",
                                    color: "rgba(0, 0, 0, 0.45)"
                                }}
                            >{order?.distance}km </Text>
                            - đ {formatPrice(order?.totalPrice ? order?.totalPrice : 0)}
                        </Text>
                        <View style={styles.orderCount}>
                            <Text style={styles.countNumber}>
                                #{order?.trackingNumber}
                            </Text>
                        </View>
                    </View>

                </View>
                <View style={styles.orderContent}>
                    <View style={{ position: "relative" }}>
                        <Text style={styles.batchName}>
                            {/* {order?.action?.actionType} */}
                            Siêu Tốc
                        </Text>
                        <Image
                            style={styles.rocket}
                            source={rocket}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.detail}>
                        <View style={styles.circle} />
                        <Text style={styles.storeName}> {order?.store?.storeName} </Text>
                        <Text style={styles.date}> {formatDate(order?.createTime)} </Text>
                        <Text style={styles.dashLine}>|</Text>
                    </View>
                    <View style={styles.detail}>
                        <View style={styles.continueLine} />
                        <Text style={{ ...styles.address, transform: [{ translateX: 22 }] }}> {order?.store?.storeAddress} </Text>
                        <Text style={styles.dashLine}>|</Text>
                    </View>
                    <View style={styles.detail}>
                        <View style={styles.emptyCircle} />
                        <Text style={styles.address}>{order?.customerCommune}, {findObjectByValue(District, order?.customerDistrict)?.name}, TP.{order?.customerCity}</Text>
                    </View>

                    {
                        order.status == OrderStatus.ACCEPTED || order.status == OrderStatus.INPROCESS ?
                            <Image
                                style={styles.arrow}
                                source={statusArrow}
                            />
                            :
                            ""
                    }

                </View>
            </TouchableOpacity>

            {
                order.status === OrderStatus.WAITING || order.status === OrderStatus.ASSIGNING ?
                    <View style={styles.tabBottom}>
                        {order.status === OrderStatus.WAITING &&
                            <TouchableOpacity
                                style={{ ...styles.orderTabButton, backgroundColor: "#F24444" }}
                                onPress={() => {
                                    // navigation.navigate("OrderDetail", { order: order })
                                    showToast("Thông Báo", "Đang Sửa Chữa", "warning");
                                }}
                            >
                                <Text style={styles.tabButtonText}>
                                    Từ chối
                                </Text>
                            </TouchableOpacity>
                        }
                        {order.status === OrderStatus.ASSIGNING || order.status === OrderStatus.WAITING ?
                            <TouchableOpacity
                                style={styles.orderTabButton}
                                onPress={() => {
                                    // navigation.navigate("OrderDetail", { order: order })
                                    showToast("Thông Báo", "Đang Sửa Chữa", "warning");
                                }}
                            >
                                <Text style={styles.tabButtonText}>
                                    Nhận Đơn
                                </Text>
                            </TouchableOpacity>
                            :
                            ""
                        }
                    </View>
                    :
                    ""
            }


        </View>

    )
}

const styles = StyleSheet.create({
    orderContainer: {
        position: "relative",
        width: WIDTH * 0.9,
        padding: 10,
        backgroundColor: "white",
        marginHorizontal: WIDTH * 0.05,
        flexWrap: "wrap",
        alignItems: "center",
        // elevation: 1,
        zIndex: 1,

        shadowColor: '#000',
        shadowOffset: { width: -1, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    orderHeader: {
        width: WIDTH * 0.85,
        flexDirection: "row",
        justifyContent: "space-between",
        // alignItems: ""
    },
    headerDetail: {
        // flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        marginRight: 5,
    },
    price: {
        color: "#72AFD3",
        fontWeight: "500",
        fontSize: 15,
    },
    packageCount: {
        flexDirection: "row",
    },
    countText: {
        opacity: 0.4
    },
    countNumber: {
        // opacity: 0.65,
        fontWeight: "600",
        color: "rgba(21, 36, 45, 0.67)"
    },
    orderContent: {
        width: WIDTH * 0.65
    },
    batchName: {
        marginVertical: 5,
        fontWeight: "700",
    },
    detail: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    continueLine: {
        width: 1.3,
        position: "absolute",
        top: 0,
        bottom: -5,
        left: 5.1,
        backgroundColor: "#72AFD3",
        borderRadius: 15,
    },
    dashLine: {
        width: 1.3,
        position: "absolute",
        top: 15,
        bottom: -10,
        left: 5.2,
        backgroundColor: "#72AFD3",
        borderRadius: 15,
    },
    storeName: {
        width: WIDTH * 0.37,
        fontSize: 12,
        fontWeight: "700"
    },
    date: {
        position: "absolute",
        right: 0,
        fontSize: 12,
        transform: [{ translateX: 20 }]
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 10,
        backgroundColor: "#72AFD3",
        marginRight: 10,
    },
    emptyCircle: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#72AFD3",
        marginRight: 10,
        marginVertical: 2,
    },
    arrow: {
        position: "absolute",
        width: 20,
        height: 20,
        right: 5,
        bottom: WIDTH * 0.12,
        transform: [{ translateX: 40 }]
    },
    tabBottom: {
        width: WIDTH * 0.9,
        backgroundColor: "white",
        paddingVertical: 10,
        marginHorizontal: WIDTH * 0.05,
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    orderTabButton: {
        padding: 7,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: "#72AFD3"
    },
    tabButtonText: {
        textTransform: "uppercase",
        color: "white"
    },
    orderCount: {
        flexDirection: "row",
    },
    countText: {
        opacity: 0.4
    },
    address: {
        fontSize: 12
    },
    rocket: {
        position: "absolute",
        width: WIDTH * 0.07,
        left: -(WIDTH * 0.1),
        bottom: -10
    }
});

export default EditOrderRouteTab