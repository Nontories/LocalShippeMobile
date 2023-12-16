import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, Dimensions, ScrollView } from "react-native";

import { UserContext } from '../context/UserContext';

import CustomToast from "../components/utils/CustomToast";

import backButton from "../assets/paymentBackbutton.png"
import { formatPrice } from "../util/util";
import { TextInput } from "react-native";
import { CreateTransaction, GetWallet } from "../api/wallet";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Transfer = ({ route, navigation }) => {

    const [fromTranfer, setFromTranfer] = useState(route?.params?.wallet)
    const [toTranfer, setToTranfer] = useState(route?.params?.wallet)
    const showToast = CustomToast();
    const { user, updateUser, token } = useContext(UserContext);

    useEffect(() => {
        const fromList = route?.params?.wallet.map(item => ({ ...item, balance: 0 }));
        const toList = route?.params?.wallet.map(item => ({ ...item, check: false }));
        setFromTranfer(fromList);
        setToTranfer(toList);
    }, [route?.params?.wallet]);

    const loadWalletData = async () => {
        const response = await GetWallet({ shipperId: user?.id }, token)
        if (response?.status === 200) {
            const fromList = response?.data?.map(item => ({ ...item, balance: 0 }));
            const toList = response?.data?.map(item => ({ ...item, check: false }));
            setFromTranfer(fromList);
            setToTranfer(toList);
        }
    }

    const handleChooseFrom = (type) => {
        const updateList = fromTranfer?.map(item => {
            if (item.type === type) {
                return { ...item, check: true };
            } else {
                return { ...item, check: false };
            }
        });

        const toList = toTranfer
        toList.forEach(item => item.check = false)

        setToTranfer(toList)
        setFromTranfer(updateList)
    }

    const handleChangeFromValue = (type, value) => {
        if (isPositiveInteger(value)) {
            const updateList = fromTranfer?.map(item => {
                if (item.type === type) {
                    return { ...item, balance: value };
                } else {
                    return item;
                }
            });
            setFromTranfer(updateList);
        }
    }

    const handleChooseTo = (type) => {
        const updateList = toTranfer?.map(item => {
            if (item.type === type) {
                return { ...item, check: true };
            } else {
                return { ...item, check: false };
            }
        });
        setToTranfer(updateList)
    }

    const hanldeTranfer = async () => {
        const fromIndex = fromTranfer?.findIndex(item => item.check)
        const toIndex = toTranfer?.findIndex(item => item.check)

        // console.log(fromTranfer[fromIndex]);
        // console.log(toTranfer[toIndex]);;

        if (fromIndex !== -1 && toIndex !== -1) {
            if (Number(fromTranfer[fromIndex]?.balance) < 1000) {
                showToast("Thông Báo", "Số tiền phải lớn hơn 1000 để chuyển khoản", "warning");
            } else {
                if (Number(fromTranfer[fromIndex]?.balance) > toIndex[toIndex]?.balance) {
                    showToast("Thông Báo", "Số tiền không đủ để chuyển khoản", "warning");
                } else {

                    const response = await CreateTransaction(toTranfer[toIndex]?.id, fromTranfer[fromIndex]?.id, Number(fromTranfer[fromIndex]?.balance), token)
                    if (response?.status === 200) {
                        await loadWalletData()
                        showToast("Thông Báo", "Chuyển tiền thành công", "success");
                    } else {
                        console.log(response);
                        showToast("Thông Báo", "Chuyển tiền thất bại", "warning");
                    }
                }
            }
        } else {
            showToast("Thông Báo", "Chọn ví cần chuyển khoản", "warning");
        }
    }

    const getTabName = (type) => {
        switch (type) {
            case 1:
                return "Ví chính"
            case 2:
                return "Ví thu hộ"
            case 3:
                return "Ví kích hoạt"

            default:
                break;
        }
    }

    const getChooseFrom = () => {
        const obj = fromTranfer?.find(item => item.check === true)
        return obj?.type
    }

    function isPositiveInteger(value) {
        return /^[0-9]\d*$/.test(value);
    }

    const renderToWallet = (type) => {
        switch (type) {
            case 1:
                // type 2 3
                return (
                    <>
                        <TouchableOpacity
                            style={{
                                ...styles.flexColumnBetween,
                                borderColor: toTranfer[1].check ? "#72AFD3" : "rgba(0,0,0,0.3)",
                                borderWidth: toTranfer[1].check ? 2 : 1
                            }}
                            onPress={() => handleChooseTo(2)}
                        >
                            <Text>{getTabName(2)}</Text>
                            <Text style={styles.amountInput}>{formatPrice(toTranfer[1].balance)}đ</Text>

                        </TouchableOpacity >
                        <TouchableOpacity
                            style={{
                                ...styles.flexColumnBetween,
                                borderColor: toTranfer[2].check ? "#72AFD3" : "rgba(0,0,0,0.3)",
                                borderWidth: toTranfer[2].check ? 2 : 1
                            }}
                            onPress={() => handleChooseTo(3)}
                        >
                            <Text>{getTabName(3)}</Text>
                            <Text style={styles.amountInput}>{formatPrice(toTranfer[2].balance)}đ</Text>
                        </TouchableOpacity >
                    </>
                )
            case 2:
                // type 1
                return (
                    <TouchableOpacity
                        style={{
                            ...styles.flexColumnBetween,
                            borderColor: toTranfer[0].check ? "#72AFD3" : "rgba(0,0,0,0.3)",
                            borderWidth: toTranfer[0].check ? 2 : 1
                        }}
                        onPress={() => handleChooseTo(1)}
                    >
                        <Text>{getTabName(1)}</Text>
                        <Text style={styles.amountInput}>{formatPrice(toTranfer[0].balance)}đ</Text>
                    </TouchableOpacity >
                )
            case 3:
                // type 1
                return (
                    <TouchableOpacity
                        style={{
                            ...styles.flexColumnBetween,
                            borderColor: toTranfer[0].check ? "#72AFD3" : "rgba(0,0,0,0.3)",
                            borderWidth: toTranfer[0].check ? 2 : 1
                        }}
                        onPress={() => handleChooseTo(1)}
                    >
                        <Text>{getTabName(1)}</Text>
                        <Text style={styles.amountInput}>{formatPrice(toTranfer[0].balance)}đ</Text>
                    </TouchableOpacity >
                )
            default:
                break;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => { navigation.navigate("Transaction") }}>
                    <Image
                        source={backButton}

                    />
                </TouchableOpacity>
                <Text style={{ ...styles.boldText, color: "white" }}>Chuyển tiền</Text>
            </View>
            <View style={styles.from}>
                <Text>Nạp tiền vào</Text>
                {
                    fromTranfer?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    ...styles.flexColumnBetween,
                                    borderColor: item.check ? "#72AFD3" : "rgba(0,0,0,0.3)",
                                    borderWidth: item.check ? 2 : 1
                                }}
                                onPress={() => handleChooseFrom(item.type)}
                                key={index}
                            >
                                <Text>{getTabName(item.type)}</Text>
                                <View style={styles.flexColumn}>
                                    <TextInput
                                        value={String(fromTranfer[index].balance)}
                                        onChangeText={(text) => handleChangeFromValue(item.type, text)}
                                        onFocus={() => handleChooseFrom(item.type)}
                                        style={styles.amountInput}
                                    />
                                    <Text>đ</Text>
                                </View>

                            </TouchableOpacity >
                        )
                    })
                }
            </View>
            <View style={styles.from}>
                <Text>Từ nguồn tiền</Text>
                {renderToWallet(getChooseFrom())}
            </View>
            <TouchableOpacity style={styles.bottomButton} onPress={hanldeTranfer}>
                <Text style={{ ...styles.boldText, color: "white", fontSize: 18 }}>CHUYỂN TIỀN</Text>
            </TouchableOpacity>
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
    header: {
        position: "relative",
        width: WIDTH,
        height: 100,
        paddingBottom: 20,
        backgroundColor: "rgba(114, 175, 211, 0.8)",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        left: 20,
        bottom: 20,
        padding: 10,
    },
    from: {
        width: WIDTH * 0.9,
        padding: 20,
        borderRadius: 15,
        marginHorizontal: WIDTH * 0.05,
        marginVertical: 20,
        backgroundColor: "white",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    amountInput: {
        paddingLeft: "50%",
        paddingVertical: 10,
    },
    bottomButton: {
        position: "absolute",
        width: WIDTH * 0.9,
        padding: 20,
        borderRadius: 15,
        marginHorizontal: WIDTH * 0.05,
        bottom: 110,
        backgroundColor: "#72AFD3",
        justifyContent: "center",
        alignItems: "center",
    },

    flexColumn: {
        flexDirection: "row",
        alignItems: "center"
    },
    flexColumnBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,

        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.3)",
        borderRadius: 10,
        marginTop: 10,
    },
    boldText: {
        fontWeight: "600"
    }
});

export default Transfer