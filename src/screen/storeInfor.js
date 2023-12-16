import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, Dimensions, ScrollView } from "react-native";

import { UserContext } from '../context/UserContext';

import { InteractOrder } from "../api/shipper";
import { ChangeShipperStatus } from "../api/shipper";
import { InteractRoute } from "../api/route";

import { OrderStatus, OrderStatusText } from "../constrant/OrderStatus"
import { ShipperStatus } from "../constrant/ShipperStatus";

import BackHeader from "../components/header/BackHeader";
import SpaceLine from "../components/utils/SpaceLine";
import CustomToast from "../components/utils/CustomToast";
import ComfirmModal from "../components/utils/ComfirmModal";

import locationIcon from "../assets/LocationBlue.png"
import account from "../assets/account_circle.png"
import call from "../assets/call.png"
import { RouteStatus } from "../constrant/RouteStatus";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const StoreInfor = ({ route, navigation }) => {

    const [order, setOrder] = useState("");
    const [modal, setModal] = useState(false);
    const showToast = CustomToast();
    const { user, updateUser, token } = useContext(UserContext);

    useEffect(() => {
        setOrder(route.params.order);
    }, [route.params.order]);


    const pickupOrder = async () => {4
    
        if (order?.routeId) {
            const response = await InteractRoute({ id: order?.routeId }, token);
            if (response?.data[0]?.status != RouteStatus.INPROGESS) {
                showToast("Thông Báo", "Đơn hàng thuộc lộ trình chưa bắt đầu giao", "warning");
                return
            }
        }

        if (user?.status !== ShipperStatus.Delivering) {
            const data = {
                id: order?.id,
                shipperId: user?.id,
                status: OrderStatus.INPROCESS,
            }

            const response = await InteractOrder(data, token)
            if (response?.status === 200) {
                console.log("getin InteractOrder");
                if (!order?.routeId) {
                    await changeStatus(ShipperStatus.Delivering)
                }
                setOrder({ ...order, status: OrderStatus.INPROCESS })
                setModal(false)
            } else {
                console.log(response);
            }
        } else {
            if (order?.routeId == user?.route[0]?.id) {
                const data = {
                    id: order?.id,
                    shipperId: user?.id,
                    status: OrderStatus.INPROCESS,
                }

                const response = await InteractOrder(data, token)
                if (response?.status === 200) {
                    if (!order?.routeId) {
                        await changeStatus(ShipperStatus.Delivering)
                    }
                    setOrder({ ...order, status: OrderStatus.INPROCESS })
                    setModal(false)
                } else {
                    console.log(response);
                }
            } else {
                showToast("Thông Báo", "Hãy hoàn thành đơn hàng hoặc lộ trình đang giao", "warning");
            }
        }

    }

    const changeStatus = async (status) => {
        const response = await ChangeShipperStatus(user?.id, status, token)
        if (response?.status === 200) {
            await updateUser({ ...user, status: status })
        }
    }

    const filterStatus = (status) => {
        switch (status) {
            case OrderStatus.ACCEPTED:
                return (
                    <View style={styles.buttonPack}>
                        <TouchableOpacity
                            onPress={() => {
                                setModal(true)
                            }}
                        >
                            <View
                                style={{ ...styles.haftButton, backgroundColor: "#72AFD3" }}
                            >
                                <Text style={{ ...styles.buttonText, color: "white" }}>
                                    ĐÃ LẤY HÀNG
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            case OrderStatus.INPROCESS:
                return (
                    <View style={styles.buttonPack}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("ShipProcedure", { order: order })
                            }}
                        >
                            <View
                                style={{ ...styles.haftButton, backgroundColor: "#72AFD3" }}
                            >
                                <Text style={{ ...styles.buttonText, color: "white" }}>
                                    Tiếp tục
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            default:
                break;
        }
    }

    const viewMap = () => {
        const routeList = [
            { latitude: order?.store?.storeLat, longitude: order?.store?.storeLng, name: order?.store?.storeName},
        ]
        navigation.navigate("MyMapView", { routeList: routeList, navigation: navigation })
    }

    return (
        <View style={styles.container}>
            <BackHeader content={"#" + order?.trackingNumber} navigation={navigation} goback={() => { navigation.navigate("OrderDetail", { order: order }) }} />
            <ScrollView>
                <View style={styles.centerColumn}>
                    <TouchableOpacity
                        style={styles.location}
                        onPress={() => {
                            viewMap()
                        }}
                    >
                        <Image
                            style={styles.locationIcon}
                            source={locationIcon}
                        />
                        <Text style={styles.boldestText}>
                            Điểm lấy hàng
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.centerColumn}>
                    <View style={styles.address}>
                        <Text style={styles.largeText}>
                            {order?.store?.storeAddress}
                        </Text>
                    </View>
                </View>

                <SpaceLine />
                <SpaceLine />
                <SpaceLine />

                <View style={styles.column}>
                    <View style={styles.infor}>
                        <Text style={styles.boldText}>
                            Thông tin người gửi
                        </Text>
                    </View>
                    <View style={styles.flexSpaceBetween}>
                        <View style={styles.flexColumn}>
                            <Image
                                style={styles.inforIcon}
                                source={account}
                            />
                            <Text style={styles.largeText}>
                                {order?.store?.storeName}
                            </Text>
                        </View>
                        <View style={styles.callBlock}>
                            <Image
                                style={styles.callIcon}
                                source={call}
                            />
                        </View>
                    </View>
                </View>

                {filterStatus(order?.status)}
            </ScrollView>
            <ComfirmModal isVisible={modal} onCancel={() => { setModal(false) }} onSubmit={() => { pickupOrder() }} content="Bạn đã lấy hàng thành công và sẵn sàng để đi giao hàng?" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5"
    },
    centerColumn: {
        width: WIDTH,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    column: {
        width: WIDTH,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    location: {
        width: WIDTH,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    locationIcon: {
        width: 30,
        height: 30,
        resizeMode: "cover"
    },
    text: {
        marginVertical: 3,
    },
    boldestText: {
        fontSize: 18,
        fontWeight: "500"
    },
    largeText: {
        fontSize: 17,
    },
    boldText: {
        fontSize: 16,
        fontWeight: "600"
    },
    address: {
        width: WIDTH * 0.9,
        paddingVertical: 10,
    },
    infor: {
        width: WIDTH * 0.9,
        paddingTop: 20,
    },
    callBlock: {
        padding: 3,
        backgroundColor: "#72AFD3",
        borderRadius: 50,
    },
    callIcon: {
        width: 25,
        height: 25,
        resizeMode: "cover"
    },
    inforIcon: {
        width: 40,
        height: 40,
        resizeMode: "cover",
        marginRight: 10,
    },
    flexSpaceBetween: {
        width: WIDTH * 0.9,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    flexColumn: {
        flexDirection: "row",
        alignItems: "center",
    },

    buttonPack: {
        width: WIDTH,
        marginTop: 20
    },
    haftButton: {
        width: WIDTH * 0.9,
        marginHorizontal: WIDTH * 0.05,
        padding: 15,
        borderRadius: 7,
        alignItems: "center"
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 700,
        textTransform: "uppercase"
    }
});

export default StoreInfor