import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Modal } from "react-native";

import { InteractOrder } from "../../api/shipper";

import { UserContext } from "../../context/UserContext";

import Icon from "../../assets/Icon.png"
import Location from "../../assets/Location.png"
import statusArrow from "../../assets/status_arrow.png"
import rocket from "../../assets/rocket.png"

import OrderStatusBar from "./OrderStatusBar";
import CustomToast from "../../components/utils/CustomToast";

import { OrderStatus } from "../../constrant/OrderStatus";
import { District } from "../../constrant/District";

import { findObjectByValue, formatPrice } from "../../util/util"

import close from "../../assets/close.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const choices = [
    'Vấn đề về phương tiện giao hàng',
    'Giao hàng quá xa',
    'Không có thông tin đầy đủ về đơn hàng',
    'điều kiện thời tiết xấu',
    // 'Người nhận hẹn ngày giao',
    // 'Người nhận đổi địa chỉ giao hàng',
    // 'Không được kiểm/thử hàng',
    // 'Hàng hóa không như người nhận yêu cầu',
    // 'Sai tiền thu hộ COD',
    // 'Người nhận đổi ý',
    // 'Người nhận không đặt hàng, đơn trùng',
    // 'Hàng hóa hư hỏng',
];

const OrderTab = (route) => {

    let order = route.order
    const navigation = route.navigation
    const [visible, setVisible] = useState(false)
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(0)
    const { user, token, updateUser } = useContext(UserContext);
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

    const handleOnPress = (order) => {
        if (order.status == OrderStatus.ACCEPTED || order.status == OrderStatus.INPROCESS) {
            navigation.navigate("OrderDetail", { order: order })
        }
    }

    const acceptOrder = async () => {
        const data = {
            id: order?.id,
            shipperId: user?.id,
            status: OrderStatus.ACCEPTED,
        }

        const index = route.orders.findIndex((item) => item.id === order?.id);
        const response = await InteractOrder(data, token);
        let orderList = [...route.orders]
        orderList[index].status = OrderStatus.ACCEPTED
        if (response?.status === 200) {
            route.setOrders(orderList)
        } else {
            console.log("get order fail");
        }
    }

    const refuseOrder = async (reason) => {
        const data = {
            id: order?.id,
            shipperId: user?.id,
            status: OrderStatus.CANCELLED,
            cancelReason: reason,
        }

        const index = route.orders.findIndex((item) => item.id === order?.id);
        const response = await InteractOrder(data, token);
        let orderList = [...route.orders]
        orderList[index].status = OrderStatus.CANCELLED
        if (response.status === 200) {
            route.setOrders(orderList)
        } else {
            console.log("cancle order fail");
        }
    }

    const handleSubmitRejectReason = async () => {
        console.log('Selected choice:', choices[selectedChoiceIndex]);
        await refuseOrder(choices[selectedChoiceIndex])
        setSelectedChoiceIndex(0);
        setVisible(false);
    };

    const RejectReason = ({ item, index }) => {
        const isSelected = selectedChoiceIndex === index;
        return (
            <TouchableOpacity
                onPress={() => handleChoiceSelect(index)}
                style={styles.choiceItem}
            >
                <View style={[styles.emptyCircle, isSelected && styles.circle]} />
                <Text style={isSelected ? styles.selectedChoiceText : styles.choiceText}>{item}</Text>
            </TouchableOpacity>
        );
    };

    const handleChoiceSelect = (choice) => {
        setSelectedChoiceIndex(choice);
    };

    return (
        <View>
            <TouchableOpacity
                style={[
                    styles.orderContainer,
                    {
                        marginBottom: (order.status === OrderStatus.WAITING || order.status === OrderStatus.ASSIGNING) ? 0 : 15,
                    }
                ]}
                onPress={() => {
                    handleOnPress(order)
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
                            <Text style={styles.codValue}>
                                {order?.cod ? formatPrice(order?.cod) : 0}đ -
                            </Text>
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
                    <View style={{ ...styles.detail, paddingTop: 10 }}>
                        <View style={styles.emptyCircle} />
                        <Text style={styles.address}>{order?.customerCommune}, {order?.customerDistrict}, TP.{order?.customerCity}</Text>
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
                                    // refuseOrder()
                                    setVisible(true)
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
                                    acceptOrder()
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

            <Modal
                transparent={true}
                animationType="slide"
                visible={visible}
                onRequestClose={() => { setSelectedChoiceIndex(null), setVisible(false) }}
            >
                <View style={styles.layout}>

                </View>
                <View style={styles.modal}>
                    <View>
                        <View style={{ ...styles.modalHeader, paddingTop: 30 }}>
                            <TouchableOpacity
                                onPress={() => { setVisible(false) }}
                                style={styles.closeButton}
                            >
                                <Image
                                    source={close}
                                />
                            </TouchableOpacity>
                            <Text style={{ ...styles.boldText, transform: [{ translateX: -15 }] }}>Hãy nhập lý không nhận đơn hàng này</Text>
                        </View>
                        <ScrollView style={styles.choiceList}>
                            {
                                choices.map((item, index) => {
                                    return (
                                        <RejectReason item={item} index={index} key={index} />
                                    )
                                })
                            }
                        </ScrollView>
                        <TouchableOpacity onPress={handleSubmitRejectReason} style={styles.modalButton}>
                            <Text style={{ textTransform: "uppercase", fontSize: 18, color: "white" }} >XÁC NHẬN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View >

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
        // borderTopLeftRadius: 8,
        // borderTopRightRadius: 8,
        zIndex: 1,

        shadowColor: '#000',
        shadowOffset: { width: -1, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        // elevation: 10,
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
        fontSize: 14,
        marginBottom: 2
    },
    packageCount: {
        flexDirection: "row",
    },
    countText: {
        opacity: 0.4
    },
    codValue: {
        color: "#72AFD3"
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
        // alignItems: "center",
        marginBottom: 8,
    },
    continueLine: {
        width: 1.3,
        position: "absolute",
        top: 0,
        bottom: -15,
        left: 5.1,
        backgroundColor: "#72AFD3",
        borderRadius: 15,
    },
    dashLine: {
        width: 1.3,
        position: "absolute",
        top: 15,
        bottom: -8,
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
    },

    modal: {
        width: WIDTH * 0.8,
        backgroundColor: "white",
        padding: 10,
        paddingBottom: 0,
        borderRadius: 10,
        marginHorizontal: WIDTH * 0.1,
        marginVertical: HEIGHT * 0.3,
    },
    layout: {
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalHeader: {
        position: "relative",
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-around",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
    },
    choiceList: {
        height: HEIGHT * 0.2
    },
    modalButton: {
        alignItems: "center",
        width: WIDTH * 0.5,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: WIDTH * 0.14,
        marginVertical: 20,
        backgroundColor: "#72AFD3",
    },
    choiceItem: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        alignItems: "center",
    },
    choiceText: {
        width: WIDTH * 0.7,
        fontSize: 16,
    },
    selectedChoiceText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderTab