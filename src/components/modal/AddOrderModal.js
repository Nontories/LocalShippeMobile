import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform, Modal, FlatList } from "react-native";
import * as Location from 'expo-location';

import { UserContext } from '../../context/UserContext';

import { GetOrder } from "../../api/order";
import { addOrderToRoute } from "../../api/route";

import OrderRouteTab from "../order/OrderRouteTab";
import { OrderStatus } from "../../constrant/OrderStatus";
import { getOrderAddable, deleteElement } from "../../util/util";

import CustomToast from "../../components/utils/CustomToast";

import check from "../../assets/routeHeader/check_circle.png"
import COLORS from "../../constrant/colors";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const AddOrderModal = (route) => {

    const data = route?.data
    const addList = route?.addList
    const setAddList = route?.setAddList
    const navigation = route?.navigation
    const modalVisible = route?.modalVisible
    const setModalVisible = route?.setModalVisible
    const [addable, setAddable] = useState([])
    const [location, setLocation] = useState({})
    const { user, token } = useContext(UserContext);
    const showToast = CustomToast();

    useEffect(() => {
        loadData()
    }, [route?.data])

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            // setErrorMsg('Permission to access location was denied');
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location)
        })();
      }, []);

    useFocusEffect(
        React.useCallback(() => {
            setAddList([])
            setAddable([])
        }, [])
    );

    const removeAddList = (value) => {
        const array = deleteElement(addList, value)
        setAddList(array)
    }

    const handleAdd = (id) => {
        setAddList(prevAddList => {
            if (!prevAddList.includes(id)) {
                return [...prevAddList, id];
            } else {
                removeAddList(id);
                return [...prevAddList];
            }
        });
    }

    const handleAddOrder = async () => {
        const response = await addOrderToRoute( user?.id, data?.id, addList, token , location)
        if (response.status === 200) {
            setAddList([])
            setModalVisible(false)
            showToast("Thông Báo", "Thêm đơn hàng thành công", "success");
            navigation.navigate("Routes")
        }else{
            console.log("add orders to route fail : ",response);
        }
    }

    const handleCancel = () => {
        setAddList([])
    }

    const loadData = async () => {
        const req = await GetOrder({ shipperId: user?.id, status: OrderStatus.ACCEPTED }, token)
        if (req.status === 200) {
            const array = getOrderAddable(req?.data)
            // console.log(array.length);
            setAddable(array)
        } else {
            console.log("can't load order to add. Status : ", req.status);
        }
    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.orderTab}>
                <View style={styles.div} />
                <TouchableOpacity
                    style={styles.add}
                    onPress={() => { handleAdd(item.id) }}
                >
                    {
                        addList.indexOf(item.id) !== -1 ?
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
                <OrderRouteTab order={item} navigation={route?.navigation} />
            </View>
        )
    }

    return (
        <Modal
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
        </Modal>
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
    content: {
        fontSize: 20,
        fontWeight: "600",
        color: "#72AFD3"
    },
    addButton: {
        position: "absolute",
        height: HEIGHT * 0.08,
        width: WIDTH * 0.15,
        right: 20,
        alignItems: "center",
        justifyContent: "center",
    },

    layout: {
        width: WIDTH,
        height: HEIGHT * 0.15,
        backgroundColor: COLORS.opacityBlackBackground,
        transform: [{ translateY: 10 }]
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

export default AddOrderModal