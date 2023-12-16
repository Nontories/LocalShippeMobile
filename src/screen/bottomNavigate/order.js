import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, FlatList } from "react-native";

import { UserContext } from '../../context/UserContext';

import { AssigningOrder } from "../../api/order";
import { ShipperOrder } from "../../api/order";

import { OrderStatus, OrderStatusText } from "../../constrant/OrderStatus"

import { getKeyByValue, uniqueFilteredOrdersById } from "../../util/util"

import Header from "../../components/header/Header";
import OrderTab from "../../components/order/OrderTab";
import SearchBar from "../../components/utils/SearchBar";
import SpinnerLoading from "../../components/utils/SpinnerLoading";
import BackGroundEmpty from "../../components/background/BackGroundEmpty";
import BackGroundOffline from "../../components/background/BackGroundOffline";
import { ShipperStatus } from "../../constrant/ShipperStatus";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const filterArray = [
    {
        value: OrderStatus.ALL,
        text: OrderStatusText[getKeyByValue(OrderStatus, OrderStatus.ALL)]
    },
    {
        value: OrderStatus.ASSIGNING,
        text: OrderStatusText[getKeyByValue(OrderStatus, OrderStatus.ASSIGNING)]
    },
    {
        value: OrderStatus.WAITING,
        text: "Đơn " + OrderStatusText[getKeyByValue(OrderStatus, OrderStatus.WAITING)]
    },
    {
        value: OrderStatus.CANCELLED,
        text: "Đơn " + OrderStatusText[getKeyByValue(OrderStatus, OrderStatus.CANCELLED)]
    },
    {
        value: OrderStatus.INPROCESS,
        // text: OrderStatusText[getKeyByValue(OrderStatus, OrderStatus.INPROCESS)]
        text: "Đơn Hiện tại"
    },
    {
        value: OrderStatus.COMPLETED,
        text: "Đơn " + OrderStatusText[getKeyByValue(OrderStatus, OrderStatus.COMPLETED)]
    }
]

const Order = ({ navigation }) => {

    const [orders, setOrders] = useState([])
    const [filterOrders, setFilterOrders] = useState([])
    const [filterValue, setFilterValue] = useState(OrderStatus.ACCEPTED)
    // const [filterArr, setFilterArr] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, token } = useContext(UserContext);

    useFocusEffect(
        React.useCallback(() => {
            loadData()
        }, [])
    );

    useEffect(() => {
        setFilterOrders(filterOrder(filterValue))
    }, [filterValue])

    const loadData = async () => {
        try {
            setLoading(loading)
            const response = await AssigningOrder(token);
            const data = await ShipperOrder(user?.id, token);

            const order = uniqueFilteredOrdersById([...response?.data, ...data.data])

            setOrders(order)
            setFilterOrders(filterOrder(filterValue))
        } catch (error) {
            console.log('Error when load order list:');
        } finally {
            setLoading(false)
        }
    }

    const filterOrder = (filterStatus) => {
        if (filterStatus === OrderStatus.ALL) {
            return orders;
        }

        let filteredOrders = [];
        if (filterStatus === OrderStatus.INPROCESS || filterStatus === OrderStatus.ACCEPTED) {
            filteredOrders = orders.filter(order => order.status === OrderStatus.INPROCESS || order.status === OrderStatus.ACCEPTED);
        } else {
            filteredOrders = orders.filter(order => order.status === filterStatus);
        }

        if (!filteredOrders) {
            return [];
        }
        return filteredOrders;
    };

    const changeOrdersList = (orderList) => {
        setFilterOrders(orderList)
    }

    const getHeaderName = filter => {
        switch (filter) {
            case OrderStatus.ALL:
                return ("Tất Cả")
            case OrderStatus.ASSIGNING:
                return ("Đang Tìm")
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

    const renderItem = ({ item }) => {
        return (
            <OrderTab order={item} navigation={navigation} setOrders={setOrders} orders={orders} />
        )
    }

    return (
        <View style={styles.container}>
            <Header content={getHeaderName(filterValue) + " (" + filterOrder(filterValue).length + ")"} navigation={navigation} />
            {loading ?
                <SpinnerLoading />
                :
                <>
                    <View style={{
                        ...styles.searchBar,
                        top: Platform.OS === 'ios' ? HEIGHT * 0.175 : HEIGHT * 0.1,
                    }}>
                        <SearchBar orders={orders} filterArray={filterArray} setFilterValue={setFilterValue} filterValue={filterValue} searchArray={filterOrder(filterValue)} setSearchArray={setFilterOrders} />
                    </View>
                    {user?.status !== ShipperStatus.Offline ?
                        <>
                            {
                                filterOrder(filterValue)[0] ?
                                    <>
                                        <FlatList
                                            style={styles.orderList}
                                            data={filterOrders[0] ? filterOrders?.reverse() : filterOrder(filterValue)?.reverse()}
                                            keyExtractor={(item) => item.id}
                                            renderItem={renderItem} />
                                    </>
                                    :
                                    <BackGroundEmpty />
                            }
                        </>
                        :
                        <BackGroundOffline />
                    }
                </>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5"
    },
    noData: {
        width: WIDTH,
        textAlign: "center",
        marginVertical: HEIGHT * 0.1,
        fontSize: 25,
        fontWeight: "700"
    },
    orderList: {
        marginTop: HEIGHT * 0.09,
        marginBottom: HEIGHT * 0.1,
        zIndex: 10,
    },
    searchBar: {
        position: "absolute",
        zIndex: 999,
    }
});

export default Order