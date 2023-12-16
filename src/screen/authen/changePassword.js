import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import { AsyncStorage } from 'react-native';

import { UserContext } from '../../context/UserContext';

import { signIn } from "../../api/auth"
import { ShipperByAcountId, ChangeShipperStatus } from "../../api/shipper"
import { GetOrder } from "../../api/order";
import { InteractRoute } from "../../api/route";

import locker from "../../assets/Lock.png"
import userpng from "../../assets/user.png"
import Logo from "../../assets/logo.png"

import { OrderStatus } from "../../constrant/OrderStatus"
import { ShipperStatus } from "../../constrant/ShipperStatus"
import { RouteStatus } from "../../constrant/RouteStatus";

import SpinnerLoading from "../../components/utils/SpinnerLoading";
import CustomToast from "../../components/utils/CustomToast";
import BackGround from "../../components/background/BackGound";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const ChangePassword = ({ navigation }) => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [loading, setLoading] = useState(false)
    const { updateUser, updateToken } = useContext(UserContext);
    const showToast = CustomToast();

    const handleChangePassword = async () => {

    }

    return (
        <View style={styles.container}>
            <BackGround />
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={Logo}
                />
                <View>
                    <Text style={{ ...styles.name, fontSize: 35, fontWeight: "700" }}>Local Shipper</Text>
                    <Text style={styles.name}>Drive</Text>
                </View>
            </View>

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={userpng}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setOldPassword}
                    value={oldPassword}
                    placeholder="Nhập mật khẩu cũ"
                />
            </View>

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={locker}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setNewPassword}
                    value={newPassword}
                    placeholder="Nhập mật khẩu mới"
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={locker}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setRePassword}
                    value={rePassword}
                    placeholder="Nhập lại mật khẩu mới"
                    secureTextEntry={true}
                />
            </View>

            <TouchableOpacity
                onPress={handleChangePassword}
            >
                <View
                    style={styles.button}
                >
                    <Text
                        style={styles.signin}
                    >
                        Xác Nhận
                    </Text>
                </View>
            </TouchableOpacity >

            {loading && <SpinnerLoading />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        flexDirection: "row",
        // flexWrap: "wrap"
        alignItems: "center",
        marginBottom: HEIGHT * 0.1
    },
    logo: {
        width: WIDTH * 0.3,
        height: WIDTH * 0.3,
        resizeMode: "contain",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 30,
    },
    name: {
        fontWeight: "500",
        fontSize: 25,
        textAlign: "right",
        marginLeft: 10,
        // fontFamily: "Loubag"
        // marginVertical: HEIGHT * 0.05,
    },
    inputBar: {
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "rgba(0, 0, 0, 0.3)",
        marginBottom: HEIGHT * 0.04,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },
    input: {
        width: WIDTH * 0.6,
        height: HEIGHT * 0.06,
        marginHorizontal: WIDTH * 0.1,
        padding: 10,
        opacity: 0.5,
        fontSize: 18,
    },
    button: {
        position: "relative",
        width: WIDTH * 0.8,
        borderRadius: 15,
        backgroundColor: "#24AB70",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#72AFD3"
    },
    locker: {
        position: "absolute",
        width: WIDTH * 0.053,
        height: WIDTH * 0.06,
        left: WIDTH * 0.05
    },
    signin: {
        textTransform: "uppercase",
        fontSize: 18,
        fontWeight: "700",
        color: "white",
        paddingVertical: HEIGHT * 0.02,
    },
    signup: {
        marginVertical: HEIGHT * 0.04,
        width: WIDTH,
        justifyContent: "center",
        flexDirection: "row",
    },
    text: {
        opacity: 0.5,
        marginRight: 5,
        fontWeight: "500",
        fontSize: 15,
    },
    signupText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#72AFD3",
        textDecorationLine: "underline"
    }
});

export default Login