import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Modal, FlatList } from "react-native";

import { UserContext } from '../../context/UserContext';

import { GetOrder } from "../../api/order";
import { DeleteOrder } from "../../api/route";

import OrderRouteTab from "../order/OrderRouteTab";
import AddOrderHeader from "../header/AddOrderHeader";
import BackGroundEmpty from "../background/BackGroundEmpty";
import SpinnerLoading from "../utils/SpinnerLoading";
import CustomToast from "../../components/utils/CustomToast";
import { deleteElement } from "../../util/util";
import EditOrderRouteTab from "../order/EditOrderRouteTab";

import check from "../../assets/routeHeader/check_circle.png"
import { RouteStatus } from "../../constrant/RouteStatus";

// import ComfirmModal from "../components/utils/ComfirmModal";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const RouteDetail = ({ route, navigation }) => {

    const data = route?.params?.data
    const [orders, setOrders] = useState([])
    const [editOrders, setEditOrders] = useState(false)
    const [editOrdersList, setEditOrdersList] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, token, updateUser } = useContext(UserContext);
    const showToast = CustomToast();

    console.log(data?.id);

    useEffect(() => {
        setOrders([])
        loadData()
    }, [data])

    useEffect(() => {
        setEditOrdersList([])
    }, [])

    const loadData = async () => {
        setLoading(true)
        const response = await GetOrder({ routeId: data?.id }, token)

        if (response.status === 200) {
            setOrders(response?.data)
            setLoading(false)
        } else {
            showToast("Cảnh Báo", "Bạn thao tác quá nhanh", "error");
            setTimeout(() => {
                loadDataAgain();
                setLoading(false)
            }, 3000);
        }
    }

    const loadDataAgain = async () => {
        const response = await GetOrder({ routeId: data?.id }, token)
        if (response.status === 200) {
            setOrders(response?.data)
        } else {
            showToast("Thông Báo", "Tải dữ liệu không thành công", "error");
            setOrders([])
        }
    }

    const removeAddList = (value) => {
        const array = deleteElement(editOrdersList, value)
        setEditOrdersList(array)
    }

    const handleAdd = (id) => {
        setEditOrdersList(prevAddList => {
            if (!prevAddList.includes(id)) {
                return [...prevAddList, id];
            } else {
                removeAddList(id);
                return [...prevAddList];
            }
        });
    }

    const handleCancle = () => {
        setEditOrders(false)
        setEditOrdersList([])
    }

    const handleDelete = async () => {
        const response = await DeleteOrder(editOrdersList, token)
        if (response?.status === 200) {
            const newOrders = orders.filter((order) => {
                return !editOrders?.find((editOrder) => editOrder.id === order.id);
            });
            setOrders(newOrders);
            setEditOrders(false)
            setEditOrdersList([])
        } else {
            console.log(response);
            showToast("Thông Báo", "Xoá đơn hàng không thành công", "error");
        }
    }

    const handleEditMode = () => {
        if (data?.status === RouteStatus.IDLE) {
            setEditOrders(!editOrders)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <OrderRouteTab order={item} editable={editOrders?.editable} navigation={navigation} />
        )
    }

    const renderEditItem = ({ item }) => {
        return (
            <View style={styles.orderTab}>
                <View style={styles.div} />
                <TouchableOpacity
                    style={styles.add}
                    onPress={() => { handleAdd(item.id) }}
                >
                    {
                        editOrdersList.indexOf(item.id) !== -1 ?
                            <View style={{ ...styles.check, transform: [{ translateX: 7 }, { translateY: 0 }], borderWidth: 0 }}>
                                <Image
                                    source={check}
                                />
                            </View>
                            :
                            <View style={styles.check}>
                            </View>
                    }
                </TouchableOpacity>
                <EditOrderRouteTab order={item} navigation={navigation} onPress={handleAdd} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <AddOrderHeader orders={orders} data={data} edit={handleEditMode} navigation={navigation} editOrders={editOrders} setEditOrders={setEditOrders} />
            {
                loading ?
                    <SpinnerLoading />
                    :
                    orders[0] ?
                        <FlatList
                            style={{ ...styles.routeList, marginBottom: editOrders ? HEIGHT * 0.16 : HEIGHT * 0.08 }}
                            data={orders}
                            keyExtractor={(item) => item.id}
                            renderItem={editOrders ? renderEditItem : renderItem} />
                        :
                        <BackGroundEmpty />
            }
            {
                editOrders &&
                < View style={styles.bottomModal}>
                    <TouchableOpacity onPress={handleCancle}>
                        <Text style={styles.cancleButton}>
                            Huỷ
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete}>
                        <Text style={styles.deleteButton}>
                            Xoá
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5",
    },
    routeList: {
        marginBottom: HEIGHT * 0.08
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

    bottomModal: {
        position: "absolute",
        height: HEIGHT * 0.16,
        paddingHorizontal: 35,
        paddingTop: 20,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "white",
    },
    bottomButon: {

    },
    cancleButton: {
        color: "#72AFD3",
        fontSize: 18
    },
    deleteButton: {
        color: "red",
        fontSize: 18
    }
});

export default RouteDetail