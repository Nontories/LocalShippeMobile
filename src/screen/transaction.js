import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, Dimensions, ScrollView } from "react-native";

import { UserContext } from '../context/UserContext';

import CustomToast from "../components/utils/CustomToast";

import backButton from "../assets/paymentBackbutton.png"
import paymentIcon from "../assets/payment.png"
import tranferIcon from "../assets/tranfer.png"
import withdrawIcon from "../assets/withdraw.png"
import { GetTransaction, GetWallet } from "../api/wallet";
import SpinnerLoading from "../components/utils/SpinnerLoading";
import { formatDate, formatPrice, getDate, getTime } from "../util/util";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Transaction = ({ route, navigation }) => {

    const [wallet, setWallet] = useState([])
    const [transactionList, setTransactionList] = useState([])
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true)
    const showToast = CustomToast();
    const { user, updateUser, token } = useContext(UserContext);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                await loadWalletData();
            };

            fetchData();
        }, [])
    );

    const loadWalletData = async () => {
        setLoading(true)
        const response = await GetWallet({ shipperId: user?.id }, token)
        if (response?.status === 200) {
            setWallet(response?.data)
        }
        await loadTransactionData(response?.data);
    }

    const loadTransactionData = async (wallet) => {
        let list = []
        const id = getWallet(wallet, 1)?.id
        const response = await GetTransaction({ fromWallet: id }, token)
        if (response?.status === 200) {
            list = [...response?.data]
        }
        const req = await GetTransaction({ toWallet: id }, token)
        if (req?.status === 200) {
            list = [...list, ...req?.data];
        }
        list.sort(compareDates)
        setTransactionList(list?.reverse())
        setLoading(false)
    }

    const compareDates = (a, b) => {
        const dateA = new Date(a.transactionTime);
        const dateB = new Date(b.transactionTime);

        return dateA - dateB;
    };
    const tranferWallet = () => {
        const walletTranfer = [...wallet]
        walletTranfer.forEach(item => item.check = item?.type === 1)
        return walletTranfer
    }

    const handleNavigateTranfer = () => {
        navigation.navigate("Transfer", { wallet: tranferWallet() })
    }

    const getWallet = (wallet, type) => {
        const walletFound = wallet.find(item => item.type === type)
        return walletFound
    }


    const TracsactionInforTab = ({ item }) => {

        return (
            <View style={styles.transactionTab}>
                <View style={styles.transactionTabHeader}>
                    <Text style={styles.tabBlurText}>{getDate(item?.createdAt) ? getDate(item?.createdAt) : "N/A"}</Text>
                </View>
                <View style={styles.tracsactionInfor}>
                    <View style={styles.flexColumnBetween}>
                        <Text style={styles.boldText}>Chuyển tiền</Text>
                        <Text style={styles.boldText}>Số tiền</Text>
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.tabBlurText}>{item?.description}</Text>
                        {/* <Text style={{ ...styles.boldText, fontSize: 12 }}>{`Từ Ví Chính -> Ví thu hộ`}</Text> */}
                    </View>

                    <View style={styles.flexColumnBetween}>
                        <Text style={styles.boldText}>Rút tiền</Text>
                        <Text style={styles.boldText}>- đ{formatPrice(item?.amount)}</Text>
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.tabBlurText}>{getTime(item?.transactionTime) ? getTime(item?.transactionTime) : "N/A"}</Text>
                    </View>

                    <View style={styles.flexColumnBetween}>
                        <Text style={styles.boldText}>Nạp tiền</Text>
                        <Text style={styles.boldText}>+ đ{formatPrice(item?.amount)}</Text>
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.tabBlurText}>{getTime(item?.transactionTime) ? getTime(item?.transactionTime) : "N/A"}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        loading ?
            <SpinnerLoading />
            :
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={backButton}
                        style={styles.backButton}
                    />
                </View>
                <View style={styles.account}>
                    <Text style={{ ...styles.boldText, color: "white" }}>Tài khoản chính</Text>
                    <Text style={{ ...styles.headerText, fontSize: 25 }}>đ{formatPrice(getWallet(wallet, 1)?.balance)}</Text>
                    <Text style={styles.headerText}>Tài khoản thu hộ: đ{formatPrice(getWallet(wallet, 2)?.balance)}</Text>
                    <Text style={styles.headerText}>Tài khoản kích hoạt: đ{formatPrice(getWallet(wallet, 3)?.balance)}</Text>
                    <View style={styles.navContainer}>
                        <TouchableOpacity
                            style={{ ...styles.navButton, paddingRight: 25, borderRightWidth: 1, borderColor: "rgba(0,0,0,0.1)" }}
                            onPress={() => { showToast("Thông Báo", "Đang cập nhật...", "warning"); }}
                        >
                            <Image
                                source={paymentIcon}
                            />
                            <Text style={styles.navText}>Nạp tiền</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.navButton, paddingHorizontal: 25, borderRightWidth: 1, borderColor: "rgba(0,0,0,0.1)" }}
                            onPress={() => { showToast("Thông Báo", "Đang cập nhật...", "warning"); }}
                        >
                            <Image
                                source={withdrawIcon}
                            />
                            <Text style={styles.navText}>Rút tiền</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.navButton, paddingLeft: 25 }}
                            onPress={handleNavigateTranfer}
                        >
                            <Image
                                source={tranferIcon}
                            />
                            <Text style={styles.navText}>Chuyển tiền</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={styles.transactionHistory}>
                    <Text style={{ ...styles.boldText, textAlign: "center", fontSize: 20, marginBottom: 20 }}>Lịch sử giao dịch</Text>
                    {
                        transactionList.map((item, index) => (
                            <TracsactionInforTab item={item} key={index} />
                        ))
                    }
                </ScrollView>
            </View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5",

    },
    header: {
        position: "relative",
        width: WIDTH,
        height: 80,
        backgroundColor: "rgba(114, 175, 211, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        left: 20,
        bottom: 0,
        padding: 10,
    },
    account: {
        width: WIDTH,
        height: HEIGHT * 0.228,
        backgroundColor: "rgba(114, 175, 211, 0.8)",
        // justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        fontSize: 18,
        color: "white",
        marginVertical: 5,
    },
    navContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
        marginTop: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    navButton: {
        justifyContent: "center",
        alignItems: "center"
    },
    navText: {
        fontWeight: "600",
        marginVertical: 5
    },
    transactionHistory: {
        width: WIDTH,
        marginTop: 70,
        marginBottom: 70
    },
    transactionTab: {
        width: WIDTH
    },
    transactionTabHeader: {
        width: WIDTH,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#F3F2F1",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    tabBlurText: {
        color: "rgba(0,0,0,0.5)"
    },
    tracsactionInfor: {
        padding: 20,
    },

    flexColumn: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    flexColumnBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    boldText: {
        fontWeight: "600"
    }
});

export default Transaction