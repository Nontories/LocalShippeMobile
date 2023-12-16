import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import { AsyncStorage } from 'react-native';

import { UserContext } from '../../context/UserContext';

import { signInWithOtp } from "../../api/auth"
import { ShipperById, ChangeShipperStatus } from "../../api/shipper"
import { GetOrder } from "../../api/order";

import locker from "../../assets/lock_white.png"
import userpng from "../../assets/user.png"
import Logo from "../../assets/logo.png"

import { OrderStatus } from "../../constrant/OrderStatus"
import { ShipperStatus } from "../../constrant/ShipperStatus"

import SpinnerLoading from "../../components/utils/SpinnerLoading";
import BackGround from "../../components/background/BackGound";
import TextSpaceLine from "../../components/utils/TextSpaceLine"
import CustomToast from "../../components/utils/CustomToast";

// import "../../assets/font/Loubag-Medium.ttf"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const LoginOtp = ({ navigation }) => {

    const [user, onChangeUser] = useState("");
    const [loading, setLoading] = useState(false)
    const { updateUser, updateToken } = useContext(UserContext);
    const showToast = CustomToast();

    // useEffect(() => {
    //     checkLogin()
    // }, [])

    const checkLogin = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const response = await signInWithOtp(token);
                if (response.status = 200) {
                    await updateToken(token)
                    await updateUser(response?.data)
                    navigation.navigate("BottomNav")
                }
            } else {
                console.log('Token not found');
            }
        } catch (error) {
            console.error('Error retrieving data: ', error);
        }
    }

    const handleSignIn = async () => {
        setLoading(true)
        const response = await signInWithOtp(user);

        if (response?.status === 200) {
            setLoading(false)
            navigation.navigate("VerifyOtp", { mail: user })
        } else {
            showToast("Thông Báo", "Mail không tồn tại trong hệ thống", "error");
            setLoading(false)
        }
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
                    onChangeText={onChangeUser}
                    value={user}
                    placeholder="Nhập email của bạn"
                />
            </View>

            <TouchableOpacity
                onPress={handleSignIn}
            >
                <View
                    style={styles.button}
                >
                    <Text
                        style={styles.signin}
                    >
                        Đăng Nhập Bằng OTP
                    </Text>
                </View>
            </TouchableOpacity >

            <TextSpaceLine content={"hoặc đăng nhập bằng"} />

            <View style={styles.passwordSignin}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Login") }}
                >
                    <Image
                        style={styles.passwordSigninIcon}
                        source={locker}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>
                Mật Khẩu
            </Text>

            <View style={styles.signup}>
                <Text style={styles.text}>
                    Chưa có tài khoản Local Shipper?
                </Text>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Signup") }}
                >
                    <Text style={styles.signupText}>
                        Đăng kí ngay
                    </Text>
                </TouchableOpacity >
            </View>

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
        // fontFamily: "Loubag-Medium" 
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
    passwordSignin: {
        padding: 10,
        paddingHorizontal: 12,
        borderRadius: 25,
        backgroundColor: "#72AFD3",
        marginBottom: 5
    },
    passwordSigninIcon: {
        width: WIDTH * 0.053,
        height: WIDTH * 0.06,
    },
    signup: {
        marginVertical: HEIGHT * 0.02,
        width: WIDTH,
        justifyContent: "center",
        flexDirection: "row",
    },
    text: {
        opacity: 0.5,
        fontWeight: "500",
        fontSize: 15,
    },
    signupText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#72AFD3",
        textDecorationLine: "underline",
        marginLeft: 5,
    }
});

export default LoginOtp