import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Dimensions, Platform, Modal } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from 'expo-location';

import { UserContext } from '../../context/UserContext';

import { createRouteMannual, createRouteAuto } from "../../api/route";

import AddOrderModal from "../modal/AddOrderModal";
import InputModal from "../modal/inputModal";
import CustomToast from "../../components/utils/CustomToast";
import SelectModal from "../modal/selectModal";

import { District } from "../../constrant/District";
import { Type } from "../../constrant/Type";
import { Action } from "../../constrant/Action";

import add from "../../assets/add_circle.png"
import addAutoIcon from "../../assets/routeHeader/auto.png"
import addMannualIcon from "../../assets/routeHeader/mannual.png"
import checkIcon from "../../assets/routeHeader/check_circle.png"

import autoDistrict from "../../assets/routeHeader/addAutoIcon/district.png"
import autoType from "../../assets/routeHeader/addAutoIcon/type.png"
import autoAction from "../../assets/routeHeader/addAutoIcon/action.png"
import autoCod from "../../assets/routeHeader/addAutoIcon/cod.png"

import COLORS from "../../constrant/colors";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const modalDefaultStatus = {
    dropdown: false,
    inputForm: false,
    chooseOrder: false,
    selectFilter: false,
}

const addAutoValue = {
    district: "",
    type: "",
    action: "",
    cod: "",
    capacityLow: "",
    capacityHigh: "",
}

const addAutoModalStatus = {
    district: false,
    type: false,
    action: false,
    cod: false,
    capacity: false,
}

const RouteHeader = (route) => {

    const routeData = route?.routeData
    const navigation = route?.navigation
    const mode = route?.mode
    const setMode = route?.setMode
    const setLoading = route?.setLoading
    const [modalStatus, setModalStatus] = useState(modalDefaultStatus)
    const [addList, setAddList] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [createdOrder, setCreatedOrder] = useState([])
    const [routeInfor, setRouteInfor] = useState({ name: "", check: false, visible: false, time: false })
    const [addAutoInfor, setAddAutoInfor] = useState({ infor: addAutoValue, value: addAutoModalStatus })
    const [userLocation, setUserLocation] = useState("")
    const showToast = CustomToast();
    const { user, token } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location)
        })();
    }, [route?.routeData]);
    // useEffect(() => {
    //     console.log(addAutoInfor.infor);
    // }, [addAutoInfor])

    const addAutoModalContent = [
        {
            name: "Quận",
            icon: autoDistrict,
            action: () => { setAddAutoInfor({ infor: addAutoInfor.infor, value: { ...addAutoInfor.value, district: true } }) },
            onCancel: () => { setAddAutoInfor({ infor: addAutoInfor.infor, value: { ...addAutoInfor.value, district: false } }) },
            value: addAutoInfor.infor.district,
            setValue: () => { handleChangeValue },
            modalStatus: addAutoInfor.value.district,
            modalTitle: "Xác nhận tạo lộ trình theo quận",
            modalSubmit: () => { console.log(addAutoInfor.infor.district) },
            modalType: "select",
        },
        {
            name: "Loại hàng",
            icon: autoType,
            action: () => { setAddAutoInfor({ infor: addAutoInfor.infor, value: { ...addAutoInfor.value, type: true } }) },
            onCancel: () => { setAddAutoInfor({ infor: addAutoInfor.infor, value: { ...addAutoInfor.value, type: false } }) },
            value: addAutoInfor.infor.type,
            setValue: () => { setAddAutoInfor({ infor: { ...addAutoInfor.infor, type: "ad" }, value: addAutoInfor.value }) },
            modalStatus: addAutoInfor.value.type,
            // setValue: setAddAutoInfor({ ...addAutoInfor, value}),
            modalTitle: "Chọn loại hàng của đơn hàng",
            modalSubmit: () => { console.log(addAutoInfor.infor.type) },
            modalType: "select",

        },
        {
            name: "Dịch vụ",
            icon: autoAction,
            action: () => { setAddAutoInfor({ infor: addAutoInfor.infor, value: { ...addAutoInfor.value, action: true } }) },
            onCancel: () => { setAddAutoInfor({ infor: addAutoInfor.infor, value: { ...addAutoInfor.value, action: false } }) },
            value: addAutoInfor.infor.action,
            setValue: () => { setAddAutoInfor({ infor: { ...addAutoInfor.infor, action: "ad" }, value: addAutoInfor.value }) },
            modalStatus: addAutoInfor.value.action,
            // setValue: setAddAutoInfor({ ...addAutoInfor, value}),
            modalTitle: "Chọn dịch vụ của đơn hàng",
            modalSubmit: () => { console.log(addAutoInfor.infor.action) },
            modalType: "select",

        },
        {
            name: "COD",
            icon: autoCod,
            action: () => { setAddAutoInfor({ infor: addAutoInfor.infor, value: { ...addAutoInfor.value, cod: true } }) },
            onCancel: () => { setAddAutoInfor({ infor: addAutoInfor.infor, value: { ...addAutoInfor.value, cod: false } }) },
            value: addAutoInfor.infor.cod,
            setValue: () => { setAddAutoInfor({ infor: { ...addAutoInfor.infor, cod: "ad" }, value: addAutoInfor.value }) },
            modalStatus: addAutoInfor.value.cod,
            // setValue: setAddAutoInfor({ ...addAutoInfor, value}),
            modalTitle: "Vui lòng nhập số tiền bạn có thể ứng trước cho đơn hàng",
            modalSubmit: () => { console.log(addAutoInfor.infor.cod) },
            modalType: "input",
        },
    ]

    useFocusEffect(
        React.useCallback(() => {
            setModalStatus(modalDefaultStatus)
            setRouteInfor({ name: "", check: false, time: false })
        }, [])
    );

    const addAuto = () => {
        setModalStatus({ ...modalStatus, dropdown: false, selectFilter: true })
    }

    const handleChangeValue = async (value, name) => {
        setLoading(true)
        setModalStatus({ ...modalStatus, dropdown: false, selectFilter: false })
        let data = {}
        let transfer = {}
        let response
        switch (name) {
            case "Quận":
                setAddAutoInfor({ infor: { ...addAutoInfor.infor, district: value }, value: addAutoInfor.value })

                data = {
                    shiperId: user?.id,
                    suggest: 1,
                    shipperLatitude: userLocation?.coords?.latitude,
                    shipperLongitude: userLocation?.coords?.longitude,
                }

                transfer = {
                    startDate: new Date()
                }

                response = await createRouteAuto(data, transfer, token)

                break;
            case "Loại hàng":
                setAddAutoInfor({ infor: { ...addAutoInfor.infor, type: value }, value: addAutoInfor.value })

                data = {
                    shiperId: user?.id,
                    sugget: 3,
                    shipperLatitude: userLocation?.coords?.latitude,
                    shipperLongitude: userLocation?.coords?.longitude,
                }

                transfer = {
                    startDate: new Date()
                }

                response = await createRouteAuto(data, transfer, token)
                break;
            case "Dịch vụ":
                setAddAutoInfor({ infor: { ...addAutoInfor.infor, action: value }, value: addAutoInfor.value })

                data = {
                    shiperId: user?.id,
                    sugget: 2,
                    shipperLatitude: userLocation?.coords?.latitude,
                    shipperLongitude: userLocation?.coords?.longitude,
                }

                transfer = {
                    startDate: new Date()
                }

                response = await createRouteAuto(data, token)
                break;
            case "COD":
                setAddAutoInfor({ infor: { ...addAutoInfor.infor, cod: value }, value: addAutoInfor.value })
                data = {
                    shiperId: user?.id,
                    sugget: 2,
                    money: addAutoInfor.infor.cod,
                    shipperLatitude: userLocation?.coords?.latitude,
                    shipperLongitude: userLocation?.coords?.longitude,
                }

                transfer = {
                    startDate: new Date()
                }

                response = await createRouteAuto(data, token)
                break;

            default:
                break;
        }
        setLoading(false)
    }

    const hanldeInputModel = (item) => {
        switch (item.name) {
            case "Quận":
                return (
                    <SelectModal name={item.name} isVisible={item.modalStatus} onCancel={item.onCancel} title={item.modalTitle} onSubmit={handleChangeValue} setInput={item.setValue} dropdownList={District} />
                )
            case "Loại hàng":
                return (
                    <SelectModal name={item.name} isVisible={item.modalStatus} onCancel={item.onCancel} title={item.modalTitle} onSubmit={handleChangeValue} setInput={item.setValue} dropdownList={Type} />
                )
            case "Dịch vụ":
                return (
                    <SelectModal name={item.name} isVisible={item.modalStatus} onCancel={item.onCancel} title={item.modalTitle} onSubmit={handleChangeValue} setInput={item.setValue} dropdownList={Action} />
                )
            case "COD":
                return (
                    <InputModal name={item.name} isVisible={item.modalStatus} onCancel={item.onCancel} title={item.modalTitle} onSubmit={handleChangeValue} setInput={item.setValue} />
                )

            default:
                break;
        }
    }

    const addMannual = () => {
        setRouteInfor({ name: "", check: false, visible: false, time: false });
        setModalStatus({ ...modalStatus, dropdown: false, inputForm: true })
    }

    const handleNameChange = (text) => {
        setRouteInfor({ ...routeInfor, name: text });
    }

    const showDatePicker = () => {
        setRouteInfor({ ...routeInfor, visible: true });
    };

    const hideDatePicker = () => {
        setRouteInfor({ ...routeInfor, visible: false });
    };

    const handleConfirm = (selectedDate) => {
        if (selectedDate) {
            setRouteInfor({ ...routeInfor, time: selectedDate, visible: false });
        }
    };

    const completeRouteInfor = async () => {
        if (routeInfor.name == "" || !routeInfor.time) {
            showToast("Thông Báo", "Nhập tên và thời gian giao", "warning");
        } else {
            const response = await createRouteMannual(routeInfor?.name, routeInfor.time, user?.id, token)
            if (response.status === 200) {
                console.log("add route success");
                routeData()
                setCreatedOrder(response?.data)
                setModalVisible(true)
            } else {
                console.log("add route fail", response);
            }
            setModalStatus({ ...modalStatus, inputForm: false });
        }
    }

    return (
        <View
            style={{
                paddingTop: Platform.OS === 'ios' ? 50 : 0,
                backgroundColor: Platform.OS === 'ios' ? "black" : "white",
                zIndex: 999,
            }}
        >
            <View style={styles.container}>
                {
                    mode === "default" ?
                        <TouchableOpacity
                            style={styles.sideButton}
                            onPress={() => {
                                setMode("edit")
                            }}
                        >
                            <Text style={styles.buttonText}>Sửa</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={styles.sideButton}
                            onPress={() => {
                                setMode("default")
                            }}
                        >
                            <Text style={styles.buttonText}>Huỷ</Text>
                        </TouchableOpacity>
                }


                <View>
                    <Text style={styles.content}>
                        {route.content}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setModalStatus({ ...modalStatus, dropdown: !modalStatus.dropdown })
                    }}
                    activeOpacity={1}
                >
                    <Image
                        style={styles.addIcon}
                        source={add}
                    />

                    {modalStatus?.dropdown && (
                        <View style={styles.dropdownContent}>
                            <TouchableOpacity
                                style={styles.dropdownTab}
                                onPress={() => {
                                    addAuto()
                                }}
                            >
                                <Text style={styles.dropdownText}>
                                    Tự động tạo lộ trình
                                </Text>
                                <Image
                                    style={styles.dropdownIcon}
                                    source={addAutoIcon}
                                />
                            </TouchableOpacity>
                            <View style={styles.line} />
                            <TouchableOpacity
                                style={styles.dropdownTab}
                                onPress={() => {
                                    addMannual()
                                }}
                            >
                                <Text style={styles.dropdownText}>
                                    Tạo lộ trình thủ công
                                </Text>
                                <Image
                                    style={styles.dropdownIcon}
                                    source={addMannualIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                </TouchableOpacity>
                {modalStatus.inputForm && (
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
                                            setModalStatus({ ...modalStatus, inputForm: false });
                                        }}
                                        style={styles.inputModalButton}
                                    >
                                        <Text style={{ ...styles.inputModalText, color: COLORS.assign }}>
                                            Huỷ
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={styles.inputModalTitle}>
                                        Lộ trình mới
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            completeRouteInfor()
                                        }}
                                        style={styles.inputModalButton}
                                    >
                                        <Text style={styles.inputModalText}>
                                            Xong
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputModalContent}>
                                    <TextInput
                                        value={routeInfor.name}
                                        onChangeText={handleNameChange}
                                        style={styles.inputField}
                                        placeholder="Tên lộ trình"
                                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                                    />
                                    <View style={styles.inputModalLine} />
                                    <TouchableOpacity
                                        style={styles.inputCheckbox}
                                        onPress={() => {
                                            setRouteInfor({ ...routeInfor, check: !routeInfor.check })
                                        }}
                                        activeOpacity={1}
                                    >
                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="Đặt giờ giao"
                                            placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                                            editable={false}
                                        />
                                        {
                                            routeInfor.check ?
                                                <Image
                                                    source={checkIcon}
                                                    style={{ ...styles.checkbox, borderWidth: 0, width: 18, height: 18 }}
                                                />
                                                :
                                                <View style={styles.checkbox} />
                                        }
                                    </TouchableOpacity>
                                    {
                                        routeInfor.check &&
                                        <>
                                            <View style={styles.inputModalLine} />
                                            {/* <TextInput
                                                value={routeInfor.time}
                                                onChangeText={handleTimeChange}
                                                style={styles.inputField}
                                                placeholder="Thời gian bắt đầu giao"
                                                placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                                            /> */}
                                            <TouchableOpacity
                                                style={styles.inputField}
                                                onPress={showDatePicker}
                                            >
                                                <Text>{routeInfor.time ? routeInfor.time.toLocaleTimeString() : "Chọn thời gian"}</Text>
                                            </TouchableOpacity>
                                            <DateTimePickerModal
                                                isVisible={routeInfor.visible}
                                                mode="time"
                                                onConfirm={handleConfirm}
                                                onCancel={hideDatePicker}
                                                textColor={"black"}
                                                minimumDate={new Date()}
                                            />
                                        </>
                                    }
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
                {modalStatus.selectFilter && (
                    <Modal
                        transparent={true}
                        visible={true}
                        animationType="slide"
                    >
                        <TouchableOpacity
                            style={styles.layout}
                            onPress={() => {
                                setModalStatus({ ...modalStatus, selectFilter: false })
                            }}
                        />
                        <View style={styles.autoModal}>
                            {addAutoModalContent.map((item, key) => {
                                return (
                                    <TouchableOpacity
                                        style={styles.autoModalTab}
                                        key={key}
                                        onPress={item.action}
                                    >
                                        <Text style={styles.autoModalTabName}>
                                            {item.name}
                                        </Text>
                                        <Image
                                            source={item.icon}
                                            style={styles.autoModalTabIcon}
                                        />
                                        {
                                            hanldeInputModel(item)
                                        }
                                    </TouchableOpacity>
                                )
                            })}
                            <TouchableOpacity style={{ ...styles.autoModalTab, borderBottomColor: "rgba(0,0,0,0)" }}>
                                <Text style={styles.autoModalTabName}>
                                    Dung tích
                                </Text>
                                <Text style={styles.autoModalTabIcon}>
                                    0kg - 10kg
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </Modal>
                )}
            </View>
            <AddOrderModal data={createdOrder} modalVisible={modalVisible} setModalVisible={setModalVisible} addList={addList} setAddList={setAddList} navigation={navigation} />
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
        backgroundColor: "#f5f5f5",
    },
    sideButton: {
        position: "absolute",
        height: HEIGHT * 0.08,
        width: WIDTH * 0.15,
        left: WIDTH * 0.05,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        fontSize: 20,
    },
    sidebar: {
        position: "absolute",
        width: WIDTH,
        height: HEIGHT,
        flexDirection: "row"
    },
    sideSheet: {
        position: "absolute",
        width: WIDTH * 0.7,
        height: HEIGHT,
        left: 0,
        top: 0,
        backgroundColor: 'white',
    },
    outline: {
        position: "absolute",
        width: WIDTH * 0.3,
        height: HEIGHT,
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    sideHeader: {
        width: WIDTH * 0.7,
        height: HEIGHT * 0.1,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.3)",
    },
    optionChoice: {
        width: WIDTH * 0.7,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.3)",
        fontSize: 18,
        paddingLeft: 15,
        paddingVertical: 10,
    },
    buttonText: {
        color: COLORS.accept,
        fontSize: 20,
    },
    addButton: {
        position: "absolute",
        right: WIDTH * 0.1,
    },
    addIcon: {
        width: 30,
        height: 30,
    },
    dropdownContent: {
        position: "absolute",
        width: WIDTH * 0.6,
        right: 0,
        top: 30,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        marginTop: 10,
        elevation: 10,
    },
    dropdownTab: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    dropdownText: {
        width: WIDTH * 0.4,
    },
    dropdownIcon: {
        width: 25,
        height: 25,
    },
    line: {
        width: WIDTH * 0.6,
        paddingVertical: 1,
        transform: [{ translateX: -20 }],
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        marginVertical: 15,
    },

    inputModal: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    inputModalStyle: {
        marginTop: HEIGHT * 0.35,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    inputModalHeader: {
        width: WIDTH * 0.8,

        flexDirection: "row",
        justifyContent: "space-around",
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
        marginVertical: 20,
        width: WIDTH * 0.8,
        backgroundColor: "#f5f5f5",
    },
    inputField: {
        paddingHorizontal: 20,
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

    layout: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    autoModal: {
        width: WIDTH * 0.7,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8,
        marginHorizontal: WIDTH * 0.15,
        marginTop: HEIGHT * 0.35,
    },
    autoModalTab: {
        height: 50,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 3,
        borderBottomColor: "rgba(0,0,0,0.1)"
    },
    autoModalTabName: {},
    autoModalTabIcon: {},
});

export default RouteHeader