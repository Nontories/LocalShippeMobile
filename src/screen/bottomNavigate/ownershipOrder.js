import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, Modal, Image } from "react-native";

import { UserContext } from '../../context/UserContext';

import { OrderStatus, OrderStatusText } from "../../constrant/OrderStatus"

import { getKeyByValue } from "../../util/util"

import Header from "../../components/header/Header";
import OrderTab from "../../components/order/OrderTab";
import SpinnerLoading from "../../components/utils/SpinnerLoading";
import BackGroundOffline from "../../components/background/BackGroundOffline";
import BackGroundEmpty from "../../components/background/BackGroundEmpty";
import Filter from "../../components/filter";

import { ShipperOrder } from "../../api/order";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const OwnershipOrder = ({ route, navigation }) => {

    const [orders, setOrders] = useState([])
    const [filterValue, setFilterValue] = useState(OrderStatus.ALL)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true)
    const { user, token } = useContext(UserContext);

    useFocusEffect(
        React.useCallback(() => {
            setIsDropdownVisible(false)
            loadData()
        }, [])
    );

    useEffect(() => {
        setIsDropdownVisible(false)
    }, [filterValue])

    const loadData = async () => {
        try {
            setLoading(true)
            const data = await ShipperOrder(user?.id, token);
            setOrders(data.data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const getHeaderName = filter => {
        switch (filter) {
            case OrderStatus.ALL:
                return ("Tất Cả")
            case OrderStatus.ASSIGNING:
                return ("Đơn Hàng")
            case OrderStatus.WAITING:
                return ("Đơn Chờ")
            case OrderStatus.CANCELLED:
                return ("Đơn Đã Huỷ")
            case OrderStatus.COMPLETED:
                return ("Đơn Hoàn Thành")
            case OrderStatus.INPROCESS:
                return ("Đơn Hiện Tại")
            case OrderStatus.ACCEPTED:
                return ("Đơn Hiện Tại")

            default:
                break;
        }
    }

    const filterOrder = (filterStatus) => {
        if (filterStatus === OrderStatus.ALL) {
            return orders;
        }

        let filteredOrders = [];
        if (filterStatus === OrderStatus.INPROCESS || filterStatus === OrderStatus.ACCEPTED) {
            filteredOrders = orders?.filter(order => order.status === OrderStatus.INPROCESS || order.status === OrderStatus.ACCEPTED);
        } else {
            filteredOrders = orders?.filter(order => order.status === filterStatus);
        }

        if (!filteredOrders) {
            return [];
        }
        return filteredOrders;
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const renderItem = ({ item }) => {
        return (
            <OrderTab order={item} navigation={navigation} />
        )
    }

    return (
        <View style={styles.container}>
            <Header content={getHeaderName(filterValue) + " (" + filterOrder(filterValue).length + ")"} navigation={navigation} />

            {
                loading ?
                    <SpinnerLoading />
                    :
                    user?.status !== 2 ?
                        <>
                            {
                                filterOrder(filterValue)[0] ?
                                    <FlatList
                                        style={styles.orderList}
                                        data={filterOrder(filterValue)}
                                        keyExtractor={(item) => item.id}
                                        renderItem={renderItem} />
                                    :
                                    <BackGroundEmpty />
                            }
                        </>
                        :
                        <BackGroundOffline />
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5",
    },
    option: {
        width: WIDTH,
        height: HEIGHT * 0.08,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginBottom: 10,
    },
    optionText: {
        width: WIDTH * 0.45,
        height: HEIGHT * 0.07,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        alignItems: "center",
        justifyContent: "space-around",

    },
    text: {
        fontSize: 18,
        color: "rgba(0, 0, 0, 0.45)",
        textTransform: "uppercase",
    },
    orderList: {
        marginBottom: HEIGHT * 0.1
    },
    noData: {
        width: WIDTH,
        textAlign: "center",
        marginVertical: HEIGHT * 0.1,
        fontSize: 25,
        fontWeight: "700"
    },
    modelContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },
    bottomSheet: {
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: WIDTH,
    },
    optionChoice: {
        paddingVertical: HEIGHT * 0.02,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.3)",
        fontSize: 18,
        textAlign: "center"
    },
    active: {
        backgroundColor: '#72AFD3',
    },
    activeText: {
        color: "white",
    },
    filterContainer: {
        position: "absolute",
        right: 15,
        bottom: HEIGHT * 0.13,
    }
});

export default OwnershipOrder