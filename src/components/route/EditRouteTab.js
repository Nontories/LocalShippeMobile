import React, { useState, useEffect, useContext, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Dimensions, TextInput } from "react-native";

import { UserContext } from "../../context/UserContext";

import { deleteRoute, editRoute } from "../../api/route";
import { ChangeShipperStatus, ShipperByAcountId } from "../../api/shipper";

import { RouteStatus, RouteStatusText } from "../../constrant/RouteStatus";
import { ShipperStatus } from "../../constrant/ShipperStatus";

import rocket from "../../assets/rocket.png"

import RouteStatusBar from "./RouteStatusBar";
import CustomToast from "../utils/CustomToast";

import ComfirmModal from "../utils/ComfirmModal"
import COLORS from "../../constrant/colors";
import { formatDate } from "../../util/util";


const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const EditRouteTab = ({ routes, setRoutes, data, store, navigation }) => {

    const showToast = CustomToast();
    const [editVisible, setEditVisible] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [editInfor, setEditInfor] = useState({ name: data?.name, time: data?.time, visible: false })
    const { user, token } = useContext(UserContext);

    const completeRouteInfor = async () => {
        if (editInfor?.name !== data?.name || editInfor?.time !== data?.time) {
            const updateData = { ...data, name: editInfor?.name, time: editInfor?.time }
            const response = await editRoute(updateData, token)
            if (response?.status === 200) {
                const index = routes.indexOf(data);
                const updatedRoutes = [...routes];
                updatedRoutes[index] = updateData;
                setRoutes(updatedRoutes);
                setEditVisible(false)
                showToast("Thông Báo", `Đã cập nhật lộ trình ${data?.name}`, "success");
            }
        }
    }

    const handleDeleteRoute = async () => {
        const response = await deleteRoute(data?.id, token)
        if (response?.status === 200) {
            const index = routes.indexOf(data);
            const updatedRoutes = [...routes];
            updatedRoutes.splice(index, 1);
            setRoutes(updatedRoutes);
            setEditVisible(false)
            setConfirmModal(false)
            showToast("Thông Báo", `Đã xoá lộ trình ${data?.name}`, "success");
        }
    }

    const handleNameChange = (text) => {
        setEditInfor({ ...editInfor, name: text });
    }

    const showDatePicker = () => {
        setEditInfor({ ...editInfor, visible: true });
    };

    const hideDatePicker = () => {
        setEditInfor({ ...editInfor, visible: false });
    };

    const handleConfirm = (selectedDate) => {
        if (selectedDate) {
            setEditInfor({ ...editInfor, time: selectedDate, visible: false });
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.routeContainer}
                onPress={() => {
                    setEditVisible(true)
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
                </View>
            </TouchableOpacity>
            {editVisible && (
                <Modal
                    transparent={true}
                    visible={true}
                    animationType="slide"
                >
                    <View style={styles.inputModal}>
                        <View style={styles.inputModalStyle}>
                            <View style={styles.inputModalHeader}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setEditVisible(false)
                                    }}
                                    style={styles.inputModalButton}
                                >
                                    <Text style={styles.inputModalText}>
                                        Huỷ
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        completeRouteInfor()
                                    }}
                                    style={styles.inputModalButton}
                                >
                                    <Text style={{ ...styles.inputModalText, color: COLORS.assign }}>
                                        Cập nhật
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputModalContent}>
                                <Text style={styles.routeName}>Tên lộ trình</Text>
                                <TextInput
                                    value={editInfor?.name}
                                    onChangeText={handleNameChange}
                                    style={styles.inputField}
                                    placeholder="Tên lộ trình"
                                    placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                                />
                                {/* <View style={styles.inputModalLine} />

                                <>
                                    <View style={styles.inputModalLine} />
                                    <TouchableOpacity
                                        style={styles.inputField}
                                        onPress={showDatePicker}
                                    >
                                        <Text>{editInfor.time ? editInfor.time.toLocaleTimeString() : "Chọn thời gian"}</Text>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={editVisible}
                                        mode="time"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                        textColor={"black"}
                                        minimumDate={new Date()}
                                    />
                                </> */}
                            </View>
                            <View style={styles.inputModalBottom}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setConfirmModal(true)
                                    }}
                                    style={styles.inputModalButton}
                                >
                                    <Text style={styles.deleteText}>
                                        Xoá
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <ComfirmModal isVisible={confirmModal} onCancel={() => { setConfirmModal(false) }} onSubmit={handleDeleteRoute} content={"Xác nhận xoá lộ trình " + data?.name} />
                </Modal>
            )}
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
        marginTop: 10,
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

    inputModal: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    inputModalStyle: {
        position: "relative",
        padding: 10,
        marginTop: HEIGHT * 0.35,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    inputModalHeader: {
        width: WIDTH * 0.8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    inputModalButton: {
        paddingTop: 20,
        paddingHorizontal: 10
    },
    inputModalTitle: {
        fontSize: 18,
        fontWeight: "600"
    },
    inputModalText: {
        fontWeight: "500"
    },
    inputModalContent: {
        position: "relative",
        marginVertical: 40,
        width: WIDTH * 0.8,
        backgroundColor: "#f5f5f5",
    },
    routeName: {
        position: "absolute",
        top: "-40%",
        left: "3.5%",
        fontWeight: "600",
    },
    inputField: {
        paddingHorizontal: 12,
        paddingVertical: 15,
    },
    inputModalLine: {
        width: WIDTH * 0.7,
        height: 3,
        borderRadius: 2,
        marginHorizontal: WIDTH * 0.05,
        backgroundColor: "rgba(0, 0, 0, 0.15)",
    },
    inputCheckbox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    checkbox: {
        width: 15,
        height: 15,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: "white",
        transform: [{ translateX: -25 }],
        borderColor: "rgba(0,0,0,0.5)"
    },
    inputModalBottom: {
        position: "absolute",
        right: 15,
        bottom: 15,
    },
    deleteText: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.fail,
    }

});

export default EditRouteTab