import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform, Modal, FlatList } from "react-native";

import { UserContext } from '../../context/UserContext';

import { GetOrder } from "../../api/order";
import { OrderStatus } from "../../constrant/OrderStatus";
import { RouteStatus } from "../../constrant/RouteStatus";

import { getOrderAddable, deleteElement } from "../../util/util";
import OrderRouteTab from "../order/OrderRouteTab";
import AddOrderModal from "../modal/AddOrderModal"
import CustomDropDown from "../utils/CustomDropDown";

import add from "../../assets/add_circle.png"
import mapIcon from "../../assets/Map.png"
import threeDots from "../../assets/three_dots.png"
import COLORS from "../../constrant/colors";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const AddOrderHeader = (route) => {

    const data = route?.data
    const orders = route?.orders
    const editOrders = route?.editOrders
    const navigation = route?.navigation
    const [addList, setAddList] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const { user, token } = useContext(UserContext);

    useFocusEffect(
        React.useCallback(() => {
            setDropdownVisible(false)
            setAddList([])
        }, [])
    );

    const addOrder = () => {
        if (data.status === RouteStatus.IDLE) {
            setAddList([]), setModalVisible(true)
        }
    }

    const viewMap = () => {
        // console.log(orders);
        const locationList = orders[0]?.sortedAddresses?.map((address, index) => {
            const [latitude, longitude] = address.split(',')?.map(coord => parseFloat(coord.trim()));
            const name = orders[0]?.sortedAddressesName[index];
            return { latitude, longitude, name };
        });
        navigation.navigate("MyMapView", { routeList: locationList, navigation: navigation })
    }

    const dropdownList = [
        {
            name: "Thêm đơn hàng",
            image: add,
            action: addOrder,
        },
        {
            name: "Xem lộ tuyến",
            image: mapIcon,
            action: viewMap,
        },
    ]

    return (
        <View
            style={{
                paddingTop: Platform.OS === 'ios' ? 50 : 0,
                backgroundColor: Platform.OS === 'ios' ? "black" : "white",
                zIndex: 999
            }}
        >
            <View
                style={styles.container}
            >
                {
                    editOrders ?

                        <TouchableOpacity
                            style={styles.sideButton}
                            onPress={() => {
                                route?.edit()
                            }}
                        >
                            <Text style={styles.editOrder}>
                                Huỷ
                            </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={styles.sideButton}
                            onPress={() => {
                                route?.edit()
                            }}
                        >
                            <Text style={styles.editOrder}>
                                Sửa
                            </Text>
                        </TouchableOpacity>
                }


                <View>
                    <Text style={styles.content}>
                        {route.data?.name}
                    </Text>
                </View>

                <View
                    style={styles.dropdownButton}
                >
                    <View style={styles.dropdownContent}>
                        <CustomDropDown isVisible={dropdownVisible} setIsVisible={setDropdownVisible} dropdownList={dropdownList} />
                    </View>

                    <TouchableOpacity
                        onPress={() => { setDropdownVisible(true) }}
                    >
                        <Image
                            // style={styles.locker}
                            source={threeDots}
                        />
                    </TouchableOpacity>

                </View>

                {/* <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        if (data.status === RouteStatus.IDLE) {
                            setAddList([]), setModalVisible(true)
                        }
                    }}
                >
                    <Image
                        // style={styles.locker}
                        source={add}
                    />
                </TouchableOpacity> */}
            </View>
            {/* <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
            >
                <TouchableOpacity
                    style={styles.layout}
                    onPress={() => { setModalVisible(false) }}
                    activeOpacity={1}
                />
                <View
                    style={styles.modalHeader}
                />
                <FlatList
                    style={styles.orderListModal}
                    data={addable}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => { handleCancel() }}
                    >
                        <Text style={styles.optionText}>Bỏ Chọn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => { handleAddOrder() }}
                    >
                        <Text style={{ ...styles.optionText, color: COLORS.accept }}>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </Modal> */}
            <AddOrderModal data={data} modalVisible={modalVisible} setModalVisible={setModalVisible} addList={addList} setAddList={setAddList} navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: WIDTH,
        height: HEIGHT * 0.1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
    },
    sideButton: {
        position: "absolute",
        height: HEIGHT * 0.08,
        width: WIDTH * 0.15,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    editOrder: {
        color: COLORS.assign,
        fontSize: 18,
    },
    content: {
        fontSize: 20,
        fontWeight: "600",
        color: "#72AFD3"
    },
    dropdownButton: {
        position: "absolute",
        height: HEIGHT * 0.08,
        width: WIDTH * 0.15,
        right: 20,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotateZ: "90deg" }]
    },
    dropdownContent: {
        transform: [{ rotateZ: "-90deg" }]
    },
    layout: {
        width: WIDTH,
        height: HEIGHT * 0.15,
        backgroundColor: COLORS.opacityBlackBackground,
    },
    orderListModal: {
        width: WIDTH,
        // height: HEIGHT * 0.6,
        backgroundColor: "#f5f5f5",
        paddingVertical: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    orderTab: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
    },
    div: {
        width: WIDTH * 0.035,
    },
    check: {
        position: "absolute",
        width: 15,
        height: 15,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: "white",
        transform: [{ translateX: 10 }, { translateY: 3 }]
    },
    add: {
        position: "absolute",
        top: 0,
        bottom: 12,
        left: 0,
        right: 0,
        // borderWidth: 1,
        zIndex: 999,
        justifyContent: 'center'
    },
    modalFooter: {
        width: WIDTH,
        height: HEIGHT * 0.1,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 999,
    },
    option: {
        width: WIDTH * 0.2,
        height: HEIGHT * 0.1,
        marginHorizontal: WIDTH * 0.1,
        justifyContent: "center",
        alignItems: "center",
    },
    optionText: {
        fontSize: 15,
        fontWeight: "700",
        opacity: 0.5
    }
});

export default AddOrderHeader