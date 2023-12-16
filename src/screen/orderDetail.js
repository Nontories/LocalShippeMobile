import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Modal } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { UserContext } from '../context/UserContext';

import { InteractOrder } from "../api/shipper"

import { OrderStatus, OrderStatusText } from "../constrant/OrderStatus"
import { Type } from "../constrant/Type"

import { formatPrice, findObjectByValue } from "../util/util"

import BackHeader from "../components/header/BackHeader";
import SpaceLine from "../components/utils/SpaceLine";
import ComfirmModal from "../components/utils/ComfirmModal";
import CustomToast from "../components/utils/CustomToast";

import locationIcon from "../assets/Location.png"
import close from "../assets/close.png"
import { ShipperStatus } from "../constrant/ShipperStatus";


const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const OrderDetail = ({ route, navigation }) => {

    const [order, setOrder] = useState("");
    const [nofication, setNofication] = useState("");
    const [buttonStatus, setButtonStatus] = useState(0);
    const [detail, setDetail] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    // const [loading, setLoading] = useState(true);
    const { user, token, updateUser } = useContext(UserContext);
    const showToast = CustomToast();

    const changeStatus = (status) => {
        const data = { ...user, status: status }
        updateUser(data)
    }

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleSubmit = () => {
        if (order?.status === OrderStatus.ASSIGNING || order?.status === OrderStatus.WAITING && buttonStatus === 1) {
            console.log(buttonStatus);
            acceptOrder()
        } else if (order?.status === OrderStatus.ACCEPTED) {
            pickupOrder()
            // navigation.navigate("Package", { batchId: order?.batches?.id })
        } else if (order?.status === OrderStatus.WAITING && buttonStatus === 0) {
            refuseOrder()
        }
        // Handle submit action
        setModalVisible(false);
    };

    useEffect(() => {
        setOrder(route.params.order);
    }, [route.params.order]);

    const filterStatus = (status) => {
        switch (status) {
            case OrderStatus.ASSIGNING:
                return (
                    <TouchableOpacity
                        onPress={() => {
                            setButtonStatus(1)
                            setNofication("Bạn xác nhận muốn nhân đơn hàng này ?")
                            setModalVisible(true)
                        }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>
                            Nhận Đơn
                        </Text>
                    </TouchableOpacity>
                )
            case OrderStatus.WAITING:
                return (
                    <>
                        <TouchableOpacity
                            onPress={() => {
                                setButtonStatus(1)
                                setNofication("Bạn xác nhận muốn nhân đơn hàng này ?")
                                setModalVisible(true)
                            }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                Nhận Đơn
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setButtonStatus(0)
                                setNofication("Bạn xác nhận muốn từ chối đơn hàng này ?")
                                setModalVisible(true)
                            }}
                            style={{ ...styles.button, backgroundColor: "#F24444" }}
                        >
                            <Text style={styles.buttonText}>
                                Từ chối
                            </Text>
                        </TouchableOpacity>
                    </>
                )
            case OrderStatus.ACCEPTED:
                return (
                    <TouchableOpacity
                        onPress={() => {
                            setButtonStatus(1)
                            setNofication("Bạn đã lấy hàng và sẵn sàng để đi giao hàng ?")
                            setModalVisible(true)
                        }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>
                            Tiếp Tục
                        </Text>
                    </TouchableOpacity>

                )
            default:
                break;
            // return (
            //     <TouchableOpacity
            //         onPress={() => {
            //             navigation.navigate("Package", { batchId: order?.batches?.id })
            //         }}
            //         style={styles.button}
            //     >
            //         <Text style={styles.buttonText}>
            //             Chi Tiết Đơn hàng
            //         </Text>
            //     </TouchableOpacity>
            // )
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDate = `${day} Th${date.getMonth() + 1}, ${hours}:${minutes} ${ampm}`;

        return formattedDate;
    }

    const acceptOrder = async () => {
        const data = {
            id: order?.id,
            shipperId: user?.id,
            status: OrderStatus.ACCEPTED,
        }
        console.log(data);
        const response = await InteractOrder(data, token);
        if (response.status === 200) {
            setOrder({ ...order, status: OrderStatus.ACCEPTED })
        } else {
            console.log("get order fail");
        }
    }

    const pickupOrder = async () => {
        const data = {
            id: order?.id,
            shipperId: user?.id,
            status: OrderStatus.INPROCESS,
        }
        const response = await InteractOrder(data, token);

        if (response.status === 200) {
            if (user?.status == ShipperStatus.Online) {
                changeStatus(OrderStatus.INPROCESS)
                setOrder({ ...order, status: OrderStatus.INPROCESS })
            } else if (order?.routeId) {
                showToast("Thông Báo", "Hãy hoàn thành đơn hàng hoặc lộ trình đang giao", "warning");
            }
        } else {
            console.log("pick up order fail");
        }
    }

    const refuseOrder = async () => {
        const data = {
            id: order?.id,
            shipperId: user?.id,
            status: OrderStatus.IDLE,
        }
        const response = await InteractOrder(data, token);
        console.log(response);
        if (response.status === 200) {
            setOrder({ ...order, status: OrderStatus.IDLE })
        } else {
            console.log("cancle order fail");
        }
    }

    return (
        <View style={styles.container}>
            <BackHeader content={order?.trackingNumber} navigation={navigation} />
            <ScrollView>
                <View style={styles.view}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.boldText}>
                                Nhận Tiền Mặt
                            </Text>
                            <Text style={styles.totalPrice}>
                                đ {formatPrice(order?.totalPrice || 0)}
                            </Text>
                            <View style={{ ...styles.flexHeader, marginTop: 10}}>
                                <Text style={styles.boldText}>
                                    Tổng COD cần ứng
                                </Text>
                                <Text style={styles.boldText}>
                                    {formatPrice(order?.subTotalprice || 0)} đ
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <SpaceLine />

                <View style={styles.view}>
                    <TouchableOpacity
                        onPress={() => {
                            setDetail(true)
                        }}
                        style={styles.orderDetail}
                    >
                        <Text style={styles.viewDetail}>
                            {"Xem Chi Tiết Giá >"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <SpaceLine />

                <View style={styles.view}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.timeText}>
                            Thời gian
                        </Text>
                        <Text style={styles.boldText}>
                            {formatDate(order?.createTime)}
                        </Text>
                    </View>
                </View>

                <SpaceLine />
                <SpaceLine />
                <SpaceLine />

                <View style={styles.view}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.bold}>
                            Dịch vụ
                        </Text>
                        <Text style={styles.boldText}>
                            Siêu tốc
                        </Text>
                    </View>
                </View>

                <SpaceLine />
                <SpaceLine />
                <SpaceLine />

                <View style={styles.view}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.bold}>
                            Khoảng cách
                        </Text>
                        <Text style={styles.boldText}>
                            {order?.distance} km
                        </Text>
                    </View>
                </View>

                <SpaceLine />
                <SpaceLine />
                <SpaceLine />

                <View style={styles.view}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.bold}>
                            Trọng lượng
                        </Text>
                        <Text style={styles.boldText}>
                            {order?.capacity}
                        </Text>
                    </View>
                </View>

                <SpaceLine />
                <SpaceLine />
                <SpaceLine />

                <View style={styles.view}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.bold}>
                            Loại hàng
                        </Text>
                        <Text style={styles.boldText}>
                            {findObjectByValue(Type ,order?.typeId)?.name}
                        </Text>
                    </View>
                </View>

                <SpaceLine />
                <SpaceLine />
                <SpaceLine />

                <View style={styles.view}>
                    <View style={styles.flexColumn}>
                        <Text style={{ ...styles.bold, color: "red" }}>
                            Lưu ý:
                        </Text>
                        <Text style={styles.boldText}>
                            {order?.orderTime ? order?.orderTime : "..."}
                            {/* Siêu tốc */}
                        </Text>
                    </View>
                </View>

                <SpaceLine />
                <SpaceLine />
                <SpaceLine />

                <View style={styles.view}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.bold}>
                            Khác
                        </Text>
                        <Text style={styles.boldText}>
                            {order?.other}
                        </Text>
                    </View>
                </View>

                <SpaceLine />
                <SpaceLine />
                <SpaceLine />
                <SpaceLine />
                <SpaceLine />
                <SpaceLine />
                <SpaceLine />

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("StoreInfor", { order: order })
                    }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        Tiếp Tục
                    </Text>
                </TouchableOpacity>
                {/* {filterStatus(order?.status)} */}

                <ComfirmModal
                    isVisible={modalVisible}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    content={nofication}
                />

                <Modal animationType="slide"
                    transparent={true}
                    visible={detail}
                // onRequestClose={onCancel}
                >
                    <TouchableOpacity
                        onPress={() => { setDetail(false) }}
                        style={styles.modalLayout}
                    />
                    <View style={styles.priceDetailModal}>
                        <View style={styles.priceDetail}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalHeaderText}>
                                    Chi tiết giá
                                </Text>
                                <TouchableOpacity
                                    onPress={() => { setDetail(false) }}
                                    style={styles.closeButton}
                                >
                                    <Image
                                        source={close}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalFlexColumn}>
                                <Text style={styles.modalColumnTitle}>Phí vận chuyển</Text>
                                <Text style={styles.modalColumnValue}>{formatPrice(order?.distancePrice)} đ</Text>
                            </View>
                            <View style={styles.modalFlexColumn}>
                                <Text style={styles.modalColumnTitle}>Phí phát sinh</Text>
                                <Text style={styles.modalColumnValue}>{formatPrice(order?.subtotalPrice)} đ</Text>
                            </View>
                            <View style={styles.modalFlexColumn}>
                                <Text style={styles.modalColumnTitle}>Tổng phí [A]</Text>
                                <Text style={styles.modalColumnValue}>{formatPrice(order?.distancePrice + order?.subtotalPrice)} đ</Text>
                            </View>
                            <View style={styles.modalFlexColumn}>
                                <Text style={styles.modalColumnTitle}>Thu hộ Cửa Hàng [B]</Text>
                                <Text style={styles.modalColumnValue}>package_price</Text>
                            </View>
                            <View style={styles.modalFlexColumn}>
                                <Text style={styles.modalColumnTitle}>Tổng cộng [A]+[B]</Text>
                                <Text style={styles.modalColumnValue}>A +B</Text>
                            </View>
                            <View style={styles.modalFlexColumn}>
                                <Text style={styles.modalColumnTitle}>Tiền thu hộ[C]</Text>
                                <Text style={styles.modalColumnValue}>hỏi C</Text>
                            </View>
                            <View style={styles.modalFlexColumn}>
                                <Text style={styles.modalColumnTitle}>Số tiền thực nhận[A] + [B] - [C]</Text>
                                <Text style={{ position: "absolute", top: 30, right: 0, fontSize: 18, fontWeight: "600" }}>A + B - C</Text>
                            </View>

                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5",

    },
    header: {
        width: WIDTH * 0.9,
        marginVertical: 10,
        justifyContent: "space-between",
    },
    boldText: {
        // fontWeight: "500",
        fontSize: 16,
    },
    totalPrice: {
        fontSize: 32,
        fontWeight: "500",
    },
    flexHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    orderDetail: {
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    viewDetail: {
        color: "#72AFD3",
        fontSize: 16,
        fontWeight: "500"
    },
    flexColumn: {
        flexDirection: "row",
        width: WIDTH * 0.9,
        paddingVertical: 10,
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeText: {
        opacity: 0.5,
        fontWeight: "500",
        fontSize: 16
    },
    bold: {
        fontWeight: "500",
        fontSize: 17,
    },
    view: {
        width: WIDTH,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    distance: {
        flexDirection: "row",
        width: WIDTH * 0.95,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 5,
        marginVertical: 10,
        justifyContent: "space-between",
        alignItems: "center",
    },
    distanceText: {
        fontWeight: "500",
        fontSize: 16,
        marginHorizontal: 10,
    },
    viewRoute: {
        flexDirection: "row",
        fontSize: 16,
        marginHorizontal: 10,
        alignItems: "center",
    },
    locationView: {
        backgroundColor: "#72AFD3",
        borderRadius: 25,
        marginLeft: 5,
    },
    locationIcon: {
        width: 25,
        height: 25,
        resizeMode: "cover",
    },
    routeDetail: {
        width: WIDTH * 0.8,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
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
    },
    button: {
        width: WIDTH * 0.9,
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: WIDTH * 0.05,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#72AFD3",
    },
    buttonText: {
        fontSize: 20,
        fontWeight: "600",
        color: "white",
        textTransform: "uppercase",
    },
    priceDetailModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalLayout: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.2)"
    },
    priceDetail: {
        width: WIDTH * 0.9,
        backgroundColor: 'white',
        padding: 20,
        // paddingBottom: 10, 
        borderRadius: 10,
    },
    modalHeader: {
        position: "relative",
        width: WIDTH * 0.8,
        justifyContent: "center",
        marginBottom: 30,
    },
    modalHeaderText: {
        fontSize: 20,
        fontWeight: "600",
    },
    closeButton: {
        position: "absolute",
        right: 0
    },
    modalFlexColumn: {
        position: "relative",
        width: WIDTH * 0.8,
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 20,
    },
    modalColumnTitle: {
        opacity: 0.6,
        fontSize: 18,
    },
    modalColumnValue: {
        fontSize: 18,
        fontWeight: "600",
    },
    modalTotalValue: {
        width: WIDTH * 0.8,
        fontSize: 18,
        fontWeight: "600",
    },
});

export default OrderDetail