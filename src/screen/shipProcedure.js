import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, Dimensions, ScrollView } from "react-native";
import { UserContext } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

import { InteractPackageStatus, GetPackage } from "../api/package"
import { InteractOrder, ChangeShipperStatus } from "../api/shipper";
import { GetOrder, UploadEnvidence } from "../api/order"
import { InteractRoute, changeRouteStatus } from "../api/route";

import { OrderStatus, OrderStatusText } from "../constrant/OrderStatus"
import { ShipperStatus } from "../constrant/ShipperStatus";

import BackHeader from "../components/header/BackHeader";
import SpaceLine from "../components/utils/SpaceLine";
import SpinnerLoading from "../components/utils/SpinnerLoading";
import CustomToast from "../components/utils/CustomToast";
import ComfirmModal from "../components/utils/ComfirmModal"
import ImagePickupModal from "../components/modal/ImagePickupModal"

import { findObjectByValue, formatPrice } from "../util/util"

import { District } from "../constrant/District";

import locationIcon from "../assets/LocationBlue.png"
import account from "../assets/account_circle.png"
import call from "../assets/call.png"
import pay from "../assets/pay.png"
import close from "../assets/close.png"
import { RouteStatus } from "../constrant/RouteStatus";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const choices = [
    'Người nhận không nghe máy',
    'Thuê bao không liên lạc được',
    'Sai số điện thoại',
    'Người nhận không xuất hiện',
    'Người nhận hẹn ngày giao',
    'Người nhận đổi địa chỉ giao hàng',
    'Không được kiểm/thử hàng',
    'Hàng hóa không như người nhận yêu cầu',
    'Sai tiền thu hộ COD',
    'Người nhận đổi ý',
    'Người nhận không đặt hàng, đơn trùng',
    'Hàng hóa hư hỏng',
];

const ShipProcedure = ({ route, navigation }) => {

    const [order, setOrder] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(undefined);
    const showToast = CustomToast();
    const { user, updateUser, token } = useContext(UserContext);

    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const [confirm, setConfirm] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            setSelectedImage(undefined)
        }, [])
    );

    useEffect(() => {
        setOrder(route.params.order);
        setLoading(false)
    }, [route.params.order]);

    const handleChoiceSelect = (choice) => {
        setSelectedChoiceIndex(choice);
    };

    const handleCancel = () => {
        setSelectedChoiceIndex(null);
        setVisible(false);
    };

    const handleSubmit = async () => {
        console.log('Selected choice:', choices[selectedChoiceIndex]);
        await cancleOrder(order?.id, choices[selectedChoiceIndex])
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

    const filterStatus = (status) => {
        if (status != OrderStatus.CANCELLED && status != OrderStatus.COMPLETED) {
            return (
                <View style={styles.buttonPack}>
                    <TouchableOpacity
                        onPress={() => {
                            setVisible(true)
                            // canclePackage()
                        }}
                    >
                        <View
                            style={{ ...styles.haftButton, backgroundColor: "rgba(0, 0, 0, 0.15)" }}
                        >
                            <Text style={{ ...styles.buttonText, color: "#19779B" }}>
                                Trả Hàng

                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setConfirm(true)
                        }}
                    >
                        <View
                            style={{ ...styles.haftButton, backgroundColor: "#72AFD3" }}
                        >
                            <Text style={{ ...styles.buttonText, color: "white" }}>
                                Thành Công
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    const completeOrder = async (orderId) => {

        const req = await UploadEnvidence(orderId, selectedImage, token)
        if (req?.status === 200) {

            const data = {
                id: orderId,
                shipperId: user?.id,
                status: OrderStatus.COMPLETED,
            }
            if (order.routeId) {
                data.routesId = order?.routeId
            }
            const response = await InteractOrder(data, token);

            if (response.status === 200) {
                if (order.routeId) {
                    checkFinal()
                } else {
                    await ChangeShipperStatus(user.id, ShipperStatus.Online, token)
                    await updateUser({ ...user, status: ShipperStatus.Online, route: null, ordersInRoute: null })
                    setOrder({ ...order, status: OrderStatus.COMPLETED })
                    showToast("Thông Báo", "Xác nhận thành công", "success");
                    setConfirm(false)
                    navigation.navigate("Order")
                }
            } else {
                showToast("Thông Báo", "Xác nhận thất bại", "warning");
            }

        } else {
            showToast("Thông Báo", "Xác nhận ảnh thất bại", "warning");
        }

    }


    const cancleOrder = async (orderId, reason) => {
        const data = {
            id: orderId,
            shipperId: user?.id,
            cancelReason: reason,
            status: OrderStatus.RETURN,
        }
        if (order.routeId) {
            data.routesId = order?.routeId
        }
        const response = await InteractOrder(data, token);
        console.log(data);
        if (response.status === 200) {
            if (order.routeId) {
                checkFinal()
            } else {
                await ChangeShipperStatus(user.id, ShipperStatus.Online, token)
                await updateUser({ ...user, status: ShipperStatus.Online, route: null, ordersInRoute: null })
            }
            setOrder({ ...order, status: OrderStatus.RETURN })
            showToast("Thông Báo", "Xác nhận thành công", "success");
            navigation.navigate("Order")
        } else {
            showToast("Thông Báo", "Xác nhận thất bại", "warning");
        }
    }

    const checkFinal = async () => {
        const response = await InteractRoute({ id: order?.routeId }, token);
        if (response?.data[0]?.status === RouteStatus.COMPLETED) {
            changeStatus()
        }
        setOrder({ ...order, status: OrderStatus.COMPLETED })
        showToast("Thông Báo", "Xác nhận thành công", "success");
        setConfirm(false)
        navigation.navigate("RouteDetail", { data: response?.data[0] })
    }

    const changeStatus = async () => {
        const response = await ChangeShipperStatus(user?.id, ShipperStatus.Online, token)
        if (response?.status === 200) {
            await updateUser({ ...user, status: ShipperStatus.Online, route: null, ordersInRoute: null })
        }
    }

    const viewMap = () => {
        const routeList = [
            { latitude: order?.customerLat, longitude: order?.customerLng, name: order?.customerCommune },
        ]
        navigation.navigate("MyMapView", { routeList: routeList, navigation: navigation })
    }

    return (
        <View style={styles.container}>
            <BackHeader content={"#" + order?.trackingNumber} navigation={navigation} goback={() => { navigation.navigate("StoreInfor", { order: order }) }} />
            {loading ? <SpinnerLoading /> :
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
                                Điểm giao hàng
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.centerColumn}>
                        <View style={styles.address}>
                            <Text style={{ ...styles.largeText, textAlign: "center" }}>
                                {order?.customerCommune}, {findObjectByValue(District, order?.customerDistrict)?.name}, TP.{order?.customerCity}
                            </Text>
                        </View>
                    </View>

                    <SpaceLine />
                    <SpaceLine />
                    <SpaceLine />

                    <View style={styles.column}>
                        <View style={styles.infor}>
                            <Text style={styles.boldText}>
                                Thông tin người nhận
                            </Text>
                        </View>
                        <View style={styles.flexSpaceBetween}>
                            <View style={styles.flexColumn}>
                                <Image
                                    style={styles.inforIcon}
                                    source={account}
                                />
                                <Text style={styles.largeText}>
                                    {order?.customerName}
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

                    <SpaceLine />
                    <SpaceLine />
                    <SpaceLine />

                    <View style={styles.column}>
                        <View style={styles.pay}>
                            <Text style={styles.boldText}>
                                Thanh toán
                            </Text>
                            <View style={styles.flexSpaceBetween}>
                                <View style={styles.flexColumn}>
                                    <Image
                                        style={styles.inforIcon}
                                        source={pay}
                                    />
                                    <Text style={styles.largeText}>
                                        Số tiền cần thu
                                    </Text>
                                </View>
                                <Text style={styles.totalPrice}>
                                    {formatPrice(order?.totalPrice)} đ
                                </Text>
                            </View>
                            <View style={styles.payColumn}>
                                <Text style={styles.text}>
                                    Hình thức thanh toán :
                                </Text>
                                <Text style={styles.price}>
                                    Tiền mặt
                                </Text>
                            </View>
                            <View style={styles.payColumn}>
                                <Text style={styles.text}>
                                    Phí giao hàng :
                                </Text>
                                <Text style={styles.price}>
                                    {formatPrice(order?.distancePrice)} đ
                                </Text>
                            </View>
                            <View style={styles.payColumn}>
                                <Text style={styles.text}>
                                    Thu hộ người gửi (COD) :
                                </Text>
                                <Text style={styles.price}>
                                    {formatPrice(order?.cod)} đ
                                </Text>
                            </View>
                        </View>
                    </View>

                    <SpaceLine />
                    <SpaceLine />
                    <SpaceLine />

                    <View style={styles.column}>
                        <View style={styles.packageInfor}>
                            <Text style={{ ...styles.boldText, marginBottom: 10 }}>
                                Thông tin gói hàng
                            </Text>

                            <View style={styles.flexColumn}>
                                <View style={styles.circle} />
                                <Text style={styles.text}>
                                    Loại hàng : {order?.typeId}
                                </Text>
                            </View>
                            <View style={styles.flexColumn}>
                                <View style={styles.circle} />
                                <Text style={styles.text}>
                                    Dung tích : {order?.capacity}
                                </Text>
                            </View>
                            <View style={styles.flexColumn}>
                                <View style={styles.circle} />
                                <Text style={styles.text}>
                                    Khác
                                </Text>
                            </View>
                        </View>
                    </View>
                    {filterStatus(order?.status)}
                </ScrollView>
            }

            <ImagePickupModal
                isVisible={confirm}
                onCancel={() => { setConfirm(false) }}
                onSubmit={() => { completeOrder(order?.id) }}
                image={selectedImage}
                setImage={setSelectedImage}
            />

            <Modal
                transparent={true}
                animationType="slide"
                visible={visible}
                onRequestClose={handleCancel}
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
                            <Text style={{ ...styles.boldText, transform: [{ translateX: -15 }] }}>Hãy nhập lý do giao hàng thất bại</Text>
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
                        <TouchableOpacity onPress={handleSubmit} style={styles.modalButton}>
                            <Text style={{ textTransform: "uppercase", fontSize: 18, color: "white" }} >XÁC NHẬN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
    payColumn: {
        width: WIDTH * 0.9,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    pay: {
        width: WIDTH * 0.9,
        paddingVertical: 20,
    },
    totalPrice: {
        color: "#72AFD3",
        fontSize: 20,
    },
    price: {
        color: "#72AFD3",
    },
    packageInfor: {
        width: WIDTH * 0.9,
        paddingVertical: 20,
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
    buttonPack: {
        width: WIDTH,
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: HEIGHT * 0.15,
        marginTop: 20
    },
    buttonText: {
        fontSize: 16,
        textTransform: "uppercase",
        fontWeight: "500",
    },
    haftButton: {
        width: WIDTH * 0.4,
        height: WIDTH * 0.1,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
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

export default ShipProcedure