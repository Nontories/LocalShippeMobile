import React, { useState, useEffect, useContext, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Dimensions, ScrollView } from "react-native";

import { UserContext } from "../../context/UserContext";

import { changeRouteStatus } from "../../api/route";
import { ChangeShipperStatus, ShipperByAcountId } from "../../api/shipper";

import { RouteStatus, RouteStatusText } from "../../constrant/RouteStatus";

import rocket from "../../assets/rocket.png"

import RouteStatusBar from "./RouteStatusBar";
import CustomToast from "../utils/CustomToast";
import { ShipperStatus } from "../../constrant/ShipperStatus";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const RouteTab = ({ routes, setRoutes, data, store, navigation }) => {

    const showToast = CustomToast();

    // showToast("Error", "Register Failed", "error");
    const { user, token, updateUser } = useContext(UserContext);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDate = `${day} Th${date.getMonth() + 1}, ${hours}:${minutes} ${ampm}`;

        return formattedDate;
    }
    const routeStart = async () => {
        if (user?.status == ShipperStatus.Online) {
            const response = await changeRouteStatus(data, RouteStatus.INPROGESS, token)
            if (response.status === 200) {
                const res = await ShipperByAcountId(user?.accountId, token);
                console.log("change to INPROGESS");
                const index = routes.findIndex((item) => item.id === data?.id);
                let routeList = [...routes]
                routeList[index].status = RouteStatus.INPROGESS
                setRoutes(routeList)
                await changeStatus(ShipperStatus.Delivering)

                await updateUser({ ...res.data[0], status: ShipperStatus.Delivering })
            } else {
                console.log("error : ", response);
            }
        } else {
            showToast("Thông Báo", "Hãy hoàn thành đơn hàng hoặc lộ trình đang giao", "warning");
        }
    }

    const routeContinue = async () => {
        const response = await changeRouteStatus(data, RouteStatus.INPROGESS, token)
        const index = routes.findIndex((item) => item.id === data?.id);
        let routeList = [...routes]
        routeList[index].status = RouteStatus.INPROGESS
        if (response.status === 200) {
            console.log("change to INPROGESS");
            setRoutes(routeList)
        } else {
            console.log("error : ", response);
        }
    }

    const changeStatus = async (status) => {
        const response = await ChangeShipperStatus(user?.id, status, token)
        if (response?.status === 200) {
            updateUser({ ...user, status: status })
        }
    }

    return (
        <View>
            <TouchableOpacity style={styles.routeContainer}
                onPress={() => {
                    navigation.navigate("RouteDetail", { data: data })
                }}
            >
                <View style={styles.routeHeader}>
                    <RouteStatusBar status={data?.status} />
                    <View style={styles.headerDetail}>
                        <Text style={styles.price}>{data?.name}</Text>
                        <View style={styles.packageCount}>
                            <Text style={{ opacity: 0.5 }}>số gói hàng: </Text>
                            <Text style={styles.countNumber}>
                                {data?.quantity ? data?.quantity : 0}
                            </Text>
                        </View>

                    </View>
                    <Image
                        style={styles.rocket}
                        source={rocket}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.routeContent}>
                    {/* <Text style={styles.batchName}>
                        {data?.name}
                    </Text> */}

                    <View style={styles.detail}>
                        <View style={styles.circle} />
                        <Text style={styles.text}> {data?.fromStation} </Text>
                        <View style={styles.dashLine} />
                        <Text style={styles.date}>
                            {formatDate(data?.createdDate)}
                        </Text>
                    </View>
                    <View style={styles.detail}>
                        <View style={styles.smallCircle} />
                        {data?.quantity > 1 ?
                            <Text style={styles.station}> + {data?.quantity - 1}</Text>
                            :
                            ""
                        }
                        <View style={styles.dashLine} />
                    </View>
                    <View style={styles.detail}>
                        <View style={styles.circle} />
                        <Text style={styles.text}>{data?.toStation}</Text>
                        <Text style={styles.date}>
                            {formatDate(data?.eta)}
                        </Text>
                    </View>

                    {/* <Image
                        style={styles.arrow}
                        source={statusArrow}
                    /> */}
                </View>
            </TouchableOpacity>
            <View style={styles.tabBottom}>
                {data.status === RouteStatus.IDLE &&
                    <TouchableOpacity
                        style={{ ...styles.orderTabButton, backgroundColor: "rgba(43, 155, 25, 0.65)" }}
                        onPress={() => {
                            routeStart()
                            // if (data?.quantity < 1) {
                            //     showToast("Thông Báo", "Chưa có đơn hàng nào trong lộ trình", "warning");
                            // } else {
                            //     routeStart()
                            // }
                        }}
                    >
                        <Text style={styles.tabButtonText}>
                            Bắt đầu
                        </Text>
                    </TouchableOpacity>
                }
                {data.status === RouteStatus.INPROGESS ?
                    <TouchableOpacity
                        style={styles.orderTabButton}
                        onPress={() => {
                            navigation.navigate("RouteDetail", { data: data })
                        }}
                    >
                        <Text style={styles.tabButtonText}>
                            Tiếp Tục
                        </Text>
                    </TouchableOpacity>
                    :
                    ""
                }
            </View>
            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={isDetailVisible}
            >
                <RouteDetailModal
                    data={data}
                    store={store}
                    closeModal={() => { setIsDetailVisible(false) }}
                    navigation={navigation} />
            </Modal> */}
        </View>

    )
}

const styles = StyleSheet.create({
    routeContainer: {
        position: "relative",
        width: WIDTH * 0.9,
        padding: 10,
        backgroundColor: "white",
        marginHorizontal: WIDTH * 0.05,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: -1, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    routeHeader: {
        position: "relative",
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
        // color: "#72AFD3",
        fontWeight: "500",
        fontSize: 14,
        marginBottom: 2
        ,
    },
    packageCount: {
        flexDirection: "row",
    },
    countText: {
        opacity: 0.4
    },
    countNumber: {
        opacity: 1,
        fontWeight: "600",
    },
    routeContent: {
        width: WIDTH * 0.65,
        marginTop: WIDTH * 0.02,
    },
    batchName: {
        marginVertical: 5,
        fontWeight: "700",
    },
    detail: {
        position: "relative",
        flexDirection: "row",
        // alignItems: "center",
        marginBottom: 8,
    },
    dashLine: {
        width: 1.3,
        position: "absolute",
        top: 14,
        bottom: -10,
        left: 5.2,
        backgroundColor: "#72AFD3",
        borderRadius: 15,
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
    smallCircle: {
        width: 8,
        height: 8,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: "#72AFD3",
        transform: [{ translateX: 2 }],
        marginRight: 13,
    },
    arrow: {
        position: "absolute",
        width: 20,
        height: 20,
        right: 0,
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
    routeTabButton: {
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
    text: {
        fontSize: 12,
        width: WIDTH * 0.4
    },
    date: {
        fontSize: 12,
        marginLeft: 15,
    },
    rocket: {
        position: "absolute",
        width: WIDTH * 0.07,
        left: 0,
        bottom: -40
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

});

export default RouteTab